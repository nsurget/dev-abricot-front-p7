"use client";

import PageHero from "@/components/layout/PageHero";
import ProjectCard from "@/components/project/projectCard";
import { useProjectsWithTasks } from "@/hooks/useProjectsWithTasks";

export default function ProjectsPage() {

  const { projects, loading, error } = useProjectsWithTasks();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
