"use client";

import { useRouter } from "next/navigation";
import { ProjectWithTasks } from "@/types/projectWithTasks";
import UserAvatar from "@/components/user/UserAvatar";
import UserTag from "@/components/user/UserTag";
import Account from "@/components/icons/Account";

export default function ProjectCard({ project }: { project: ProjectWithTasks }) {
  const router = useRouter();

  const totalTasks = project._count?.tasks || 0;
  const completedTasks = project.tasks?.length || 0;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCardClick = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-[#e5e7eb] flex flex-col gap-[56px] justify-between overflow-clip px-[34px] py-[30px] rounded-[10px] w-full cursor-pointer hover:shadow-md transition-shadow"
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
          <div className="bg-[#e5e7eb] h-[7px] rounded-[40px] w-full overflow-hidden">
            <div
              className="bg-[#d3590b] h-full rounded-[40px] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="font-['Inter',sans-serif] font-normal text-[#6b7280] text-[10px]">
            {completedTasks}/{totalTasks} tâches terminées
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[15px] items-start">
        <div className="flex gap-[8px] items-center text-[#6b7280]">
          <Account />
          <p className="font-['Inter',sans-serif] font-normal text-[10px]">
            Équipe ({project.members.length})
          </p>
        </div>
        <div className="flex gap-[4px] items-center w-full">
          <div className="flex gap-[5px] items-center">
            <UserAvatar name={project.owner.name} />
            <UserTag label="Propriétaire" />
          </div>
          
          {project.members.length > 1 && (
            <div className="flex items-center">
              {project.members
                .filter(m => m.user.id !== project.ownerId)
                .slice(0, 3)
                .map((member, index) => (
                  <UserAvatar 
                    key={member.id} 
                    name={member.user.name} 
                    className="-ml-[6px] first:ml-0 bg-grey" 
                    backgroundGrey={true}
                  />
                ))}
              {project.members.length > 4 && (
                <div className="bg-[#e5e7eb] flex items-center justify-center rounded-full shrink-0 border border-white -ml-2 w-[27px] h-[27px]">
                   <span className="text-[10px] text-[#0f0f0f]">+{project.members.length - 4}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}