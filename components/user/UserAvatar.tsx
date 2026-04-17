"use client";

import React from "react";

interface UserAvatarProps {
  name: string;
  size?: number;
  className?: string;
  backgroundGrey?: boolean;
}

export function getInitials(name: string) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function UserAvatar({ name, size = 27, className = "", backgroundGrey = false }: UserAvatarProps) {
  const initials = getInitials(name);
  
  return (
    <div 
      className={` ${backgroundGrey ? "bg-neutral-grey-200" : "bg-[#ffe8d9]"} flex flex-col items-center justify-center rounded-full shrink-0 border border-white ${className}`}
      style={{ width: size, height: size }}
      aria-label={name}
      role="img"
    >
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-none text-[#0f0f0f] text-[10px] text-center tracking-[0.2px] uppercase whitespace-nowrap" aria-hidden="true">
        {initials}
      </p>
    </div>
  );
}
