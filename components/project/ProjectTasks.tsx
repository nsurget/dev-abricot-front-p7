"use client";

import React from "react";
import Container from "../ui/Container";
import { Project } from "@/types/project";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import { Task, TaskStatus } from "@/types/task";
import { statusMap, priorityMap, priorityOrder } from "@/types/task.constants";
import { User } from "@/types/user";
import UserAvatar from "@/components/user/UserAvatar";
import UserTag from "@/components/user/UserTag";
import CalendarIcon from "@/components/icons/Calendar";
import DotsHorizontalIcon from "@/components/icons/DotsHorizontal";
import ChevronDown from "@/components/icons/ChevronDown";
import { useUserInfo } from "@/hooks/useUserInfo";
import SearchIcon from "@/components/icons/SearchIcon";

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


const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
};

function TaskCard({ task, projectMembers }: { task: Task, projectMembers: User[] }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const currentUser = useUserInfo();
    const openModal = useTaskModalStore((state) => state.openModal);
    
    const status = statusMap[task.status] || statusMap.TODO;
    const priority = priorityMap[task.priority] || priorityMap.MEDIUM;

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Le back renvoie les IDs dans task.assignees
        // On adapte pour le store qui attend string[] (IDs)
        const assigneeIds = task.assignees?.map(a => a.user.id) || [];
        
        openModal("edit", task.projectId, projectMembers, {
            ...task,
            assignees: assigneeIds
        });
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-white border border-neutral-grey-200 rounded-[10px] p-3 md:p-4 md:px-[40px] md:py-[25px] flex flex-col gap-6 w-full">
            {/* Top Row: Title, Status, Description and More Button */}
            <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-manrope font-semibold text-[18px] text-neutral-grey-800">
                            {task.title}
                        </h3>
                        <div className={`${status.className} px-4 py-0.5 rounded-[50px] shrink-0`}>
                            <span className={`font-inter font-normal text-[14px] ${status.textClass} whitespace-nowrap`}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                    <p className="font-inter font-normal text-[14px] text-neutral-grey-600">
                        {task.description}
                    </p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-neutral-grey-50 rounded-lg border border-neutral-grey-200 text-neutral-grey-600 transition-colors"
                        aria-label="Plus d'options"
                    >
                        <DotsHorizontalIcon className="w-5 h-5" />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-[150px] bg-white border border-neutral-grey-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-3 text-left font-inter text-[14px] text-neutral-grey-700 hover:bg-neutral-grey-50 flex items-center gap-2 transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Modifier
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Meta Section: Due Date, Priority and Assignees */}
            <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-x-8 gap-y-4">
                {/* Due Date */}
                <div className="flex items-center gap-1">
                    <span className="font-inter font-normal text-[12px] text-neutral-grey-600">
                        Échéance :
                    </span>
                    <div className="flex items-center gap-1.5 ml-1">
                        <CalendarIcon className="w-4 h-4 text-neutral-grey-800" />
                        <span className="font-inter font-normal text-[12px] text-neutral-grey-800">
                            {formatDate(task.dueDate)}
                        </span>
                    </div>
                </div>

                {/* Priority */}
                <div className="flex items-center gap-1">
                    <span className="font-inter font-normal text-[12px] text-neutral-grey-600">
                        Priorité :
                    </span>
                    <div className="ml-1">
                        <span className={`font-inter font-semibold text-[11px] ${priority.textClass} uppercase tracking-wider`}>
                            {priority.label}
                        </span>
                    </div>
                </div>

                {/* Assignees */}
                <div className="flex items-center gap-2">
                    <span className="font-inter font-normal text-[12px] text-neutral-grey-600">
                        Assigné à :
                    </span>
                    <div className="flex gap-2 items-center">
                        {task.assignees?.map((assignment, idx) => (
                            <div key={idx} className="flex gap-1 items-center">
                                <UserAvatar
                                    name={assignment.user.name}
                                    backgroundGrey
                                    className="border-2 border-white"
                                />
                                <UserTag
                                    label={assignment.user.name}
                                    variant="grey"
                                    className="hidden sm:flex"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Comments Section */}
            <div className="flex flex-col gap-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full text-left group hover:cursor-pointer border-t border-neutral-grey-200 pt-6 pb-6 -mb-6"
                >
                    <span className="font-inter font-normal text-[14px] text-neutral-grey-800 transition-colors group-hover:text-brand-orange">
                        Commentaires ({task.comments?.length || 0})
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-neutral-grey-800 group-hover:text-brand-orange transition-transform duration-300 ${!isExpanded ? "rotate-180" : ""}`}
                    />
                </button>

                {isExpanded && task.comments && task.comments.length > 0 && (
                    <div className="flex flex-col gap-6 pl-2 md:pl-4 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                        {task.comments.map((comment) => {
                            const isMe = comment.author.id === currentUser?.id;
                            return (
                                <div key={comment.id} className={`flex gap-3 items-start ${isMe ? "flex-row-reverse" : ""}`}>
                                    <UserAvatar
                                        name={comment.author.name}
                                        backgroundGrey
                                        className="w-8 h-8 shrink-0 mt-1"
                                    />
                                    <div className={`flex flex-col gap-1 flex-1 ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                                        <div className={`flex items-center gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                            <span className="font-inter font-semibold text-[13px] text-neutral-grey-800">
                                                {isMe ? "Moi" : comment.author.name}
                                            </span>
                                            <span className="font-inter font-normal text-[11px] text-neutral-grey-400">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <div className={`p-3 rounded-2xl border ${isMe
                                            ? "bg-brand-orange-light text-neutral-grey-800 border-brand-orange-light rounded-tr-none"
                                            : "bg-neutral-grey-50 text-neutral-grey-700 border-neutral-grey-100 rounded-tl-none"
                                            }`}>
                                            <p className="font-inter font-normal text-[13px] leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isExpanded && (!task.comments || task.comments.length === 0) && (
                    <div className="text-center py-4 text-neutral-grey-400 text-[13px] italic">
                        Aucun commentaire sur cette tâche.
                    </div>
                )}
            </div>
        </div>
    );
}

import { useTaskModalStore } from "@/store/taskModalStore";


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
    const projectMembers = React.useMemo(() => [
        project.owner,
        ...(project.members?.map(m => m.user) || [])
    ], [project]);

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
                        <TaskCard key={task.id} task={task} projectMembers={projectMembers} />
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
