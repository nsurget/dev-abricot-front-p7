import { User } from "./user";

export interface Comment {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    author: User;
    createdAt: string;
    updatedAt: string;
}
