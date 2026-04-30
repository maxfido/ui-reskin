import type { CardType } from '../../store/chatStore'

const mono: React.CSSProperties = {
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 8,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
}

function CardShell({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: `1px solid ${accent ? 'rgba(26,122,69,0.3)' : 'var(--border)'}`,
      borderRadius: 8,
      overflow: 'hidden',
      marginTop: 6,
      maxWidth: 400,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ label, badge, badgeColor }: {
  label: string
  badge: string
  badgeColor: 'blue' | 'green' | 'orange' | 'muted'
}) {
  const colors: Record<string, { color: string; bg: string; border: string }> = {
    blue:   { color: 'var(--blue)',   bg: 'rgba(107,127,224,0.10)', border: 'rgba(107,127,224,0.25)' },
    green:  { color: 'var(--green)',  bg: 'rgba(26,122,69,0.10)',   border: 'rgba(26,122,69,0.25)'  },
    orange: { color: 'var(--orange)', bg: 'rgba(232,93,26,0.10)',   border: 'rgba(232,93,26,0.25)'  },
    muted:  { color: 'var(--text-muted)', bg: 'var(--bg-elevated)', border: 'var(--border)' },
  }
  const c = colors[badgeColor]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)',
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      <span style={{
        ...mono, fontSize: 8,
        color: c.color, background: c.bg,
        border: `1px solid ${c.border}`,
        padding: '2px 8px', borderRadius: 20,
      }}>
        {badge}
      </span>
    </div>
  )
}

function MetricGrid({ cols, metrics }: {
  cols: number
  metrics: { label: string; value: string; sub?: string; valueColor?: string }[]
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 1,
      background: 'var(--border)',
    }}>
      {metrics.map(m => (
        <div key={m.label} style={{ background: 'var(--bg-surface)', padding: '8px 10px' }}>
          <div style={{ ...mono, color: 'var(--text-muted)', marginBottom: 3 }}>{m.label}</div>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 700,
            color: m.valueColor ?? 'var(--text)',
          }}>
            {m.value}
          </div>
          {m.sub && <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</div>}
        </div>
      ))}
    </div>
  )
}

// ── EXISTING CARDS ────────────────────────────────────────────────────────────

function HealthSummaryCard() {
  const metrics = [
    { label: 'Cash Flow Margin', value: '22%', status: 'good' },
    { label: 'Revenue Growth (MoM)', value: '+8.4%', status: 'good' },
    { label: 'Fixed Overhead Ratio', value: '38%', status: 'warn' },
    { label: 'Accounts Receivable Days', value: '42 days', status: 'warn' },
  ]
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '18px 20px', marginTop: 4, maxWidth: 360,
    }}>
      <div style={{ ...mono, color: 'var(--text-muted)', marginBottom: 14 }}>
        Business Health Summary
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{m.label}</span>
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: m.status === 'good' ? 'var(--green)' : '#C08010',
              fontFamily: 'IBM Plex Mono, monospace',
            }}>
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LenderMatchCard() {
  const lenders = [
    { name: 'Bluevine', type: 'Line of Credit', rate: '8.2%', amount: '$250K', match: 97 },
    { name: 'Fundbox', type: 'Term Loan', rate: '10.5%', amount: '$150K', match: 91 },
    { name: 'OnDeck', type: 'SBA Loan', rate: '7.8%', amount: '$500K', match: 84 },
  ]
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '18px 20px', marginTop: 4, maxWidth: 400,
    }}>
      <div style={{ ...mono, color: 'var(--text-muted)', marginBottom: 14 }}>Matched Lenders</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lenders.map(l => (
          <div key={l.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 5, padding: '10px 14px',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{l.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{l.type} · up to {l.amount}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)', fontFamily: 'IBM Plex Mono, monospace' }}>{l.rate}</div>
              <div style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>{l.match}% match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── DEMO CARDS ────────────────────────────────────────────────────────────────

function PlaidVerifiedCard() {
  return (
    <CardShell>
      <CardHeader label="Plaid — Bank of America Business ••7203" badge="Verified" badgeColor="blue" />
      <MetricGrid cols={3} metrics={[
        { label: 'Annual Collections', value: '$720K', sub: 'Last 12 months', valueColor: 'var(--green)' },
        { label: 'Avg Monthly',        value: '$60K',  sub: 'Consistent deposits' },
        { label: 'Existing Debt',      value: '$38K',  sub: 'Equipment loan' },
      ]} />
    </CardShell>
  )
}

function FundingProfileCard() {
  return (
    <CardShell>
      <CardHeader label="Funding Profile" badge="Pre-Qualified" badgeColor="green" />
      <MetricGrid cols={3} metrics={[
        { label: 'DSCR',           value: '1.45',       sub: 'SBA min: 1.25', valueColor: 'var(--green)' },
        { label: 'Debt Ratio',     value: '5.3%',       sub: 'Well below limit' },
        { label: 'Eligible Range', value: '$100–$300K', sub: 'Your ask fits' },
      ]} />
    </CardShell>
  )
}

function LenderOffersCard() {
  const offers = [
    { name: 'Live Oak Bank',           type: 'SBA 7(a) — Healthcare', rate: '7.2% APR', term: '84 mo.', monthly: '$2,310/mo', best: true  },
    { name: 'TD Bank Practice Finance', type: 'Practice Term Loan',   rate: '9.1% APR', term: '72 mo.', monthly: '$2,750/mo', best: false },
    { name: 'Provide Financial',        type: 'Dental Equipment Loan', rate: '10.4% APR', term: '60 mo.', monthly: '$3,220/mo', best: false },
  ]
  return (
    <CardShell>
      <CardHeader label="3 Matched Offers — $150,000" badge="Get Funded" badgeColor="orange" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
        {offers.map(o => (
          <div key={o.name} style={{
            background: o.best ? 'rgba(232,93,26,0.04)' : 'var(--bg-surface)',
            borderLeft: o.best ? '2px solid var(--orange)' : '2px solid transparent',
            padding: '8px 12px',
            display: 'grid', gridTemplateColumns: '1fr auto',
            alignItems: 'center', gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{o.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{o.type}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...mono, fontSize: 9, color: o.best ? 'var(--orange)' : 'var(--blue)' }}>{o.rate}</div>
                <div style={{ ...mono, fontSize: 8, color: 'var(--text-muted)', marginTop: 1 }}>{o.term}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...mono, fontSize: 9, color: 'var(--text-2)' }}>{o.monthly}</div>
                {o.best && (
                  <div style={{ ...mono, fontSize: 7, color: 'var(--orange)', marginTop: 1 }}>Best Match</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function LoanComparisonCard() {
  const opts = [
    {
      name: 'Live Oak Bank',
      sub: 'Why it wins',
      color: 'var(--green)',
      body: 'Lowest APR at 7.2% saves ~$42K in interest vs. Provide Financial. SBA healthcare program built for practices like yours — understands dental revenue cycles and insurance timelines. 84-month term keeps payments at $2,310/mo, well within your $60K monthly collections.',
    },
    {
      name: 'TD Bank Practice Finance',
      sub: 'Runner-up',
      color: 'var(--text-muted)',
      body: 'Solid option but 9.1% rate and shorter 72-month term push monthly payments $440 higher. Better if you want faster payoff.',
    },
    {
      name: 'Provide Financial',
      sub: 'Not recommended',
      color: 'var(--text-muted)',
      body: '10.4% rate is the highest of the three. Best reserved for equipment-only purchases under $50K.',
    },
  ]
  return (
    <CardShell>
      <CardHeader label="Overall Analysis" badge="3 Options Compared" badgeColor="muted" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {opts.map((o, i) => (
          <div key={o.name} style={{
            padding: '10px 12px',
            borderBottom: i < opts.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ ...mono, fontSize: 8, color: o.color }}>{o.name}</span>
              <span style={{ ...mono, fontSize: 7, color: 'var(--text-muted)' }}>— {o.sub}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>{o.body}</div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function ApprovalAssessmentCard() {
  const criteria = [
    { label: 'DSCR 1.45',                  detail: 'Exceeds SBA minimum of 1.25. Strong cash flow relative to debt obligations.' },
    { label: '5+ years in practice',        detail: 'Live Oak requires 2+ years. Lakeside qualifies comfortably.' },
    { label: 'Low existing debt',           detail: '$38K equipment balance is minimal relative to $720K annual collections.' },
    { label: 'Consistent collection history', detail: '12 months of steady $60K/mo deposits with no significant gaps.' },
  ]
  return (
    <CardShell accent>
      <CardHeader label="Approval Assessment" badge="High Confidence" badgeColor="green" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {criteria.map((c, i) => (
          <div key={c.label} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            padding: '9px 12px',
            borderBottom: i < criteria.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ color: 'var(--green)', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.label} </span>
              <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.55 }}>{c.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function DocsOnFileCard() {
  const docs = [
    '12 months bank statements — pulled from Plaid',
    'Practice financials & collections summary — calculated from your data',
    'Existing debt schedule — $38K equipment loan on file',
    'Business profile — Lakeside Family Dental, 5 years operating',
  ]
  return (
    <CardShell accent>
      <CardHeader label="Required Documents" badge="All on File" badgeColor="green" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {docs.map((d, i) => (
          <div key={d} style={{
            display: 'flex', gap: 10, alignItems: 'center',
            padding: '9px 12px',
            borderBottom: i < docs.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ color: 'var(--green)', fontSize: 12, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{d}</span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function SubmittedCard() {
  return (
    <CardShell accent>
      <CardHeader label="Application Submitted" badge="Confirmed" badgeColor="green" />
      <MetricGrid cols={2} metrics={[
        { label: 'Lender',   value: 'Live Oak Bank' },
        { label: 'Product',  value: 'SBA 7(a)'      },
        { label: 'Amount',   value: '$150,000', valueColor: 'var(--green)' },
        { label: 'Ref #',    value: 'LOB-2026-7203' },
      ]} />
    </CardShell>
  )
}

// ── COFFEE CO CARDS ───────────────────────────────────────────────────────────

function CoffeePlaidCard() {
  return (
    <CardShell>
      <CardHeader label="Chase Business Checking ••4891" badge="Verified" badgeColor="blue" />
      <MetricGrid cols={3} metrics={[
        { label: 'Monthly Revenue', value: '$15,200', sub: 'Avg monthly deposits', valueColor: 'var(--green)' },
        { label: 'Annual',          value: '$182,400', sub: 'Last 12 months' },
        { label: 'Existing Debt',   value: '$0',       sub: 'No outstanding loans' },
      ]} />
    </CardShell>
  )
}

function CoffeeProfileCard() {
  const criteria = [
    { label: 'Monthly Revenue', detail: '$15,200/mo — exceeds $8,333 OnDeck minimum' },
    { label: 'Time in Business', detail: '3 years operating — exceeds 1 year minimum' },
    { label: 'Est. FICO',        detail: '668 — meets 625+ threshold for OnDeck products' },
    { label: 'Daily Deposits',   detail: 'Consistent 5-day deposit pattern detected' },
  ]
  return (
    <CardShell accent>
      <CardHeader label="Funding Profile" badge="Pre-Qualified" badgeColor="green" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {criteria.map((c, i) => (
          <div key={c.label} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            padding: '8px 12px',
            borderBottom: i < criteria.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ color: 'var(--green)', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.label} </span>
              <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.55 }}>{c.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function CoffeeSubmittedCard() {
  const rows = [
    { label: 'Business',         value: 'The Coffee Co — Chicago, IL' },
    { label: 'Lender',           value: 'OnDeck Capital' },
    { label: 'Amount requested', value: '$28,000', highlight: true },
    { label: 'Equipment',        value: 'La Marzocco Linea Micra' },
    { label: 'Vendor quote',     value: 'Espresso Parts & Supply, Chicago' },
    { label: 'Revenue proof',    value: '$15,200/mo — Chase ••4891' },
    { label: 'FICO',             value: '720 — soft pull, no impact' },
    { label: 'Reference',        value: 'APP-2026-4891' },
  ]
  return (
    <CardShell accent>
      <CardHeader label="Submitted to OnDeck Underwriting" badge="Sent" badgeColor="green" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '7px 12px',
            borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: (r as { highlight?: boolean }).highlight ? 'var(--green)' : 'var(--text)',
              fontFamily: 'IBM Plex Mono, monospace',
            }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

// ── EXPORT ────────────────────────────────────────────────────────────────────

export default function InlineCard({ type }: { type: CardType }) {
  if (type === 'health-summary')      return <HealthSummaryCard />
  if (type === 'lender-match')        return <LenderMatchCard />
  if (type === 'plaid-verified')      return <PlaidVerifiedCard />
  if (type === 'funding-profile')     return <FundingProfileCard />
  if (type === 'lender-offers')       return <LenderOffersCard />
  if (type === 'loan-comparison')     return <LoanComparisonCard />
  if (type === 'approval-assessment') return <ApprovalAssessmentCard />
  if (type === 'docs-on-file')        return <DocsOnFileCard />
  if (type === 'submitted')           return <SubmittedCard />
  if (type === 'coffee-plaid')        return <CoffeePlaidCard />
  if (type === 'coffee-profile')    return <CoffeeProfileCard />
  if (type === 'coffee-submitted')  return <CoffeeSubmittedCard />
  return null
}
