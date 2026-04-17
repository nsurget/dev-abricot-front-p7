"use client"

import Container from "../ui/Container";
import { Project } from "@/types/project";

interface ProjectTasksProps {
    project: Project;
}

export default function ProjectTasks({ project }: ProjectTasksProps) {
    return (
        <Container background={true}>
            <div>
                <h1>Tâches</h1>
                {project.tasks?.map((task) => (
                    <div key={task.id}>
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                    </div>
                ))}
            </div>
        </Container>
    );
}
