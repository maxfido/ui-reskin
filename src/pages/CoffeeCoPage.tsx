import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Check, X, ArrowRight, Star, Sparkles, TrendingDown, Zap, Shield,
  FileText, Landmark, BarChart2, Clock, CheckCircle2, CreditCard, Bell, CalendarDays,
} from 'lucide-react'
import ChatMessage from '../components/chat/ChatMessage'
import TypingIndicator from '../components/chat/TypingIndicator'
import iconColor from '../assets/icon-color.png'
import type { Message, CardType } from '../store/chatStore'

interface LoanOffer {
  id: string
  lender: string
  product: string
  amount: string
  apr: string
  term: string
  weeklyPayment: string
  fundingTime: string
  badge?: string
  isBest?: boolean
  color: string
  colorSoft: string
}

interface ChatStep {
  chipText?: string
  userMsg?: string
  delay: number
  response: string
  card?: CardType
  triggersOffers?: boolean
}

type Stage = 'form' | 'chat' | 'offers' | 'funded'

const LOAN_ID = 'OD-2026-4891'
const APPLICATION_ID = 'APP-2026-4891'

const STAGE_ORDER: { id: Stage; label: string; sublabel: string }[] = [
  { id: 'form', label: 'Intake', sublabel: 'Prefilled application' },
  { id: 'chat', label: 'Fido Review', sublabel: 'Bank data + pre-qual' },
  { id: 'offers', label: 'Offers', sublabel: 'OnDeck match' },
  { id: 'funded', label: 'Funded', sublabel: 'Transfer initiated' },
]

const STAGE_COPY: Record<Stage, { eyebrow: string; title: string; description: string }> = {
  form: {
    eyebrow: 'My Loans / Partner application',
    title: 'The Coffee Co lending request',
    description: 'A prefilled OnDeck request inside the Fido application center, using connected account data and the business profile already on file.',
  },
  chat: {
    eyebrow: 'Fido AI underwriting workspace',
    title: 'Fido is underwriting The Coffee Co',
    description: 'Fido pulls live Chase data, confirms financial details, and walks through OnDeck\'s 5 underwriting criteria — with pre-filled answers at every step.',
  },
  offers: {
    eyebrow: 'Financing center',
    title: 'OnDeck offers are ready',
    description: 'Fido compares the instant offers against The Coffee Co cash flow and explains the recommendation before the owner accepts terms.',
  },
  funded: {
    eyebrow: 'Application complete',
    title: 'Funding is in motion',
    description: 'The accepted offer is logged against the application and the owner can return to My Loans for ongoing status.',
  },
}

const COFFEE_OFFERS: LoanOffer[] = [
  {
    id: 'od-term',
    lender: 'OnDeck',
    product: 'Term Loan',
    amount: '$28,000',
    apr: '34.5%',
    term: '18 months',
    weeklyPayment: '$396 / wk',
    fundingTime: 'Next business day',
    badge: "Fido's Pick",
    isBest: true,
    color: 'var(--orange)',
    colorSoft: 'var(--orange-soft)',
  },
  {
    id: 'od-loc',
    lender: 'OnDeck',
    product: 'Line of Credit',
    amount: '$25,000',
    apr: '29.9%',
    term: '24 months revolving',
    weeklyPayment: 'Min. ~$260 / wk',
    fundingTime: 'Same day after draw',
    color: 'var(--blue)',
    colorSoft: 'var(--blue-soft)',
  },
]

const INSIGHT_LINES = [
  'The $28,000 term loan is the right call for The Coffee Co. La Marzocco machines drive 40-60% higher specialty drink margins versus commodity equipment.',
  "At $396/week, your debt service is 5.1% of The Coffee Co's average weekly revenue, leaving a comfortable buffer even in slower weeks.",
  'OnDeck moves faster than SBA capital. With the holiday season three weeks out, speed is worth more than waiting 60-90 days for cheaper debt.',
  "Based on comparable cafe upgrades, the new machine pays for itself within 5-7 months through increased ticket sizes. OnDeck's 18-month term leaves 11+ months of upside.",
]

const OPENER = "Hi Max. I have The Coffee Co application open — $28,000 for equipment. Let me pull Chase ••4891 and walk through the details with you."

const CHAT_STEPS: ChatStep[] = [
  {
    delay: 2000,
    response: "Connected. $15,200 average monthly deposits over the last 90 days, $182K annualized, zero existing debt. Clean books. Let me confirm the purchase details now.",
    card: 'coffee-plaid',
  },
  {
    chipText: "An espresso machine",
    userMsg: "An espresso machine.",
    delay: 1000,
    response: "Which model? La Marzocco prices vary significantly between the Linea and GS3 — OnDeck flags equipment specificity in the underwriting package.",
  },
  {
    chipText: "La Marzocco Linea Micra — commercial grade",
    userMsg: "The La Marzocco Linea Micra, commercial grade.",
    delay: 1100,
    response: "Good choice for a high-volume café. What's the all-in cost — machine, installation, accessories?",
  },
  {
    chipText: "$24,500 machine, ~$3,500 install and accessories",
    userMsg: "$24,500 for the machine, roughly $3,500 for installation and accessories.",
    delay: 1000,
    response: "That totals $28,000 — lines up exactly with the request. Do you have a vendor quote on file?",
  },
  {
    chipText: "Yes — Espresso Parts & Supply, Chicago",
    userMsg: "Yes, from Espresso Parts & Supply in Chicago.",
    delay: 950,
    response: "Got it, I'll attach that to the package. How does this machine improve revenue — I need a projection to include in the OnDeck use-of-funds narrative.",
  },
  {
    chipText: "35–40% lift in specialty drink sales",
    userMsg: "We're projecting 35 to 40% increase in specialty drink sales. The current machine bottlenecks output during morning rush.",
    delay: 1100,
    response: "Constraint removal with a clear revenue path — that's the strongest use-of-funds case you can make. I'll write it up exactly like that. Any outstanding business debt or active credit lines?",
  },
  {
    chipText: "None outstanding",
    userMsg: "None.",
    delay: 900,
    response: "Clean debt profile on top of clean books. Last step — OnDeck needs a soft pull on Max Ruskowski. Won't affect your score. Ready?",
  },
  {
    chipText: "Yes, run the check",
    userMsg: "Yes, go ahead.",
    delay: 1400,
    response: "Soft pull complete. 720 FICO, no derogatory marks. All 5 OnDeck underwriting criteria passed. Loading your offers now.",
    card: 'coffee-profile',
    triggersOffers: true,
  },
]

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 9,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
    }}>
      {children}
    </div>
  )
}

function StatusBadge({ label, color, dot }: { label: string; color: 'green' | 'orange' | 'blue' | 'muted'; dot?: boolean }) {
  const colors = {
    green: { fg: 'var(--green)', bg: 'var(--green-soft)', border: 'rgba(26,122,69,0.25)' },
    orange: { fg: 'var(--orange)', bg: 'var(--orange-soft)', border: 'rgba(232,93,26,0.25)' },
    blue: { fg: 'var(--blue)', bg: 'var(--blue-soft)', border: 'rgba(37,99,235,0.25)' },
    muted: { fg: 'var(--text-muted)', bg: 'var(--bg-elevated)', border: 'var(--border)' },
  }[color]

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 100,
      fontSize: 10,
      fontWeight: 600,
      color: colors.fg,
      fontFamily: 'IBM Plex Mono, monospace',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors.fg,
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
      )}
      {label}
    </span>
  )
}

function StageProgress({ stage }: { stage: Stage }) {
  const activeIndex = STAGE_ORDER.findIndex(item => item.id === stage)

  return (
    <div className="card coffee-demo-progress" aria-label="Coffee Co application progress">
      {STAGE_ORDER.map((item, index) => {
        const done = index < activeIndex
        const active = index === activeIndex
        return (
          <div className="coffee-demo-progress-step" key={item.id}>
            <div
              className="coffee-demo-progress-dot"
              style={{
                background: done ? 'var(--green)' : active ? 'var(--text)' : 'var(--bg-elevated)',
                borderColor: done ? 'var(--green)' : active ? 'var(--text)' : 'var(--border-strong)',
              }}
            >
              {done ? <Check size={12} color="#fff" strokeWidth={2.6} /> : active ? <span /> : null}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: done || active ? 'var(--text)' : 'var(--text-muted)' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                {item.sublabel}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DemoAside({ stage, acceptedOffer }: { stage: Stage; acceptedOffer: LoanOffer | null }) {
  const activeIndex = STAGE_ORDER.findIndex(item => item.id === stage)
  const timeline = [
    { label: 'Application drafted', sub: 'Fido prefilled owner, business, and use-of-funds fields' },
    { label: 'Chase account verified', sub: 'Deposits and current debt pulled from connected accounts' },
    { label: 'OnDeck profile packaged', sub: 'Revenue, time in business, and FICO checks passed' },
    { label: 'Owner acceptance', sub: acceptedOffer ? `${acceptedOffer.lender} ${acceptedOffer.product} selected` : 'Waiting for selected terms' },
  ]

  return (
    <aside className="coffee-demo-aside">
      <div className="card coffee-demo-side-card">
        <div className="coffee-demo-side-head">
          <Landmark size={15} color="var(--text-muted)" />
          <SectionLabel>Connected Account</SectionLabel>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Chase Business Checking
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          The Coffee Co ••4891
        </div>
        <div className="coffee-demo-mini-grid">
          {[
            { label: 'Avg monthly', value: '$15.2K', color: 'var(--green)' },
            { label: 'Annualized', value: '$182K' },
            { label: 'Debt', value: '$0' },
            { label: 'Deposits', value: '5 days/wk' },
          ].map(item => (
            <div key={item.label} className="coffee-demo-mini-metric">
              <div>{item.label}</div>
              <strong style={{ color: item.color ?? 'var(--text)' }}>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="card coffee-demo-side-card">
        <div className="coffee-demo-side-head">
          <FileText size={15} color="var(--text-muted)" />
          <SectionLabel>Request Summary</SectionLabel>
        </div>
        {[
          { label: 'Application ID', value: APPLICATION_ID },
          { label: 'Amount', value: '$28,000' },
          { label: 'Purpose', value: 'La Marzocco Linea Micra' },
          { label: 'Partner', value: 'OnDeck Capital' },
        ].map((row, i, arr) => (
          <div key={row.label} className="coffee-demo-side-row" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>

      <div className="card coffee-demo-side-card">
        <div className="coffee-demo-side-head">
          <Clock size={15} color="var(--text-muted)" />
          <SectionLabel>Application Timeline</SectionLabel>
        </div>
        <div className="coffee-demo-timeline">
          {timeline.map((item, index) => {
            const done = index < activeIndex || stage === 'funded'
            const active = index === activeIndex && stage !== 'funded'
            return (
              <div className="coffee-demo-timeline-item" key={item.label}>
                <div
                  className="coffee-demo-timeline-dot"
                  style={{
                    background: done ? 'var(--green)' : active ? 'var(--text)' : 'var(--bg-elevated)',
                    borderColor: done ? 'var(--green)' : active ? 'var(--text)' : 'var(--border-strong)',
                  }}
                >
                  {done && <Check size={10} color="#fff" strokeWidth={2.6} />}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: done || active ? 'var(--text)' : 'var(--text-muted)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    {item.sub}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

function DemoLayout({
  stage,
  acceptedOffer,
  children,
}: {
  stage: Stage
  acceptedOffer: LoanOffer | null
  children: ReactNode
}) {
  const copy = STAGE_COPY[stage]

  return (
    <div className="coffee-demo-page">
      <div className="coffee-demo-header">
        <div>
          <SectionLabel>{copy.eyebrow}</SectionLabel>
          <h1 className="coffee-demo-title">{copy.title}</h1>
          <p className="coffee-demo-description">{copy.description}</p>
        </div>

        <div className="card coffee-demo-status-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <img src={iconColor} alt="Fido" style={{ width: 28, height: 28, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Fido AI</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Business lending partner</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <StatusBadge label="Chase linked" color="blue" />
            <StatusBadge label={stage === 'funded' ? 'Funding queued' : 'OnDeck live'} color={stage === 'funded' ? 'green' : 'orange'} dot />
          </div>
        </div>
      </div>

      <StageProgress stage={stage} />

      <div
        className="coffee-demo-body"
        style={stage === 'chat' ? { gridTemplateColumns: '1fr', maxWidth: 860, margin: '0 auto', width: '100%' } : undefined}
      >
        <div style={{ minWidth: 0 }}>{children}</div>
        {stage !== 'chat' && <DemoAside stage={stage} acceptedOffer={acceptedOffer} />}
      </div>
    </div>
  )
}

function OfferCard({ offer, onSelect, selected }: {
  offer: LoanOffer
  onSelect: (o: LoanOffer) => void
  selected: boolean
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
      className="coffee-demo-offer-card"
      style={{
        border: selected
          ? `2px solid ${offer.color}`
          : offer.isBest
          ? `1.5px solid ${offer.color}`
          : '1.5px solid var(--border-strong)',
        boxShadow: hovered || selected ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      {offer.badge && (
        <div className="coffee-demo-offer-badge" style={{ background: offer.color }}>
          <Star size={9} fill="#fff" />
          {offer.badge}
        </div>
      )}
      {selected && (
        <div className="coffee-demo-selected" style={{ background: offer.color }}>
          <Check size={12} color="#fff" strokeWidth={2.5} />
        </div>
      )}
      <div style={{ marginBottom: 16, marginTop: offer.badge ? 6 : 0 }}>
        <div style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          fontFamily: 'IBM Plex Mono, monospace',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {offer.lender}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          {offer.product}
        </div>
      </div>
      <div className="coffee-demo-offer-metric" style={{ background: offer.isBest ? offer.colorSoft : 'var(--bg-elevated)' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[
          { label: 'Term', value: offer.term },
          { label: 'Weekly', value: offer.weeklyPayment },
          { label: 'Funding', value: offer.fundingTime },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ChatWithFidoPill() {
  const navigate = useNavigate()
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={() => navigate('/dashboard/skill/get-funded')}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 13px',
        background: hov ? 'var(--text)' : 'var(--bg-elevated)',
        border: `1px solid ${hov ? 'var(--text)' : 'var(--border-strong)'}`,
        borderRadius: 100,
        fontSize: 12, fontWeight: 600,
        color: hov ? '#fff' : 'var(--text-2)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <img src={iconColor} alt="Fido" style={{ width: 13, height: 13, flexShrink: 0 }} />
      Chat with Fido about your offer
    </button>
  )
}

function FidoInsight() {
  const [lineIndex, setLineIndex] = useState(0)
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentText, setCurrentText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const typing = lineIndex < INSIGHT_LINES.length

  useEffect(() => {
    if (!typing) return

    const line = INSIGHT_LINES[lineIndex]
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setCurrentText(line.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, 14)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setDisplayedLines(prev => [...prev, line])
      setCurrentText('')
      setCharIndex(0)
      setLineIndex(i => i + 1)
    }, 320)
    return () => clearTimeout(t)
  }, [typing, lineIndex, charIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card coffee-demo-insight"
    >
      <div className="coffee-demo-insight-head">
        <div className="coffee-demo-insight-icon">
          <Sparkles size={13} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Fido AI Insight</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Why the OnDeck term loan is the right fit</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <StatusBadge label={typing ? 'Analyzing' : 'Complete'} color={typing ? 'green' : 'blue'} dot={typing} />
        </div>
      </div>
      <div className="coffee-demo-insight-body">
        {displayedLines.map((line, i) => (
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {line}
          </motion.p>
        ))}
        {(typing || currentText) && (
          <p>
            {currentText}
            <span className="coffee-demo-cursor" />
          </p>
        )}
        {!typing && displayedLines.length === INSIGHT_LINES.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}
          >
            {[
              { Icon: TrendingDown, label: '$14K less total cost vs. 24mo LOC', color: 'green' },
              { Icon: Zap,          label: 'Funds tomorrow by 9am',             color: 'orange' },
              { Icon: Shield,       label: '5-7 month ROI on machine',           color: 'blue'  },
            ].map(({ Icon, label, color }) => (
              <div key={label} className={`coffee-demo-info-chip coffee-demo-info-chip-${color}`}>
                <Icon size={11} />
                {label}
              </div>
            ))}
            <ChatWithFidoPill />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function AcceptModal({ offer, onClose, onAccept }: {
  offer: LoanOffer
  onClose: () => void
  onAccept: () => void
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
    <div
      className="coffee-demo-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22 }}
        className="coffee-demo-modal card"
      >
        <div className="coffee-demo-modal-head">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Accept Loan Terms</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{offer.lender} · {offer.product} · {LOAN_ID}</div>
          </div>
          <button className="coffee-demo-icon-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div className="coffee-demo-terms">
            {[
              { label: 'Loan Amount', value: offer.amount },
              { label: 'Annual Percentage Rate', value: offer.apr },
              { label: 'Term Length', value: offer.term },
              { label: 'Weekly Payment', value: offer.weeklyPayment },
              { label: 'Estimated Funding', value: offer.fundingTime },
              { label: 'Loan ID', value: LOAN_ID },
            ].map((row, i, arr) => (
              <div key={row.label} className="coffee-demo-term-row" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <label className="coffee-demo-check-label">
            <span
              className="coffee-demo-checkbox"
              onClick={() => setAgreed(a => !a)}
              style={{
                border: agreed ? 'none' : '1.5px solid var(--border-strong)',
                background: agreed ? 'var(--green)' : 'transparent',
              }}
            >
              {agreed && <Check size={11} color="#fff" strokeWidth={2.5} />}
            </span>
            <span>
              I have read and agree to the loan terms above. I authorize OnDeck Capital to process my application via eNova International's Colossus platform and perform any required credit inquiries. I understand this is not a final approval.
            </span>
          </label>
          <div className="coffee-demo-modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={!agreed || submitting} onClick={handleAccept}>
              {submitting ? (
                <>
                  <span className="coffee-demo-spinner" />
                  Submitting
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

function ScenarioChip({ text, onClick }: { text: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="coffee-demo-scenario-chip"
      style={{
        borderColor: hov ? 'var(--orange)' : 'var(--border)',
        background: hov ? 'rgba(232,93,26,0.06)' : 'var(--bg-surface)',
        color: hov ? 'var(--text)' : 'var(--text-2)',
      }}
    >
      <span>{text}</span>
      <ArrowRight size={13} color="var(--orange)" />
    </button>
  )
}

function IntakeStage({ onSubmit }: { onSubmit: () => void }) {
  const fields = [
    { label: 'First Name', value: 'Max' },
    { label: 'Last Name', value: 'Ruskowski' },
    { label: 'Business Name', value: 'The Coffee Co' },
    { label: 'Amount Needed', value: '$28,000' },
    { label: 'Use of Funds', value: 'Commercial espresso machine' },
    { label: 'Monthly Revenue', value: '$15,200' },
    { label: 'Time in Business', value: '3 years' },
    { label: 'Business Location', value: 'Chicago, IL' },
  ]

  const inputStyle: CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid var(--border)',
    borderRadius: 4,
    background: 'var(--bg-elevated)',
    padding: '10px 14px',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    color: 'var(--text)',
    outline: 'none',
  }

  return (
    <div className="card coffee-demo-main-card">
      <div className="coffee-demo-card-head">
        <div>
          <SectionLabel>OnDeck Quick Application · Powered by Fido</SectionLabel>
          <h2>Review the prefilled request</h2>
          <p>Fido pulled the profile, Chase activity, and use of funds into a lender-ready application.</p>
        </div>
        <StatusBadge label="Pre-filled" color="blue" />
      </div>

      <div className="coffee-demo-card-body">
        <div className="coffee-demo-field-grid">
          {fields.map(f => (
            <div key={f.label}>
              <label className="coffee-demo-input-label">{f.label}</label>
              <input type="text" defaultValue={f.value} style={inputStyle} readOnly />
            </div>
          ))}
        </div>

        <div className="coffee-demo-eligibility-grid">
          {[
            { icon: BarChart2, label: 'Revenue', sub: '$15,200/mo meets the $8,333 minimum' },
            { icon: Clock, label: 'Time in Business', sub: '3 years exceeds the 1 year minimum' },
            { icon: CreditCard, label: 'Loan Size', sub: '$28K fits the $5K-$400K OnDeck range' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="coffee-demo-eligibility">
              <div>
                <Icon size={14} color="var(--green)" />
              </div>
              <div>
                <strong>{label}</strong>
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onSubmit} className="btn btn-primary coffee-demo-primary-action">
          Check my options in 60 seconds <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

function ChatStage({ onOffersReady }: { onOffersReady: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: 'opener', role: 'fido', content: OPENER, timestamp: Date.now() },
  ])
  const [isTyping, setIsTyping] = useState(true)
  const [step, setStep] = useState<number | null>(null)
  const [offersReady, setOffersReady] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `auto-${Date.now()}`,
        role: 'fido',
        content: CHAT_STEPS[0].response,
        card: CHAT_STEPS[0].card,
        timestamp: Date.now(),
      }])
      setIsTyping(false)
      setStep(1)
    }, CHAT_STEPS[0].delay)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleStep = async (stepIdx: number) => {
    const s = CHAT_STEPS[stepIdx]
    if (!s || isTyping) return

    setMessages(prev => [...prev, {
      id: `u-${Date.now()}`,
      role: 'user',
      content: s.userMsg!,
      timestamp: Date.now(),
    }])
    setIsTyping(true)

    await new Promise<void>(resolve => setTimeout(resolve, s.delay))

    setMessages(prev => [...prev, {
      id: `f-${Date.now()}`,
      role: 'fido',
      content: s.response,
      card: s.card,
      timestamp: Date.now(),
    }])
    setIsTyping(false)

    if (s.triggersOffers) {
      setTimeout(() => setIsTyping(true), 500)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `submit-${Date.now()}`,
          role: 'fido',
          content: 'Package submitted. OnDeck underwriting has everything they need — your application is in queue.',
          card: 'coffee-submitted' as const,
          timestamp: Date.now(),
        }])
        setIsTyping(false)
        setOffersReady(true)
      }, 1600)
      return
    }

    setStep(stepIdx + 1)
  }

  const pendingChip = step !== null && step < CHAT_STEPS.length && CHAT_STEPS[step].chipText
    ? CHAT_STEPS[step]
    : null

  return (
    <div className="card coffee-demo-chat-card" style={{ minHeight: 'calc(100vh - 380px)' }}>
      <div className="coffee-demo-chat-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img src={iconColor} alt="Fido" style={{ width: 28, height: 28, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Fido AI</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Underwriting · The Coffee Co x OnDeck</div>
          </div>
        </div>
        <StatusBadge label="Live underwriting" color="green" dot />
      </div>

      <div className="coffee-demo-chat-log" style={{ flex: 1, maxHeight: 'none' }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {offersReady && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <button
            className="btn btn-primary"
            onClick={onOffersReady}
            style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '13px 0', gap: 8 }}
          >
            View your OnDeck offers <ArrowRight size={14} />
          </button>
        </div>
      )}

      {!offersReady && pendingChip && !isTyping && (
        <div className="coffee-demo-chat-suggestions">
          <ScenarioChip text={pendingChip.chipText!} onClick={() => void handleStep(step!)} />
        </div>
      )}

      {!offersReady && (
        <div className="coffee-demo-chat-input">
          <input placeholder="Use the suggested answers above to continue the underwriting..." disabled />
          <button disabled className="btn btn-primary" aria-label="Send message">
            <Send size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

function OffersStage({ onAccepted }: { onAccepted: (offer: LoanOffer) => void }) {
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer>(COFFEE_OFFERS[0])
  const [showInsight, setShowInsight] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowInsight(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <div className="card coffee-demo-offer-alert">
        <div className="coffee-demo-alert-icon">
          <CheckCircle2 size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 3 }}>
            2 OnDeck offers are ready
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Fido packaged the application and matched terms against The Coffee Co cash-flow profile.
          </div>
        </div>
      </div>

      <div className="coffee-demo-offer-grid">
        {COFFEE_OFFERS.map((offer, i) => (
          <motion.div key={offer.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <OfferCard offer={offer} selected={selectedOffer.id === offer.id} onSelect={setSelectedOffer} />
          </motion.div>
        ))}
      </div>

      {showInsight && <FidoInsight />}

      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="coffee-demo-accept-panel"
            style={{ borderColor: selectedOffer.color }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                Ready to accept {selectedOffer.lender} {selectedOffer.product}?
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {selectedOffer.apr} APR · {selectedOffer.term} · {selectedOffer.weeklyPayment}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Accept This Offer <ArrowRight size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <AcceptModal
            offer={selectedOffer}
            onClose={() => setShowModal(false)}
            onAccept={() => onAccepted(selectedOffer)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function FundedStage({
  offer,
  onReset,
  onGoToLoans,
}: {
  offer: LoanOffer
  onReset: () => void
  onGoToLoans: () => void
}) {
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const firstPayment = new Date(); firstPayment.setDate(firstPayment.getDate() + 7)
  const checkIn30   = new Date(); checkIn30.setDate(checkIn30.getDate() + 30)
  const earlyPayoff = new Date(); earlyPayoff.setMonth(earlyPayoff.getMonth() + 12)
  const finalPmt    = new Date(); finalPmt.setMonth(finalPmt.getMonth() + 18)

  const REMINDERS = [
    {
      icon: Bell,
      color: 'orange' as const,
      label: 'Weekly payment reminder',
      date: `Starting ${fmt(firstPayment)}`,
      sub: 'Fido alerts you 48h before every $396 payment — and flags it if cash looks tight.',
    },
    {
      icon: BarChart2,
      color: 'blue' as const,
      label: '30-day cash flow check-in',
      date: fmt(checkIn30),
      sub: 'Fido reviews revenue vs. repayment pace and surfaces any early pressure.',
    },
    {
      icon: TrendingDown,
      color: 'green' as const,
      label: 'Early payoff window',
      date: fmt(earlyPayoff),
      sub: 'If ahead of schedule, Fido calculates exact interest savings and prompts you to act.',
    },
    {
      icon: CheckCircle2,
      color: 'green' as const,
      label: 'Loan close confirmation',
      date: fmt(finalPmt),
      sub: "Loan retires — Fido updates The Coffee Co's credit profile and unlocks new capacity.",
    },
  ]

  const colorVars = {
    orange: { fg: 'var(--orange)', bg: 'var(--orange-soft)', border: 'rgba(232,93,26,0.2)' },
    blue:   { fg: 'var(--blue)',   bg: 'var(--blue-soft)',   border: 'rgba(37,99,235,0.2)'  },
    green:  { fg: 'var(--green)',  bg: 'var(--green-soft)',  border: 'rgba(26,122,69,0.2)'  },
  }

  // 0 = waiting, 1 = typing, 2 = message ready, 3 = plan shown, 4 = setting reminders, 5 = done
  const [phase, setPhase] = useState(0)
  const [remindersChecked, setRemindersChecked] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1600)
    const t2 = setTimeout(() => setPhase(2), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [phase, remindersChecked])

  function handlePlanClick() {
    setPhase(3)
  }

  function handleSetReminders() {
    setPhase(4)
    REMINDERS.forEach((_, i) => {
      setTimeout(() => setRemindersChecked(i + 1), (i + 1) * 550)
    })
    setTimeout(() => setPhase(5), REMINDERS.length * 550 + 700)
  }

  return (
    <div>
      {/* ── Funded confirmation ── */}
      <motion.div
        className="card coffee-demo-funded-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 16 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
          className="coffee-demo-funded-icon"
        >
          <Check size={28} color="#fff" strokeWidth={2.5} />
        </motion.div>

        <h2>You're funded.</h2>
        <p>
          OnDeck is transferring $28,000 to The Coffee Co's Chase Business account. Expect the deposit by tomorrow morning.
        </p>

        <div className="coffee-demo-funded-summary">
          {[
            { label: 'Lender',         value: 'OnDeck Capital · eNova International' },
            { label: 'Amount',         value: '$28,000', highlight: true },
            { label: 'Weekly Payment', value: offer.weeklyPayment },
            { label: 'First Payment',  value: fmt(firstPayment) },
            { label: 'Loan ID',        value: LOAN_ID },
          ].map((row, i, arr) => (
            <div key={row.label} className="coffee-demo-term-row" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span>{row.label}</span>
              <strong style={{ color: (row as { highlight?: boolean }).highlight ? 'var(--green)' : 'var(--text)' }}>{row.value}</strong>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Fido follow-up chat ── */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key="followup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card coffee-demo-chat-card"
            style={{ minHeight: 'unset' }}
          >
            {/* Header */}
            <div className="coffee-demo-chat-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <img src={iconColor} alt="Fido" style={{ width: 28, height: 28, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Fido AI</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Post-funding · Repayment planning</div>
                </div>
              </div>
              <StatusBadge label="Active" color="green" dot />
            </div>

            {/* Log */}
            <div className="coffee-demo-chat-log" style={{ maxHeight: 'none', minHeight: 'unset' }}>

              {/* Typing / first message */}
              {phase === 1 && <TypingIndicator />}

              {phase >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ChatMessage msg={{
                    id: 'followup-1',
                    role: 'fido',
                    content: "The transfer is initiated — The Coffee Co gets the $28,000 tomorrow morning. Before you go, let me build a repayment plan so this loan works *for* you, not against you. I'll set the key milestones and monitor each one.",
                    timestamp: Date.now(),
                  }} />
                </motion.div>
              )}

              {/* Plan chip */}
              {phase === 2 && (
                <div className="coffee-demo-chat-suggestions" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <ScenarioChip text="Yes, let's build the plan" onClick={handlePlanClick} />
                </div>
              )}

              {/* Repayment plan */}
              {phase >= 3 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <ChatMessage msg={{
                    id: 'followup-2',
                    role: 'fido',
                    content: "Here's your repayment plan. I'll own all four of these milestones — you just need to approve.",
                    timestamp: Date.now(),
                  }} />

                  {/* Milestone cards */}
                  <div style={{ margin: '4px 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {REMINDERS.map((r, i) => {
                      const c = colorVars[r.color]
                      const Icon = r.icon
                      const checked = remindersChecked > i
                      return (
                        <motion.div
                          key={r.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '12px 14px',
                            background: checked ? c.bg : 'var(--bg-elevated)',
                            border: `1px solid ${checked ? c.border : 'var(--border)'}`,
                            borderRadius: 8,
                            transition: 'all 0.35s ease',
                          }}
                        >
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: checked ? c.fg : 'var(--bg-surface)',
                            border: `1.5px solid ${checked ? c.fg : 'var(--border-strong)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.35s ease',
                          }}>
                            {checked
                              ? <Check size={13} color="#fff" strokeWidth={2.5} />
                              : <Icon size={13} color="var(--text-muted)" />
                            }
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.label}</span>
                              <span style={{
                                fontSize: 10, fontFamily: 'IBM Plex Mono, monospace',
                                color: c.fg, background: c.bg,
                                border: `1px solid ${c.border}`,
                                padding: '2px 7px', borderRadius: 100,
                                letterSpacing: '0.04em',
                              }}>
                                {r.date}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{r.sub}</div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Set reminders chip */}
              {phase === 3 && (
                <div className="coffee-demo-chat-suggestions" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <ScenarioChip text="Set all reminders" onClick={handleSetReminders} />
                </div>
              )}

              {/* Sign-off */}
              {phase === 5 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <ChatMessage msg={{
                    id: 'followup-signoff',
                    role: 'fido',
                    content: `All set. I'll ping you 48 hours before every $${offer.weeklyPayment.replace(' / wk', '')} payment, surface any cash flow concerns before they become problems, and flag the early payoff window if it makes sense. The Coffee Co is in good hands — you've got a partner now, not just a loan.`,
                    timestamp: Date.now(),
                  }} />

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0 8px' }}>
                    {[
                      { icon: Bell,        label: 'Weekly payment alerts on',    color: 'orange' as const },
                      { icon: CalendarDays,label: '4 milestones tracked',         color: 'blue'   as const },
                      { icon: Shield,       label: 'Fido monitoring active',       color: 'green'  as const },
                    ].map(({ icon: Icon, label, color }) => {
                      const c = colorVars[color]
                      return (
                        <div key={label} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '5px 11px',
                          background: c.bg,
                          border: `1px solid ${c.border}`,
                          borderRadius: 100,
                          fontSize: 11, fontWeight: 500,
                          color: c.fg,
                        }}>
                          <Icon size={11} /> {label}
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* CTAs — only after done */}
            {phase === 5 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  padding: '14px 20px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex', gap: 10,
                }}
              >
                <button className="btn btn-primary" onClick={onGoToLoans} style={{ gap: 6 }}>
                  View My Loans <ArrowRight size={13} />
                </button>
                <button className="btn btn-ghost" onClick={onReset}>
                  Run demo again
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CoffeeCoPage() {
  const [stage, setStage] = useState<Stage>('form')
  const [acceptedOffer, setAcceptedOffer] = useState<LoanOffer | null>(null)
  const navigate = useNavigate()

  function handleAccept(offer: LoanOffer) {
    setAcceptedOffer(offer)
    setStage('funded')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetDemo() {
    setAcceptedOffer(null)
    setStage('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <DemoLayout stage={stage} acceptedOffer={acceptedOffer}>
      <AnimatePresence mode="wait">
        {stage === 'form' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntakeStage onSubmit={() => setStage('chat')} />
          </motion.div>
        )}
        {stage === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChatStage onOffersReady={() => setStage('offers')} />
          </motion.div>
        )}
        {stage === 'offers' && (
          <motion.div key="offers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OffersStage onAccepted={handleAccept} />
          </motion.div>
        )}
        {stage === 'funded' && acceptedOffer && (
          <motion.div key="funded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FundedStage offer={acceptedOffer} onReset={resetDemo} onGoToLoans={() => navigate('/funding')} />
          </motion.div>
        )}
      </AnimatePresence>
    </DemoLayout>
  )
}
