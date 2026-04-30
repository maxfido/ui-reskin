import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Plan = 'free' | 'premium'
export type BillingCycle = 'monthly' | 'annual'

interface BillingState {
  plan: Plan
  billingCycle: BillingCycle
  messagesUsed: number
  trialDaysLeft: number
  card: { brand: string; last4: string } | null
  setPlan: (plan: Plan) => void
  setBillingCycle: (cycle: BillingCycle) => void
  setCard: (card: { brand: string; last4: string } | null) => void
}

export const FREE_MSG_LIMIT = 50
export const PREMIUM_MSG_LIMIT = 300
export const TRIAL_DAYS = 30

export const useBillingStore = create<BillingState>()(
  persist(
    (set) => ({
      plan: 'free',
      billingCycle: 'monthly',
      messagesUsed: 18,
      trialDaysLeft: 24,
      card: null,
      setPlan: (plan) => set({ plan }),
      setBillingCycle: (billingCycle) => set({ billingCycle }),
      setCard: (card) => set({ card }),
    }),
    { name: 'fido-billing' }
  )
)
