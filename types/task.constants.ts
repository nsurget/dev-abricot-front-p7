import { TaskStatus, TaskPriority } from "./task";

export const statusMap: Record<TaskStatus, { label: string; className: string; textClass: string }> = {
    TODO: { 
        label: "À faire", 
        className: "bg-[#ffe0e0]", 
        textClass: "text-[#ef4444]" 
    },
    IN_PROGRESS: { 
        label: "En cours", 
        className: "bg-[#fff0d7]", 
        textClass: "text-[#e08d00]" 
    },
    DONE: { 
        label: "Terminée", 
        className: "bg-[#f1fff7]", 
        textClass: "text-[#27ae60]" 
    },
    CANCELLED: { 
        label: "Annulée", 
        className: "bg-gray-100", 
        textClass: "text-gray-500" 
    }
};

export const priorityMap: Record<TaskPriority, { label: string; textClass: string }> = {
    LOW: { 
        label: "Basse", 
        textClass: "text-[#949494]" 
    },
    MEDIUM: { 
        label: "Moyenne", 
        textClass: "text-[#e08d00]" 
    },
    HIGH: { 
        label: "Haute", 
        textClass: "text-[#ef4444]" 
    },
    URGENT: { 
        label: "Urgent", 
        textClass: "text-[#b91c1c]" 
    }
};

export const priorityOrder: Record<TaskPriority, number> = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4
};
