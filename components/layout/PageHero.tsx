"use client";

import React from "react";
import ChevronLeft from "@/components/icons/ChevronLeft";
import Button from "@/components/ui/Button";

interface ActionButton {
    label: string;
    variant?: "primary" | "secondary" | "outline";
    onClick?: () => void;
    icon?: React.ReactNode;
}

interface PageHeroProps {
    title: string;
    titleAction?: () => void;
    subtitle?: string;
    onBack?: () => void;
    actions?: ActionButton[];
}

export default function PageHero({
    title,
    titleAction,
    subtitle,
    onBack,
    actions = [],
}: PageHeroProps) {
    
    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
            {/* Desktop Back Button (outside container) */}
            {onBack && (
                <div className="hidden 2xl:block absolute left-[-76px] top-1/2 -translate-y-1/2 hover:cursor-pointer">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center w-[57px] h-[57px] bg-white border border-neutral-grey-200 rounded-[10px] text-neutral-grey-800 hover:bg-neutral-grey-50 transition-colors"
                        aria-label="Retour"
                    >
                        <ChevronLeft />
                    </button>
                </div>
            )}

            {/* Hero Container */}
            <div className="py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                <div className="flex items-center gap-4 md:gap-6">
                    {/* Mobile/Tablet Back Button (inside container) */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="2xl:hidden flex-shrink-0 flex items-center justify-center hover:cursor-pointer w-[48px] h-[48px] md:w-[57px] md:h-[57px] bg-white border border-neutral-grey-200 rounded-[10px] text-neutral-grey-800 hover:bg-neutral-grey-50 transition-colors"
                            aria-label="Retour"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    )}

                    <div className="flex flex-col gap-1 md:gap-2">
                        <h1 className="gap-2 text-xl md:text-2xl font-manrope font-semibold text-neutral-grey-800">
                            {title} {titleAction && <Button size="sm" variant="outline" onClick={titleAction}>Modifier</Button>}
                        </h1>
                        {subtitle && (
                            <p className="text-sm md:text-lg font-inter text-neutral-grey-600 max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {actions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                variant={action.variant}
                                onClick={action.onClick}
                                icon={action.icon}
                                className="w-full sm:w-auto hover"
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
