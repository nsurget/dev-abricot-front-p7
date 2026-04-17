"use client";

import React from "react";

interface UserTagProps {
  label: string;
  variant?: "orange" | "grey";
  className?: string;
}

export default function UserTag({ label, variant = "orange", className = "" }: UserTagProps) {
  const isGrey = variant === "grey";
  
  return (
    <div className={`${isGrey ? "bg-neutral-grey-200" : "bg-[#ffe8d9]"} flex items-center justify-center overflow-clip px-[16px] py-[4px] rounded-[50px] shrink-0 ${className}`}>
      <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] ${isGrey ? "text-neutral-grey-600" : "text-[#d3590b]"} text-[14px] whitespace-nowrap`}>
        {label}
      </p>
    </div>
  );
}
