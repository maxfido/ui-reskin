import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '../../store/chatStore'
import { getNextResponse } from '../../data/mockResponses'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

interface Props {
  skillId: string
  conversationId: string
}

export default function ChatPane({ skillId, conversationId }: Props) {
  const { conversations, addMessage, isTyping, setTyping } = useChatStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const conversation = conversations.find(c => c.id === conversationId)
  const messages = conversation?.messages ?? []
  const userMsgCount = messages.filter(m => m.role === 'user').length

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')

    addMessage(conversationId, { role: 'user', content: text })
    setTyping(true)

    const flow = getNextResponse(skillId, userMsgCount + 1)
    await new Promise(r => setTimeout(r, flow.delay))

    addMessage(conversationId, {
      role: 'fido',
      content: flow.response,
      card: flow.card,
    })
    setTyping(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Message thread */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 40px',
        background: 'var(--bg-surface)',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Fido..."
          disabled={isTyping}
          style={{
            flex: 1,
            border: '1px solid var(--border)',
            borderRadius: 4,
            background: 'var(--bg)',
            padding: '11px 16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: 'var(--text)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--border-strong)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          onClick={sendMessage}
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
