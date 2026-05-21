import { create } from 'zustand';

/**
 * Interface d'une tâche
 */
interface TaskData {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignees?: string[]; // IDs or Emails
}

/**
 * État de la modale de tâche
 */
interface TaskModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  projectId: string | null;
  projectMembers: { id: string, name: string, email: string }[];
  taskData: TaskData | null;
  openModal: (mode: 'create' | 'edit', projectId: string, members: { id: string, name: string, email: string }[], data?: TaskData) => void;
  closeModal: () => void;
  refreshCounter: number;
  triggerRefresh: () => void;
}

/**
 * Store Zustand open/close task modal
 */
export const useTaskModalStore = create<TaskModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  projectId: null,
  projectMembers: [],
  taskData: null,
  refreshCounter: 0,

  openModal: (mode, projectId, members, data) => set({ 
    isOpen: true, 
    mode, 
    projectId,
    projectMembers: members,
    taskData: data 
  }),

  closeModal: () => set({ 
    isOpen: false, 
    projectId: null,
    projectMembers: [],
    taskData: null 
  }),

  triggerRefresh: () => set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
}));
