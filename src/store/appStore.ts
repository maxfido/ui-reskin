import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BusinessProfile {
  type: 'existing' | 'new' | null
  businessName: string
  ownerName: string
  industry: string
  website: string
  phone: string
  city: string
  state: string
  zip: string
  bankLinked: boolean
}

interface AppState {
  onboarded: boolean
  profile: BusinessProfile
  setOnboarded: (v: boolean) => void
  setProfile: (p: Partial<BusinessProfile>) => void
  reset: () => void
}

const defaultProfile: BusinessProfile = {
  type: null,
  businessName: '',
  ownerName: '',
  industry: '',
  website: '',
  phone: '',
  city: '',
  state: '',
  zip: '',
  bankLinked: false,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarded: false,
      profile: defaultProfile,
      setOnboarded: (v) => set({ onboarded: v }),
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      reset: () => set({ onboarded: false, profile: defaultProfile }),
    }),
    { name: 'fido-app' }
  )
)
