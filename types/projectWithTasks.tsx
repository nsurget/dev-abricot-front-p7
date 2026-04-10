export interface ProjectWithTasks {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  members: {
    id: string;
    role: string;
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
    joinedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  tasks: {
    id: string;
  }[];
  _count: {
    tasks: number;
  };
}
