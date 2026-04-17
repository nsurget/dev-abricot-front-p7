import { User } from "./user";

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    creatorId: string;
    creator: User;
    projectId: string;
    assignees: { user: User }[];
    _count?: {
        comments: number;
    };
    createdAt: string;
    updatedAt: string;
}