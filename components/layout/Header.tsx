"use client";

import { useState } from "react";
import Logo from "../Logo";
import { Navigation } from "./Navigation";
import { UserMenu } from "./UserMenu";
import { BurgerButton } from "./BurgerButton";
import { MobileMenu } from "./MobileMenu";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white px-1  xl:px-[50px] 2xl:px-[100px] py-4 md:py-[8px] lg:py-[8px] flex items-center justify-between shadow-[0px_4px_12px_1px_rgba(0,0,0,0.02)] sticky top-0 z-[60]">
            <Logo height={18} className="cursor-pointer md:w-40" />

            <Navigation className="hidden md:flex" />
            <UserMenu className="hidden md:flex" />


            {/* Mobile Burger Button */}
            <BurgerButton
                isOpen={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            />

            {/* Mobile Menu Drawer */}
            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
        </header>
    );
}