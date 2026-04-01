import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Check, ArrowRight } from 'lucide-react'

const INDUSTRIES = ['Retail', 'Food & Beverage', 'Services', 'Construction', 'Healthcare', 'Technology', 'Other']

type Plan = 'free' | 'premium'

function PlanFeature({ text, note }: { text: string; note?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
      <Check size={13} style={{ marginTop: 2, flexShrink: 0, color: 'var(--text)' }} strokeWidth={2.5} />
      <div>
        <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{text}</div>
        {note && (
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {note}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 9,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{label}</label>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { profile, setProfile } = useAppStore()
  const [saved, setSaved] = useState(false)
  const [currentPlan] = useState<Plan>('free')

  const [form, setForm] = useState({
    businessName: profile.businessName,
    ownerName: profile.ownerName,
    industry: profile.industry,
    website: profile.website,
    phone: profile.phone || '',
  })

  const handleSave = () => {
    setProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontSize: 13,
    color: 'var(--text)',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-strong)',
    padding: '6px 0',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.15s',
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888886' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 4px center',
    paddingRight: 20,
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 44, animation: 'fade-up 0.4s ease both' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 6,
        }}>
          Account
        </div>
        <h1 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}>
          Settings
        </h1>
      </div>

      {/* Business Profile */}
      <div className="card" style={{ padding: '28px 32px', marginBottom: 28, animation: 'fade-up 0.4s 0.05s ease both' }}>
        <SectionLabel>Business Profile</SectionLabel>

        <FieldRow label="Business name">
          <input
            style={inputStyle}
            value={form.businessName}
            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            placeholder="Your business name"
            onFocus={e => (e.target.style.borderBottomColor = 'var(--text)')}
            onBlur={e => (e.target.style.borderBottomColor = 'var(--border-strong)')}
          />
        </FieldRow>

        <FieldRow label="Industry">
          <select
            style={selectStyle}
            value={form.industry}
            onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            onFocus={e => (e.target.style.borderBottomColor = 'var(--text)')}
            onBlur={e => (e.target.style.borderBottomColor = 'var(--border-strong)')}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </FieldRow>

        <FieldRow label="Website">
          <input
            style={inputStyle}
            value={form.website}
            onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
            placeholder="https://yourbusiness.com"
            onFocus={e => (e.target.style.borderBottomColor = 'var(--text)')}
            onBlur={e => (e.target.style.borderBottomColor = 'var(--border-strong)')}
          />
        </FieldRow>

        <div style={{ marginTop: 20 }} />
        <SectionLabel>Owner</SectionLabel>

        <FieldRow label="Full name">
          <input
            style={inputStyle}
            value={form.ownerName}
            onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
            placeholder="Your full name"
            onFocus={e => (e.target.style.borderBottomColor = 'var(--text)')}
            onBlur={e => (e.target.style.borderBottomColor = 'var(--border-strong)')}
          />
        </FieldRow>

        <FieldRow label="Phone number">
          <input
            style={inputStyle}
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            type="tel"
            onFocus={e => (e.target.style.borderBottomColor = 'var(--text)')}
            onBlur={e => (e.target.style.borderBottomColor = 'var(--border-strong)')}
          />
        </FieldRow>

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ fontSize: 13, padding: '9px 20px' }}
          >
            {saved ? 'Saved' : 'Save changes'}
          </button>
          {saved && (
            <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500 }}>
              Changes saved
            </span>
          )}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="card" style={{ padding: '28px 32px', marginBottom: 28, animation: 'fade-up 0.4s 0.1s ease both' }}>
        <SectionLabel>Connected Accounts</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Plaid — Bank Connection</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {profile.bankLinked ? 'Connected · Chase Business Checking' : 'Not connected'}
            </div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={() => setProfile({ bankLinked: !profile.bankLinked })}
          >
            {profile.bankLinked ? 'Disconnect' : 'Connect'}
          </button>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 0' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>QuickBooks</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Not connected</div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>
            Connect
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ animation: 'fade-up 0.4s 0.15s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionLabel>Plan &amp; Billing</SectionLabel>
          <button
            onClick={() => navigate('/billing')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--text-2)', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 4,
              marginTop: -14, transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
          >
            Manage billing <ArrowRight size={11} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Free plan */}
          <div className="card" style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            border: currentPlan === 'free' ? '1.5px solid var(--border-strong)' : '1.5px solid var(--border)',
          }}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}>
              Free
              {currentPlan === 'free' && (
                <span style={{
                  marginLeft: 8,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 3,
                  padding: '2px 6px',
                  fontSize: 8,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                }}>
                  CURRENT
                </span>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: 'Platypi, serif', fontSize: 42, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.04em' }}>$0</span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>forever</span>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
              Everything you need to get started — no credit card, no commitment.
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 24, flex: 1 }}>
              <PlanFeature text="Explore Fido's funding flow" note="Up to 10 messages, then a simple form" />
              <PlanFeature text="25 conversations with Fido per month" />
              <PlanFeature text="Connect Plaid & QuickBooks" note="Weekly sync" />
              <PlanFeature text="Business health dashboard" note="Updated every 48 hrs" />
              <PlanFeature text="Basic alerts & notifications" />
            </div>

            <button
              className="btn"
              disabled={currentPlan === 'free'}
              style={{
                width: '100%',
                justifyContent: 'center',
                fontSize: 14,
                padding: '13px',
                background: 'var(--bg-elevated)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              {currentPlan === 'free' ? 'Current plan' : 'Downgrade'}
            </button>
          </div>

          {/* Premium plan */}
          <div style={{ position: 'relative' }}>
            <div className="card" style={{
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              border: '1.5px solid var(--blue)',
              height: '100%',
            }}>
              <div style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--blue)',
                marginBottom: 12,
              }}>
                Premium
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontFamily: 'Platypi, serif', fontSize: 42, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.04em' }}>$25</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>/ month</span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                Everything in Free, plus Fido becomes your active day-to-day business partner.
              </p>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 24, flex: 1 }}>
                <PlanFeature text="Everything in Free" />
                <PlanFeature text="150 conversations per month" note="+$0.10 per message over limit" />
                <PlanFeature text="Daily Plaid & QuickBooks sync" />
                <PlanFeature text="Real-time business dashboard" />
                <PlanFeature text="Unlimited alerts" note="SMS, email & in-app" />
                <PlanFeature text="Priority funding processing" />
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: 14,
                  padding: '13px',
                }}
              >
                Purchase Premium →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ padding: '24px 32px', marginTop: 28, animation: 'fade-up 0.4s 0.2s ease both' }}>
        <SectionLabel>Account</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Sign out</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>You can sign back in anytime.</div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '7px 14px' }}
            onClick={() => { useAppStore.getState().reset(); window.location.href = '/' }}
          >
            Sign out
          </button>
        </div>
      </div>

    </div>
  )
}
