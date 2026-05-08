"use client";

import { useProject } from "@/hooks/useProject";
import Toast from "@/components/ui/Toast";
import { use } from "react";
import PageHero from "@/components/layout/PageHero";
import ProjectMembers from "@/components/project/ProjectMembers";
import { useRouter } from "next/navigation";
import ProjectTasks from "@/components/project/ProjectTasks";

import { useProjectModalStore } from "@/store/projectModalStore";

export default function ProjectSinglePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { project, loading, error } = useProject(id);
  const router = useRouter();
  const openModal = useProjectModalStore((state) => state.openModal);
  
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
              title={project?.name || ""}
              titleAction={() => project && openModal('edit', {
                id: project.id,
                name: project.name,
                description: project.description,
                contributors: project.members?.map(m => m.user.email) || [],
                members: project.members
              })}
              subtitle={project?.description || ""}
              onBack={router.back}
              actions={[
                {
                  label: "+ Créer une tâche",
                  variant: "secondary",
                  onClick: () => alert("Créer une tâche")
                }
              ]}
      />
      {project && <ProjectMembers project={project} />}
      {project && <ProjectTasks project={project} />}
    </div>
  );
}
