import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useChatStore } from '../store/chatStore'
import { SKILLS } from '../data/skills'
import HubGraph from '../components/dashboard/HubGraph'
import SkillCard from '../components/dashboard/SkillCard'
import BusinessAnalytics from '../components/dashboard/BusinessAnalytics'
import { MessageSquare, ArrowRight } from 'lucide-react'

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function DashboardPage() {
  const { profile } = useAppStore()
  const { conversations } = useChatStore()
  const navigate = useNavigate()

  const allSkills = SKILLS

  const firstName = profile.ownerName?.split(' ')[0] || 'there'

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1000, margin: '0 auto' }}>

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
          Good morning
        </div>
        <h1 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 30,
          fontWeight: 600,
          color: 'var(--text)',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}>
          {firstName}, what would you like to work on today?
        </h1>
      </div>

      {/* Business Analytics */}
      <BusinessAnalytics />

      {/* Hub graph */}
      <div
        className="card"
        style={{
          marginBottom: 32,
          padding: '28px 0 20px',
          animation: 'fade-up 0.4s 0.08s ease both',
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
        <HubGraph />
      </div>

      {/* Skills grid */}
      <div style={{ marginBottom: 36, animation: 'fade-up 0.4s 0.14s ease both' }}>
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

      {/* Empty state nudge */}
      {conversations.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '32px',
          animation: 'fade-up 0.4s 0.2s ease both',
        }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Select a skill above to start your first conversation with Fido.
          </p>
        </div>
      )}
    </div>
  )
}
