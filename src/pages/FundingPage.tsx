import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Clock, Sparkles, ChevronRight, X,
  FileText, TrendingDown, Zap, Shield, ArrowRight,
  Star, Check, AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ondeckLogo from '../assets/ondeck-logo.png'
import fidoIcon from '../assets/icon-color.png'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoanOffer {
  id: string
  lender: string
  product: string
  amount: string
  apr: string
  term: string
  monthlyPayment: string
  fundingTime: string
  badge?: string
  isBest?: boolean
  color: string
  colorSoft: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const APPLICATION = {
  id: 'APP-2024-8841',
  business: 'Sweet Paws Bakery',
  amount: '$150,000',
  purpose: 'Equipment & Working Capital',
  submittedDate: 'Apr 7, 2026',
}

const OFFERS: LoanOffer[] = [
  {
    id: 'offer-a',
    lender: 'Celtic Bank',
    product: 'SBA 7(a) Loan',
    amount: '$150,000',
    apr: '6.5%',
    term: '84 months',
    monthlyPayment: '$2,218 / mo',
    fundingTime: '10 – 14 days',
    badge: "Fido's Pick",
    isBest: true,
    color: 'var(--green)',
    colorSoft: 'var(--green-soft)',
  },
  {
    id: 'offer-b',
    lender: 'Bluevine',
    product: 'Term Loan',
    amount: '$150,000',
    apr: '9.2%',
    term: '60 months',
    monthlyPayment: '$3,116 / mo',
    fundingTime: '3 – 5 days',
    color: 'var(--blue)',
    colorSoft: 'var(--blue-soft)',
  },
  {
    id: 'offer-c',
    lender: 'OnDeck',
    product: 'Line of Credit',
    amount: '$150,000',
    apr: '11.8%',
    term: 'Revolving',
    monthlyPayment: 'Min. ~$1,800 / mo',
    fundingTime: '1 – 2 days',
    color: 'var(--orange)',
    colorSoft: 'var(--orange-soft)',
  },
]

const AI_INSIGHT_LINES = [
  "Based on Sweet Paws Bakery's $420K annual revenue and 3-year operating history, the SBA 7(a) loan from Celtic Bank is your strongest option.",
  "Your debt service coverage ratio of 1.42x comfortably covers the $2,218 monthly payment — leaving healthy cash flow buffer even in slower months.",
  "At 6.5% APR over 84 months, your total interest cost is $36K less than Option B and $67K less than Option C. The longer term also protects you against seasonal dips.",
  "Celtic Bank has a 94% approval-to-close rate for applicants with your profile. Fido pre-verified all required documents — no additional uploads needed.",
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ label, color, dot }: { label: string; color: string; dot?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      background: color === 'green' ? 'var(--green-soft)' : color === 'orange' ? 'var(--orange-soft)' : 'var(--blue-soft)',
      border: `1px solid ${color === 'green' ? 'rgba(26,122,69,0.25)' : color === 'orange' ? 'rgba(232,93,26,0.25)' : 'rgba(37,99,235,0.25)'}`,
      borderRadius: 100,
      fontSize: 11, fontWeight: 600,
      color: color === 'green' ? 'var(--green)' : color === 'orange' ? 'var(--orange)' : 'var(--blue)',
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: '0.04em',
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: color === 'green' ? 'var(--green)' : color === 'orange' ? 'var(--orange)' : 'var(--blue)',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
      )}
      {label}
    </span>
  )
}

function TimelineStep({
  label, sublabel, done, active, isLast,
}: {
  label: string; sublabel: string; done?: boolean; active?: boolean; isLast?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: done ? 'var(--green)' : active ? 'var(--text)' : 'var(--bg-elevated)',
          border: done ? '2px solid var(--green)' : active ? '2px solid var(--text)' : '2px solid var(--border-strong)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {done ? (
            <Check size={13} color="#fff" strokeWidth={2.5} />
          ) : active ? (
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#fff',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
          ) : (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)' }} />
          )}
        </div>
        {!isLast && (
          <div style={{
            width: 2, flex: 1, minHeight: 24,
            background: done ? 'var(--green)' : 'var(--border)',
            marginTop: 4,
            transition: 'background 0.3s',
          }} />
        )}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 24, paddingTop: 3 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: done || active ? 'var(--text)' : 'var(--text-muted)',
        }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {sublabel}
        </div>
      </div>
    </div>
  )
}

function OfferCard({
  offer, onSelect, selected,
}: {
  offer: LoanOffer; onSelect: (o: LoanOffer) => void; selected: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(offer)}
      style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        border: selected
          ? `2px solid ${offer.color}`
          : offer.isBest
          ? `1.5px solid ${offer.color}`
          : '1.5px solid var(--border-strong)',
        borderRadius: 10,
        padding: '22px 20px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s, transform 0.15s',
        boxShadow: hovered || selected ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Badge */}
      {offer.badge && (
        <div style={{
          position: 'absolute', top: -11, left: 16,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: offer.color,
          color: '#fff',
          padding: '3px 10px',
          borderRadius: 100,
          fontSize: 10, fontWeight: 700,
          fontFamily: 'IBM Plex Mono, monospace',
          letterSpacing: '0.06em',
        }}>
          <Star size={9} fill="#fff" />
          {offer.badge}
        </div>
      )}

      {/* Selected check */}
      {selected && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          width: 22, height: 22, borderRadius: '50%',
          background: offer.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={12} color="#fff" strokeWidth={2.5} />
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 16, marginTop: offer.badge ? 6 : 0 }}>
        <div style={{
          fontSize: 11, color: 'var(--text-muted)',
          fontFamily: 'IBM Plex Mono, monospace',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {offer.lender}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {offer.product}
        </div>
      </div>

      {/* Key metric */}
      <div style={{
        background: offer.isBest ? offer.colorSoft : 'var(--bg-elevated)',
        borderRadius: 8,
        padding: '14px 16px',
        marginBottom: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            APR
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: offer.isBest ? offer.color : 'var(--text)', letterSpacing: '-0.03em', fontFamily: 'Platypi, serif' }}>
            {offer.apr}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            Amount
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {offer.amount}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[
          { label: 'Term', value: offer.term },
          { label: 'Monthly', value: offer.monthlyPayment },
          { label: 'Funding', value: offer.fundingTime },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function FidoInsight({ visible }: { visible: boolean }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentText, setCurrentText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const typing = visible && lineIndex < AI_INSIGHT_LINES.length

  useEffect(() => {
    if (!typing) return
    const line = AI_INSIGHT_LINES[lineIndex]
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setCurrentText(line.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, 14)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDisplayedLines(prev => [...prev, line])
        setCurrentText('')
        setCharIndex(0)
        setLineIndex(i => i + 1)
      }, 320)
      return () => clearTimeout(t)
    }
  }, [typing, lineIndex, charIndex])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--border-strong)',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Sparkles size={13} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            Fido AI Insight
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Why Celtic Bank SBA 7(a) is your best option
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge label="Analyzing" color="green" dot />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {displayedLines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}
          >
            {line}
          </motion.p>
        ))}
        {(typing || currentText) && (
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            {currentText}
            <span style={{
              display: 'inline-block', width: 2, height: 14,
              background: 'var(--text)',
              marginLeft: 1,
              animation: 'pulse-dot 0.8s ease-in-out infinite',
              verticalAlign: 'text-bottom',
            }} />
          </p>
        )}

        {/* Summary chips — show after done */}
        {!typing && displayedLines.length === AI_INSIGHT_LINES.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}
          >
            {[
              { icon: TrendingDown, label: '$67K less interest vs Option C', color: 'green' },
              { icon: Shield, label: 'All docs pre-verified by Fido', color: 'blue' },
              { icon: Zap, label: '94% close rate for your profile', color: 'orange' },
            ].map(chip => {
              const Icon = chip.icon
              return (
                <div key={chip.label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px',
                  background: chip.color === 'green' ? 'var(--green-soft)' : chip.color === 'blue' ? 'var(--blue-soft)' : 'var(--orange-soft)',
                  border: `1px solid ${chip.color === 'green' ? 'rgba(26,122,69,0.2)' : chip.color === 'blue' ? 'rgba(37,99,235,0.2)' : 'rgba(232,93,26,0.2)'}`,
                  borderRadius: 100,
                  fontSize: 12, fontWeight: 500,
                  color: chip.color === 'green' ? 'var(--green)' : chip.color === 'blue' ? 'var(--blue)' : 'var(--orange)',
                }}>
                  <Icon size={11} />
                  {chip.label}
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function AcceptModal({
  offer, onClose, onAccept,
}: {
  offer: LoanOffer; onClose: () => void; onAccept: () => void
}) {
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleAccept() {
    if (!agreed) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onAccept()
    }, 1400)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22 }}
        style={{
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-strong)',
          borderRadius: 14,
          width: '100%',
          maxWidth: 520,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Accept Loan Terms
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {offer.lender} · {offer.product}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 6, color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Terms summary */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 20,
          }}>
            {[
              { label: 'Loan Amount', value: offer.amount },
              { label: 'Annual Percentage Rate', value: offer.apr },
              { label: 'Term Length', value: offer.term },
              { label: 'Monthly Payment', value: offer.monthlyPayment },
              { label: 'Estimated Funding', value: offer.fundingTime },
              { label: 'Application ID', value: APPLICATION.id },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Agreement */}
          <label style={{
            display: 'flex', gap: 12, cursor: 'pointer',
            alignItems: 'flex-start',
            marginBottom: 20,
          }}>
            <div
              onClick={() => setAgreed(a => !a)}
              style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                border: agreed ? 'none' : '1.5px solid var(--border-strong)',
                background: agreed ? 'var(--green)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {agreed && <Check size={11} color="#fff" strokeWidth={2.5} />}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              I have read and agree to the loan terms above. I authorize {offer.lender} to process my application and perform any required credit inquiries. I understand this is not a final approval.
            </span>
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-ghost"
              onClick={onClose}
              style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '11px 0' }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={!agreed || submitting}
              onClick={handleAccept}
              style={{ flex: 2, justifyContent: 'center', fontSize: 13, padding: '11px 0', gap: 8 }}
            >
              {submitting ? (
                <>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    display: 'inline-block',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  Submitting…
                </>
              ) : (
                <>Accept & Submit <ArrowRight size={13} /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Stages ───────────────────────────────────────────────────────────────────

function OpportunityCard() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 9, letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 12,
      }}>
        Open Opportunities
      </div>

      <div
        className="card"
        onClick={() => navigate('/coffee-co')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: 0,
          overflow: 'hidden',
          cursor: 'pointer',
          border: hovered ? '1px solid var(--blue)' : '1px solid var(--border)',
          boxShadow: hovered ? '0 2px 16px rgba(37,99,235,0.08)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}>
          <img src={fidoIcon} alt="Fido" style={{ width: 15, height: 15, flexShrink: 0 }} />
          <span style={{
            fontSize: 10,
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
          }}>
            Fido identified a lender match
          </span>
          <span style={{
            marginLeft: 'auto',
            fontSize: 9,
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: 'var(--blue)',
            background: 'var(--blue-soft)',
            border: '1px solid rgba(37,99,235,0.2)',
            padding: '2px 8px',
            borderRadius: 100,
          }}>
            Pre-qualified
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={ondeckLogo} alt="OnDeck" style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 3 }}>
                The Coffee Co · OnDeck Term Loan
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                $28,000 · 34.5% APR · 18 months · Next-day funding
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{
              fontSize: 12,
              padding: '8px 16px',
              gap: 6,
              flexShrink: 0,
              background: hovered ? 'var(--blue)' : undefined,
              borderColor: hovered ? 'var(--blue)' : undefined,
            }}
          >
            Start application <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

function TrackerStage({ onViewOffers }: { onViewOffers: () => void }) {
  return (
    <div style={{ animation: 'fade-up 0.35s ease both' }}>

      {/* Open opportunities */}
      <OpportunityCard />

      {/* Offer alert banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'var(--green-soft)',
          border: '1.5px solid rgba(26,122,69,0.3)',
          borderRadius: 10,
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
          marginBottom: 28,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <CheckCircle2 size={18} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', letterSpacing: '-0.01em', marginBottom: 3 }}>
            3 loan offers are ready for you
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Fido reviewed 47 lenders and surfaced your best matches. No documents needed.
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={onViewOffers}
          style={{ fontSize: 13, padding: '9px 18px', gap: 6, flexShrink: 0 }}
        >
          View Offers <ChevronRight size={13} />
        </button>
      </motion.div>

      {/* Application card */}
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 9, letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 12,
      }}>
        Active Application
      </div>

      <div className="card" style={{ padding: '24px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {APPLICATION.business}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {APPLICATION.id} · Submitted {APPLICATION.submittedDate}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <StatusBadge label="Offers Ready" color="green" dot />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {[
            { label: 'Requested', value: APPLICATION.amount },
            { label: 'Purpose', value: APPLICATION.purpose },
            { label: 'Lenders Scanned', value: '47' },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{
          background: 'var(--bg-elevated)',
          borderRadius: 8,
          padding: '20px 20px 14px',
        }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 9, letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 18,
          }}>
            Application Timeline
          </div>
          <TimelineStep
            label="Application Submitted"
            sublabel="Apr 7 — Fido packaged and sent your profile to lenders"
            done
          />
          <TimelineStep
            label="Lender Review"
            sublabel="Apr 8–10 — Partners processed your application"
            done
          />
          <TimelineStep
            label="Offers Received"
            sublabel="Apr 10 — 3 offers ready for your review"
            done
          />
          <TimelineStep
            label="Accept Terms"
            sublabel="Waiting on you — review and accept an offer"
            active
          />
          <TimelineStep
            label="Funded"
            sublabel="Funds disbursed to your business account"
            isLast
          />
        </div>
      </div>

      {/* Documents panel */}
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 9, letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 12,
      }}>
        Documents
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {[
          { name: 'Business Tax Return 2024', status: 'Verified', color: 'green' },
          { name: 'Bank Statements (6 months)', status: 'Verified', color: 'green' },
          { name: 'Business License', status: 'Verified', color: 'green' },
          { name: 'Personal Financial Statement', status: 'Verified', color: 'green' },
        ].map((doc, i, arr) => (
          <div key={doc.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 20px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FileText size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{doc.name}</span>
            </div>
            <StatusBadge label={doc.status} color={doc.color} />
          </div>
        ))}
      </div>

    </div>
  )
}

function OffersStage({
  onBack,
  onAccept,
}: {
  onBack: () => void
  onAccept: (offer: LoanOffer) => void
}) {
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer>(OFFERS[0])
  const [showInsight, setShowInsight] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowInsight(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ animation: 'fade-up 0.35s ease both' }}>

      {/* Nav */}
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: 'var(--text-muted)',
          padding: '4px 0', marginBottom: 20,
          fontFamily: 'IBM Plex Mono, monospace',
          letterSpacing: '0.08em',
        }}
      >
        ← Back to Application
      </button>

      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 22, fontWeight: 600,
          color: 'var(--text)', letterSpacing: '-0.02em',
          marginBottom: 6,
        }}>
          Your Loan Offers
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Fido matched you with 3 offers from {APPLICATION.amount} in requests. Select one to review details, or accept to move forward.
        </p>
      </div>

      {/* Offer cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 0 }}>
        {OFFERS.map((offer, i) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <OfferCard
              offer={offer}
              selected={selectedOffer.id === offer.id}
              onSelect={setSelectedOffer}
            />
          </motion.div>
        ))}
      </div>

      {/* Fido AI Insight */}
      <FidoInsight visible={showInsight} />

      {/* CTA */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-surface)',
              border: `1.5px solid ${selectedOffer.color}`,
              borderRadius: 10,
              padding: '16px 20px',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                Ready to accept {selectedOffer.lender} {selectedOffer.product}?
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {selectedOffer.apr} APR · {selectedOffer.term} · {selectedOffer.monthlyPayment}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              style={{ fontSize: 13, padding: '10px 20px', gap: 7 }}
            >
              Accept This Offer <ArrowRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accept Modal */}
      <AnimatePresence>
        {showModal && (
          <AcceptModal
            offer={selectedOffer}
            onClose={() => setShowModal(false)}
            onAccept={() => onAccept(selectedOffer)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function AcceptedStage({ offer }: { offer: LoanOffer }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ textAlign: 'center', padding: '60px 40px' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <Check size={28} color="#fff" strokeWidth={2.5} />
      </motion.div>

      <h2 style={{
        fontFamily: 'Platypi, serif',
        fontSize: 26, fontWeight: 600,
        color: 'var(--text)', letterSpacing: '-0.02em',
        marginBottom: 10,
      }}>
        Offer Accepted
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 420, margin: '0 auto 32px' }}>
        Fido has forwarded your acceptance to {offer.lender}. Expect confirmation within 1 business day and funds in {offer.fundingTime.toLowerCase()}.
      </p>

      {/* Summary */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '20px 24px',
        maxWidth: 380,
        margin: '0 auto 28px',
        textAlign: 'left',
      }}>
        {[
          { label: 'Lender', value: `${offer.lender} · ${offer.product}` },
          { label: 'Amount', value: offer.amount },
          { label: 'APR', value: offer.apr },
          { label: 'Monthly Payment', value: offer.monthlyPayment },
          { label: 'Expected Funding', value: offer.fundingTime },
        ].map((row, i, arr) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '9px 0',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { icon: AlertCircle, label: 'Fido will notify you of any lender requests', color: 'blue' },
          { icon: Clock, label: 'No action needed until funding completes', color: 'orange' },
        ].map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px',
              background: item.color === 'blue' ? 'var(--blue-soft)' : 'var(--orange-soft)',
              border: `1px solid ${item.color === 'blue' ? 'rgba(37,99,235,0.2)' : 'rgba(232,93,26,0.2)'}`,
              borderRadius: 100,
              fontSize: 12, color: item.color === 'blue' ? 'var(--blue)' : 'var(--orange)',
            }}>
              <Icon size={11} />
              {item.label}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Stage = 'tracker' | 'offers' | 'accepted'

export default function FundingPage() {
  const [stage, setStage] = useState<Stage>('tracker')
  const [acceptedOffer, setAcceptedOffer] = useState<LoanOffer | null>(null)

  function handleAccept(offer: LoanOffer) {
    setAcceptedOffer(offer)
    setStage('accepted')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: 6,
        }}>
          Financing Center
        </div>
        <h1 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 28, fontWeight: 600,
          color: 'var(--text)', letterSpacing: '-0.03em',
          lineHeight: 1.2, marginBottom: 10,
        }}>
          {stage === 'accepted' ? 'Application Complete' : 'Loan Application Center'}
        </h1>
        {stage !== 'accepted' && (
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 520 }}>
            Fido monitors your applications in real time — tracking lender activity, submitting documents, and alerting you when you need to step in.
          </p>
        )}
      </div>

      {/* Stages */}
      <AnimatePresence mode="wait">
        {stage === 'tracker' && (
          <motion.div key="tracker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TrackerStage onViewOffers={() => setStage('offers')} />
          </motion.div>
        )}
        {stage === 'offers' && (
          <motion.div key="offers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OffersStage onBack={() => setStage('tracker')} onAccept={handleAccept} />
          </motion.div>
        )}
        {stage === 'accepted' && acceptedOffer && (
          <motion.div key="accepted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AcceptedStage offer={acceptedOffer} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
