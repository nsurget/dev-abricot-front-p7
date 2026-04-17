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
    createdAt: string;
    updatedAt: string;
}