"use client";

interface BurgerButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export function BurgerButton({ isOpen, onClick }: BurgerButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col justify-center items-center size-10 relative z-[70] md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={isOpen}
        >
            <span
                className={`block absolute h-0.5 w-6 bg-[#0f0f0f] transition-all duration-300 ease-in-out ${
                    isOpen ? "rotate-45" : "-translate-y-2"
                }`}
            />
            <span
                className={`block absolute h-0.5 w-6 bg-[#0f0f0f] transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
                className={`block absolute h-0.5 w-6 bg-[#0f0f0f] transition-all duration-300 ease-in-out ${
                    isOpen ? "-rotate-45" : "translate-y-2"
                }`}
            />
        </button>
    );
}
