"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { statusMap, priorityMap } from "@/types/task.constants";
import CalendarIcon from "@/components/icons/Calendar";
import MessageCircle from "@/components/icons/MessageCircle";
import { MenuProjectsIcon } from "@/components/icons/MenuProjectsIcon";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/date";

interface KanbanTaskCardProps {
    task: Task;
}

export default function KanbanTaskCard({ task }: KanbanTaskCardProps) {
    const router = useRouter();
    const status = statusMap[task.status] || statusMap.TODO;
    const priority = priorityMap[task.priority] || priorityMap.MEDIUM;

    return (
        <div className="bg-white border border-neutral-grey-200 rounded-[10px] p-6 flex flex-col gap-8 w-full hover:shadow-sm transition-shadow">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-manrope font-semibold text-[18px] text-[#1f1f1f] leading-none">
                            {task.title}
                        </h3>
                        <p className="font-inter font-normal text-[14px] text-neutral-grey-600 line-clamp-2">
                            {task.description}
                        </p>
                    </div>
                    <div className={`${status.className} px-[16px] py-[4px] rounded-[50px] shrink-0`}>
                        <span className={`font-inter font-normal text-[14px] ${status.textClass} whitespace-nowrap`}>
                            {status.label}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-[15px]">
                    {/* Project Name */}
                    <div className="flex items-center gap-2">
                        <MenuProjectsIcon className="w-[18px] h-[13.95px] text-neutral-grey-400" />
                        <span className="font-inter font-normal text-[12px] text-neutral-grey-600 truncate max-w-[120px]">
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

            <Button
                variant="secondary"
                className="w-full !h-[50px]"
                onClick={() => router.push(`/project/${task.projectId}`)}
            >
                Voir
            </Button>
        </div>
    );
}
