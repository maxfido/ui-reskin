import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import logo from '../assets/logo.png'

export default function WelcomePage() {
  const navigate = useNavigate()
  const { onboarded } = useAppStore()
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (onboarded) navigate('/dashboard', { replace: true })
  }, [onboarded, navigate])

  if (onboarded) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>
      {/* Privacy link — bottom-right corner */}
      <a
        href="#"
        onClick={e => e.preventDefault()}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 24,
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 11,
          letterSpacing: '0.08em',
          color: 'var(--text-2)',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          transition: 'color 0.15s',
          zIndex: 200,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
      >
        Privacy Policy
      </a>

      {/* Logo */}
      <div style={{ marginBottom: 48, animation: 'fade-up 0.5s ease both', animationFillMode: 'both' }}>
        <img src={logo} alt="Fido Financial" style={{ height: 36, width: 'auto' }} />
      </div>

      {/* Greeting card */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '40px 44px 44px',
          animation: 'fade-up 0.5s 0.1s ease both',
        }}
      >
        {/* Fido status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 10, height: 10 }}>
            <span style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: 'var(--green)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
          </div>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--green)',
          }}>
            Fido is online
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--text)',
          lineHeight: 1.25,
          letterSpacing: '-0.025em',
          marginBottom: 12,
        }}>
          Hi, I'm Fido — your AI business partner.
        </h1>

        <p style={{
          fontSize: 15,
          color: 'var(--text-2)',
          lineHeight: 1.65,
          marginBottom: 28,
        }}>
          I help small businesses get funded, understand their finances, and grow — without the complexity of doing it alone.
        </p>

        {/* Terms checkbox */}
        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 24,
          cursor: 'pointer',
        }}>
          <div
            onClick={() => setAgreed(a => !a)}
            style={{
              width: 16, height: 16,
              borderRadius: 3,
              border: `1.5px solid ${agreed ? 'var(--text)' : 'var(--border-strong)'}`,
              background: agreed ? 'var(--text)' : 'transparent',
              flexShrink: 0,
              marginTop: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, border-color 0.15s',
              cursor: 'pointer',
            }}
          >
            {agreed && (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            I agree to Fido's{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-2)', fontWeight: 600, textDecoration: 'underline' }}>
              Terms of Service
            </a>
            ,{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-2)', fontWeight: 600, textDecoration: 'underline' }}>
              Data Usage Policy
            </a>
            , and{' '}
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--text-2)', fontWeight: 600, textDecoration: 'underline' }}>
              Privacy Statement
            </a>
            . Fido may use my business data to provide AI-powered insights.
          </span>
        </label>

        <button
          className="btn btn-primary-lg"
          disabled={!agreed}
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => navigate('/onboarding')}
        >
          Get Started →
        </button>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-2)', fontWeight: 600,
                textDecoration: 'underline', padding: 0,
              }}
            >
              Sign in
            </button>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 40,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
        animation: 'fade-up 0.5s 0.2s ease both',
      }}>
        SBA Fintech Inc. · Fido Financial
      </div>
    </div>
  )
}
