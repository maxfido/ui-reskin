import type { CardType } from '../store/chatStore'

export interface DemoStep {
  chipText: string
  userMsg:  string
  delay:    number
  response: string
  card?:    CardType
}

export const DEMO_SCENARIO: DemoStep[] = [
  {
    chipText: 'I need $150K for a second operatory and new imaging equipment',
    userMsg:  'I need $150,000 to add a second operatory and upgrade our digital X-ray and CBCT imaging.',
    delay:    2000,
    response: "Got it. I pulled Lakeside Family Dental's financials directly from your connected bank account. Here's what I found:",
    card:     'plaid-verified',
  },
  {
    chipText: 'Yes, that looks right →',
    userMsg:  'Yes, that looks right.',
    delay:    1800,
    response: "Lakeside Family Dental clears every key threshold. Here's your funding profile:",
    card:     'funding-profile',
  },
  {
    chipText: 'Find my loan options →',
    userMsg:  'Find my loan options.',
    delay:    2200,
    response: "Found 3 matched offers for $150,000. Want me to walk you through a full analysis?",
    card:     'lender-offers',
  },
  {
    chipText: 'What do you recommend?',
    userMsg:  'What do you recommend?',
    delay:    2000,
    response: "My recommendation: Live Oak Bank SBA 7(a). Ready to submit your application?",
    card:     'loan-comparison',
  },
  {
    chipText: 'What are my chances of approval?',
    userMsg:  'What are my chances of approval?',
    delay:    1800,
    response: "Your approval odds are strong. Here's how Lakeside Family Dental stacks up against Live Oak's SBA 7(a) healthcare criteria:",
    card:     'approval-assessment',
  },
  {
    chipText: 'What paperwork do I need?',
    userMsg:  'What paperwork do I need?',
    delay:    1600,
    response: "None. I already have everything Live Oak needs.",
    card:     'docs-on-file',
  },
  {
    chipText: 'Submit to Live Oak Bank →',
    userMsg:  'Yes — submit to Live Oak Bank.',
    delay:    2400,
    response: "Your application is in. Live Oak Bank has received everything they need. I'll notify you when they respond — typically 2 to 5 business days. You didn't fill out a single form.",
    card:     'submitted',
  },
]

export interface MockFlow {
  trigger: string
  response: string
  delay: number
  card?: 'health-summary' | 'lender-match'
}

export const MOCK_FLOWS: Record<string, MockFlow[]> = {
  'business-analysis': [
    {
      trigger: 'default',
      delay: 1400,
      response: "Got it. And what are your typical monthly expenses — things like rent, payroll, inventory, and any recurring costs?",
    },
    {
      trigger: 'second',
      delay: 1800,
      response: "Thanks — that gives me a clear picture. Let me run a quick analysis on your numbers.",
      card: 'health-summary',
    },
    {
      trigger: 'third',
      delay: 1200,
      response: "Your cash flow margin looks healthy at around 22%. The main opportunity I see is reducing fixed overhead — you're running about 15% above the industry benchmark for your category. Want me to dig deeper into any of these areas?",
    },
    {
      trigger: 'default-fallback',
      delay: 1000,
      response: "Good question. Based on what you've shared, I'd focus on tightening your accounts receivable cycle — that's where most of the cash flow pressure is coming from. Want a breakdown?",
    },
  ],
  'general': [
    {
      trigger: 'default',
      delay: 1100,
      response: "Great question. I can help you think through that. To give you the most relevant answer, can you tell me a bit more about where your business is right now — stage, revenue range, and what's top of mind?",
    },
    {
      trigger: 'second',
      delay: 1300,
      response: "That makes sense. A lot of businesses at your stage face this same tension. Here's how I'd think about it: prioritize cash flow stability first, then growth levers. Want me to pull up your financial dashboard or explore a specific skill like funding or business analysis?",
    },
    {
      trigger: 'third',
      delay: 1000,
      response: "Exactly — and that's actually where Fido can save you the most time. I can handle the analysis, surface the right lenders, and flag anything that needs your attention. What would you like to tackle first?",
    },
    {
      trigger: 'default-fallback',
      delay: 900,
      response: "Good point. I'd recommend starting with your business health score — it gives us a single number to work from and highlights where to focus. Want me to run that now?",
    },
  ],
  'get-funded': [
    {
      trigger: 'default',
      delay: 1400,
      response: "Got it. And how long has your business been operating? Lenders typically look for at least 6 months of history for most products.",
    },
    {
      trigger: 'second',
      delay: 1600,
      response: "Perfect. Last question before I run your match — what's your approximate annual revenue?",
    },
    {
      trigger: 'third',
      delay: 2000,
      response: "Based on what you've shared, I've found 3 strong matches for your profile.",
      card: 'lender-match',
    },
    {
      trigger: 'default-fallback',
      delay: 1000,
      response: "That's a common question. The rate you'll qualify for depends largely on your time in business and revenue consistency. Your profile looks competitive — I'd expect offers in the 8–14% range based on current market conditions.",
    },
  ],
}

export const getNextResponse = (skillId: string, messageCount: number): MockFlow => {
  const flows = MOCK_FLOWS[skillId] ?? MOCK_FLOWS['business-analysis']
  if (messageCount === 1) return flows[0]
  if (messageCount === 2) return flows[1] ?? flows[0]
  if (messageCount === 3) return flows[2] ?? flows[0]
  return flows[3] ?? flows[flows.length - 1]
}
