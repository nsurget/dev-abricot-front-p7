"use client";

import React from "react";
import { Project } from "@/types/project";
import UserAvatar from "@/components/user/UserAvatar";
import UserTag from "@/components/user/UserTag";

interface ProjectMembersProps {
    project: Project;
}

export default function ProjectMembers({ project }: ProjectMembersProps) {
    const membersExcludingOwner = project.members?.filter(m => m.user?.id !== project.owner?.id) || [];
    const totalMembers = membersExcludingOwner.length + 1;

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 xl:px-0 mb-8">
            <div className="bg-neutral-grey-100 rounded-[10px] px-6 md:px-[50px] py-5 md:py-[20px] flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left side: Title and count */}
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <h2 className="font-manrope font-semibold text-[18px] text-neutral-grey-800">
                        Contributeurs
                    </h2>
                    <span className="font-inter font-normal text-[16px] text-neutral-grey-600">
                        {totalMembers} {totalMembers > 1 ? "personnes" : "personne"}
                    </span>
                </div>

                {/* Right side: Avatars and Tags */}
                <div className="flex flex-wrap gap-2 md:gap-[8px] items-center">
                    {/* Owner */}
                    <div className="flex gap-[5px] items-center">
                        <UserAvatar 
                            name={project.owner?.name} 
                        />
                        <UserTag 
                            label="Propriétaire" 
                        />
                    </div>

                    {/* Members */}
                    {membersExcludingOwner.map((member) => (
                        <div key={member.id} className="flex gap-[4px] items-center">
                            <UserAvatar 
                                name={member.user?.name} 
                                backgroundGrey 
                            />
                            <UserTag 
                                label={member.user?.name} 
                                variant="grey" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
