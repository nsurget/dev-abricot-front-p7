"use client";

import PageHero from "@/components/layout/PageHero";
import { useUserInfo } from "@/hooks/useUserInfo";
import AssignedTasks from "@/components/dashboard/AssignedTasks";


export default function DashboardPage() {
  const user = useUserInfo();

  return (
    <div className="py-8">
          <PageHero
            title="Tableau de bord"
            subtitle={`Bonjour ${user?.name}, voici un aperçu de vos projets et tâches`}
            
            actions={[
              {
                label: "+ Créer un projet",
                variant: "secondary",
                onClick: () => alert("Créer un projet")
              }
            ]}
          />
          <AssignedTasks />
        </div>
  );
}
