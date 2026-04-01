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
