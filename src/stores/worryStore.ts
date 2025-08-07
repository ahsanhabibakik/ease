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

export enum CognitiveDistortion {
  ALL_OR_NOTHING = 'all-or-nothing',
  OVERGENERALIZATION = 'overgeneralization',
  MENTAL_FILTER = 'mental-filter',
  DIMINISHING_POSITIVE = 'diminishing-positive',
  JUMPING_TO_CONCLUSIONS = 'jumping-to-conclusions',
  CATASTROPHIZING = 'catastrophizing',
  EMOTIONAL_REASONING = 'emotional-reasoning',
  SHOULD_STATEMENTS = 'should-statements',
  LABELING = 'labeling',
  PERSONALIZATION = 'personalization'
}

export interface CognitiveChallenge {
  id: string;
  worryId: string;
  originalThought: string;
  evidenceFor: string[];
  evidenceAgainst: string[];
  probabilityRating: number; // 0-100
  helpfulnessRating: number; // 1-10
  reframedThought: string;
  cognitiveDistortions: CognitiveDistortion[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface WorrySettings {
  dailyWorryTime: number; // minutes
  notifications: boolean;
}

interface WorryStore {
  // State
  worries: Worry[];
  challenges: CognitiveChallenge[];
  settings: WorrySettings;
  isLoading: boolean;
  
  // Worry Actions
  addWorry: (worry: Omit<Worry, 'id' | 'createdAt' | 'isReleased'>) => void;
  releaseWorry: (id: string) => void;
  getActiveWorries: () => Worry[];
  getReleasedWorries: () => Worry[];
  updateSettings: (settings: Partial<WorrySettings>) => void;
  setLoading: (loading: boolean) => void;
  clearWorries: () => void;

  // Cognitive Challenge Actions
  startChallenge: (worryId: string, originalThought: string) => string; // returns challenge ID
  updateChallenge: (challengeId: string, updates: Partial<CognitiveChallenge>) => void;
  completeChallenge: (challengeId: string, reframedThought: string) => void;
  getWorryChallenge: (challengeId: string) => CognitiveChallenge | undefined;
  getWorrysChallenges: (worryId: string) => CognitiveChallenge[];
  deleteChallenge: (challengeId: string) => void;
  getChallengeStats: () => {
    totalChallenges: number;
    completedChallenges: number;
    mostCommonDistortions: { distortion: CognitiveDistortion; count: number }[];
    averageHelpfulness: number;
    averageProbability: number;
  };
}

const useWorryStore = create<WorryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      worries: [],
      challenges: [],
      settings: {
        dailyWorryTime: 15,
        notifications: true,
      },
      isLoading: false,

      // Worry Actions
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

      // Cognitive Challenge Actions
      startChallenge: (worryId, originalThought) => {
        const challengeId = crypto.randomUUID();
        const now = new Date();
        
        const newChallenge: CognitiveChallenge = {
          id: challengeId,
          worryId,
          originalThought,
          evidenceFor: [],
          evidenceAgainst: [],
          probabilityRating: 50, // Default to middle
          helpfulnessRating: 5, // Default to middle
          reframedThought: '',
          cognitiveDistortions: [],
          createdAt: now,
          updatedAt: now,
          isCompleted: false,
        };

        set((state) => ({
          challenges: [...state.challenges, newChallenge],
        }));

        return challengeId;
      },

      updateChallenge: (challengeId, updates) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, ...updates, updatedAt: new Date() }
              : challenge
          ),
        }));
      },

      completeChallenge: (challengeId, reframedThought) => {
        const completedAt = new Date();
        
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  reframedThought,
                  completedAt,
                  updatedAt: completedAt,
                  isCompleted: true,
                }
              : challenge
          ),
        }));
      },

      getWorryChallenge: (challengeId) => {
        return get().challenges.find((challenge) => challenge.id === challengeId);
      },

      getWorrysChallenges: (worryId) => {
        return get().challenges.filter((challenge) => challenge.worryId === worryId);
      },

      deleteChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.filter((challenge) => challenge.id !== challengeId),
        }));
      },

      getChallengeStats: () => {
        const challenges = get().challenges;
        const completedChallenges = challenges.filter(c => c.isCompleted);
        
        // Count cognitive distortions
        const distortionCounts: Record<CognitiveDistortion, number> = {} as Record<CognitiveDistortion, number>;
        completedChallenges.forEach(challenge => {
          challenge.cognitiveDistortions.forEach(distortion => {
            distortionCounts[distortion] = (distortionCounts[distortion] || 0) + 1;
          });
        });

        const mostCommonDistortions = Object.entries(distortionCounts)
          .map(([distortion, count]) => ({
            distortion: distortion as CognitiveDistortion,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        const averageHelpfulness = completedChallenges.length > 0
          ? completedChallenges.reduce((sum, c) => sum + c.helpfulnessRating, 0) / completedChallenges.length
          : 0;

        const averageProbability = completedChallenges.length > 0
          ? completedChallenges.reduce((sum, c) => sum + c.probabilityRating, 0) / completedChallenges.length
          : 0;

        return {
          totalChallenges: challenges.length,
          completedChallenges: completedChallenges.length,
          mostCommonDistortions,
          averageHelpfulness,
          averageProbability,
        };
      },
    }),
    {
      name: 'ease-worry-store',
      version: 2, // Increment version for new schema
    }
  )
);

export default useWorryStore;
