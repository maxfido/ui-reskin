export type Section = 'funding' | 'accounts' | 'plan'

export interface UserProfile {
  firstName: string
  lastName: string
  businessName: string
  businessWebsite: string
  city: string
  state: string
  zip: string
}
