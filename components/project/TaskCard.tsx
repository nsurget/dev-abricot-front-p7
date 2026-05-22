"use client";

import React from "react";
import { Task } from "@/types/task";
import { User } from "@/types/user";
import { Comment } from "@/types/comment";
import { statusMap, priorityMap } from "@/types/task.constants";
import UserAvatar from "@/components/user/UserAvatar";
import UserTag from "@/components/user/UserTag";
import CalendarIcon from "@/components/icons/Calendar";
import DotsHorizontalIcon from "@/components/icons/DotsHorizontal";
import ChevronDown from "@/components/icons/ChevronDown";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useTaskModalStore } from "@/store/taskModalStore";
import axiosInstance from "@/lib/axios";

interface TaskCardProps {
    task: Task;
    projectMembers: User[];
    onRefresh: (silent?: boolean) => void;
}

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
};

export default function TaskCard({ task, projectMembers, onRefresh }: TaskCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const currentUser = useUserInfo();
    const openModal = useTaskModalStore((state) => state.openModal);
    
    // États pour la gestion des commentaires
    const [newComment, setNewComment] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
    const [editingContent, setEditingContent] = React.useState("");

    // Handlers API pour les commentaires
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await axiosInstance.post(`/projects/${task.projectId}/tasks/${task.id}/comments`, {
                content: newComment.trim(),
            });
            setNewComment("");
            onRefresh(true);
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const handleEditSubmit = async (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        if (!editingContent.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await axiosInstance.put(`/projects/${task.projectId}/tasks/${task.id}/comments/${commentId}`, {
                content: editingContent.trim(),
            });
            setEditingCommentId(null);
            onRefresh(true);
        } catch (error) {
            console.error("Erreur lors de la modification du commentaire:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
        setIsSubmitting(true);
        try {
            await axiosInstance.delete(`/projects/${task.projectId}/tasks/${task.id}/comments/${commentId}`);
            onRefresh(true);
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
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

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;
        setIsMenuOpen(false);
        setIsSubmitting(true);
        try {
            await axiosInstance.delete(`/projects/${task.projectId}/tasks/${task.id}`);
            onRefresh();
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche:", error);
        } finally {
            setIsSubmitting(false);
        }
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
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-3 text-left font-inter text-[14px] text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                    Supprimer
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

                {isExpanded && (
                    <div className="flex flex-col gap-6 pl-2 md:pl-4 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                        {task.comments && task.comments.length > 0 ? (
                            <div className="flex flex-col gap-6">
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
                                                <div className={`flex items-center gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                    <div className={`p-3 rounded-2xl border ${isMe
                                                        ? "bg-brand-orange-light text-neutral-grey-800 border-brand-orange-light rounded-tr-none"
                                                        : "bg-neutral-grey-50 text-neutral-grey-700 border-neutral-grey-100 rounded-tl-none"
                                                        }`}>
                                                        {editingCommentId === comment.id ? (
                                                            <form onSubmit={(e) => handleEditSubmit(e, comment.id)} className="flex flex-col gap-2 min-w-[200px]">
                                                                <input
                                                                    type="text"
                                                                    value={editingContent}
                                                                    onChange={(e) => setEditingContent(e.target.value)}
                                                                    className="w-full px-2 py-1 bg-white border border-neutral-grey-200 rounded-[6px] font-inter text-[13px] text-neutral-grey-800 focus:outline-none focus:border-brand-orange"
                                                                    autoFocus
                                                                    disabled={isSubmitting}
                                                                />
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setEditingCommentId(null)}
                                                                        className="text-[11px] text-neutral-grey-600 hover:text-neutral-grey-800 font-inter cursor-pointer"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        Annuler
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        className="text-[11px] text-brand-orange hover:text-brand-orange-hover font-inter font-semibold cursor-pointer"
                                                                        disabled={isSubmitting}
                                                                    >
                                                                        Enregistrer
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                            <p className="font-inter font-normal text-[13px] leading-relaxed text-left">
                                                                {comment.content}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {isMe && editingCommentId !== comment.id && (
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 items-center shrink-0">
                                                            <button
                                                                onClick={() => handleStartEdit(comment)}
                                                                className="p-1 hover:bg-neutral-grey-50 rounded text-neutral-grey-400 hover:text-brand-orange transition-colors cursor-pointer"
                                                                title="Modifier le commentaire"
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M12 20h9"></path>
                                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                className="p-1 hover:bg-neutral-grey-50 rounded text-neutral-grey-400 hover:text-red-500 transition-colors cursor-pointer"
                                                                title="Supprimer le commentaire"
                                                            >
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-neutral-grey-400 text-[13px] italic">
                                Aucun commentaire sur cette tâche.
                            </div>
                        )}

                        {/* Formulaire d'ajout de commentaire */}
                        <form onSubmit={handleAddComment} className="flex gap-3 items-center border-t border-neutral-grey-100 pt-6">
                            <UserAvatar
                                name={currentUser?.name || "Moi"}
                                backgroundGrey
                                className="w-8 h-8 shrink-0"
                            />
                            <div className="flex-1 flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder="Ajouter un commentaire..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 min-w-0 h-[40px] px-3 bg-white border border-neutral-grey-200 rounded-[8px] font-inter text-[13px] text-neutral-grey-800 placeholder:text-neutral-grey-400 focus:outline-none focus:border-brand-orange transition-all"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="h-[40px] px-4 bg-brand-orange hover:bg-opacity-90 disabled:opacity-50 text-white rounded-[8px] font-inter font-medium text-[13px] transition-all cursor-pointer flex items-center justify-center shrink-0"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
