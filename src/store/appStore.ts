import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Worry {
  id: string
  title: string
  description?: string
  category: string
  bodyFeeling?: string
  intensity: number
  status: 'ACTIVE' | 'ARCHIVED' | 'SCHEDULED' | 'RESOLVED'
  createdAt: Date
  scheduledAt?: Date
}

export interface Reflection {
  id: string
  worryId?: string
  evidenceFor?: string
  evidenceAgainst?: string
  alternativeView?: string
  worstCaseReality?: string
  gentleAction?: string
  feelingNow?: string
  whatHelped?: string
  whatDidntFeel?: string
  realizations?: string
  celebrations?: string
  completed: boolean
  createdAt: Date
}

interface AppState {
  // Worry management
  worries: Worry[]
  currentWorry: Worry | null
  
  // Reflection state
  currentReflection: Reflection | null
  reflections: Reflection[]
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Settings
  reflectionTime: string
  customCategories: string[]
  
  // Actions
  addWorry: (worry: Omit<Worry, 'id' | 'createdAt'>) => void
  updateWorry: (id: string, updates: Partial<Worry>) => void
  deleteWorry: (id: string) => void
  setCurrentWorry: (worry: Worry | null) => void
  
  addReflection: (reflection: Omit<Reflection, 'id' | 'createdAt'>) => void
  updateReflection: (id: string, updates: Partial<Reflection>) => void
  setCurrentReflection: (reflection: Reflection | null) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  updateSettings: (settings: { reflectionTime?: string; customCategories?: string[] }) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        worries: [],
        currentWorry: null,
        currentReflection: null,
        reflections: [],
        isLoading: false,
        error: null,
        reflectionTime: '17:00',
        customCategories: [],
        
        // Actions
        addWorry: (worryData) =>
          set((state) => ({
            worries: [
              ...state.worries,
              {
                ...worryData,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          })),
        
        updateWorry: (id, updates) =>
          set((state) => ({
            worries: state.worries.map((worry) =>
              worry.id === id ? { ...worry, ...updates } : worry
            ),
          })),
        
        deleteWorry: (id) =>
          set((state) => ({
            worries: state.worries.filter((worry) => worry.id !== id),
            currentWorry: state.currentWorry?.id === id ? null : state.currentWorry,
          })),
        
        setCurrentWorry: (worry) => set({ currentWorry: worry }),
        
        addReflection: (reflectionData) =>
          set((state) => ({
            reflections: [
              ...state.reflections,
              {
                ...reflectionData,
                id: crypto.randomUUID(),
                createdAt: new Date(),
              },
            ],
          })),
        
        updateReflection: (id, updates) =>
          set((state) => ({
            reflections: state.reflections.map((reflection) =>
              reflection.id === id ? { ...reflection, ...updates } : reflection
            ),
          })),
        
        setCurrentReflection: (reflection) => set({ currentReflection: reflection }),
        
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        
        updateSettings: (settings) =>
          set((state) => ({
            ...state,
            ...settings,
          })),
      }),
      {
        name: 'ease-app-storage',
        partialize: (state) => ({
          reflectionTime: state.reflectionTime,
          customCategories: state.customCategories,
        }),
      }
    )
  )
)
