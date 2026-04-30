import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import BusinessAnalytics from '../components/dashboard/BusinessAnalytics'
import fidoIcon from '../assets/icon-color.png'
import { TrendingUp, DollarSign, BarChart2, ArrowRight, PieChart, Users, Search, FileText, ListChecks } from 'lucide-react'

const LINK_BENEFITS = [
  {
    icon: DollarSign,
    title: 'Better loan readiness',
    body: 'Fido reads your cash flow and surfaces your strongest financial signals to match you with the right lenders faster.',
  },
  {
    icon: TrendingUp,
    title: 'Better profitability guidance',
    body: 'See where your money is going and get AI-driven recommendations to improve margins and cut waste.',
  },
  {
    icon: BarChart2,
    title: 'Better growth planning',
    body: 'Fido uses your real numbers to model growth scenarios and help you make confident decisions about your next move.',
  },
]

const enc = (s: string) => encodeURIComponent(s)
const PROMPT_PILLS = [
  { key: 'spending',  label: 'Where am I spending money?',          icon: PieChart,   to: `/dashboard/skill/business-analysis?prompt=${enc('Where am I spending money?')}` },
  { key: 'vendors',   label: 'Who are my top vendors?',             icon: Users,      to: `/dashboard/skill/business-analysis?prompt=${enc('Who are my top vendors?')}` },
  { key: 'unusual',   label: 'Anything unusual in my transactions?', icon: Search,    to: `/dashboard/skill/business-analysis?prompt=${enc('Anything unusual in my transactions?')}` },
  { key: 'loan',      label: 'Get the best loan',                   icon: FileText,   to: '/dashboard/skill/get-funded' },
  { key: 'tasks',     label: "What's on my to-do list?",            icon: ListChecks, to: '/dashboard' },
]

export default function FinancialsPage() {
  const { profile } = useAppStore()
  const navigate = useNavigate()
  const [hoveredPill, setHoveredPill] = useState<string | null>(null)

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'fade-up 0.4s ease both' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: 6,
        }}>
          Overview
        </div>
        <h1 style={{
          fontFamily: 'Platypi, serif', fontSize: 30, fontWeight: 600,
          color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.2,
        }}>
          Financials
        </h1>
      </div>

      {/* Fido contextual message — shown after linking */}
      {profile.bankLinked && (
        <div className="card" style={{
          marginBottom: 28,
          animation: 'fade-up 0.4s 0.04s ease both',
          borderLeft: '3px solid var(--orange)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <img src={fidoIcon} alt="Fido" style={{ width: 28, height: 28, flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>Fido AI</div>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                Thanks for linking your financials — now I can help you get a loan, improve profitability, and plan for growth.
              </p>
            </div>
          </div>
          <div style={{
            padding: '12px 20px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {PROMPT_PILLS.map(({ key, label, icon: Icon, to }) => {
              const hov = hoveredPill === key
              return (
                <button
                  key={key}
                  onClick={() => navigate(to)}
                  onMouseEnter={() => setHoveredPill(key)}
                  onMouseLeave={() => setHoveredPill(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px',
                    borderRadius: 20,
                    border: hov ? '1px solid var(--orange)' : '1px solid var(--border)',
                    background: hov ? 'var(--orange-soft)' : 'var(--bg-elevated)',
                    color: hov ? 'var(--orange)' : 'var(--text-2)',
                    fontSize: 13, fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={13} style={{ flexShrink: 0 }} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Why linking matters — shown when NOT linked */}
      {!profile.bankLinked && (
        <div style={{ marginBottom: 28, animation: 'fade-up 0.4s 0.04s ease both' }}>
          <div className="card" style={{ padding: '24px 28px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <img src={fidoIcon} alt="Fido" style={{ width: 24, height: 24, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Fido AI</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 20 }}>
              Connect your business bank account and I can unlock three things that make a real difference for your business.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
              {LINK_BENEFITS.map(({ icon: Icon, title, body }) => (
                <div key={title} style={{
                  padding: '16px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-elevated)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--orange-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                    <Icon size={15} color="var(--orange)" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 5 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>{body}</div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary"
              style={{ gap: 8, fontSize: 13 }}
              onClick={() => navigate('/onboarding')}
            >
              Connect your bank <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      <BusinessAnalytics />
    </div>
  )
}
