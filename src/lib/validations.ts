import { z } from 'zod'

export const createWorrySchema = z.object({
  title: z.string().min(1, 'Worry title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  category: z.enum(['School', 'Work', 'Family', 'Finance', 'Politics', 'Custom']),
  bodyFeeling: z.enum(['Sweaty palms', 'Heartbeat', 'Jaw tightness', 'Restless legs', 'Others']).optional(),
  intensity: z.number().min(1).max(10).default(5),
  scheduledAt: z.date().optional(),
})

export const updateWorrySchema = createWorrySchema.partial()

export const createReflectionSchema = z.object({
  worryId: z.string().optional(),
  evidenceFor: z.string().optional(),
  evidenceAgainst: z.string().optional(),
  alternativeView: z.string().optional(),
  worstCaseReality: z.string().optional(),
  gentleAction: z.string().optional(),
  feelingNow: z.string().optional(),
  whatHelped: z.string().optional(),
  whatDidntFeel: z.string().optional(),
  realizations: z.string().optional(),
  celebrations: z.string().optional(),
  completed: z.boolean().default(false),
})

export const updateReflectionSchema = createReflectionSchema.partial()

export const userSettingsSchema = z.object({
  reflectionTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  customCategories: z.array(z.string()).max(10, 'Too many custom categories'),
  notifications: z.boolean().default(true),
  darkMode: z.boolean().default(false),
})

export type CreateWorryInput = z.infer<typeof createWorrySchema>
export type UpdateWorryInput = z.infer<typeof updateWorrySchema>
export type CreateReflectionInput = z.infer<typeof createReflectionSchema>
export type UpdateReflectionInput = z.infer<typeof updateReflectionSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>
