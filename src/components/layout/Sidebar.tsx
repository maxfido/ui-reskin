import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Settings, LogOut, ArrowLeft, Plus, Trash2, Landmark } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useChatStore } from '../../store/chatStore'
import { getSkill } from '../../data/skills'
import logo from '../../assets/logo.png'

const mainNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/funding', icon: Landmark, label: 'Funding', exact: false },
  { to: '/chat', icon: MessageSquare, label: 'Chat with Fido AI', exact: false },
  { to: '/settings', icon: Settings, label: 'Settings', exact: false },
]

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Sidebar() {
  const [hoveredConvId, setHoveredConvId] = useState<string | null>(null)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const [footerHovered, setFooterHovered] = useState(false)
  const [backHovered, setBackHovered] = useState(false)

  const { profile, reset } = useAppStore()
  const { conversations, activeConversationId, setActiveConversation, createConversation, deleteConversation } = useChatStore()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const skillId = params.skillId
  const skill = skillId ? getSkill(skillId) : null
  const isSkillRoute = !!skillId

  const initials = profile.ownerName
    ? profile.ownerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'FB'

  const skillConversations = skillId
    ? conversations.filter(c => c.skillId === skillId)
    : []

  const handleLogout = () => { reset(); navigate('/') }

  const handleNewChat = () => {
    if (!skill) return
    createConversation(skillId!, skill.mockOpener)
  }

  const isActive = (to: string, exact: boolean) => {
    if (exact) return location.pathname === to
    // For skill routes, match exactly to avoid Dashboard catching /dashboard/skill/*
    if (to.startsWith('/dashboard/skill/')) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  return (
    <aside style={{
      width: 'var(--sb-width)',
      minHeight: '100vh',
      background: 'var(--sb-bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 100,
    }}>

      {/* Logo — clickable, hovers to tinted bg */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          transition: 'background 0.15s',
          background: 'transparent',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <img src={logo} alt="Fido Financial" style={{ height: 22, width: 'auto', pointerEvents: 'none' }} />
      </div>

      {/* Context-aware nav */}
      {isSkillRoute ? (
        /* ── Skill mode ── */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Back button */}
          <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => navigate('/dashboard')}
              onMouseEnter={() => setBackHovered(true)}
              onMouseLeave={() => setBackHovered(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: backHovered ? 'var(--bg-elevated)' : 'none',
                border: 'none', cursor: 'pointer',
                color: backHovered ? 'var(--text)' : 'var(--text-muted)',
                fontSize: 12, padding: '4px 8px',
                marginBottom: 12, marginLeft: -8,
                borderRadius: 4,
                transition: 'color 0.15s, background 0.15s',
              }}
            >
              <ArrowLeft
                size={12}
                style={{
                  transition: 'transform 0.2s',
                  transform: backHovered ? 'translateX(-2px)' : 'translateX(0)',
                }}
              />
              Dashboard
            </button>
            <div style={{ fontFamily: 'Platypi, serif', fontSize: 15, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {skill?.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{skill?.tagline}</div>
          </div>

          {/* New chat */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={handleNewChat}
              className="btn btn-ghost-sm"
              style={{ width: '100%', justifyContent: 'center', gap: 6 }}
            >
              <Plus size={12} /> New Chat
            </button>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
            {skillConversations.length === 0 && (
              <div style={{ padding: '16px 12px', fontSize: 12, color: 'var(--text-muted)' }}>No conversations yet.</div>
            )}
            {skillConversations.map(conv => {
              const active = conv.id === activeConversationId
              const hov = hoveredConvId === conv.id
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  onMouseEnter={() => setHoveredConvId(conv.id)}
                  onMouseLeave={() => setHoveredConvId(null)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'flex-start', gap: 8,
                    padding: '9px 10px', borderRadius: 4, border: 'none',
                    background: active ? 'var(--sb-active)' : hov ? 'var(--sb-hover)' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                    position: 'relative',
                  }}
                >
                  <MessageSquare
                    size={12}
                    color={active ? 'var(--text)' : hov ? 'var(--text-2)' : 'var(--text-muted)'}
                    style={{ flexShrink: 0, marginTop: 2, transition: 'color 0.15s' }}
                  />
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{
                      fontSize: 12, fontWeight: active ? 600 : 400,
                      color: active ? 'var(--text)' : hov ? 'var(--text)' : 'var(--text-2)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      transition: 'color 0.15s',
                    }}>
                      {conv.title}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                      {timeAgo(conv.createdAt)} · {conv.messages.length} msgs
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      ) : (
        /* ── Main nav ── */
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {mainNav.map(({ to, icon: Icon, label, exact }) => {
            const active = isActive(to, exact)
            const hov = hoveredNav === to

            return (
              <button
                key={to}
                onClick={() => navigate(to)}
                onMouseEnter={() => setHoveredNav(to)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 4,
                  fontSize: 13, fontWeight: active || hov ? 600 : 500,
                  color: active || hov ? 'var(--text)' : 'var(--sb-muted)',
                  background: active ? 'var(--sb-active)' : hov ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'background 0.15s, color 0.12s, font-weight 0s',
                  position: 'relative',
                  boxShadow: active ? 'inset 2px 0 0 var(--text)' : hov ? 'inset 2px 0 0 var(--border-strong)' : 'none',
                }}
              >
                <Icon
                  size={15}
                  style={{
                    transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: hov && !active ? 'scale(1.15)' : 'scale(1)',
                    color: active || hov ? 'var(--text)' : 'var(--sb-muted)',
                    flexShrink: 0,
                  }}
                />
                {label}
              </button>
            )
          })}

          {/* Recent conversations */}
          {conversations.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', marginBottom: 6 }}>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 9, letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)', flex: 1,
                }}>
                  Recent
                </span>
                <button
                  onClick={() => navigate('/dashboard')}
                  title="New conversation"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 3, display: 'flex',
                    borderRadius: 3, transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--sb-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                >
                  <Plus size={12} />
                </button>
              </div>

              {conversations.slice(0, 5).map(conv => {
                const hov = hoveredConvId === conv.id
                return (
                  <div
                    key={conv.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredConvId(conv.id)}
                    onMouseLeave={() => setHoveredConvId(null)}
                  >
                    <button
                      onClick={() => navigate(`/dashboard/skill/${conv.skillId}?conv=${conv.id}`)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 32px 6px 12px', borderRadius: 4, border: 'none',
                        background: hov ? 'var(--sb-hover)' : 'transparent',
                        color: hov ? 'var(--sb-text)' : 'var(--sb-muted)',
                        fontSize: 12, cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s, color 0.15s', overflow: 'hidden',
                      }}
                    >
                      <MessageSquare size={11} style={{ flexShrink: 0, transition: 'color 0.15s' }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.title}
                      </span>
                    </button>
                    {hov && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteConversation(conv.id) }}
                        title="Delete"
                        style={{
                          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-muted)', padding: 2, display: 'flex',
                          borderRadius: 3, transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#d93026')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </nav>
      )}

      {/* User footer */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 4,
            background: footerHovered ? 'var(--sb-hover)' : 'transparent',
            transition: 'background 0.15s',
            cursor: 'default',
          }}
          onMouseEnter={() => setFooterHovered(true)}
          onMouseLeave={() => setFooterHovered(false)}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--orange)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, flexShrink: 0,
            transition: 'transform 0.2s',
            transform: footerHovered ? 'scale(1.08)' : 'scale(1)',
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--sb-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.businessName || 'Your Business'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--sb-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.ownerName || ''}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: footerHovered ? 'var(--bg-elevated)' : 'none',
              border: footerHovered ? '1px solid var(--border)' : '1px solid transparent',
              cursor: 'pointer',
              color: 'var(--sb-muted)',
              padding: 5, display: 'flex', borderRadius: 4,
              transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--border)' }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--sb-muted)'
              e.currentTarget.style.background = footerHovered ? 'var(--bg-elevated)' : 'none'
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
