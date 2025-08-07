import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Worry {
  id: string;
  name: string;
  description: string;
  category: string;
  bodyResponses: string[];
  createdAt: Date;
  releasedAt?: Date;
  isReleased: boolean;
}

export interface WorrySettings {
  dailyWorryTime: number; // minutes
  notifications: boolean;
}

interface WorryStore {
  // State
  worries: Worry[];
  settings: WorrySettings;
  isLoading: boolean;
  
  // Actions
  addWorry: (worry: Omit<Worry, 'id' | 'createdAt' | 'isReleased'>) => void;
  releaseWorry: (id: string) => void;
  getActiveWorries: () => Worry[];
  getReleasedWorries: () => Worry[];
  updateSettings: (settings: Partial<WorrySettings>) => void;
  setLoading: (loading: boolean) => void;
  clearWorries: () => void;
}

const useWorryStore = create<WorryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      worries: [],
      settings: {
        dailyWorryTime: 15,
        notifications: true,
      },
      isLoading: false,

      // Actions
      addWorry: (worryData) => {
        const newWorry: Worry = {
          ...worryData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          isReleased: false,
        };
        
        set((state) => ({
          worries: [...state.worries, newWorry],
        }));
      },

      releaseWorry: (id) => {
        set((state) => ({
          worries: state.worries.map((worry) =>
            worry.id === id
              ? { ...worry, isReleased: true, releasedAt: new Date() }
              : worry
          ),
        }));
      },

      getActiveWorries: () => {
        return get().worries.filter((worry) => !worry.isReleased);
      },

      getReleasedWorries: () => {
        return get().worries.filter((worry) => worry.isReleased);
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      clearWorries: () => {
        set({ worries: [] });
      },
    }),
    {
      name: 'ease-worry-store',
      version: 1,
    }
  )
);

export default useWorryStore;
