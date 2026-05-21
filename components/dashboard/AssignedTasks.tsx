"use client";

import React from "react";
import Container from "../ui/Container";
import { useAssignedTasks } from "@/hooks/useAssignedTasks";
import { Task } from "@/types/task";
import { priorityOrder } from "@/types/task.constants";
import SearchIcon from "@/components/icons/SearchIcon";
import GridIcon from "@/components/icons/GridIcon";
import ListIcon from "@/components/icons/ListIcon";
import KanbanTaskCard from "./KanbanTaskCard";
import AssignedTaskCard from "./AssignedTaskCard";

export default function AssignedTasks() {
    const { assignedTasks, loading, error } = useAssignedTasks();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [viewMode, setViewMode] = React.useState<"list" | "kanban">("list");

    const filteredTasks = React.useMemo(() => {
        const result = assignedTasks.filter((task) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.project?.name?.toLowerCase().includes(query)
            );
        });

        // Tri par priorité (Urgent en premier)
        return [...result].sort((a, b) => {
            const orderA = priorityOrder[a.priority] || 0;
            const orderB = priorityOrder[b.priority] || 0;
            return orderB - orderA;
        });
    }, [assignedTasks, searchQuery]);

    const tasksByStatus = React.useMemo(() => {
        const groups: Record<string, Task[]> = {
            TODO: [],
            IN_PROGRESS: [],
            DONE: [],
        };
        filteredTasks.forEach(task => {
            if (groups[task.status] !== undefined) {
                groups[task.status].push(task);
            }
        });
        return groups;
    }, [filteredTasks]);

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
        <>
            {/* View Switcher */}
            <Container className="mt-[20px] mb-[20px]">
                <div className="flex items-center gap-[10px]">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-[14px] px-[16px] py-[14px] rounded-[8px] transition-all ${viewMode === "list"
                            ? "bg-brand-orange text-white shadow-sm"
                            : "bg-white text-neutral-grey-600 hover:text-brand-orange border border-neutral-grey-100"
                            }`}
                    >
                        <ListIcon className="w-4 h-4" />
                        <span className="font-inter font-normal text-[14px]">Liste</span>
                    </button>
                    <button
                        onClick={() => setViewMode("kanban")}
                        className={`flex items-center gap-[14px] px-[16px] py-[14px] rounded-[8px] transition-all ${viewMode === "kanban"
                            ? "bg-brand-orange text-white shadow-sm"
                            : "bg-white text-neutral-grey-600 hover:text-brand-orange border border-neutral-grey-100"
                            }`}
                    >
                        <GridIcon className="w-4 h-4" />
                        <span className="font-inter font-normal text-[14px]">Kanban</span>
                    </button>
                </div>
            </Container>

            <Container 
                background={viewMode === "list"} 
                className={`flex flex-col ${
                    viewMode === "list" 
                        ? "px-[20px] md:px-[59px] py-[40px] gap-[41px]" 
                        : "p-0 gap-8"
                }`}
            >
                {/* Header and Search - Only in List View */}
                {viewMode === "list" && (
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
                )}

                {/* Task View */}
                {viewMode === "list" ? (
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
                ) : (
                    <div className="flex flex-col lg:flex-row gap-[22px] items-start overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {Object.entries(tasksByStatus).map(([statusKey, tasks]) => {
                            const statusLabel = statusKey === "TODO" ? "À faire" : statusKey === "IN_PROGRESS" ? "En cours" : "Terminées";
                            return (
                                <div key={statusKey} className="flex flex-col gap-[41px] min-w-[320px] lg:min-w-0 flex-1 bg-white border border-[#ffe0e0] rounded-[10px] px-6 py-[40px]">
                                    <div className="flex gap-2 items-center">
                                        <h3 className="font-manrope font-semibold text-[18px] text-[#1f1f1f]">
                                            {statusLabel}
                                        </h3>
                                        <div className="bg-neutral-grey-200 px-[16px] py-[4px] rounded-[50px]">
                                            <span className="font-inter font-normal text-[14px] text-neutral-grey-600">
                                                {tasks.length}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {tasks.length > 0 ? (
                                            tasks.map(task => (
                                                <KanbanTaskCard key={task.id} task={task} />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 bg-neutral-grey-50 rounded-xl border border-dashed border-neutral-grey-200 text-neutral-grey-400 text-[13px] italic">
                                                Aucune tâche
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Container>
        </>
    );
}
