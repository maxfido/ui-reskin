import { useState } from 'react'
import { motion } from 'framer-motion'
import type { UserProfile } from '../types'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

const inputStyle = {
  width: '100%', padding: '10px 13px',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-strong)',
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'IBM Plex Sans, sans-serif',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle = {
  display: 'block',
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 9,
  fontWeight: 500,
  color: 'var(--text-muted)',
  marginBottom: 6,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
}

interface Props {
  onSubmit?: (profile: UserProfile) => void
}

type BusinessType = 'existing' | 'new'

export default function FundingForm({ onSubmit }: Props) {
  const [bizType, setBizType] = useState<BusinessType>('existing')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessWebsite, setBusinessWebsite] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  const canSubmit = firstName.trim() && lastName.trim() && businessName.trim() && city.trim() && state && zip.trim()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit?.({ firstName, lastName, businessName, businessWebsite, city, state, zip })
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      background: 'var(--bg-base)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 720,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        }}
      >
        {/* ── Toggle: Existing / New Business ── */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-strong)',
        }}>
          {(['existing', 'new'] as BusinessType[]).map((type) => {
            const isActive = bizType === type
            const label = type === 'existing' ? 'Existing Business' : 'New Business'
            return (
              <button
                key={type}
                onClick={() => setBizType(type)}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  border: 'none',
                  borderRight: type === 'existing' ? '1px solid var(--border-strong)' : 'none',
                  borderBottom: isActive ? '2px solid var(--ink)' : '2px solid transparent',
                  background: isActive ? 'var(--ink)' : 'var(--bg-elevated)',
                  color: isActive ? 'var(--cream)' : 'var(--text-muted)',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                  letterSpacing: '-0.01em',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* First + Last name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Max"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#16A34A')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Ruskowski"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#16A34A')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
                />
              </div>
            </div>

            {/* Business name */}
            <div>
              <label style={labelStyle}>Business Name</label>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Sweet Paws Bakery"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#16A34A')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
              />
            </div>

            {/* Business website */}
            <div>
              <label style={labelStyle}>
                Business Website{' '}
                <span style={{ fontWeight: 300, opacity: 0.65, letterSpacing: '0.04em', textTransform: 'none', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 11 }}>
                  (optional)
                </span>
              </label>
              <input
                value={businessWebsite}
                onChange={e => setBusinessWebsite(e.target.value)}
                placeholder="yourcompany.com"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#16A34A')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
              />
            </div>

            {/* City / State / Zip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Austin"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#16A34A')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
                />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none' as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234A3C2E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: 32,
                    cursor: 'pointer',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#16A34A')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
                >
                  <option value="">Select</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Zip Code</label>
                <input
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  placeholder="e.g. 78701"
                  maxLength={10}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#16A34A')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border-strong)')}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit}
              style={{ marginTop: 6 }}
            >
              Let's Go!
            </button>

          </div>
        </form>
      </motion.div>
    </div>
  )
}
