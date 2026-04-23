"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { MenuDashboardIcon } from "../icons/MenuDashboardIcon";
import { MenuProjectsIcon } from "../icons/MenuProjectsIcon";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const user = useUserInfo();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const menuItems = [
        {
            name: "Tableau de bord",
            href: "/dashboard",
            icon: MenuDashboardIcon,
        },
        {
            name: "Projets",
            href: "/project",
            icon: MenuProjectsIcon,
        },
    ];

    const handleLogout = () => {
        logout();
        onClose();
        router.push("/login");
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[60] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex-1 overflow-y-auto pt-24 px-6">
                    {/* User Profile Section */}
                    {user && (
                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center justify-center bg-[#ffe8d9] text-[#0f0f0f] rounded-full size-12 font-medium text-sm">
                                    {user.name
                                        ? user.name
                                            .split(" ")
                                            .filter(Boolean)
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)
                                        : user.email[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name || user.email.split("@")[0]}
                                    </span>
                                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-medium ${
                                        isActive
                                            ? "bg-[#0f0f0f] text-white shadow-sm"
                                            : "text-[#d3590b] hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon className={isActive ? "text-white" : "text-[#d3590b]"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-2">
                        <Link
                            href="/my-account"
                            onClick={onClose}
                            className={`block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors ${pathname === "/my-account" ? "bg-gray-100" : ""}`}
                        >
                            Mon compte
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
