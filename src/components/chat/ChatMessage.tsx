import type { Message } from '../../store/chatStore'
import InlineCard from './InlineCard'

export default function ChatMessage({ msg }: { msg: Message }) {
  const isFido = msg.role === 'fido'

  return (
    <div style={{
      display: 'flex',
      flexDirection: isFido ? 'row' : 'row-reverse',
      gap: 10,
      alignItems: 'flex-start',
      animation: 'fade-up 0.3s ease both',
    }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: isFido ? 'var(--orange)' : 'var(--text)',
        color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isFido ? 10 : 11,
        fontWeight: 700,
        flexShrink: 0,
        marginTop: 2,
      }}>
        {isFido ? 'F' : 'Y'}
      </div>

      <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Sender label */}
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          textAlign: isFido ? 'left' : 'right',
        }}>
          {isFido ? 'Fido' : 'You'}
        </div>

        {/* Bubble */}
        <div style={{
          background: isFido ? 'var(--bg-surface)' : 'var(--text)',
          border: isFido ? '1px solid var(--border)' : 'none',
          borderRadius: isFido ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
          padding: '11px 15px',
          fontSize: 14,
          lineHeight: 1.6,
          color: isFido ? 'var(--text)' : '#fff',
        }}>
          {msg.content}
        </div>

        {/* Inline card if present */}
        {msg.card && <InlineCard type={msg.card} />}
      </div>
    </div>
  )
}
