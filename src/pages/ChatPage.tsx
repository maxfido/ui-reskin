import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { GENERAL_SKILL } from '../data/skills'
import { getNextResponse } from '../data/mockResponses'
import ChatMessage from '../components/chat/ChatMessage'
import TypingIndicator from '../components/chat/TypingIndicator'
import iconColor from '../assets/icon-color.png'

const STARTER_PROMPTS = [
  'How can I increase cash flow?',
  'What financing options are best for me?',
  'Help me plan to secure funding',
  'What loan types are best for my business?',
  'How should I think about marketing spend?',
  'Give me a business health check',
]

const SKILL_ID = 'general'

export default function ChatPage() {
  const { conversations, activeConversationId, createConversation, setActiveConversation, addMessage, isTyping, setTyping } = useChatStore()
  const [input, setInput] = useState('')
  const [initialized, setInitialized] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Find or create the general conversation
  const generalConvs = conversations.filter(c => c.skillId === SKILL_ID)
  const activeConv = conversations.find(c => c.id === activeConversationId && c.skillId === SKILL_ID)
    ?? generalConvs[0]
    ?? null

  const messages = activeConv?.messages ?? []
  const userMsgCount = messages.filter(m => m.role === 'user').length
  const isEmpty = userMsgCount === 0

  useEffect(() => {
    if (initialized) return
    setInitialized(true)
    if (generalConvs.length > 0) {
      setActiveConversation(generalConvs[0].id)
    } else {
      createConversation(SKILL_ID, GENERAL_SKILL.mockOpener)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping || !activeConv) return
    setInput('')

    addMessage(activeConv.id, { role: 'user', content: trimmed })
    setTyping(true)

    const flow = getNextResponse(SKILL_ID, userMsgCount + 1)
    await new Promise(r => setTimeout(r, flow.delay))

    addMessage(activeConv.id, { role: 'fido', content: flow.response, card: flow.card })
    setTyping(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '14px 32px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#111110',
            border: '1.5px solid rgba(232,93,26,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src={iconColor} style={{ width: 20, height: 20 }} alt="" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Fido</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI Business Partner</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--green)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--green)', letterSpacing: '0.1em' }}>
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}

        {/* Starter prompts — shown while no user message yet */}
        {isEmpty && !isTyping && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 20, marginTop: 16,
            animation: 'fade-up 0.4s 0.2s ease both',
          }}>
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              Try asking
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
              maxWidth: 560,
            }}>
              {STARTER_PROMPTS.map(prompt => (
                <PromptPill key={prompt} label={prompt} onClick={() => send(prompt)} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 40px',
        background: 'var(--bg-surface)',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Fido anything about your business..."
          disabled={isTyping}
          style={{
            flex: 1, border: '1px solid var(--border)', borderRadius: 4,
            background: 'var(--bg)', padding: '11px 16px',
            fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--text)',
            outline: 'none', transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--border-strong)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || isTyping}
          className="btn btn-primary"
          style={{ padding: '11px 16px' }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}

function PromptPill({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: `1.5px solid ${hov ? 'var(--border-strong)' : 'var(--border)'}`,
        background: hov ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        color: hov ? 'var(--text)' : 'var(--text-2)',
        fontSize: 13, fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}
