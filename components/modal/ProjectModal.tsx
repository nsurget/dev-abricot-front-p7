"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { useProjectModalStore } from "@/store/projectModalStore";
import AsyncSelect from "react-select/async";
import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";
import { AxiosError } from "axios";

interface Option {
  value: string;
  label: string;
}

interface ProjectFormValues {
  name: string;
  description: string;
  contributors: Option[];
}

import { useToastStore } from "@/store/toastStore";

/**
 * Modale de création et d'édition de projet.
 * Utilise React Hook Form pour la gestion du formulaire.
 */
export default function ProjectModal() {
  const user = useUserInfo();
  // Récupération de l'état global du store
  const { isOpen, mode, closeModal, projectData, triggerRefresh } = useProjectModalStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  // Initialisation du formulaire
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
      contributors: [],
    },
  });

  // Mettre à jour les valeurs du formulaire quand projectData change
  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      if (mode === "edit" && projectData) {
        const ownerEmail = projectData.ownerEmail || user?.email;
        reset({
          name: projectData.name,
          description: projectData.description,
          contributors: projectData.contributors
            ?.filter(email => email !== ownerEmail)
            .map(email => ({ value: email, label: email })) || [],
        });
      } else {
        reset({
          name: "",
          description: "",
          contributors: [],
        });
      }
    }
  }, [projectData, isOpen, reset, mode, user?.email]);

  // Action de recherche des utilisateurs
  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 2) return [];
    
    try {
      const response = await axiosInstance.get(`/users/search?query=${inputValue}`);
      const users = response.data.data.users;
      // On masque le créateur (si on édite) ou l'utilisateur actuel (si on crée)
      // pour éviter qu'il ne s'ajoute lui-même en tant que contributeur externe
      return users
        .filter((u: User) => {
          const isOwner = projectData?.ownerEmail ? u.email === projectData.ownerEmail : u.id === user?.id;
          return !isOwner;
        })
        .map((user: User) => ({
          value: user.email,
          label: user.name ? `${user.name} (${user.email})` : user.email,
        }));
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
      return [];
    }
  };

  // Action de suppression
  const handleDelete = async () => {
    if (!projectData?.id) return;
    
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
      setLoading(true);
      try {
        await axiosInstance.delete(`/projects/${projectData.id}`);
        addToast("error", "Projet supprimé !");
        triggerRefresh();
        closeModal();
        router.push("/project");
        router.refresh();
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
        addToast("error", "Erreur lors de la suppression du projet");
      } finally {
        setLoading(false);
      }
    }
  };

  // Action de soumission
  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);

    try {
      if (mode === 'create') {
        const contributorEmails = data.contributors.map(opt => opt.value);
        if (user?.email && !contributorEmails.includes(user.email)) {
          contributorEmails.push(user.email);
        }
        const payload = {
          name: data.name,
          description: data.description,
          contributors: contributorEmails
        };
        const response = await axiosInstance.post(`/projects`, payload);
        const newProject = response.data.data.project;
        addToast("success", "Projet créé avec succès !");
        
        reset();
        closeModal();
        triggerRefresh();
        if (newProject?.id) {
          router.push(`/project/${newProject.id}`);
        } else {
          router.push(`/project`);
        }
      } else {
        const projectId = projectData?.id;
        if (!projectId) return;

        // 1. Mise à jour des informations de base (nom, description)
        const projectPayload = {
          name: data.name,
          description: data.description
        };
        await axiosInstance.put(`/projects/${projectId}`, projectPayload);

        // 2. Gestion des contributeurs (Sync)
        const currentEmails = projectData.contributors || [];
        const newEmails = data.contributors.map(opt => opt.value);

        // Contributeurs à ajouter
        const emailsToAdd = newEmails.filter(email => !currentEmails.includes(email));
        for (const email of emailsToAdd) {
          await axiosInstance.post(`/projects/${projectId}/contributors`, { email });
        }

        // Contributeurs à retirer
        const emailsToRemove = currentEmails.filter(email => !newEmails.includes(email));
        for (const email of emailsToRemove) {
          // Trouver l'ID utilisateur correspondant à l'email
          const member = projectData.members?.find(m => m.user.email === email);
          if (member) {
            // Empêcher le propriétaire de se retirer (le backend le bloque de toute façon)
            if (member.user.id === projectData.ownerId) {
              console.warn("Le propriétaire ne peut pas être retiré de la liste des contributeurs.");
              continue;
            }
            await axiosInstance.delete(`/projects/${projectId}/contributors/${member.user.id}`);
          }
        }

        addToast("success", "Projet modifié !");
        reset();
        closeModal();
        triggerRefresh();
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Erreur lors de la création ou de la modification du projet:", err);
      const message = err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(message || "Erreur lors de la création ou de la modification du projet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="p-[24px] md:p-[50px] 2xl:p-[70px] relative">
        {/* Bouton de fermeture (X) */}
        <button 
          onClick={closeModal}
          className="absolute top-[24px] right-[24px] md:top-[47px] md:right-[47px] xl:top-[67px] xl:right-[67px] text-[#9CA3AF] hover:text-brand-orange transition-colors cursor-pointer z-10"
        >
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-[14px] md:h-[14px]">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Titre de la modale */}
        <h2 className="font-manrope font-semibold text-[24px] text-[#1F1F1F] mb-[32px] md:mb-[40px] pr-[40px]">
          {mode === "create" ? "Créer un projet" : "Modifier le projet"}
        </h2>

        {error && (
          <div className="mb-6">
            <Toast type="error" message={error} />
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
          {/* Champ Nom (Titre) */}
          <div className="flex flex-col gap-[7px]">
            <label className="font-inter text-[14px] text-black">Titre*</label>
            <input
              {...register("name", { 
                required: "Le titre est requis",
                minLength: { value: 2, message: "Le titre doit faire au moins 2 caractères" },
                maxLength: { value: 100, message: "Le titre ne peut pas dépasser 100 caractères" }
              })}
              placeholder="Nom de votre projet"
              className="h-[53px] px-[17px] border border-[#E5E7EB] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          {/* Champ Description */}
          <div className="flex flex-col gap-[7px]">
            <label className="font-inter text-[14px] text-black">Description*</label>
            <textarea
              {...register("description", { 
                required: "La description est requise",
                maxLength: { value: 500, message: "La description ne peut pas dépasser 500 caractères" }
              })}
              placeholder="Décrivez brièvement le projet"
              className="h-[100px] py-[13px] px-[17px] border border-[#E5E7EB] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
            />
            {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
          </div>

          {/* Champ Créateur (Readonly) */}
          {mode === "edit" && projectData?.ownerEmail && (
            <div className="flex flex-col gap-[7px]">
              <label className="font-inter text-[14px] text-black">Créateur</label>
              <input
                type="text"
                value={projectData.ownerEmail}
                readOnly
                className="h-[53px] px-[17px] border border-[#E5E7EB] rounded-[4px] bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-[12px] text-gray-400">Le créateur est automatiquement membre du projet.</p>
            </div>
          )}

          {/* Champ Contributeurs (Auto-complete) */}
          <div className="flex flex-col gap-[7px]">
            <label className="font-inter text-[14px] text-black">Contributeurs</label>
            <Controller
              name="contributors"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  isMulti
                  cacheOptions
                  defaultOptions
                  loadOptions={loadOptions}
                  placeholder="Rechercher par nom ou email..."
                  noOptionsMessage={({ inputValue }) => 
                    inputValue.length < 2 
                      ? "Tapez au moins 2 caractères..." 
                      : "Aucun utilisateur trouvé"
                  }
                  loadingMessage={() => "Recherche en cours..."}
                  // to fix the menuPortal overlay issue
                  menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                  }}
                />
              )}
            />
          </div>

          {/* Boutons d'action */}
          <div className="mt-[32px] flex flex-col md:flex-row gap-4 justify-between items-center">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Envoi..." : mode === "create" ? "Ajouter un projet" : "Enregistrer"}
            </Button>

            {mode === "edit" && (
              <Button 
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
                className="w-full md:w-auto"
              >
                Supprimer le projet
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
