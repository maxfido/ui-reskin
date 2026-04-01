import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Check, AlertTriangle, ArrowLeft, Download, X } from 'lucide-react'

type Plan = 'free' | 'premium'

const INVOICES = [
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$25.00', status: 'paid', period: 'March 2026' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$25.00', status: 'paid', period: 'February 2026' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$25.00', status: 'paid', period: 'January 2026' },
  { id: 'INV-2025-12', date: 'Dec 1, 2025', amount: '$25.00', status: 'paid', period: 'December 2025' },
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

function ConfirmModal({
  title, body, confirmLabel, danger,
  onConfirm, onCancel,
}: {
  title: string
  body: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={onCancel}
    >
      <div
        className="card"
        style={{ maxWidth: 400, width: '100%', padding: '32px 28px', animation: 'fade-up 0.2s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h2 style={{ fontFamily: 'Platypi, serif', fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 13, padding: '8px 18px' }}
            onClick={onCancel}
          >
            Keep plan
          </button>
          <button
            className="btn"
            style={{
              fontSize: 13, padding: '8px 18px',
              background: danger ? '#d93026' : 'var(--text)',
              color: '#fff', borderRadius: 'var(--radius)',
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
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

  const inputStyle: React.CSSProperties = {
    width: '100%', fontSize: 14, color: 'var(--text)',
    background: 'var(--bg-elevated)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '10px 12px', outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s',
  }

  const formatNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
  }

  const last4 = number.replace(/\s/g, '').slice(-4)
  const valid = number.replace(/\s/g, '').length === 16 && expiry.length >= 4 && cvc.length >= 3 && name.trim()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={onCancel}
    >
      <div
        className="card"
        style={{ maxWidth: 420, width: '100%', padding: '32px 28px', animation: 'fade-up 0.2s ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Platypi, serif', fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Add payment method
          </h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
              CARD NUMBER
            </label>
            <input
              style={inputStyle}
              value={number}
              onChange={e => setNumber(formatNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              onFocus={e => (e.target.style.borderColor = 'var(--text)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
                EXPIRY
              </label>
              <input
                style={inputStyle}
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM / YY"
                onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
                CVC
              </label>
              <input
                style={inputStyle}
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.04em' }}>
              NAME ON CARD
            </label>
            <input
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              onFocus={e => (e.target.style.borderColor = 'var(--text)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 24 }}>
          <div style={{ width: 14, height: 14, borderRadius: 2, background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={9} color="var(--green)" strokeWidth={3} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Secured with 256-bit SSL encryption</span>
        </div>

        <button
          className="btn btn-primary"
          disabled={!valid}
          style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '12px' }}
          onClick={() => onSave(last4)}
        >
          Save card
        </button>
      </div>
    </div>
  )
}

export default function BillingPage() {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<Plan>('premium')
  const [card, setCard] = useState<{ brand: string; last4: string } | null>({ brand: 'Visa', last4: '4242' })
  const [showCancel, setShowCancel] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showRemoveCard, setShowRemoveCard] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [backHovered, setBackHovered] = useState(false)

  const handleCancel = () => {
    setPlan('free')
    setCard(null)
    setCancelled(true)
    setShowCancel(false)
  }

  const handleUpgrade = () => {
    setPlan('premium')
    setCancelled(false)
    setShowUpgrade(false)
  }

  const nextBilling = plan === 'premium' ? 'Apr 1, 2026' : null

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720, margin: '0 auto' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/settings')}
        onMouseEnter={() => setBackHovered(true)}
        onMouseLeave={() => setBackHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: backHovered ? 'var(--bg-elevated)' : 'none',
          border: 'none', cursor: 'pointer',
          color: backHovered ? 'var(--text)' : 'var(--text-muted)',
          fontSize: 12, padding: '5px 8px', marginLeft: -8,
          borderRadius: 4, marginBottom: 28,
          transition: 'color 0.15s, background 0.15s',
        }}
      >
        <ArrowLeft size={12} style={{ transition: 'transform 0.18s', transform: backHovered ? 'translateX(-2px)' : 'translateX(0)' }} />
        Settings
      </button>

      {/* Header */}
      <div style={{ marginBottom: 36, animation: 'fade-up 0.4s ease both' }}>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
          Billing
        </div>
        <h1 style={{ fontFamily: 'Platypi, serif', fontSize: 28, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Billing &amp; Subscription
        </h1>
      </div>

      {/* Cancelled notice */}
      {cancelled && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 16px', borderRadius: 'var(--radius)',
          background: 'rgba(26,122,69,0.07)', border: '1px solid rgba(26,122,69,0.2)',
          marginBottom: 24, animation: 'fade-up 0.3s ease both',
        }}>
          <Check size={14} color="var(--green)" style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>Subscription cancelled</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>You've been moved to the Free plan. Your data is safe.</div>
          </div>
        </div>
      )}

      {/* Current plan */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 20, animation: 'fade-up 0.4s 0.05s ease both' }}>
        <SectionLabel>Current Plan</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'Platypi, serif', fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em' }}>
                {plan === 'premium' ? '$25' : '$0'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {plan === 'premium' ? '/ month' : 'forever'}
              </span>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9, letterSpacing: '0.1em',
                padding: '3px 8px', borderRadius: 3,
                background: plan === 'premium' ? 'rgba(37,99,235,0.08)' : 'var(--bg-elevated)',
                color: plan === 'premium' ? 'var(--blue)' : 'var(--text-muted)',
                fontWeight: 600,
              }}>
                {plan === 'premium' ? 'PREMIUM' : 'FREE'}
              </span>
            </div>
            {nextBilling && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Next billing date: <span style={{ fontWeight: 500, color: 'var(--text-2)' }}>{nextBilling}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {plan === 'free' ? (
              <button
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '9px 18px' }}
                onClick={() => setShowUpgrade(true)}
              >
                Upgrade to Premium →
              </button>
            ) : (
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13, padding: '9px 18px', color: '#d93026', borderColor: 'rgba(217,48,38,0.3)' }}
                onClick={() => setShowCancel(true)}
              >
                Cancel subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className="card" style={{ padding: '24px 28px', marginBottom: 20, animation: 'fade-up 0.4s 0.08s ease both' }}>
        <SectionLabel>Payment Method</SectionLabel>

        {card ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Card icon */}
              <div style={{
                width: 44, height: 30,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CreditCard size={16} color="var(--text-2)" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                  {card.brand} ending in {card.last4}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>Expires 12 / 28</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-ghost-sm"
                onClick={() => setShowAddCard(true)}
              >
                Replace
              </button>
              <button
                className="btn btn-ghost-sm"
                style={{ color: '#d93026', borderColor: 'rgba(217,48,38,0.25)' }}
                onClick={() => setShowRemoveCard(true)}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No payment method on file</span>
            </div>
            <button
              className="btn btn-ghost-sm"
              onClick={() => setShowAddCard(true)}
            >
              + Add card
            </button>
          </div>
        )}
      </div>

      {/* Invoice history */}
      {plan === 'premium' && (
        <div className="card" style={{ overflow: 'hidden', animation: 'fade-up 0.4s 0.12s ease both' }}>
          <div style={{ padding: '20px 28px 14px' }}>
            <SectionLabel>Billing History</SectionLabel>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {['Invoice', 'Period', 'Amount', 'Status', ''].map(h => (
                  <th key={h} style={{
                    padding: '9px 28px 9px',
                    textAlign: 'left',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 9, letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    paddingLeft: h === 'Invoice' ? 28 : 0,
                    paddingRight: h === '' ? 28 : 0,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <InvoiceRow key={inv.id} inv={inv} last={i === INVOICES.length - 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCancel && (
        <ConfirmModal
          title="Cancel your subscription?"
          body="You'll lose access to Premium features at the end of your current billing period (Apr 1, 2026). You can re-subscribe anytime."
          confirmLabel="Yes, cancel"
          danger
          onConfirm={handleCancel}
          onCancel={() => setShowCancel(false)}
        />
      )}

      {showUpgrade && (
        <ConfirmModal
          title="Upgrade to Premium?"
          body={card ? `You'll be charged $25/month starting today. Your ${card.brand} ending in ${card.last4} will be billed.` : 'Add a payment method first to upgrade.'}
          confirmLabel={card ? 'Confirm upgrade' : 'Add card'}
          onConfirm={card ? handleUpgrade : () => { setShowUpgrade(false); setShowAddCard(true) }}
          onCancel={() => setShowUpgrade(false)}
        />
      )}

      {showAddCard && (
        <AddCardModal
          onSave={(last4) => { setCard({ brand: 'Visa', last4 }); setShowAddCard(false) }}
          onCancel={() => setShowAddCard(false)}
        />
      )}

      {showRemoveCard && (
        <ConfirmModal
          title="Remove payment method?"
          body="Your card will be removed. If you're on Premium, you'll need to add a new card before your next billing date."
          confirmLabel="Remove card"
          danger
          onConfirm={() => { setCard(null); setShowRemoveCard(false) }}
          onCancel={() => setShowRemoveCard(false)}
        />
      )}
    </div>
  )
}

function InvoiceRow({ inv, last }: { inv: typeof INVOICES[0]; last: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <tr
      style={{
        borderBottom: last ? 'none' : '1px solid var(--border)',
        background: hov ? 'var(--bg-elevated)' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'default',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <td style={{ padding: '13px 0 13px 28px', fontSize: 11, color: 'var(--text-2)', fontFamily: 'IBM Plex Mono, monospace' } as React.CSSProperties}>
        {inv.id}
      </td>
      <td style={{ padding: '13px 0', fontSize: 13, color: 'var(--text)' }}>{inv.period}</td>
      <td style={{ padding: '13px 0', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{inv.amount}</td>
      <td style={{ padding: '13px 0' }}>
        <span style={{
          fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em',
          padding: '3px 7px', borderRadius: 3,
          background: 'rgba(26,122,69,0.08)', color: 'var(--green)',
        }}>
          Paid
        </span>
      </td>
      <td style={{ padding: '13px 28px 13px 0', textAlign: 'right' }}>
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: hov ? 'var(--text)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, marginLeft: 'auto',
            transition: 'color 0.15s',
          }}
        >
          <Download size={11} /> PDF
        </button>
      </td>
    </tr>
  )
}
