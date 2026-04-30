import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SoulDocument {
  why: string           // Why does this business exist beyond making money?
  vision: string        // Where will you be in 5 years?
  values: string        // What do you stand for?
  customer: string      // Who is your ideal customer?
  goals: string         // Top goals for the next 12 months
  challenge: string     // Hardest thing you're navigating right now
  differentiation: string // Why would someone choose you?
  northStar: string     // The one number that means everything is working
  origin: string        // How did this start?
  letter: string        // Note to future self (optional)
  lastSaved: number | null
}

const defaultSoul: SoulDocument = {
  why: '',
  vision: '',
  values: '',
  customer: '',
  goals: '',
  challenge: '',
  differentiation: '',
  northStar: '',
  origin: '',
  letter: '',
  lastSaved: null,
}

interface SoulState {
  soul: SoulDocument
  setSoul: (fields: Partial<SoulDocument>) => void
  save: () => void
  reset: () => void
}

export const useSoulStore = create<SoulState>()(
  persist(
    (set) => ({
      soul: defaultSoul,
      setSoul: (fields) =>
        set((s) => ({ soul: { ...s.soul, ...fields } })),
      save: () =>
        set((s) => ({ soul: { ...s.soul, lastSaved: Date.now() } })),
      reset: () => set({ soul: defaultSoul }),
    }),
    { name: 'fido-soul' }
  )
)

export const SOUL_FIELDS = [
  'why', 'vision', 'values', 'customer',
  'goals', 'challenge', 'differentiation', 'northStar', 'origin',
] as const

export type SoulFieldKey = typeof SOUL_FIELDS[number]

export function soulCompleteness(soul: SoulDocument): number {
  const filled = SOUL_FIELDS.filter(k => soul[k].trim().length >= 10).length
  return Math.round((filled / SOUL_FIELDS.length) * 100)
}
