import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-16 px-6 text-center select-none">
      {/* logo */}
      <Logo width={252} height={32} className="mb-[70px]" />
      
      {/* 404 Heading */}
      <h1 className="font-manrope font-black text-9xl md:text-[140px] text-brand-orange leading-none tracking-tight select-none">
        404
      </h1>
      
      {/* Subtitle */}
      <h2 className="font-manrope text-2xl md:text-3xl font-bold text-neutral-grey-800 mt-6">
        Oups ! Page introuvable
      </h2>
      
      {/* Contextual Description */}
      <p className="font-inter text-neutral-grey-600 max-w-md mt-3 mb-10 leading-relaxed text-sm md:text-base">
        La page que vous recherchez n&apos;existe pas, a été déplacée ou n&apos;est plus disponible. Notre petit abricot semble tout aussi perdu que vous !
      </p>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
        <Link
          href="/dashboard"
          className="flex-1 h-[50px] flex items-center justify-center bg-neutral-grey-800 hover:bg-black text-white font-inter font-semibold rounded-[10px] shadow-sm hover:shadow-md transition-all duration-200 transform active:scale-[0.98] cursor-pointer"
        >
          Retour au tableau de bord
        </Link>
        <Link
          href="/project"
          className="flex-1 h-[50px] flex items-center justify-center bg-white border border-neutral-grey-200 hover:bg-neutral-grey-50 text-neutral-grey-800 font-inter font-semibold rounded-[10px] transition-all duration-200 transform active:scale-[0.98] cursor-pointer"
        >
          Voir mes projets
        </Link>
      </div>
    </div>
  );
}