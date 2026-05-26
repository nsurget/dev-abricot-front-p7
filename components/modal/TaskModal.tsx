"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useTaskModalStore } from "@/store/taskModalStore";
import Select from "react-select";
import Toast from "@/components/ui/Toast";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";
import { AxiosError } from "axios";

interface Option {
  value: string;
  label: string;
}

interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignees: Option[];
}

const statusOptions = [
  { value: 'TODO', label: 'À faire', bg: 'bg-[#ffe0e0]', text: 'text-[#ef4444]' },
  { value: 'IN_PROGRESS', label: 'En cours', bg: 'bg-[#fff0d7]', text: 'text-[#e08d00]' },
  { value: 'DONE', label: 'Terminée', bg: 'bg-[#f1fff7]', text: 'text-[#27ae60]' },
] as const;

const priorityOptions = [
  { value: 'LOW', label: 'Basse', bg: 'bg-[#f3f4f6]', text: 'text-[#6b7280]' },
  { value: 'MEDIUM', label: 'Moyenne', bg: 'bg-[#fff0d7]', text: 'text-[#e08d00]' },
  { value: 'HIGH', label: 'Haute', bg: 'bg-[#ffe0e0]', text: 'text-[#ef4444]' },
  { value: 'URGENT', label: 'Urgent', bg: 'bg-[#fee2e2]', text: 'text-[#b91c1c]' },
] as const;

export default function TaskModal() {
  const { isOpen, mode, closeModal, projectId, projectMembers, taskData, triggerRefresh } = useTaskModalStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "TODO",
      priority: "MEDIUM",
      assignees: [],
    },
  });

  const currentStatus = watch("status");
  const currentPriority = watch("priority");

  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      if (mode === "edit" && taskData) {
        // Reconstruction des options pour les assignés à partir des IDs
        const prefilledAssignees = taskData.assignees?.map(idOrEmail => {
          // On cherche si c'est un ID présent dans projectMembers
          const member = projectMembers.find(m => m.id === idOrEmail || m.email === idOrEmail);
          if (member) {
            return {
              value: member.id,
              label: member.name ? `${member.name} (${member.email})` : member.email
            };
          }
          // Fallback si non trouvé
          return { value: idOrEmail, label: idOrEmail };
        }) || [];

        reset({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : "",
          status: taskData.status,
          priority: taskData.priority || "MEDIUM",
          assignees: prefilledAssignees,
        });
      } else {
        reset({
          title: "",
          description: "",
          dueDate: "",
          status: "TODO",
          priority: "MEDIUM",
          assignees: [],
        });
      }
    }
  }, [taskData, isOpen, reset, mode, projectMembers]);

  // Options pour le sélecteur d'assignation basées UNIQUEMENT sur les membres du projet
  const memberOptions = projectMembers.map(member => ({
    value: member.id,
    label: member.name ? `${member.name} (${member.email})` : member.email,
  }));

  const onSubmit = async (data: TaskFormValues) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      // Formatage de la date en ISO strict pour le backend
      const formattedDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;

      const payload = {
        title: data.title,
        description: data.description,
        dueDate: formattedDate,
        assigneeIds: data.assignees.map(opt => opt.value),
        priority: data.priority,
      };

      if (mode === 'create') {
        // Le back ne supporte pas le statut à la création, on envoie sans
        const response = await axiosInstance.post(`/projects/${projectId}/tasks`, payload);
        
        // Si le statut choisi n'est pas le statut par défaut (TODO), 
        // on fait une mise à jour immédiate car le back est "figé"
        if (data.status !== 'TODO') {
          const taskId = response.data.data.task.id;
          await axiosInstance.put(`/projects/${projectId}/tasks/${taskId}`, { 
            status: data.status 
          });
        }
        
        addToast("success", "Tâche créée avec succès !");
      } else {
        await axiosInstance.put(`/projects/${projectId}/tasks/${taskData?.id}`, {
          ...payload,
          status: data.status,
        });
        addToast("success", "Tâche modifiée !");
      }
      
      triggerRefresh();
      closeModal();
      router.refresh();
    } catch (err: unknown) {
      console.error("Erreur lors de la gestion de la tâche:", err);
      const message = err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(message || "Erreur lors de la gestion de la tâche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="p-[24px] md:p-[50px]  relative">
        <button 
          onClick={closeModal}
          aria-label="Fermer la boîte de dialogue d'édition de tâche"
          className="absolute top-[35px] right-[25px] md:top-[60px] md:right-[60px] text-[#9CA3AF] hover:text-brand-orange transition-colors cursor-pointer z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="font-manrope font-semibold text-[24px] text-[#1F1F1F] mb-[32px] md:mb-[40px]">
          {mode === "create" ? "Créer une tâche" : "Modifier la tâche"}
        </h2>

        {error && (
          <div className="mb-6">
            <Toast type="error" message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="task-title" className="font-inter text-[14px] text-black">Titre*</label>
            <input
              id="task-title"
              {...register("title", { required: "Le titre est requis" })}
              placeholder="Nom de la tâche"
              className="h-[53px] px-[17px] border border-[#E5E7EB] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="task-desc" className="font-inter text-[14px] text-black">Description*</label>
            <textarea
              id="task-desc"
              {...register("description", { required: "La description est requise" })}
              placeholder="Décrivez la tâche"
              className="h-[100px] py-[13px] px-[17px] border border-[#E5E7EB] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
            />
            {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="task-due-date" className="font-inter text-[14px] text-black">Échéance*</label>
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                {...register("dueDate", { required: "L'échéance est requise" })}
                className="w-full h-[53px] px-[17px] border border-[#E5E7EB] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-orange"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="task-assignees" className="font-inter text-[14px] text-black">Assigné à :</label>
            <Controller
              name="assignees"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="task-assignees"
                  isMulti
                  options={memberOptions}
                  placeholder="Choisir parmi les membres du projet"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  // to fix the menuPortal overlay issue
                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                  }}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-[16px]">
            <span className="font-inter text-[14px] text-black font-semibold">Statut :</span>
            <div className="flex gap-[8px] flex-wrap">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("status", opt.value)}
                  aria-pressed={currentStatus === opt.value}
                  className={`px-[16px] py-[4px] rounded-[50px] transition-all border-2 ${
                    currentStatus === opt.value 
                      ? `${opt.bg} ${opt.text} border-brand-orange` 
                      : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="font-inter text-[14px]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <span className="font-inter text-[14px] text-black font-semibold">Priorité :</span>
            <div className="flex gap-[8px] flex-wrap">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("priority", opt.value)}
                  aria-pressed={currentPriority === opt.value}
                  className={`px-[16px] py-[4px] rounded-[50px] transition-all border-2 ${
                    currentPriority === opt.value 
                      ? `${opt.bg} ${opt.text} border-brand-orange` 
                      : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="font-inter text-[14px]">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-[32px]">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Envoi..." : mode === "create" ? "+ Ajouter une tâche" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
