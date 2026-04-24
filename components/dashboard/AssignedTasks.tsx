"use client";

import React from "react";
import Container from "../ui/Container";
import { useAssignedTasks } from "@/hooks/useAssignedTasks";
import { Task, TaskStatus } from "@/types/task";
import CalendarIcon from "@/components/icons/Calendar";
import SearchIcon from "@/components/icons/SearchIcon";
import MessageCircle from "@/components/icons/MessageCircle";
import { MenuProjectsIcon } from "@/components/icons/MenuProjectsIcon";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const statusMap: Record<TaskStatus, { label: string; className: string; textClass: string }> = {
    TODO: { label: "À faire", className: "bg-[#ffe0e0]", textClass: "text-[#ef4444]" },
    IN_PROGRESS: { label: "En cours", className: "bg-[#fff0d7]", textClass: "text-[#e08d00]" },
    DONE: { label: "Terminée", className: "bg-[#f1fff7]", textClass: "text-[#27ae60]" },
    CANCELLED: { label: "Annulée", className: "bg-neutral-grey-200", textClass: "text-neutral-grey-600" },
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
};

function AssignedTaskCard({ task }: { task: Task }) {
    const router = useRouter();
    const status = statusMap[task.status] || statusMap.TODO;

    return (
        <div className="bg-white border border-neutral-grey-200 rounded-[10px] px-6 py-6 md:px-[40px] md:py-[25px] flex flex-col md:flex-row md:items-center justify-between gap-6 w-full hover:shadow-sm transition-shadow">
            <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[7px]">
                    <h3 className="font-manrope font-semibold text-[18px] text-[#1f1f1f] leading-none">
                        {task.title}
                    </h3>
                    <p className="font-inter font-normal text-[14px] text-neutral-grey-600">
                        {task.description}
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-[15px]">
                    {/* Project Name */}
                    <div className="flex items-center gap-2">
                        <MenuProjectsIcon className="w-[18px] h-[13.95px] text-neutral-grey-400" />
                        <span className="font-inter font-normal text-[12px] text-neutral-grey-600">
                            {task.project?.name || "Projet inconnu"}
                        </span>
                    </div>

                    <div className="h-[11px] w-[1px] bg-neutral-grey-200"></div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-[15px] h-[16.5px] text-neutral-grey-400" />
                        <span className="font-inter font-normal text-[12px] text-neutral-grey-600">
                            {formatDate(task.dueDate)}
                        </span>
                    </div>

                    <div className="h-[11px] w-[1px] bg-neutral-grey-200"></div>

                    {/* Comment Count */}
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-[15.15px] h-[15px] text-neutral-grey-400" />
                        <span className="font-inter font-normal text-[12px] text-neutral-grey-600">
                            {task._count?.comments || task.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:items-end gap-[15px] md:gap-[37px] shrink-0 w-full md:w-auto">
                <div className={`${status.className} px-[16px] py-[4px] rounded-[50px] w-fit`}>
                    <span className={`font-inter font-normal text-[14px] ${status.textClass} whitespace-nowrap`}>
                        {status.label}
                    </span>
                </div>
                <Button 
                    variant="secondary" 
                    className="w-full md:w-[121px] !h-[50px]"
                    onClick={() => router.push(`/project/${task.projectId}`)}
                >
                    Voir
                </Button>
            </div>
        </div>
    );
}

export default function AssignedTasks() {
    const { assignedTasks, loading, error } = useAssignedTasks();
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredTasks = React.useMemo(() => {
        return assignedTasks.filter((task) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.project?.name?.toLowerCase().includes(query)
            );
        });
    }, [assignedTasks, searchQuery]);

    if (loading) {
        return (
            <Container background={true} className="flex justify-center p-12">
                <div className="animate-pulse text-neutral-grey-600">Chargement de vos tâches...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container background={true} className="p-8">
                <div className="text-red-500 font-inter">{error}</div>
            </Container>
        );
    }

    return (
        <Container background={true} className="px-[20px] md:px-[59px] py-[40px] flex flex-col gap-[41px]">
            {/* Header and Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
                <div className="flex flex-col gap-2">
                    <h2 className="font-manrope font-semibold text-[18px] text-[#1f1f1f]">
                        Mes tâches assignées
                    </h2>
                    <p className="font-inter font-normal text-[16px] text-neutral-grey-600">
                        Par ordre de priorité
                    </p>
                </div>

                <div className="relative group max-w-sm w-full shrink-0">
                    <input
                        type="text"
                        placeholder="Rechercher une tâche"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-12 py-[23px] bg-white border border-neutral-grey-200 rounded-[8px] font-inter text-[14px] text-neutral-grey-800 placeholder:text-neutral-grey-600 focus:outline-none focus:border-brand-orange transition-all"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-neutral-grey-600">
                        <SearchIcon className="w-[14px] h-[14px]" />
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-[17px]">
                {filteredTasks && filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <AssignedTaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-neutral-grey-50 rounded-xl border border-dashed border-neutral-grey-200 text-neutral-grey-600 italic">
                        {searchQuery 
                            ? "Aucune tâche ne correspond à votre recherche."
                            : "Vous n'avez aucune tâche assignée pour le moment."}
                    </div>
                )}
            </div>
        </Container>
    );
}
