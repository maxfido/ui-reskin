import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { useNavigate } from 'react-router-dom'
import { Link, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import iconColor from '../../assets/icon-color.png'

const HEALTH_SCORE = 74
const HEALTH_LABEL = 'Good'
const HEALTH_COLOR = '#1A7A45'
const HEALTH_INSIGHTS = [
  { label: 'Cash flow positive for 3 consecutive months', status: 'good' },
  { label: 'Fixed overhead 15% above industry benchmark', status: 'warn' },
  { label: 'Revenue growing +8.4% month-over-month', status: 'good' },
  { label: 'Accounts receivable averaging 42 days', status: 'warn' },
]

// Mock Plaid-sourced data
const PLAID_DATA = {
  lastSynced: new Date(Date.now() - 1000 * 60 * 14), // 14 min ago
  accounts: [
    { name: 'Chase Business Checking', mask: '4821', balance: 48_320 },
    { name: 'Chase Business Savings', mask: '9034', balance: 21_750 },
  ],
  monthly: [
    { month: 'Jan', revenue: 68_400, expenses: 51_200 },
    { month: 'Feb', revenue: 72_100, expenses: 48_900 },
    { month: 'Mar', revenue: 79_600, expenses: 53_400 },
  ],
  categories: [
    { label: 'Payroll', amount: 28_500, pct: 53 },
    { label: 'Rent & Utilities', amount: 8_200, pct: 15 },
    { label: 'Inventory', amount: 7_100, pct: 13 },
    { label: 'Marketing', amount: 4_800, pct: 9 },
    { label: 'Software & Tools', amount: 2_600, pct: 5 },
    { label: 'Other', amount: 2_200, pct: 4 },
  ],
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return `$${n}`
}

function timeAgoShort(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

function CashFlowChart() {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)
  const max = Math.max(...PLAID_DATA.monthly.flatMap(m => [m.revenue, m.expenses]))
  const barW = 28
  const gap = 8
  const groupW = barW * 2 + gap
  const groupGap = 24
  const h = 80
  const svgW = PLAID_DATA.monthly.length * (groupW + groupGap) - groupGap

  return (
    <svg viewBox={`0 0 ${svgW} ${h + 24}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      {PLAID_DATA.monthly.map((m, i) => {
        const x = i * (groupW + groupGap)
        const rH = (m.revenue / max) * h
        const eH = (m.expenses / max) * h
        const net = m.revenue - m.expenses
        const hov = hoveredMonth === i
        return (
          <g key={m.month} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHoveredMonth(i)}
            onMouseLeave={() => setHoveredMonth(null)}
          >
            {/* Hit area */}
            <rect x={x - 4} y={0} width={groupW + 8} height={h + 20} fill="transparent" />
            {/* Revenue bar */}
            <rect x={x} y={h - rH} width={barW} height={rH} rx={3} fill="var(--blue)" opacity={hov ? 1 : 0.75}
              style={{ transition: 'opacity 0.15s' }} />
            {/* Expense bar */}
            <rect x={x + barW + gap} y={h - eH} width={barW} height={eH} rx={3}
              fill={net >= 0 ? '#888886' : 'var(--orange)'} opacity={hov ? 0.9 : 0.55}
              style={{ transition: 'opacity 0.15s' }} />
            {/* Tooltip on hover */}
            {hov && (
              <g>
                <rect x={x - 8} y={-36} width={groupW + 16} height={28} rx={4} fill="var(--text)" />
                <text x={x + groupW / 2} y={-26} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={8} fill="#fff">
                  {`Rev ${fmt(m.revenue)}`}
                </text>
                <text x={x + groupW / 2} y={-14} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={8} fill="rgba(255,255,255,0.6)">
                  {`Exp ${fmt(m.expenses)}`}
                </text>
              </g>
            )}
            {/* Month label */}
            <text x={x + groupW / 2} y={h + 16} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={9}
              fill={hov ? 'var(--text)' : 'var(--text-muted)'} style={{ transition: 'fill 0.15s' }}>
              {m.month}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function HealthScoreArc({ score }: { score: number }) {
  const r = 52
  const cx = 70, cy = 70
  const startAngle = -210
  const endAngle = 30
  const totalArc = endAngle - startAngle
  const scoreArc = (score / 100) * totalArc

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcPath = (angle: number) => {
    const x = cx + r * Math.cos(toRad(angle))
    const y = cy + r * Math.sin(toRad(angle))
    return { x, y }
  }

  const start = arcPath(startAngle)
  const trackEnd = arcPath(endAngle)
  const scoreEnd = arcPath(startAngle + scoreArc)
  const largeArc = totalArc > 180 ? 1 : 0
  const scoreLarge = scoreArc > 180 ? 1 : 0

  return (
    <svg width={140} height={110} viewBox="0 0 140 110">
      {/* Track */}
      <path
        d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${trackEnd.x} ${trackEnd.y}`}
        fill="none" stroke="var(--border)" strokeWidth={8} strokeLinecap="round"
      />
      {/* Score arc */}
      <path
        d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${scoreLarge} 1 ${scoreEnd.x} ${scoreEnd.y}`}
        fill="none" stroke={HEALTH_COLOR} strokeWidth={8} strokeLinecap="round"
      />
      {/* Score number */}
      <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="Platypi, serif" fontSize={28} fontWeight={600} fill="var(--text)">{score}</text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize={9} fill={HEALTH_COLOR} letterSpacing="1">{HEALTH_LABEL}</text>
    </svg>
  )
}

function AccountRow({ acc }: { acc: { name: string; mask: string; balance: number } }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: hov ? 'var(--bg-elevated)' : 'var(--bg)',
        border: `1px solid ${hov ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius: 5, padding: '12px 16px',
        transition: 'background 0.15s, border-color 0.15s',
        cursor: 'default',
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{acc.name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'IBM Plex Mono, monospace' }}>···· {acc.mask}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: hov ? 'var(--green)' : 'var(--text)', fontFamily: 'IBM Plex Mono, monospace', transition: 'color 0.15s' }}>
        {fmt(acc.balance)}
      </div>
    </div>
  )
}

function CategoryRow({ cat }: { cat: { label: string; amount: number; pct: number } }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ padding: '4px 6px', borderRadius: 4, background: hov ? 'var(--bg)' : 'transparent', transition: 'background 0.15s', cursor: 'default' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: hov ? 'var(--text)' : 'var(--text-2)', transition: 'color 0.15s' }}>{cat.label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'IBM Plex Mono, monospace' }}>{fmt(cat.amount)}</span>
      </div>
      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${hov ? cat.pct + 2 : cat.pct}%`, background: hov ? 'var(--text)' : 'var(--text)', borderRadius: 2, opacity: hov ? 0.55 : 0.22, transition: 'width 0.2s, opacity 0.15s' }} />
      </div>
    </div>
  )
}

function StatCell({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: 'up' | 'down' | 'flat' }) {
  const [hov, setHov] = useState(false)
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'var(--green)' : trend === 'down' ? 'var(--orange)' : 'var(--text-muted)'
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 4,
        padding: '10px 12px', borderRadius: 5, cursor: 'default',
        background: hov ? 'var(--bg)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.03em' }}>{value}</span>
        {trend && <TrendIcon size={13} color={trendColor} style={{ marginBottom: 2 }} />}
      </div>
      {sub && <div style={{ fontSize: 11, color: hov ? 'var(--text-2)' : 'var(--text-muted)', transition: 'color 0.15s' }}>{sub}</div>}
    </div>
  )
}

export default function BusinessAnalytics() {
  const { profile } = useAppStore()
  const navigate = useNavigate()

  const [askHovered, setAskHovered] = useState(false)
  const lastMonth = PLAID_DATA.monthly[PLAID_DATA.monthly.length - 1]
  const prevMonth = PLAID_DATA.monthly[PLAID_DATA.monthly.length - 2]
  const netCash = lastMonth.revenue - lastMonth.expenses
  const revGrowth = ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100).toFixed(1)
  const totalBalance = PLAID_DATA.accounts.reduce((s, a) => s + a.balance, 0)

  if (!profile.bankLinked) {
    return (
      <div className="card" style={{
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        marginBottom: 28,
      }}>
        <div>
          <div style={{ fontFamily: 'Platypi, serif', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Connect your bank to unlock analytics
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 420 }}>
            Fido uses your transaction data to surface cash flow trends, spending breakdowns, and funding readiness — in real time.
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ flexShrink: 0, gap: 8 }}
          onClick={() => navigate('/onboarding')}
        >
          <Link size={13} /> Connect Plaid
        </button>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 32, animation: 'fade-up 0.4s 0.05s ease both', opacity: 0 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Business Analytics
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: 'var(--green)', letterSpacing: '0.08em' }}>
              Plaid · synced {timeAgoShort(PLAID_DATA.lastSynced)}
            </span>
          </div>
          {/* Fido AI token */}
          <button
            onClick={() => navigate('/dashboard/skill/business-analysis')}
            onMouseEnter={() => setAskHovered(true)}
            onMouseLeave={() => setAskHovered(false)}
            title="Ask Fido about your analytics"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: askHovered ? 8 : 0,
              background: askHovered ? 'var(--orange)' : 'var(--orange-soft)',
              border: '1.5px solid transparent',
              borderColor: askHovered ? 'var(--orange)' : 'rgba(232,93,26,0.2)',
              borderRadius: 20,
              padding: askHovered ? '5px 12px 5px 6px' : '5px 6px',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <img
              src={iconColor}
              alt="Fido"
              style={{ width: 22, height: 22, flexShrink: 0, display: 'block' }}
            />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: '#fff',
              maxWidth: askHovered ? 160 : 0,
              opacity: askHovered ? 1 : 0,
              transition: 'max-width 0.22s ease, opacity 0.18s ease',
              overflow: 'hidden',
            }}>
              Ask Fido AI
            </span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Top stats */}
        <div className="card" style={{ padding: '24px 28px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            <StatCell label="Total Balance" value={fmt(totalBalance)} sub="Across 2 accounts" trend="up" />
            <StatCell label="Mar Revenue" value={fmt(lastMonth.revenue)} sub={`+${revGrowth}% vs Feb`} trend="up" />
            <StatCell label="Mar Expenses" value={fmt(lastMonth.expenses)} sub="↑ 9% vs Feb" trend="down" />
            <StatCell label="Net Cash Flow" value={fmt(netCash)} sub="This month" trend={netCash > 0 ? 'up' : 'down'} />
          </div>
        </div>

        {/* Business Health Score */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Business Health Score</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Based on cash flow, growth & overhead</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <HealthScoreArc score={HEALTH_SCORE} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {HEALTH_INSIGHTS.map(ins => (
                <div key={ins.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                    background: ins.status === 'good' ? 'var(--green)' : '#C08010',
                  }} />
                  <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{ins.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cash flow chart */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Cash Flow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--blue)', opacity: 0.75 }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Revenue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#CCCCCA' }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Expenses</span>
              </div>
            </div>
          </div>
          <CashFlowChart />
        </div>

        {/* Top spending categories */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Top Expenses</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLAID_DATA.categories.slice(0, 5).map(cat => (
              <CategoryRow key={cat.label} cat={cat} />
            ))}
          </div>
        </div>

        {/* Connected accounts */}
        <div className="card" style={{ padding: '22px 24px', gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Connected Accounts</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {PLAID_DATA.accounts.map(acc => (
              <AccountRow key={acc.mask} acc={acc} />
            ))}
          </div>
        </div>


      </div>
    </div>
  )
}
