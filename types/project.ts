import { User } from "./user";
import { Member } from "./member";
import { Task } from "./task";


export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: User;
  members: Member[];
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  _count: {
    tasks: number;
  };
}

