"use client";

import React from "react";
import Container from "../ui/Container";
import { Project } from "@/types/project";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import { TaskStatus } from "@/types/task";
import { priorityOrder } from "@/types/task.constants";
import ChevronDown from "@/components/icons/ChevronDown";
import SearchIcon from "@/components/icons/SearchIcon";
import { useTaskModalStore } from "@/store/taskModalStore";
import TaskCard from "./TaskCard";

interface ProjectTasksProps {
    project: Project;
}

type FilterStatus = "ALL" | TaskStatus;

const filterOptions: { label: string; value: FilterStatus }[] = [
    { label: "Tous", value: "ALL" },
    { label: "À faire", value: "TODO" },
    { label: "En cours", value: "IN_PROGRESS" },
    { label: "Terminée", value: "DONE" },
];


export default function ProjectTasks({ project }: ProjectTasksProps) {
    const { tasks, loading, error, refresh } = useProjectTasks(project.id);
    const refreshCounter = useTaskModalStore((state) => state.refreshCounter);
    const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("ALL");
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const currentFilterLabel = React.useMemo(() => {
        return filterOptions.find(opt => opt.value === statusFilter)?.label || "Statut";
    }, [statusFilter]);

    React.useEffect(() => {
        if (refreshCounter > 0) {
            refresh();
        }
    }, [refreshCounter, refresh]);

    const filteredTasks = React.useMemo(() => {
        const result = tasks.filter((task) => {
            // Status Filter
            if (statusFilter !== "ALL" && task.status !== statusFilter) return false;

            // Search Query
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();

            const inTitle = task.title.toLowerCase().includes(query);
            const inDescription = task.description.toLowerCase().includes(query);
            const inAssignees = task.assignees?.some(a => a.user.name.toLowerCase().includes(query));
            const inComments = task.comments?.some(c => c.content.toLowerCase().includes(query));

            return inTitle || inDescription || inAssignees || inComments;
        });

        // Tri par priorité (Urgent en premier)
        return [...result].sort((a, b) => {
            const orderA = priorityOrder[a.priority] || 0;
            const orderB = priorityOrder[b.priority] || 0;
            return orderB - orderA;
        });
    }, [tasks, statusFilter, searchQuery]);

    // Liste des membres pour la modale d'édition des tâches
    const projectMembers = React.useMemo(() => {
        const uniqueMembers = new Map<string, typeof project.owner>();
        if (project.owner) {
            uniqueMembers.set(project.owner.id, project.owner);
        }
        project.members?.forEach(m => {
            if (m.user) {
                uniqueMembers.set(m.user.id, m.user);
            }
        });
        return Array.from(uniqueMembers.values());
    }, [project]);

    if (loading) {
        return (
            <Container background={true} className="flex justify-center p-12">
                <div className="animate-pulse text-neutral-grey-600">Chargement des tâches...</div>
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
        <Container background={true} className="px-4 md:px-[59px] py-5 md:py-[40px] flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-wrap gap-4 justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="font-manrope font-semibold text-[18px] text-neutral-grey-800">
                        Tâches
                    </h2>
                    <p className="font-inter font-normal text-[16px] text-neutral-grey-600">
                        Par ordre de priorité
                    </p>
                </div>

                {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center w-full sm:w-auto">
                <div className="relative w-full md:w-auto">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full md:w-[200px] h-[48px] px-6 bg-white border border-neutral-grey-200 rounded-[8px] transition-all hover:border-brand-orange group cursor-pointer "
                    >
                        <span className="font-inter text-[14px] text-neutral-grey-600 group-hover:text-neutral-grey-800">
                            {statusFilter === "ALL" ? "Statut" : currentFilterLabel}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 text-neutral-grey-400 duration-200 ${isDropdownOpen ? '' : 'rotate-x-180'}`}
                        />
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-grey-200 rounded-[8px] shadow-lg z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                {filterOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setStatusFilter(opt.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full px-6 py-3 text-left font-inter text-[14px] transition-colors ${
                                            statusFilter === opt.value
                                                ? "bg-neutral-grey-50 text-brand-orange font-semibold"
                                                : "text-neutral-grey-600 hover:bg-neutral-grey-50 hover:text-neutral-grey-800"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="relative group w-full md:w-[350px]">
                    <input
                        type="text"
                        aria-label="Rechercher une tâche"
                        placeholder="Rechercher une tâche"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-grey-200 rounded-[8px] font-inter text-[14px] text-neutral-grey-800 placeholder:text-neutral-grey-400 focus:outline-none focus:border-brand-orange transition-all"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-grey-400 group-focus-within:text-brand-orange transition-colors">
                        <SearchIcon className="w-4 h-4" />
                    </div>
                </div>
            </div>

                
            </div>

            

            {/* Task List */}
            <div className="flex flex-col gap-6">
                {filteredTasks && filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} projectMembers={projectMembers} onRefresh={refresh} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-neutral-grey-50 rounded-xl border border-dashed border-neutral-grey-200 text-neutral-grey-400 italic">
                        {searchQuery 
                            ? "Aucune tâche ne correspond à votre recherche."
                            : "Aucune tâche dans cette catégorie pour le moment."}
                    </div>
                )}
            </div>
        </Container>
    );
}
