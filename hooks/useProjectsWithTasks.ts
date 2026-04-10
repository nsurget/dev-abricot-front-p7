import axiosInstance from "@/lib/axios";
import React from "react";
import { AxiosError } from "axios";
import { ProjectWithTasks } from "@/types/projectWithTasks";

export function useProjectsWithTasks() {
    const [projects, setProjects] = React.useState<ProjectWithTasks[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get("/projects");
                setProjects(response.data.data.projects);
            } catch (err: unknown) {
                const message =
                    err instanceof AxiosError ? err.response?.data?.message : undefined;
                setError(
                    message ||
                    "Erreur lors de la récupération des projets."
                );
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return { projects, loading, error };
}

    