"use client";

import PageHero from "@/components/layout/PageHero";
import { useUserInfo } from "@/hooks/useUserInfo";


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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <p>Contenu du tableau de bord</p>
          </div>
        </div>
  );
}
