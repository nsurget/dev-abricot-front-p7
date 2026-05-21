"use client";

import PageHero from "@/components/layout/PageHero";
import ProjectCard from "@/components/project/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { useProjectModalStore } from "@/store/projectModalStore";
import React from "react";
import { useToastStore } from "@/store/toastStore";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {

  const { projects, loading, error } = useProjects();
  const openModalProject = useProjectModalStore((state) => state.openModal);
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  // Utiliser useEffect pour afficher l'erreur si elle existe
  React.useEffect(() => {
    if (error) {
      addToast("error", `Erreur lors du chargement des projets : ${error}`);
    }
  }, [error, addToast]);

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
            {error || "Une erreur est survenue lors de la récupération de la liste des projets."}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 h-[50px] flex items-center justify-center bg-neutral-grey-800 hover:bg-black text-white font-inter font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all duration-200 transform active:scale-[0.98] cursor-pointer"
            >
              Tableau de bord
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
        title="Mes projets"
        subtitle="Gérez vos projets"
        actions={[
          {
            label: "+ Créer un projet",
            variant: "secondary",
            onClick: () => openModalProject("create")
          }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
