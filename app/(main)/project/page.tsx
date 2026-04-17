"use client";

import PageHero from "@/components/layout/PageHero";
import ProjectCard from "@/components/project/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import Toast from "@/components/ui/Toast";

export default function ProjectsPage() {

  const { projects, loading, error } = useProjects();

  if (loading) {
    return <div role="status" aria-live="polite" className="flex justify-center items-center min-h-[400px]">Chargement des projets...</div>;
  }

  if (error) {
    return (
      <div role="alert" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Toast type="error" message={`Erreur lors du chargement des projets : ${error}`} />
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
            onClick: () => alert("Créer un projet")
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
