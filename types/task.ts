import { User } from "./user";
import { Comment } from "./comment";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: string;
    creator: User;
    projectId: string;
    project?: {
        name: string;
    };
    assignees: { user: User }[];
    comments: Comment[];
    _count?: {
        comments: number;
    };
    createdAt: string;
    updatedAt: string;
}