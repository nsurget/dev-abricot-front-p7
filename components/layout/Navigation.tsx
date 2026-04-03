"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuDashboardIcon } from "../icons/MenuDashboardIcon";
import { MenuProjectsIcon } from "../icons/MenuProjectsIcon";

export function Navigation({ className }: { className?: string }) {
    const pathname = usePathname();

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

    return (
        <nav className={className}>
            <ul className="flex gap-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                        <li key={item.href}>
                            <Link 
                                href={item.href} 
                                className={`flex items-center gap-4 px-10 py-7 rounded-xl transition-colors font-medium ${
                                    isActive 
                                    ? "bg-[#0f0f0f] text-white shadow-sm" 
                                    : "text-[#d3590b] hover:bg-gray-100"
                                }`}
                            >
                                <Icon className={isActive ? "text-white" : "text-[#d3590b]"} />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}