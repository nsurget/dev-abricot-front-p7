import React from "react";

export default function ChevronDown({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="10" viewBox="0 0 17 10" fill="none" className={className}>
            <path d="M16.3535 8.70711L8.35352 0.707108L0.353515 8.70711" stroke="#0F0F0F" />
        </svg>
    );
}
