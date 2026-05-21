import { create } from 'zustand';

/**
 * Interface d'un projet
 */
interface ProjectData {
  id: string;
  name: string;
  description: string;
  ownerId?: string;
  ownerEmail?: string;
  contributors?: string[];
  members?: { id: string, user: { id: string, email: string } }[];
}

/**
 * État de la modale de projet
 */
interface ProjectModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  projectData: ProjectData | null;
  openModal: (mode: 'create' | 'edit', data?: ProjectData) => void;
  closeModal: () => void;
  refreshCounter: number;
  triggerRefresh: () => void;
}

/**
 * Store Zustand open/close project modal
 */
export const useProjectModalStore = create<ProjectModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  projectData: null,
  refreshCounter: 0,

  openModal: (mode, data) => set({ 
    isOpen: true, 
    mode, 
    projectData: data 
  }),

  closeModal: () => set({ 
    isOpen: false, 
    projectData: null 
  }),

  triggerRefresh: () => set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
}));
