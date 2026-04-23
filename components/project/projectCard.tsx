"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import UserAvatar from "@/components/user/UserAvatar";
import UserTag from "@/components/user/UserTag";
import Account from "@/components/icons/Account";

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(task => task.status === 'DONE').length || 0;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const membersExcludingOwner = project.members.filter(m => m.user.id !== project.ownerId);
  const teamMembersCount = membersExcludingOwner.length + 1;

  const handleCardClick = () => {
    router.push(`/project/${project.id}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      id={`project-${project.id}`}
      aria-label={`Projet: ${project.name}. Cliquez pour voir les détails.`}
      className="bg-white border border-[#e5e7eb] flex flex-col gap-[56px] justify-between overflow-clip px-[34px] py-[30px] rounded-[10px] w-full cursor-pointer hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-orange scroll-mt-24"
    >
      <div className="flex flex-col gap-[8px] items-start w-full">
        <h3 className="font-['Manrope',sans-serif] font-semibold text-[#1f1f1f] text-[18px] leading-tight">
          {project.name}
        </h3>
        <p className="font-['Inter',sans-serif] font-normal text-[#6b7280] text-[14px]">
          {project.description}
        </p>
      </div>

      <div className="flex flex-col gap-[16px] w-full">
        <div className="flex font-['Inter',sans-serif] font-normal items-center justify-between text-[12px] w-full">
          <p className="text-[#6b7280]">Progression</p>
          <p className="text-[#1f1f1f] font-medium">{percentage}%</p>
        </div>
        <div className="flex flex-col gap-[8px] items-start w-full">
          {totalTasks > 0 ? (
            <>
              <div 
                className="bg-[#e5e7eb] h-[7px] rounded-[40px] w-full relative"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progression: ${percentage}%`}
              >
                <div
                  className="bg-[#d3590b] h-full rounded-[40px] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="font-['Inter',sans-serif] font-normal text-[#6b7280] text-[10px]">
                {completedTasks}/{totalTasks} tâches terminées
              </p>
            </>
          ) : (
            <p className="font-['Inter',sans-serif] font-normal text-[#6b7280] text-[10px]">
              Pas encore de tâche
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[15px] items-start">
        <div className="flex gap-[8px] items-center text-[#6b7280]">
          <Account aria-hidden="true" />
          <p className="font-['Inter',sans-serif] font-normal text-[10px]">
            Équipe ({teamMembersCount}) 
          </p>
        </div>
        <div className="flex gap-[4px] items-center w-full">
          <div className="flex gap-[5px] items-center">
            <UserAvatar name={project.owner.name} />
            <UserTag label="Propriétaire" />
          </div>

          {membersExcludingOwner.length > 0 && (
            <div className="flex items-center">
              {membersExcludingOwner
                .slice(0, 3)
                .map((member) => (
                  <UserAvatar
                    key={member.id}
                    name={member.user.name}
                    className="-ml-[6px] first:ml-0 bg-grey"
                    backgroundGrey={true}
                  />
                ))}
              {membersExcludingOwner.length > 3 && (
                <div 
                  className="bg-[#e5e7eb] flex items-center justify-center rounded-full shrink-0 border border-white -ml-2 w-[27px] h-[27px]"
                  aria-label={`Et ${membersExcludingOwner.length - 3} autres membres`}
                >
                  <span className="text-[10px] text-[#0f0f0f]" aria-hidden="true">+{membersExcludingOwner.length - 3}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}