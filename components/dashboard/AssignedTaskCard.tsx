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

interface AssignedTaskCardProps {
    task: Task;
}

export default function AssignedTaskCard({ task }: AssignedTaskCardProps) {
    const router = useRouter();
    const status = statusMap[task.status] || statusMap.TODO;
    const priority = priorityMap[task.priority] || priorityMap.MEDIUM;

    return (
        <div className="bg-white border border-neutral-grey-200 rounded-[10px] px-6 py-6 md:px-[40px] md:py-[25px] flex flex-col md:flex-row md:items-center justify-between gap-6 w-full hover:shadow-sm transition-shadow">
            <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[7px]">
                    <div className="flex items-center gap-2">
                        <h3 className="font-manrope font-semibold text-[18px] text-[#1f1f1f] leading-none">
                            {task.title}
                        </h3>
                        <span className={`font-inter font-semibold text-[10px] ${priority.textClass} uppercase tracking-wider`}>
                            {priority.label}
                        </span>
                    </div>
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
