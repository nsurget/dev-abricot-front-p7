"use client";

import { useUserInfo } from "@/hooks/useUserInfo";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserMenu({ className }: { className?: string }) {
    const user = useUserInfo();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!user) {
        return <div className="relative group size-[65px]"></div>; // Ou un bouton "Connexion"
    }

    // Get initials from name (e.g., "Nicolas Surget" -> "NS")
    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "??";

    return (
        <div className={`relative group ${className}`}>
            {/* User Avatar */}
            <div className="flex items-center justify-center bg-[#ffe8d9] text-[#0f0f0f] rounded-full size-[65px] font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity">
                {initials}
            </div>

            {/* Hover Submenu */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div className="bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-[200px]">
                    <div className="px-4 py-2 border-b border-gray-50 flex flex-col mb-1">
                        <span className="text-sm font-semibold text-gray-900 truncate">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    </div>
                    
                    <Link 
                        href="/my-account" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Mon compte
                    </Link>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
}