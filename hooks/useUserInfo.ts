"use client";

import { useAuthStore } from "@/store/authStore";

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export function useUserInfo() {
    const user = useAuthStore((state) => state.user);
    
    return user;
}