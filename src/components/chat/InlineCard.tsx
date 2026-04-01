import type { CardType } from '../../store/chatStore'

function HealthSummaryCard() {
  const metrics = [
    { label: 'Cash Flow Margin', value: '22%', status: 'good' },
    { label: 'Revenue Growth (MoM)', value: '+8.4%', status: 'good' },
    { label: 'Fixed Overhead Ratio', value: '38%', status: 'warn' },
    { label: 'Accounts Receivable Days', value: '42 days', status: 'warn' },
  ]
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '18px 20px',
      marginTop: 4,
      maxWidth: 360,
    }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 9,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 14,
      }}>
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
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '18px 20px',
      marginTop: 4,
      maxWidth: 400,
    }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 9,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 14,
      }}>
        Matched Lenders
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lenders.map(l => (
          <div key={l.name} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 5,
            padding: '10px 14px',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{l.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{l.type} · up to {l.amount}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)', fontFamily: 'IBM Plex Mono, monospace' }}>{l.rate}</div>
              <div style={{
                fontSize: 10, color: 'var(--green)',
                fontFamily: 'IBM Plex Mono, monospace',
                marginTop: 2,
              }}>{l.match}% match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InlineCard({ type }: { type: CardType }) {
  if (type === 'health-summary') return <HealthSummaryCard />
  if (type === 'lender-match') return <LenderMatchCard />
  return null
}
