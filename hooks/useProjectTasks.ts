import axiosInstance from "@/lib/axios";
import React from "react";
import { AxiosError } from "axios";
import { Task } from "@/types/task";

export function useProjectTasks(projectId: string) {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchTasks = React.useCallback(async (signal?: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(`/projects/${projectId}/tasks`, {
                signal
            });
            console.log(response.data.data.tasks);
            setTasks(response.data.data.tasks);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.code === 'ERR_CANCELED') {
                return;
            }
            const message = err instanceof AxiosError ? err.response?.data?.message : undefined;
            setError(message || "Erreur lors de la récupération des tâches.");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    React.useEffect(() => {
        const controller = new AbortController();
        if (projectId) {
            fetchTasks(controller.signal);
        }
        return () => {
            controller.abort();
        };
    }, [projectId, fetchTasks]);

    return { tasks, loading, error, refresh: fetchTasks };
}
