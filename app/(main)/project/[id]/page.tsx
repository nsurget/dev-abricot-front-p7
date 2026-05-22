"use client";

import { useProject } from "@/hooks/useProject";
import React, { use } from "react";
import PageHero from "@/components/layout/PageHero";
import ProjectMembers from "@/components/project/ProjectMembers";
import { useRouter } from "next/navigation";
import ProjectTasks from "@/components/project/ProjectTasks";

import { useProjectModalStore } from "@/store/projectModalStore";
import { useTaskModalStore } from "@/store/taskModalStore";
import { useAiTaskModalStore } from "@/store/aiTaskModalStore";
import { useToastStore } from "@/store/toastStore";
import StarIcon from "@/components/icons/StarIcon";

export default function ProjectSinglePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { project, loading, error } = useProject(id);
  const router = useRouter();
  const openProjectModal = useProjectModalStore((state) => state.openModal);
  const openTaskModal = useTaskModalStore((state) => state.openModal);
  const openAiTaskModal = useAiTaskModalStore((state) => state.openModal);
  const addToast = useToastStore((state) => state.addToast);

  // Utiliser useEffect pour afficher l'erreur si elle existe
  React.useEffect(() => {
    if (error && error !== "Accès refusé au projet") {
      addToast("error", `Erreur lors du chargement du projet : ${error}`);
    }
  }, [error, addToast]);

  const getUniqueMembers = React.useCallback(() => {
    if (!project) return [];
    const membersMap = new Map<string, { id: string; name: string; email: string }>();
    if (project.owner) {
      membersMap.set(project.owner.id, {
        id: project.owner.id,
        name: project.owner.name || "",
        email: project.owner.email
      });
    }
    project.members?.forEach(m => {
      if (m.user) {
        membersMap.set(m.user.id, {
          id: m.user.id,
          name: m.user.name || "",
          email: m.user.email
        });
      }
    });
    return Array.from(membersMap.values());
  }, [project]);
  
    if (loading) {
      return <div role="status" aria-live="polite" className="flex justify-center items-center min-h-[400px]">Chargement des projets...</div>;
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-6 text-center select-none">
          <div role="alert" className="w-full max-w-md bg-white border border-neutral-grey-200 rounded-[20px] p-8 shadow-sm flex flex-col items-center">
            {/* Warning Circle Icon */}
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-orange-light text-brand-orange mb-6">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            {/* Heading */}
            <h2 className="font-manrope text-xl md:text-2xl font-bold text-neutral-grey-800 mb-3">
              Erreur de chargement
            </h2>
            
            {/* Description */}
            <p className="font-inter text-neutral-grey-600 text-sm md:text-base mb-8 leading-relaxed max-w-xs">
              {error === "Accès refusé au projet" 
                ? "Vous n'avez pas l'autorisation d'accéder à ce projet ou ce dernier n'existe pas."
                : error || "Une erreur est survenue lors de la récupération des données du projet."}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={() => router.push("/project")}
                className="flex-1 h-[50px] flex items-center justify-center bg-neutral-grey-800 hover:bg-black text-white font-inter font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all duration-200 transform active:scale-[0.98] cursor-pointer"
              >
                Retour aux projets
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 h-[50px] flex items-center justify-center bg-white border border-neutral-grey-200 hover:bg-neutral-grey-50 text-neutral-grey-800 font-inter font-semibold rounded-[10px] transition-all duration-200 transform active:scale-[0.98] cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="py-8">
      <PageHero
              title={project?.name || ""}
              titleAction={() => project && openProjectModal('edit', {
                id: project.id,
                name: project.name,
                description: project.description,
                ownerId: project.ownerId,
                ownerEmail: project.owner?.email,
                contributors: project.members?.map(m => m.user.email) || [],
                members: project.members
              })}
              subtitle={project?.description || ""}
              onBack={router.back}
              actions={[
                {
                  label: "+ Créer une tâche",
                  variant: "secondary",
                  onClick: () => {
                    if (project) {
                      openTaskModal('create', project.id, getUniqueMembers());
                    }
                  }
                },
                {
                  label: "IA",
                  icon: <StarIcon className="w-5 h-5" />,
                  variant: "primary",
                  onClick: () => {
                    if (project) {
                      openAiTaskModal(project.id, getUniqueMembers());
                    }
                  }
                }
              ]
            }
      />
      {project && <ProjectMembers project={project} />}
      {project && <ProjectTasks project={project} />}
    </div>
  );
}
