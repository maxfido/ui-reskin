import { Home, Building2, CreditCard, ChevronRight } from 'lucide-react'
import type { Section } from '../types'

interface Props {
  active: Section
  onChange: (s: Section) => void
  firstName?: string
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

export { US_STATES }

export default function Sidebar({ active, onChange, firstName = 'Max' }: Props) {
  const initials = firstName.charAt(0).toUpperCase()

  const navItem = (id: Section, icon: React.ReactNode, label: string) => {
    const isActive = active === id
    return (
      <button
        key={id}
        onClick={() => onChange(id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 10px', height: 36, width: '100%', textAlign: 'left',
          borderRadius: 6, border: 'none', cursor: 'pointer',
          fontFamily: 'IBM Plex Sans, sans-serif',
          fontSize: 13, fontWeight: isActive ? 500 : 400,
          background: isActive ? 'var(--sb-active)' : 'transparent',
          color: isActive ? 'var(--sb-active-text)' : 'var(--sb-muted)',
          transition: 'background 0.12s, color 0.12s',
          position: 'relative',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'var(--sb-hover)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--sb-muted)'
          }
        }}
      >
        {isActive && (
          <div style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%',
            width: 2, borderRadius: 2, background: 'var(--ink)',
          }} />
        )}
        <span style={{ opacity: isActive ? 1 : 0.55, flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
      </button>
    )
  }

  return (
    <aside style={{
      width: 220, minWidth: 220,
      background: 'var(--sb-bg)',
      borderRight: '1px solid var(--sb-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>

      {/* ── Logo lockup ── */}
      <div style={{
        padding: '20px 18px 18px',
        borderBottom: '1px solid var(--sb-border)',
      }}>
        <div>
          <div>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 300,
              fontSize: 15,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              lineHeight: 1.2,
              position: 'relative',
              display: 'inline-block',
            }}>
              Fido Financial.
              <sup style={{
                fontSize: 6, fontWeight: 300,
                position: 'absolute', top: 0, right: -7,
                color: 'var(--ink)', opacity: 0.4,
                letterSpacing: 0, lineHeight: 1,
              }}>™</sup>
            </div>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 300,
              fontSize: 7,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--sb-muted)',
              lineHeight: 1,
              marginTop: 3,
            }}>
              Stop Working For The Man
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItem('funding',  <Home      size={14} />, 'Apply for Funding')}
        {navItem('accounts', <Building2 size={14} />, 'Connected Accounts')}
        {navItem('plan',     <CreditCard size={14} />, 'Free Plan')}

        {/* Coming soon */}
        <div style={{
          margin: '14px 2px 4px',
          display: 'flex', alignItems: 'center', gap: 6,
          cursor: 'default',
        }}>
          <ChevronRight size={10} style={{ color: 'var(--sb-muted)', opacity: 0.5 }} />
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 9, fontWeight: 400, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--sb-muted)', opacity: 0.6,
          }}>Coming Soon</span>
        </div>
      </nav>

      {/* ── User footer ── */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--sb-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 12, fontWeight: 500, color: '#fff',
            flexShrink: 0,
          }}>{initials}</div>
          <div style={{
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: 13, color: 'var(--text-primary)', fontWeight: 500,
          }}>
            {firstName}
          </div>
        </div>
      </div>
    </aside>
  )
}
