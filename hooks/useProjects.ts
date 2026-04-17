// ... imports existants
import axiosInstance from "@/lib/axios";
import React from "react";
import { AxiosError } from "axios";
import { Project } from "@/types/project";

export function useProjects() {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        // 1. Création d'un contrôleur pour annuler la requête
        const controller = new AbortController();

        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get("/projects", {
                    signal: controller.signal // 2. On passe le signal à axios
                });

                setProjects(response.data.data.projects);
            } catch (err: unknown) {
                // On ignore l'erreur si c'est nous qui avons annulé la requête
                if (err instanceof AxiosError && err.code === 'ERR_CANCELED') {
                    return;
                }
                
                const message = err instanceof AxiosError ? err.response?.data?.message : undefined;
                setError(message || "Erreur lors de la récupération des projets.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

        // 3. Fonction de nettoyage : s'exécute quand le composant est démonté
        return () => {
            controller.abort();
        };
    }, []);

    return { projects, loading, error };
}
