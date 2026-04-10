"use client";

import React from "react";

interface UserTagProps {
  label: string;
  className?: string;
}

export default function UserTag({ label, className = "" }: UserTagProps) {
  return (
    <div className={`bg-[#ffe8d9] flex items-center justify-center overflow-clip px-[16px] py-[4px] rounded-[50px] shrink-0 ${className}`}>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] text-[#d3590b] text-[14px] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}
