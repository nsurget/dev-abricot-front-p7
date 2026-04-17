import { User } from "./user";

export interface Member {
    id: string;
    role: string;
    user: User;
    joinedAt: string;
}