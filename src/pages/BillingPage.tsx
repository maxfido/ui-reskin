import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Check, AlertTriangle, ArrowLeft, Download, X, Zap, ChevronDown } from 'lucide-react'
import { useBillingStore, FREE_MSG_LIMIT, PREMIUM_MSG_LIMIT } from '../store/billingStore'

const INVOICES = [
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$25.00', status: 'paid', period: 'March 2026' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$25.00', status: 'paid', period: 'February 2026' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$25.00', status: 'paid', period: 'January 2026' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 9, letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

function ConfirmModal({ title, body, confirmLabel, danger, onConfirm, onCancel }: {
  title: string; body: string; confirmLabel: string; danger?: boolean
  onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onCancel}>
      <div className="card" style={{ maxWidth: 400, width: '100%', padding: '32px 28px', animation: 'fade-up 0.2s ease both' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Platypi, serif', fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>{title}</h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><X size={16} /></button>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 18px' }} onClick={onCancel}>Keep plan</button>
          <button className="btn" style={{ fontSize: 13, padding: '8px 18px', background: danger ? '#d93026' : 'var(--text)', color: '#fff', borderRadius: 'var(--radius)' }} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

function AddCardModal({ onSave, onCancel }: { onSave: (last4: string) => void; onCancel: () => void }) {
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const inputStyle: React.CSSProperties = { width: '100%', fontSize: 14, color: 'var(--text)', background: 'var(--bg-elevated)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 12px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s' }
  const formatNumber = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d }
  const last4 = number.replace(/\s/g, '').slice(-4)
  const valid = number.replace(/\s/g, '').length === 16 && expiry.length >= 4 && cvc.length >= 3 && name.trim()
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onCancel}>
      <div className="card" style={{ maxWidth: 420, width: '100%', padding: '32px 28px', animation: 'fade-up 0.2s ease both' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Platypi, serif', fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>Add payment method</h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>CARD NUMBER</label>
            <input style={inputStyle} value={number} onChange={e => setNumber(formatNumber(e.target.value))} placeholder="1234 5678 9012 3456" onFocus={e => (e.target.style.borderColor = 'var(--text)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>EXPIRY</label>
              <input style={inputStyle} value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM / YY" onFocus={e => (e.target.style.borderColor = 'var(--text)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>CVC</label>
              <input style={inputStyle} value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" onFocus={e => (e.target.style.borderColor = 'var(--text)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>NAME ON CARD</label>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" onFocus={e => (e.target.style.borderColor = 'var(--text)')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 24 }}>
          <div style={{ width: 14, height: 14, borderRadius: 2, background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={9} color="var(--green)" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Secured with 256-bit SSL encryption</span>
        </div>
        <button className="btn btn-primary" disabled={!valid} style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '12px' }} onClick={() => onSave(last4)}>Save card</button>
      </div>
    </div>
  )
}

const PREMIUM_FEATURES = [
  '300 messages/month — $5 per additional 100',
  '5 connected business accounts via Plaid (+$2/additional/month)',
  'Unlimited loan applications with AI + human support',
  'Cancel monthly anytime',
]

const FREE_FEATURES = [
  '1 connected business account via Plaid',
  '50 messages included in trial',
  'Unlimited loan applications with AI + human support',
  '30-day trial, then choose to upgrade',
]

export default function BillingPage() {
  const navigate = useNavigate()
  const { plan, billingCycle, messagesUsed, trialDaysLeft, card, setPlan, setBillingCycle, setCard } = useBillingStore()
  const [showCancel, setShowCancel] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showRemoveCard, setShowRemoveCard] = useState(false)
  const [backHovered, setBackHovered] = useState(false)
  const [upgradeHovered, setUpgradeHovered] = useState(false)
  const [extraPacks, setExtraPacks] = useState(0)
  const [packDropdownOpen, setPackDropdownOpen] = useState(false)

  useEffect(() => {
    if (!packDropdownOpen) return
    const close = () => setPackDropdownOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [packDropdownOpen])

  const msgLimit = plan === 'free' ? FREE_MSG_LIMIT : PREMIUM_MSG_LIMIT
  const msgPct = Math.min((messagesUsed / msgLimit) * 100, 100)
  const barColor = msgPct > 80 ? '#d93026' : 'var(--orange)'

  const basePrice = billingCycle === 'annual' ? 20 : 25
  const monthlyPrice = basePrice + extraPacks * 5
  const upgradeBody = billingCycle === 'annual'
    ? `$${monthlyPrice * 12}/year ($${monthlyPrice}/mo)`
    : `$${monthlyPrice}/month`

  const handleCancel = () => { setPlan('free'); setCard(null); setShowCancel(false) }
  const handleUpgrade = () => { setPlan('premium'); setShowUpgrade(false) }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720, margin: '0 auto' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/settings')}
        onMouseEnter={() => setBackHovered(true)}
        onMouseLeave={() => setBackHovered(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: backHovered ? 'var(--bg-elevated)' : 'none', border: 'none', cursor: 'pointer', color: backHovered ? 'var(--text)' : 'var(--text-muted)', fontSize: 12, padding: '5px 8px', marginLeft: -8, borderRadius: 4, marginBottom: 28, transition: 'color 0.15s, background 0.15s' }}
      >
        <ArrowLeft size={12} style={{ transition: 'transform 0.18s', transform: backHovered ? 'translateX(-2px)' : 'translateX(0)' }} />
        Settings
      </button>

      {/* Header */}
      <div style={{ marginBottom: 36, animation: 'fade-up 0.4s ease both' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Account</div>
        <h1 style={{ fontFamily: 'Platypi, serif', fontSize: 28, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Plan &amp; Billing</h1>
      </div>

      {/* Current plan */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 16, animation: 'fade-up 0.4s 0.04s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <SectionLabel>Current Plan</SectionLabel>
            <div style={{ fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {plan === 'free' ? 'Free' : 'Premium'}
            </div>
            {plan === 'premium' && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Next billing: <span style={{ fontWeight: 500, color: 'var(--text-2)' }}>May 1, 2026</span>
              </div>
            )}
          </div>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 4,
            background: plan === 'premium' ? 'rgba(37,99,235,0.08)' : 'var(--bg-elevated)',
            color: plan === 'premium' ? 'var(--blue)' : 'var(--text-muted)',
            fontWeight: 600,
          }}>
            {plan === 'free' ? 'Free' : 'Premium'}
          </span>
        </div>
      </div>

      {/* Message usage meter */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 16, animation: 'fade-up 0.4s 0.08s ease both' }}>
        <SectionLabel>Message Usage</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'Platypi, serif', fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {messagesUsed} <span style={{ fontSize: 18, color: 'var(--text-2)' }}>/ {msgLimit}</span>
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {plan === 'free' ? 'in trial' : 'this month'}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ height: '100%', width: `${msgPct}%`, background: barColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {messagesUsed} of {msgLimit} messages used
          {plan === 'free' && ` · ${trialDaysLeft} days left in your trial`}
          {plan === 'premium' && ` · $5 per additional 100 messages`}
        </div>
      </div>

      {/* Upgrade CTA (free only) */}
      {plan === 'free' && (
        <button
          onClick={() => setShowUpgrade(true)}
          onMouseEnter={() => setUpgradeHovered(true)}
          onMouseLeave={() => setUpgradeHovered(false)}
          style={{
            width: '100%', padding: '15px 24px',
            background: upgradeHovered ? '#c94f16' : 'var(--orange)',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 16, transition: 'background 0.15s',
            animation: 'fade-up 0.4s 0.1s ease both',
          }}
        >
          <Zap size={15} fill="#fff" />
          Upgrade to Premium
        </button>
      )}

      {/* Pricing comparison */}
      <div className="card" style={{ marginBottom: 16, animation: 'fade-up 0.4s 0.12s ease both' }}>
        <div style={{ padding: '20px 24px 16px' }}>
          <SectionLabel>Pricing</SectionLabel>

          {/* Billing cycle toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['monthly', 'annual'] as const).map(cycle => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: billingCycle === cycle ? '1.5px solid var(--text)' : '1.5px solid var(--border)',
                  background: billingCycle === cycle ? 'var(--text)' : 'transparent',
                  color: billingCycle === cycle ? '#fff' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Annual'}
                {cycle === 'annual' && (
                  <span style={{ marginLeft: 6, fontSize: 10, color: billingCycle === 'annual' ? 'rgba(255,255,255,0.7)' : 'var(--green)', fontWeight: 600 }}>
                    20% off
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Plan cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Free */}
            <div style={{
              padding: '16px', borderRadius: 8,
              border: plan === 'free' ? '1.5px solid var(--border-strong)' : '1px solid var(--border)',
              background: plan === 'free' ? 'var(--bg-elevated)' : 'transparent',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Free</div>
              <div style={{ fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 12 }}>
                $0
                <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}> / 30 days</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {FREE_FEATURES.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <Check size={11} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2.5} />
                    <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium */}
            <div style={{
              padding: '16px', borderRadius: 8,
              border: plan === 'premium' ? '1.5px solid var(--orange)' : '1px solid var(--border)',
              background: plan === 'premium' ? 'var(--orange-soft)' : 'transparent',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Premium</div>
                {plan !== 'premium' && (
                  <span style={{ fontSize: 9, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', color: 'var(--orange)', textTransform: 'uppercase', fontWeight: 600 }}>Popular</span>
                )}
              </div>
              <div style={{ fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 2 }}>
                ${(billingCycle === 'annual' ? 20 : 25) + extraPacks * 5}
                <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}> / month</span>
              </div>
              {billingCycle === 'annual' && (
                <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500, marginBottom: 10 }}>$240/year · save $60</div>
              )}
              {billingCycle === 'monthly' && <div style={{ marginBottom: 10 }} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {PREMIUM_FEATURES.map((f, fi) => (
                  <div key={f}>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      <Check size={11} color="var(--orange)" style={{ flexShrink: 0, marginTop: 2 }} strokeWidth={2.5} />
                      <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{f}</span>
                    </div>
                    {/* Message pack dropdown — only under first feature */}
                    {fi === 0 && (
                      <div style={{ marginLeft: 18, marginTop: 8, position: 'relative', zIndex: 10 }}>
                        {/* Trigger button */}
                        <button
                          onClick={() => setPackDropdownOpen(o => !o)}
                          style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 12px',
                            borderRadius: 8,
                            border: `1.5px solid ${packDropdownOpen ? 'var(--orange)' : 'var(--border)'}`,
                            background: 'var(--bg-surface)',
                            color: 'var(--text)',
                            fontSize: 12, fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'border-color 0.15s',
                            textAlign: 'left',
                          }}
                        >
                          <span>{300 + extraPacks * 100} messages / mo{extraPacks > 0 ? ` (+$${extraPacks * 5}/mo)` : ' — included'}</span>
                          <ChevronDown
                            size={13}
                            color="var(--text-muted)"
                            style={{ flexShrink: 0, transition: 'transform 0.15s', transform: packDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>

                        {/* Dropdown list */}
                        {packDropdownOpen && (
                          <div style={{
                            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                            background: 'var(--bg-surface)',
                            border: '1.5px solid var(--border)',
                            borderRadius: 8,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            zIndex: 100,
                          }}>
                            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                              <button
                                key={n}
                                onClick={() => { setExtraPacks(n); setPackDropdownOpen(false) }}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '9px 12px',
                                  background: extraPacks === n ? 'var(--orange-soft)' : 'transparent',
                                  border: 'none',
                                  borderBottom: n < 10 ? '1px solid var(--border)' : 'none',
                                  color: extraPacks === n ? 'var(--orange)' : 'var(--text)',
                                  fontSize: 12, fontWeight: extraPacks === n ? 600 : 400,
                                  cursor: 'pointer', textAlign: 'left',
                                  transition: 'background 0.1s',
                                }}
                                onMouseEnter={e => { if (extraPacks !== n) e.currentTarget.style.background = 'var(--bg-elevated)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = extraPacks === n ? 'var(--orange-soft)' : 'transparent' }}
                              >
                                <span>{300 + n * 100} messages / mo</span>
                                <span style={{ fontSize: 11, color: n === 0 ? 'var(--text-muted)' : 'var(--orange)', fontWeight: 500 }}>
                                  {n === 0 ? 'included' : `+$${n * 5}/mo`}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {plan === 'free' && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  style={{ width: '100%', marginTop: 14, padding: '8px', background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  Upgrade →
                </button>
              )}
            </div>
          </div>

          {billingCycle === 'annual' && (
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Annual plan: up to 5 accounts included. Additional accounts at $1/month (50% discount vs monthly).
            </div>
          )}
        </div>
      </div>

      {/* Payment method (premium) */}
      {plan === 'premium' && (
        <div className="card" style={{ padding: '20px 24px', marginBottom: 16, animation: 'fade-up 0.4s 0.14s ease both' }}>
          <SectionLabel>Payment Method</SectionLabel>
          {card ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 30, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} color="var(--text-2)" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{card.brand} ending in {card.last4}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>Expires 12 / 28</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost-sm" onClick={() => setShowAddCard(true)}>Replace</button>
                <button className="btn btn-ghost-sm" style={{ color: '#d93026', borderColor: 'rgba(217,48,38,0.25)' }} onClick={() => setShowRemoveCard(true)}>Remove</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={14} color="var(--text-muted)" />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No payment method on file</span>
              </div>
              <button className="btn btn-ghost-sm" onClick={() => setShowAddCard(true)}>+ Add card</button>
            </div>
          )}
        </div>
      )}

      {/* Cancel subscription (premium) */}
      {plan === 'premium' && (
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '7px 14px', color: '#d93026', borderColor: 'rgba(217,48,38,0.25)' }}
            onClick={() => setShowCancel(true)}
          >
            Cancel subscription
          </button>
        </div>
      )}

      {/* Invoice history (premium) */}
      {plan === 'premium' && (
        <div className="card" style={{ overflow: 'hidden', animation: 'fade-up 0.4s 0.16s ease both' }}>
          <div style={{ padding: '20px 24px 14px' }}>
            <SectionLabel>Billing History</SectionLabel>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {['Invoice', 'Period', 'Amount', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '9px 24px', textAlign: 'left', fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, paddingLeft: h === 'Invoice' ? 24 : 0, paddingRight: h === '' ? 24 : 0 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => <InvoiceRow key={inv.id} inv={inv} last={i === INVOICES.length - 1} />)}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCancel && (
        <ConfirmModal title="Cancel your subscription?" body="You'll lose access to Premium features at the end of your billing period. You can re-subscribe anytime." confirmLabel="Yes, cancel" danger onConfirm={handleCancel} onCancel={() => setShowCancel(false)} />
      )}
      {showUpgrade && (
        <ConfirmModal
          title="Upgrade to Premium?"
          body={card ? `You'll be charged ${upgradeBody} starting today. Your ${card.brand} ending in ${card.last4} will be billed.` : 'Add a payment method first to upgrade.'}
          confirmLabel={card ? 'Confirm upgrade' : 'Add card'}
          onConfirm={card ? handleUpgrade : () => { setShowUpgrade(false); setShowAddCard(true) }}
          onCancel={() => setShowUpgrade(false)}
        />
      )}
      {showAddCard && (
        <AddCardModal onSave={(last4) => { setCard({ brand: 'Visa', last4 }); setShowAddCard(false) }} onCancel={() => setShowAddCard(false)} />
      )}
      {showRemoveCard && (
        <ConfirmModal title="Remove payment method?" body="Your card will be removed. Add a new one before your next billing date to avoid service interruption." confirmLabel="Remove card" danger onConfirm={() => { setCard(null); setShowRemoveCard(false) }} onCancel={() => setShowRemoveCard(false)} />
      )}
    </div>
  )
}

function InvoiceRow({ inv, last }: { inv: typeof INVOICES[0]; last: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <tr style={{ borderBottom: last ? 'none' : '1px solid var(--border)', background: hov ? 'var(--bg-elevated)' : 'transparent', transition: 'background 0.15s', cursor: 'default' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <td style={{ padding: '13px 0 13px 24px', fontSize: 11, color: 'var(--text-2)', fontFamily: 'IBM Plex Mono, monospace' } as React.CSSProperties}>{inv.id}</td>
      <td style={{ padding: '13px 0', fontSize: 13, color: 'var(--text)' }}>{inv.period}</td>
      <td style={{ padding: '13px 0', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{inv.amount}</td>
      <td style={{ padding: '13px 0' }}><span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em', padding: '3px 7px', borderRadius: 3, background: 'rgba(26,122,69,0.08)', color: 'var(--green)' }}>Paid</span></td>
      <td style={{ padding: '13px 24px 13px 0', textAlign: 'right' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: hov ? 'var(--text)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, marginLeft: 'auto', transition: 'color 0.15s' }}>
          <Download size={11} /> PDF
        </button>
      </td>
    </tr>
  )
}
