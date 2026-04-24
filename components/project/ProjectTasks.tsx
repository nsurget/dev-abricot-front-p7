"use client";

import React from "react";
import Container from "../ui/Container";
import { Project } from "@/types/project";
import { useProjectTasks } from "@/hooks/useProjectTasks";
import { Task, TaskStatus } from "@/types/task";
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

function TaskCard({ task }: { task: Task }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const currentUser = useUserInfo();
    const status = statusMap[task.status] || statusMap.TODO;

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

                <button
                    className="p-2 hover:bg-neutral-grey-50 rounded-lg border border-neutral-grey-200 text-neutral-grey-600 transition-colors"
                    aria-label="Plus d'options"
                >
                    <DotsHorizontalIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Meta Section: Due Date and Assignees */}
            <div className="flex flex-col flex-wrap gap-x-8 gap-y-4">
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

export default function ProjectTasks({ project }: ProjectTasksProps) {
    const { tasks, loading, error } = useProjectTasks(project.id);
    const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("ALL");
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredTasks = React.useMemo(() => {
        return tasks.filter((task) => {
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
    }, [tasks, statusFilter, searchQuery]);

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

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-3 sm:gap-4 md:gap-6">
                    {/* Status Filter Dropdown */}
                    <div className="relative w-full sm:shrink-0 sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                            id="status-filter"
                            className="appearance-none pl-4 w-full pr-10 py-2.5 md:py-4 border border-neutral-grey-200 rounded-xl font-inter text-[14px] text-neutral-grey-800 focus:outline-none focus:border-neutral-grey-400 transition-all cursor-pointer min-w-[120px] sm:min-w-[140px]"
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-180 pointer-events-none text-neutral-grey-400">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full sm:flex-1 sm:w-[250px] md:w-[300px]">
                        <input
                            type="text"
                            placeholder="Rechercher une tâche..."
                            value={searchQuery}
                            id="search-task"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 md:py-4  bg-white border border-neutral-grey-200 rounded-xl font-inter text-[14px] text-neutral-grey-800 placeholder:text-neutral-grey-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-grey-400 group-focus-within:text-brand-orange transition-colors">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-neutral-grey-50 rounded-xl border border-dashed border-neutral-grey-200 text-neutral-grey-600 italic">
                        {searchQuery || statusFilter !== "ALL"
                            ? "Aucune tâche ne correspond à vos critères."
                            : "Aucune tâche pour le moment."}
                    </div>
                )}
            </div>
        </Container>
    );
}
