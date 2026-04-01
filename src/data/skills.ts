export interface Skill {
  id: string
  name: string
  tagline: string
  description: string
  icon: string
  color: string
  available: boolean
  mockOpener: string
}

// General chat skill — used by "Chat with Fido AI" nav item, not shown in hub graph
export const GENERAL_SKILL: Skill = {
  id: 'general',
  name: 'Chat with Fido AI',
  tagline: 'Ask me anything.',
  description: 'Talk to Fido about your business — funding, finances, strategy, or anything else on your mind.',
  icon: 'MessageSquare',
  color: '#E85D1A',
  available: true,
  mockOpener: "Hey! I'm Fido, your AI business partner. What's on your mind today? You can ask me about funding, your financials, strategy — anything.",
}

export const SKILLS: Skill[] = [
  {
    id: 'business-analysis',
    name: 'Business Analysis',
    tagline: 'Know your numbers.',
    description: 'Analyze your financial health, cash flow, and business performance. Fido surfaces what matters.',
    icon: 'BarChart3',
    color: '#2563EB',
    available: true,
    mockOpener: "Let's take a look at your business health. To get started, can you tell me your approximate monthly revenue for the last 3 months?",
  },
  {
    id: 'get-funded',
    name: 'Get Funded',
    tagline: 'Capital on your terms.',
    description: 'Get matched with the right lenders and build your loan application — without the paperwork nightmare.',
    icon: 'Banknote',
    color: '#E85D1A',
    available: true,
    mockOpener: "I'm going to help you find the right financing for your business. First — how much capital are you looking to raise, and what do you need it for?",
  },
  {
    id: 'incorporate',
    name: 'Incorporate',
    tagline: 'Coming soon.',
    description: 'Form your LLC, stay compliant, and handle annual filings — all handled by Fido.',
    icon: 'Building2',
    color: '#888886',
    available: false,
    mockOpener: '',
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Coming soon.',
    description: 'Find your next customer. Fido builds your presence and drives revenue on your behalf.',
    icon: 'TrendingUp',
    color: '#888886',
    available: false,
    mockOpener: '',
  },
  {
    id: 'pitch-deck',
    name: 'Create Pitch Deck',
    tagline: 'Coming soon.',
    description: 'Build a compelling investor pitch deck in minutes — tailored to your business and funding goal.',
    icon: 'Presentation',
    color: '#888886',
    available: false,
    mockOpener: '',
  },
  {
    id: 'build-website',
    name: 'Build My Website',
    tagline: 'Coming soon.',
    description: 'Launch a professional business website with Fido — no code required.',
    icon: 'Globe',
    color: '#888886',
    available: false,
    mockOpener: '',
  },
]

export const getSkill = (id: string) =>
  id === 'general' ? GENERAL_SKILL : SKILLS.find(s => s.id === id)
