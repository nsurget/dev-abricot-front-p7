"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    icon?: React.ReactNode;
    className?: string;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    icon,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-inter font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 disabled:pointer-events-none disabled:opacity-50 gap-2";
    
    const variants = {
        primary: "bg-brand-orange text-white hover:bg-brand-orange rounded-[10px] cursor-pointer",
        secondary: "bg-neutral-grey-800 text-white hover:bg-neutral-grey-600 rounded-[10px] cursor-pointer",
        outline: "text-brand-orange underline underline-offset-2 hover:no-underline cursor-pointer",
    };

    const sizes = {
        sm: "-translate-y-[2px] text-base px-2 font-normal",
        md: "h-[50px] px-8 text-base",
        lg: "h-14 px-10 text-lg",
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button className={combinedClassName} {...props}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
