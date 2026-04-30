import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Check, Sparkles, ChevronDown } from 'lucide-react'
import { useSoulStore, soulCompleteness, type SoulFieldKey, type SoulDocument } from '../store/soulStore'
import { useAppStore } from '../store/appStore'

// ─── Question definitions ──────────────────────────────────────────────────────

interface Question {
  key: SoulFieldKey | 'letter'
  section: string
  prompt: string
  subtext: string
  placeholder: string
  rows: number
  optional?: boolean
}

const QUESTIONS: Question[] = [
  {
    key: 'why',
    section: 'Foundation',
    prompt: 'Why does this business exist?',
    subtext: `Beyond revenue — what's the deeper reason this business is in the world?`,
    placeholder: `e.g. "We started Sweet Paws because every pet deserves food made with the same love you'd give family. Most commercial treats are full of fillers. We exist to change that."`,
    rows: 4,
  },
  {
    key: 'vision',
    section: 'Foundation',
    prompt: 'Where are you going in 5 years?',
    subtext: 'Paint the picture. What does success look like at full scale?',
    placeholder: 'e.g. "Three storefronts across Austin, a regional wholesale line in 200+ pet stores, and a subscription box reaching 10,000 families nationwide."',
    rows: 4,
  },
  {
    key: 'values',
    section: 'Foundation',
    prompt: 'What do you stand for?',
    subtext: 'The 3–5 principles that guide every decision — how you treat customers, employees, and the work itself.',
    placeholder: 'e.g. "Transparency in ingredients. Obsession with quality over margin. Warmth in every interaction. We never cut corners on the thing the customer can\'t see."',
    rows: 3,
  },
  {
    key: 'customer',
    section: 'People',
    prompt: 'Who is your ideal customer?',
    subtext: 'Be specific. The more Fido understands who you serve, the better it can help you reach them.',
    placeholder: 'e.g. "Dog owners 28–45, urban, households earning $80K+. They read ingredient labels. They\'d spend $40 on a bag of treats without blinking if they trusted the brand."',
    rows: 4,
  },
  {
    key: 'differentiation',
    section: 'People',
    prompt: 'Why would someone choose you over anyone else?',
    subtext: `What's the honest, specific answer — not "great customer service"?`,
    placeholder: 'e.g. "We\'re the only bakery in Austin that bakes to order with no preservatives. Every product ships within 48 hours of being made. Competitors batch-produce weeks in advance."',
    rows: 3,
  },
  {
    key: 'goals',
    section: 'Right Now',
    prompt: 'What are your top goals for the next 12 months?',
    subtext: 'Be concrete — revenue targets, milestones, hires, launches. Fido will use this to prioritize what to help with.',
    placeholder: 'e.g. "1. Hit $600K ARR. 2. Launch a wholesale line with 3 regional pet chains. 3. Hire a part-time production manager so I can step back from daily ops."',
    rows: 4,
  },
  {
    key: 'challenge',
    section: 'Right Now',
    prompt: `What's the hardest thing you're navigating right now?`,
    subtext: 'The real stuff. Cash flow, hiring, competition, burnout — whatever it is.',
    placeholder: 'e.g. "Cash is tight between ingredient orders and customer payments. I need about 45 days of working capital to stop feeling like I\'m always behind."',
    rows: 3,
  },
  {
    key: 'northStar',
    section: 'Right Now',
    prompt: `What's your north star metric?`,
    subtext: 'The one number that, if it went up consistently, would mean everything is working.',
    placeholder: 'e.g. "Monthly recurring revenue from subscriptions. If that hits $25K, I know retention is strong and the model works."',
    rows: 3,
  },
  {
    key: 'origin',
    section: 'Story',
    prompt: 'How did this start?',
    subtext: 'The origin. Fido uses this to understand your relationship with the business.',
    placeholder: 'e.g. "I left a corporate job at 34 after my dog was diagnosed with a food allergy. The vet said most store treats were the problem. I spent six months researching, then started baking in my kitchen. First sale was to a neighbor. That was 3 years ago."',
    rows: 5,
  },
  {
    key: 'letter',
    section: 'Story',
    prompt: 'Write a note to yourself — to open in one year.',
    subtext: 'Optional. What do you want to remind yourself of? What do you hope has changed?',
    placeholder: 'Dear future me…',
    rows: 5,
    optional: true,
  },
]

const SECTIONS = ['Foundation', 'People', 'Right Now', 'Story'] as const

// ─── Completeness ring ────────────────────────────────────────────────────────

function CompletenessRing({ pct }: { pct: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={68} height={68} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={34} cy={34} r={r} fill="none" stroke="var(--border)" strokeWidth={3} />
      <circle
        cx={34} cy={34} r={r}
        fill="none"
        stroke={pct === 100 ? 'var(--green)' : '#E85D1A'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
      />
    </svg>
  )
}

// ─── Save indicator ───────────────────────────────────────────────────────────

function SaveIndicator({ lastSaved }: { lastSaved: number | null }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!lastSaved) return
    const showTimer = setTimeout(() => setShow(true), 0)
    const hideTimer = setTimeout(() => setShow(false), 2200)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [lastSaved])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 11, color: 'var(--green)',
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.06em',
          }}
        >
          <Check size={11} strokeWidth={2.5} /> Saved
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Single question block ────────────────────────────────────────────────────

function QuestionBlock({
  q, value, onChange, index,
}: {
  q: Question
  value: string
  onChange: (val: string) => void
  index: number
}) {
  const filled = value.trim().length >= 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      style={{
        background: 'var(--bg-surface)',
        border: `1.5px solid ${filled ? 'rgba(232,93,26,0.25)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '28px 32px',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Prompt */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 18, fontWeight: 600,
          color: 'var(--text)', letterSpacing: '-0.02em',
          lineHeight: 1.35,
          flex: 1,
        }}>
          {q.prompt}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, marginTop: 2, flexShrink: 0 }}>
          {q.optional && (
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              optional
            </span>
          )}
          <motion.div
            animate={{ scale: filled ? 1 : 0, opacity: filled ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Check size={10} color="#fff" strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>

      <p style={{
        fontSize: 13, color: 'var(--text-muted)',
        lineHeight: 1.6, marginBottom: 16,
      }}>
        {q.subtext}
      </p>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={q.placeholder}
        rows={q.rows}
        style={{
          width: '100%',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 8,
          padding: '13px 16px',
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
          color: 'var(--text)',
          lineHeight: 1.65,
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color 0.15s, background 0.15s',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#E85D1A'
          e.target.style.background = '#fff'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border-strong)'
          e.target.style.background = 'var(--bg-elevated)'
        }}
      />
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SoulPage() {
  const { soul, setSoul, save } = useSoulStore()
  const { profile } = useAppStore()
  const pct = soulCompleteness(soul)
  const businessName = profile.businessName || 'Your Business'
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [railOpen, setRailOpen] = useState(true)

  const autoSave = useCallback((fields: Partial<SoulDocument>) => {
    setSoul(fields)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => save(), 1200)
  }, [setSoul, save])

  // Group questions by section
  const grouped = SECTIONS.map(section => ({
    section,
    questions: QUESTIONS.filter(q => q.section === section),
  }))

  const isLocked = pct === 100

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Left rail ── */}
      <div style={{
        width: railOpen ? 220 : 0,
        flexShrink: 0,
        borderRight: railOpen ? '1px solid var(--border)' : 'none',
        padding: railOpen ? '32px 0' : 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: railOpen ? 'auto' : 'hidden',
        overflowX: 'hidden',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1), padding 0.22s, border 0.22s',
      }}>

        {/* Ring + label */}
        <div style={{
          padding: '0 24px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ position: 'relative' }}>
            <CompletenessRing pct={pct} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isLocked ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  <Flame size={18} color="#E85D1A" />
                </motion.div>
              ) : (
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 13, fontWeight: 600,
                  color: pct > 0 ? '#E85D1A' : 'var(--text-muted)',
                }}>
                  {pct}%
                </span>
              )}
            </div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: isLocked ? 'var(--green)' : pct > 0 ? '#E85D1A' : 'var(--text-muted)',
            fontFamily: 'IBM Plex Mono, monospace',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            {isLocked ? 'Soul Complete' : pct > 0 ? 'In Progress' : 'Not Started'}
          </div>
        </div>

        {/* Section nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {grouped.map((g, gi) => {
            const sectionFilled = g.questions.filter(q =>
              q.optional ? true : soul[q.key as SoulFieldKey]?.trim().length >= 10
            ).length
            const sectionTotal = g.questions.filter(q => !q.optional).length
            const done = sectionFilled >= sectionTotal
            const active = activeSectionIdx === gi

            return (
              <button
                key={g.section}
                onClick={() => {
                  setActiveSectionIdx(gi)
                  document.getElementById(`section-${gi}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  transition: 'background 0.12s',
                  width: '100%',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: done ? 'var(--green)' : active ? '#E85D1A' : 'var(--border-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>
                  {done
                    ? <Check size={9} color="#fff" strokeWidth={2.5} />
                    : <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#fff' : 'var(--bg-surface)' }} />
                  }
                </div>
                <span style={{
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                  transition: 'color 0.12s',
                }}>
                  {g.section}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 10, color: 'var(--text-muted)',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>
                  {sectionFilled}/{sectionTotal}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Fido uses this */}
        <div style={{
          margin: '0 12px 12px',
          background: 'rgba(232,93,26,0.06)',
          border: '1px solid rgba(232,93,26,0.18)',
          borderRadius: 8,
          padding: '12px 14px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
          }}>
            <Sparkles size={11} color="#E85D1A" />
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#E85D1A',
              fontFamily: 'IBM Plex Mono, monospace',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Fido reads this
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Every answer here becomes part of Fido's core understanding of {businessName}. The richer this is, the smarter Fido gets.
          </p>
        </div>

      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

        {/* Top bar: collapse + save */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 12px 16px',
          background: 'rgba(247,246,243,0.88)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <button
            onClick={() => setRailOpen(o => !o)}
            title={railOpen ? 'Collapse panel' : 'Expand panel'}
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)'
              e.currentTarget.style.borderColor = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-surface)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
          >
            <motion.div
              animate={{ rotate: railOpen ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronDown size={13} color="var(--text-muted)" style={{ transform: 'rotate(90deg)' }} />
            </motion.div>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SaveIndicator lastSaved={soul.lastSaved} />
            <button
              className="btn btn-primary"
              onClick={() => save()}
              style={{ fontSize: 12, padding: '7px 16px', gap: 6 }}
            >
              <Check size={12} /> Save
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 48px 96px' }}>

          {/* Header */}
          <div style={{ marginBottom: 52 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(232,93,26,0.08)',
              border: '1px solid rgba(232,93,26,0.2)',
              borderRadius: 100,
              padding: '5px 14px',
              marginBottom: 20,
            }}>
              <Flame size={12} color="#E85D1A" />
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#E85D1A',
                fontFamily: 'IBM Plex Mono, monospace',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Business Soul
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Platypi, serif',
              fontSize: 34, fontWeight: 600,
              color: 'var(--text)', letterSpacing: '-0.03em',
              lineHeight: 1.2, marginBottom: 14,
            }}>
              The core of {businessName}
            </h1>
            <p style={{
              fontSize: 15, color: 'var(--text-muted)',
              lineHeight: 1.7, maxWidth: 540,
            }}>
              This is where Fido learns who you really are. Not just your industry and revenue — your <em>why</em>, your goals, your story. Fido holds all of this at its core and uses it to guide every recommendation, every action, every conversation.
            </p>
          </div>

          {/* Sections */}
          {grouped.map((g, gi) => (
            <div
              key={g.section}
              id={`section-${gi}`}
              style={{ marginBottom: 52 }}
              onFocus={() => setActiveSectionIdx(gi)}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 24,
              }}>
                <div style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 9, letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  {g.section}
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {g.questions.map((q) => {
                  const globalIdx = QUESTIONS.indexOf(q)
                  return (
                    <QuestionBlock
                      key={q.key}
                      q={q}
                      value={soul[q.key as keyof typeof soul] as string}
                      onChange={val => autoSave({ [q.key]: val })}
                      index={globalIdx}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Completion callout */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  textAlign: 'center',
                  padding: '48px 32px',
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--green)',
                  borderRadius: 14,
                  marginTop: 8,
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <Flame size={24} color="#fff" />
                </motion.div>
                <h3 style={{
                  fontFamily: 'Platypi, serif',
                  fontSize: 22, fontWeight: 600,
                  color: 'var(--text)', letterSpacing: '-0.02em',
                  marginBottom: 10,
                }}>
                  {businessName}'s soul is alive
                </h3>
                <p style={{
                  fontSize: 14, color: 'var(--text-muted)',
                  lineHeight: 1.65, maxWidth: 400, margin: '0 auto',
                }}>
                  Fido now has everything it needs to act as a true partner for your business. Every recommendation, plan, and conversation is grounded in who you are.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}
