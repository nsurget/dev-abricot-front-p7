"use client";

export default function Container({ children, background = false, className = "" }: { children: React.ReactNode, background?: boolean, className?: string }) {
    return (
        <div className={`max-w-7xl mx-2 sm:mx-4 md:mx-6 xl:mx-auto my-[57px] ${background ? "px-2 sm:px-4 md:px-6 bg-white rounded-xl border border-gray-200" : ""} ${className}`}>
            {children}
        </div>
    );
}