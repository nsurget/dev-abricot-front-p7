"use client";

import { useProject } from "@/hooks/useProject";
import Toast from "@/components/ui/Toast";
import { use } from "react";
import PageHero from "@/components/layout/PageHero";
import { useRouter } from "next/navigation";

export default function ProjectSinglePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { project, loading, error } = useProject(id);
  const router = useRouter();
  
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
              titleAction={() => alert("Modifier le projet")}
              subtitle={project?.description || ""}
              onBack={() => router.push("/project")}
              actions={[
                {
                  label: "Créer une tâche",
                  variant: "secondary",
                  onClick: () => alert("Créer une tâche")
                }
              ]}
      />
    </div>
  );
}
