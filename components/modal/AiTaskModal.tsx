"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAiTaskModalStore } from "@/store/aiTaskModalStore";
import { useTaskModalStore } from "@/store/taskModalStore";
import { useToastStore } from "@/store/toastStore";
import StarIcon from "@/components/icons/StarIcon";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

interface GeneratedTask {
  tempId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeIds: string[]; // List of member IDs
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

export default function AiTaskModal() {
  const { isOpen, projectId, projectMembers, closeModal } = useAiTaskModalStore();
  const triggerTaskRefresh = useTaskModalStore((state) => state.triggerRefresh);
  const addToast = useToastStore((state) => state.addToast);

  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for generated tasks
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  // IDs of tasks currently in edit mode
  const [editingTaskIds, setEditingTaskIds] = useState<string[]>([]);
  
  // Refs
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Clear state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPromptInput("");
      setTasks([]);
      setEditingTaskIds([]);
      setError(null);
      setLoading(false);
      setCreating(false);
    }
  }, [isOpen]);

  // Autoscroll to bottom when new tasks are loaded or created
  useEffect(() => {
    if (tasks.length > 0 && listContainerRef.current) {
      listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
    }
  }, [tasks]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || loading || creating) return;

    setLoading(true);
    setError(null);

    try {
      // Find the project name/description if available from DOM or from a prop. 
      // (For simplicity, we'll fetch them from the page hero title if present, or let the server action generate)
      const projectName = typeof document !== 'undefined' ? document.querySelector('h1')?.textContent || "" : "";
      
      const response = await fetch('/ai/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptInput,
          projectName,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Une erreur est survenue lors de la génération.");
      }

      const generated: Partial<GeneratedTask>[] = data.tasks;
      const formatted: GeneratedTask[] = generated.map((t, idx) => ({
        tempId: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        title: t.title || "Tâche générée sans nom",
        description: t.description || "",
        dueDate: t.dueDate || "",
        priority: t.priority || "MEDIUM",
        status: t.status || "TODO",
        assigneeIds: [],
      }));

      // Append new tasks to the list (allowing building on top of previous generations!)
      setTasks((prev) => [...prev, ...formatted]);
      setPromptInput("");
      addToast("success", `${formatted.length} tâche(s) générée(s) avec succès !`);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Impossible de générer les tâches. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAll = async () => {
    if (tasks.length === 0 || creating) return;
    setCreating(true);
    setError(null);

    try {
      const createPromises = tasks.map(async (task) => {
        const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString() : null;

        const payload = {
          title: task.title,
          description: task.description,
          dueDate: formattedDate,
          assigneeIds: task.assigneeIds,
          priority: task.priority,
        };

        const response = await axiosInstance.post(`/projects/${projectId}/tasks`, payload);
        
        // If status is not the default TODO, update it
        if (task.status !== 'TODO') {
          const taskId = response.data.data.task.id;
          await axiosInstance.put(`/projects/${projectId}/tasks/${taskId}`, { 
            status: task.status 
          });
        }
      });

      await Promise.all(createPromises);
      
      addToast("success", `${tasks.length} tâche(s) créée(s) avec succès !`);
      triggerTaskRefresh();
      closeModal();
    } catch (err: unknown) {
      console.error("Erreur lors de la création groupée des tâches:", err);
      const message = err instanceof AxiosError ? err.response?.data?.message : undefined;
      setError(message || "Erreur lors de la création des tâches dans la base de données.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = (tempId: string) => {
    setTasks((prev) => prev.filter((t) => t.tempId !== tempId));
    setEditingTaskIds((prev) => prev.filter((id) => id !== tempId));
  };

  const toggleEditTask = (tempId: string) => {
    setEditingTaskIds((prev) => 
      prev.includes(tempId) ? prev.filter((id) => id !== tempId) : [...prev, tempId]
    );
  };

  const updateTaskField = <K extends keyof GeneratedTask>(
    tempId: string,
    field: K,
    value: GeneratedTask[K]
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.tempId === tempId ? { ...t, [field]: value } : t))
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="p-6 md:p-8 flex flex-col h-[90vh] md:h-[650px] relative font-inter bg-white select-none">
        
        {/* Close Button */}
        <button 
          onClick={closeModal}
          disabled={creating}
          className="absolute top-6 right-6 text-neutral-grey-400 hover:text-brand-orange transition-colors cursor-pointer z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Modal Title & Icon */}
        <div className="flex gap-2 items-center mb-6">
          <StarIcon className="w-5 h-5 text-brand-orange fill-brand-orange shrink-0 animate-pulse" fill="brand-orange" />
          <h2 className="font-manrope font-semibold text-[22px] md:text-[24px] text-neutral-grey-800">
            {tasks.length > 0 ? "Vos tâches..." : "Créer une tâche"}
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-[8px] flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
            <span className="font-semibold">Une erreur est survenue :</span>
            <span>{error}</span>
          </div>
        )}

        {/* Content Zone (Dynamic Center height) */}
        <div 
          ref={listContainerRef}
          className="flex-1 overflow-y-auto pr-1 mb-6 flex flex-col gap-4 min-h-0"
        >
          {tasks.length === 0 && !loading && (
            // Initial/Empty State (WOW UI with sparkles and hints)
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-neutral-grey-50 rounded-[12px] border border-dashed border-neutral-grey-200">
              <div className="w-14 h-14 bg-brand-orange-light text-brand-orange rounded-full flex items-center justify-center mb-4">
                <StarIcon className="w-7 h-7 fill-brand-orange text-brand-orange" />
              </div>
              <h3 className="font-manrope text-base font-semibold text-neutral-grey-800 mb-2">
                {"Générez des tâches instantanément avec l'IA"}
              </h3>
              <p className="text-neutral-grey-600 text-sm max-w-sm leading-relaxed">
                {"Décrivez simplement ce que vous souhaitez réaliser dans l'input ci-dessous."}
              </p>
            </div>
          )}

          {/* Task List */}
          {tasks.map((task) => {
            const isEditing = editingTaskIds.includes(task.tempId);
            return (
              <div 
                key={task.tempId} 
                className="bg-white border border-[#e5e7eb] rounded-[10px] p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isEditing ? (
                  // Editable State Form
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-neutral-grey-600">Titre</label>
                      <input 
                        type="text" 
                        value={task.title}
                        onChange={(e) => updateTaskField(task.tempId, "title", e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange text-neutral-grey-800 font-medium"
                        placeholder="Nom de la tâche"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-neutral-grey-600">Description</label>
                      <textarea 
                        value={task.description}
                        onChange={(e) => updateTaskField(task.tempId, "description", e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-[6px] text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange text-neutral-grey-600 resize-none h-16"
                        placeholder="Décrivez la tâche..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-neutral-grey-600">Priorité</label>
                        <select
                          value={task.priority}
                          onChange={(e) => updateTaskField(task.tempId, "priority", e.target.value as GeneratedTask['priority'])}
                          className="px-2.5 py-1.5 border border-[#e5e7eb] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        >
                          {priorityOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-neutral-grey-600">Statut</label>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskField(task.tempId, "status", e.target.value as GeneratedTask['status'])}
                          className="px-2.5 py-1.5 border border-[#e5e7eb] rounded-[6px] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-neutral-grey-600">Échéance</label>
                        <input 
                          type="date" 
                          value={task.dueDate}
                          onChange={(e) => updateTaskField(task.tempId, "dueDate", e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-[#e5e7eb] rounded-[6px] text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-neutral-grey-600">Assigner à</label>
                        <div className="relative group/assign">
                          <div className="min-h-[32px] px-2.5 py-1 border border-[#e5e7eb] rounded-[6px] text-xs flex items-center justify-between bg-white cursor-pointer select-none">
                            <span className="truncate max-w-[110px]">
                              {task.assigneeIds.length === 0 
                                ? "Non assigné" 
                                : `${task.assigneeIds.length} assigné(s)`
                              }
                            </span>
                            <svg className="w-3.5 h-3.5 text-neutral-grey-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          
                          {/* Assignee Checkboxes Dropdown */}
                          <div className="hidden group-hover/assign:flex absolute bottom-full right-0 mb-1 flex-col bg-white border border-[#e5e7eb] rounded-[8px] shadow-lg max-h-40 overflow-y-auto w-48 z-[200] p-1.5">
                            <p className="text-[10px] font-bold text-neutral-grey-400 px-2 py-1 uppercase border-b border-neutral-grey-100 mb-1">
                              Membres du projet
                            </p>
                            {projectMembers.map((member) => {
                              const isChecked = task.assigneeIds.includes(member.id);
                              return (
                                <label 
                                  key={member.id} 
                                  className="flex items-center gap-2 px-2 py-1 text-xs text-neutral-grey-800 hover:bg-neutral-grey-50 rounded cursor-pointer"
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      const newIds = isChecked 
                                        ? task.assigneeIds.filter(id => id !== member.id)
                                        : [...task.assigneeIds, member.id];
                                      updateTaskField(task.tempId, "assigneeIds", newIds);
                                    }}
                                    className="accent-brand-orange"
                                  />
                                  <span className="truncate font-medium">{member.name || member.email}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-neutral-grey-100">
                      <button 
                        type="button" 
                        onClick={() => toggleEditTask(task.tempId)}
                        className="px-3 py-1 bg-brand-orange text-white text-xs font-semibold rounded-[6px] shadow-sm hover:bg-brand-orange-light hover:text-brand-orange transition-all cursor-pointer"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display/Mockup State (Matches Figma 2:4121 exactly)
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-manrope font-semibold text-[17px] md:text-[18px] text-neutral-grey-800 leading-tight">
                          {task.title}
                        </p>
                        
                        {/* Display Badges */}
                        <div className="flex gap-1 shrink-0">
                          {task.priority !== "MEDIUM" && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              priorityOptions.find(o => o.value === task.priority)?.bg
                            } ${
                              priorityOptions.find(o => o.value === task.priority)?.text
                            }`}>
                              {priorityOptions.find(o => o.value === task.priority)?.label}
                            </span>
                          )}
                          {task.status !== "TODO" && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              statusOptions.find(o => o.value === task.status)?.bg
                            } ${
                              statusOptions.find(o => o.value === task.status)?.text
                            }`}>
                              {statusOptions.find(o => o.value === task.status)?.label}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="font-inter text-neutral-grey-600 text-sm leading-relaxed whitespace-pre-line">
                        {task.description || "Aucune description."}
                      </p>

                      {/* Display Assignees / Due Date */}
                      {(task.dueDate || task.assigneeIds.length > 0) && (
                        <div className="flex flex-wrap gap-2 items-center mt-1 text-xs text-neutral-grey-400">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Échéance : {new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          )}
                          {task.dueDate && task.assigneeIds.length > 0 && <span>•</span>}
                          {task.assigneeIds.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              <span>
                                {task.assigneeIds.map(id => {
                                  const name = projectMembers.find(m => m.id === id)?.name || "";
                                  return name ? name.split(" ")[0] : "Membre";
                                }).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom action panel */}
                    <div className="flex gap-4 items-center pt-2.5 border-t border-[#f3f4f6]">
                      
                      {/* Delete Action */}
                      <button 
                        onClick={() => handleDeleteTask(task.tempId)}
                        className="flex items-center gap-1 text-xs text-neutral-grey-600 hover:text-red-500 transition-colors cursor-pointer group"
                      >
                        <svg className="w-4 h-4 text-neutral-grey-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer</span>
                      </button>

                      <span className="text-neutral-grey-200">|</span>

                      {/* Edit Action */}
                      <button 
                        onClick={() => toggleEditTask(task.tempId)}
                        className="flex items-center gap-1 text-xs text-neutral-grey-600 hover:text-brand-orange transition-colors cursor-pointer group"
                      >
                        <svg className="w-4 h-4 text-neutral-grey-400 group-hover:text-brand-orange transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Modifier</span>
                      </button>

                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Sparkles Thinking Skeleton Loader */}
          {loading && (
            <div className="flex-1 flex flex-col gap-4 justify-center items-center py-10 bg-neutral-grey-50 rounded-[12px] border border-neutral-grey-100 animate-pulse text-center">
              <div className="relative">
                <StarIcon className="w-10 h-10 fill-brand-orange text-brand-orange animate-spin" />
              </div>
              <div className="flex flex-col gap-1 items-center mt-2">
                <p className="font-manrope font-semibold text-neutral-grey-800 text-sm">
                  Génération des tâches en cours...
                </p>
                <p className="text-xs text-neutral-grey-400">
                  {"L'intelligence artificielle analyse votre demande"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Submission Action (Create Generated Tasks) */}
        {tasks.length > 0 && (
          <div className="flex flex-col gap-4 items-center">
            {/* Action button to batch create */}
            <div className="w-full flex justify-center">
              <Button 
                onClick={handleCreateAll}
                disabled={creating || loading}
                variant="secondary"
                className="w-full max-w-[240px] md:max-w-[280px]"
              >
                {creating ? "Création..." : `+ Ajouter les ${tasks.length} tâche(s)`}
              </Button>
            </div>
            
            {/* Divider line before new input */}
            <div className="w-full h-[1px] bg-neutral-grey-200 shrink-0" />
          </div>
        )}

        {/* Input Bar Section */}
        <form onSubmit={handleGenerate} className="mt-auto pt-2 shrink-0">
          <div className="bg-[#f9fafb] border border-neutral-grey-100 rounded-full pl-6 pr-2 py-2 flex items-center justify-between focus-within:border-brand-orange/40 transition-colors">
            <input 
              type="text" 
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              disabled={loading || creating}
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              className="flex-1 mr-4 bg-transparent outline-none text-sm text-neutral-grey-800 placeholder:text-neutral-grey-400"
            />
            
            {/* Action AI Sparkle circle button */}
            <button
              type="submit"
              disabled={!promptInput.trim() || loading || creating}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                promptInput.trim() && !loading && !creating
                  ? "bg-brand-orange hover:bg-brand-orange/95 text-white scale-100 cursor-pointer"
                  : "bg-neutral-grey-200 text-neutral-grey-400 scale-95 pointer-events-none"
              }`}
            >
              <StarIcon className="w-4 h-4 fill-white text-white" />
            </button>
          </div>
        </form>

      </div>
    </Modal>
  );
}
