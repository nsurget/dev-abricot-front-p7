"use client";

import { useProjects } from "@/hooks/useProjects";
import PageHero from "@/components/layout/PageHero";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {

  const router = useRouter();
  const { projects, loading, error } = useProjects();

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
        onBack={() => router.back()}
        actions={[
          {
            label: "+ Créer un projet",
            variant: "secondary",
            onClick: () => alert("Créer un projet")
          }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <ul>
          <pre className="bg-neutral-grey-50 p-4 rounded-lg overflow-auto text-sm text-neutral-grey-600">
            {JSON.stringify(projects, null, 2)}
          </pre>
        </ul>
      </div>
    </div>
  );
}
