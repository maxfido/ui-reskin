import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useChatStore } from '../store/chatStore'
import { SKILLS } from '../data/skills'
import HubGraph from '../components/dashboard/HubGraph'
import SkillCard from '../components/dashboard/SkillCard'
import BusinessPlanModal from '../components/dashboard/BusinessPlanModal'
import TasksReminders from '../components/dashboard/TasksReminders'
import { MessageSquare, ArrowRight, FileText, BarChart2, Zap, ListChecks } from 'lucide-react'
import fidoIcon from '../assets/icon-color.png'
import ondeckLogo from '../assets/ondeck-logo.png'

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function FidoGreeting({ businessName, bankLinked }: { businessName: string; bankLinked: boolean }) {
  const navigate = useNavigate()
  const timeOfDay = getTimeOfDay()
  const heading = `Good ${timeOfDay}. I'm Fido, your AI Business Partner.`
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [hoveredPill, setHoveredPill] = useState<string | null>(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(heading.slice(0, i))
      if (i >= heading.length) { clearInterval(id); setDone(true) }
    }, 28)
    return () => clearInterval(id)
  }, [heading])

  const pills = [
    { key: 'loan',      label: 'Apply for the best Loan', icon: FileText,   to: '/dashboard/skill/get-funded' },
    { key: 'financials', label: 'Analyze Financials',    icon: BarChart2,  to: '/dashboard/skill/business-analysis' },
    { key: 'tasks',     label: "What's on my to-do list?", icon: ListChecks, to: null as string | null },
    ...(bankLinked ? [{ key: 'offers', label: "What are my offers?", icon: Zap, to: '/funding' as string | null }] : []),
  ]

  return (
    <div className="card" style={{ marginBottom: 32, animation: 'fade-up 0.4s ease both', overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <img src={fidoIcon} alt="Fido" style={{ width: 26, height: 26, flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Fido AI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
            <span style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em' }}>Online</span>
          </div>
        </div>
      </div>

      {/* Main message body */}
      <div style={{ padding: '28px 28px 20px' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9, letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 12,
        }}>
          Good {timeOfDay}
        </div>

        {/* Large typewriter heading */}
        <div style={{
          fontFamily: 'Platypi, serif',
          fontSize: 32,
          fontWeight: 700,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: 14,
          minHeight: '2.8em',
        }}>
          {displayed}
          {!done && (
            <span style={{
              display: 'inline-block', width: 2, height: '0.85em',
              background: 'var(--orange)', marginLeft: 2,
              verticalAlign: 'middle',
            }} />
          )}
        </div>

        {/* Subtitle — fades in after typing */}
        <p style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.65,
          opacity: done ? 1 : 0,
          transition: 'opacity 0.5s ease',
          marginBottom: 16,
        }}>
          What do you want me to work on today?{' '}
          {businessName
            ? `I analyzed your business financials for ${businessName} — select the skill you want me to perform and I'll get started!`
            : "I analyzed your business financials — select the skill you want me to perform and I'll get started!"}
        </p>

        {/* Proactive OnDeck insight — fades in after typing */}
        <div
          onClick={() => navigate('/coffee-co')}
          style={{
            opacity: done ? 1 : 0,
            transition: 'opacity 0.6s ease 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '11px 14px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--blue)',
            borderRadius: 6,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--blue)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--blue-soft)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--blue)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <img src={ondeckLogo} alt="OnDeck" style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 4 }} />
            <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.4 }}>
              I pre-qualified <strong style={{ color: 'var(--text)' }}>The Coffee Co</strong> for <strong style={{ color: 'var(--text)' }}>$28,000</strong> from OnDeck — terms are ready.
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Start application →
          </span>
        </div>
      </div>

      {/* Action pills */}
      <div style={{
        padding: '14px 28px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex', flexWrap: 'wrap', gap: 8,
      }}>
        {pills.map(({ key, label, icon: Icon, to }) => {
          const hov = hoveredPill === key
          return (
            <button
              key={key}
              onClick={() => to ? navigate(to) : document.getElementById('tasks-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              onMouseEnter={() => setHoveredPill(key)}
              onMouseLeave={() => setHoveredPill(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px',
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
  )
}

export default function DashboardPage() {
  const { profile } = useAppStore()
  const { conversations } = useChatStore()
  const navigate = useNavigate()
  const [showBusinessPlan, setShowBusinessPlan] = useState(false)

  const allSkills = SKILLS

  return (
    <>
    <div style={{ padding: '40px 48px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Fido greeting */}
      <FidoGreeting businessName={profile.businessName} bankLinked={profile.bankLinked} />

      {/* Tasks & Reminders */}
      <div id="tasks-section">
        <TasksReminders />
      </div>

      {/* Skills grid */}
      <div style={{ marginBottom: 36, animation: 'fade-up 0.4s 0.08s ease both' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 14,
        }}>
          Skills
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {allSkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>

      {/* Hub graph */}
      <div
        className="card"
        style={{
          marginBottom: 32,
          padding: '28px 0 20px',
          animation: 'fade-up 0.4s 0.14s ease both',
        }}
      >
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          padding: '0 32px',
          marginBottom: 4,
        }}>
          Fido Knowledge Hub
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '0 32px', marginBottom: 12 }}>
          Click a skill to open a conversation with Fido.
        </p>
        <HubGraph onCenterClick={() => setShowBusinessPlan(true)} />
      </div>

      {/* Recent conversations */}
      {conversations.length > 0 && (
        <div style={{ animation: 'fade-up 0.4s 0.2s ease both' }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 14,
          }}>
            Recent Conversations
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {conversations.slice(0, 5).map((conv, i) => {
              const skill = SKILLS.find(s => s.id === conv.skillId)
              return (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/dashboard/skill/${conv.skillId}?conv=${conv.id}`)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 20px',
                    borderBottom: i < Math.min(conversations.length, 5) - 1 ? '1px solid var(--border)' : 'none',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <MessageSquare size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {skill?.name} · {timeAgo(conv.createdAt)}
                    </div>
                  </div>
                  <ArrowRight size={12} color="var(--text-muted)" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {conversations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', animation: 'fade-up 0.4s 0.2s ease both' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Select a skill above to start your first conversation with Fido.
          </p>
        </div>
      )}
    </div>

    {showBusinessPlan && (
      <BusinessPlanModal onClose={() => setShowBusinessPlan(false)} />
    )}
    </>
  )
}
