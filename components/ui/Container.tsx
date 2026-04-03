"use client";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-7xl mx-2 md:mx-4 xl:mx-auto my-[57px] px-4 sm:px-6 lg:px-8 bg-white rounded-xl border border-gray-200">
            {children}
        </div>
    );
}