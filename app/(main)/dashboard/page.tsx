"use client";

import PageHero from "@/components/layout/PageHero";
import { useUserInfo } from "@/hooks/useUserInfo";
import AssignedTasks from "@/components/dashboard/AssignedTasks";
import { useProjectModalStore } from "@/store/projectModalStore";

export default function DashboardPage() {
  const user = useUserInfo();
  const openModalProject = useProjectModalStore((state) => state.openModal);

  return (
    <div className="py-8">
          <PageHero
            title="Tableau de bord"
            subtitle={`Bonjour ${user?.name}, voici un aperçu de vos projets et tâches`}
            
            actions={[
              {
                label: "+ Créer un projet",
                variant: "secondary",
                onClick: () => openModalProject("create")
              }
            ]}
          />
          <AssignedTasks />
        </div>
  );
}
