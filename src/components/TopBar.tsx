import { Bell } from 'lucide-react'

interface Props {
  title: string
}

export default function TopBar({ title }: Props) {
  return (
    <div style={{
      height: 48,
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      background: 'var(--bg-surface)',
      flexShrink: 0,
    }}>
      {/* Title + active dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <span style={{
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: 14, fontWeight: 600,
          color: 'var(--text-primary)',
        }}>{title}</span>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#16A34A', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: 12, color: 'var(--text-muted)',
          fontWeight: 400,
        }}>Active now</span>
      </div>

      {/* Notifications */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-muted)',
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontSize: 13, fontWeight: 400,
        padding: '6px 10px', borderRadius: 6,
        transition: 'color 0.12s, background 0.12s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--bg-hover)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-muted)'
        }}
      >
        <Bell size={15} />
        <span>Notifications</span>
      </button>
    </div>
  )
}
