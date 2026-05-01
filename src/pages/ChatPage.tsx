import { useEffect, useMemo, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { DEMO_SCENARIO } from '../data/mockResponses'
import ChatMessage from '../components/chat/ChatMessage'
import TypingIndicator from '../components/chat/TypingIndicator'
import iconColor from '../assets/icon-color.png'

const SKILL_ID = 'general'
const DEMO_OPENER = "Hi Dr. Sarah — I'm tracking everything across Lakeside Family Dental. Ready to find your best funding options?"

export default function ChatPage() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    addMessage,
    deleteConversation,
    isTyping,
    setTyping,
  } = useChatStore()

  const [input, setInput] = useState('')
  const [scenarioStep, setScenarioStep] = useState<number | null>(0)
  const initialized = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const generalConvs = conversations.filter(c => c.skillId === SKILL_ID)
  const activeConv = conversations.find(c => c.id === activeConversationId && c.skillId === SKILL_ID)
    ?? generalConvs[0]
    ?? null

  const messages = useMemo(() => activeConv?.messages ?? [], [activeConv?.messages])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    conversations
      .filter(c => c.skillId === SKILL_ID)
      .forEach(c => deleteConversation(c.id))
    createConversation(SKILL_ID, DEMO_OPENER)
  }, [conversations, createConversation, deleteConversation])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendDemoStep = async (stepIndex: number) => {
    const step = DEMO_SCENARIO[stepIndex]
    if (!step || isTyping || !activeConv) return

    addMessage(activeConv.id, { role: 'user', content: step.userMsg })
    setTyping(true)

    await new Promise(r => setTimeout(r, step.delay))

    addMessage(activeConv.id, { role: 'fido', content: step.response, card: step.card })
    setTyping(false)

    const next = stepIndex + 1
    setScenarioStep(next < DEMO_SCENARIO.length ? next : null)
    inputRef.current?.focus()
  }

  const send = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping || !activeConv) return
    setInput('')

    addMessage(activeConv.id, { role: 'user', content: trimmed })
    setTyping(true)
    await new Promise(r => setTimeout(r, 1200))
    addMessage(activeConv.id, {
      role: 'fido',
      content: "Got it. Let me look into that for you.",
    })
    setTyping(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send(input)
    }
  }

  const pendingChip = scenarioStep !== null && scenarioStep < DEMO_SCENARIO.length
    ? DEMO_SCENARIO[scenarioStep]
    : null

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
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI Business Partner · Lakeside Family Dental</div>
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
        <div ref={bottomRef} />
      </div>

      {/* Scenario chip */}
      {pendingChip && !isTyping && (
        <div style={{
          padding: '10px 40px',
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          animation: 'fade-up 0.25s ease both',
        }}>
          <ScenarioChip
            text={pendingChip.chipText}
            onClick={() => sendDemoStep(scenarioStep!)}
          />
        </div>
      )}

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

function ScenarioChip({ text, onClick }: { text: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid ${hov ? 'var(--orange)' : 'var(--border)'}`,
        background: hov ? 'rgba(232,93,26,0.06)' : 'var(--bg-surface)',
        color: hov ? 'var(--text)' : 'var(--text-2)',
        fontSize: 13, fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        textAlign: 'left',
      }}
    >
      <span>{text}</span>
      <span style={{ color: 'var(--orange)', fontSize: 14, fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>→</span>
    </button>
  )
}
