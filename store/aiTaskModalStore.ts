import { create } from 'zustand';

interface ProjectMember {
  id: string;
  name: string;
  email: string;
}

interface AiTaskModalState {
  isOpen: boolean;
  projectId: string | null;
  projectMembers: ProjectMember[];
  openModal: (projectId: string, members: ProjectMember[]) => void;
  closeModal: () => void;
}

/**
 * Zustand store to control the open/close state and project details of the AI Task Modal.
 */
export const useAiTaskModalStore = create<AiTaskModalState>((set) => ({
  isOpen: false,
  projectId: null,
  projectMembers: [],

  openModal: (projectId, members) => set({ 
    isOpen: true, 
    projectId, 
    projectMembers: members 
  }),

  closeModal: () => set({ 
    isOpen: false, 
    projectId: null, 
    projectMembers: [] 
  }),
}));
