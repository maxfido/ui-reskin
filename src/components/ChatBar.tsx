import { useState, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export default function ChatBar() {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) setValue('')
    }
  }

  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      padding: '12px 24px 14px',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-base)',
        border: '1px solid var(--border-strong)',
        borderRadius: 10,
        padding: '10px 14px',
        transition: 'border-color 0.15s',
      }}
        onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--ink-rule)')}
        onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Fido anything about your business..."
          rows={1}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            overflow: 'hidden',
          }}
          onInput={e => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = Math.min(el.scrollHeight, 120) + 'px'
          }}
        />
        <button
          onClick={() => { if (value.trim()) setValue('') }}
          style={{
            width: 28, height: 28, borderRadius: 6,
            border: 'none',
            background: value.trim() ? 'var(--ink)' : 'transparent',
            color: value.trim() ? 'var(--cream)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: value.trim() ? 'pointer' : 'default',
            transition: 'background 0.15s, color 0.15s',
            flexShrink: 0,
          }}
        >
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
