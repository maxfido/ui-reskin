import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useChatStore } from '../store/chatStore'
import { getSkill } from '../data/skills'
import ChatPane from '../components/chat/ChatPane'

export default function SkillChatPage() {
  const { skillId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const skill = getSkill(skillId)
  const { conversations, activeConversationId, createConversation, setActiveConversation } = useChatStore()
  const [initialized, setInitialized] = useState(false)

  const skillConversations = conversations.filter(c => c.skillId === skillId)

  useEffect(() => {
    if (!skill || initialized) return

    const convParam = searchParams.get('conv')
    if (convParam && conversations.find(c => c.id === convParam)) {
      setActiveConversation(convParam)
      setInitialized(true)
      return
    }

    const existing = skillConversations[0]
    if (existing) {
      setActiveConversation(existing.id)
    } else {
      createConversation(skillId, skill.mockOpener)
    }
    setInitialized(true)
  }, [skillId, skill, initialized])

  if (!skill) {
    return <div style={{ padding: 48, color: 'var(--text-muted)' }}>Skill not found.</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Chat header */}
      <div style={{
        padding: '14px 32px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>F</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Fido</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{skill.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--green)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em',
          }}>Ready</span>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeConversationId ? (
          <ChatPane skillId={skillId} conversationId={activeConversationId} />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            Starting conversation...
          </div>
        )}
      </div>
    </div>
  )
}
