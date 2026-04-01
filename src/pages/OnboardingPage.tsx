import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Sparkles, ShieldCheck, Link } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import logo from '../assets/logo.png'

const INDUSTRIES = ['Retail', 'Food & Beverage', 'Professional Services', 'Construction', 'Healthcare', 'Technology', 'Other']

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { setProfile, setOnboarded } = useAppStore()

  const [step, setStep] = useState<Step>(1)
  const [type, setType] = useState<'existing' | 'new' | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [bankLinked, setBankLinked] = useState(false)

  const canProceedStep1 = type !== null
  const canProceedStep2 = businessName.trim() && ownerName.trim() && industry && city.trim() && state.trim() && zip.trim()

  const handleFinish = () => {
    setProfile({ type, businessName, ownerName, industry, website, city, state, zip, bankLinked })
    setOnboarded(true)
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 36 }}>
        <img src={logo} alt="Fido Financial" style={{ height: 28, width: 'auto' }} />
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 520, overflow: 'hidden' }}>
        {/* Progress */}
        <div style={{
          padding: '20px 40px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                height: 3,
                flex: 1,
                borderRadius: 2,
                background: s <= step ? 'var(--text)' : 'var(--border)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        <div style={{ padding: '36px 40px 40px' }}>

          {/* ── STEP 1: Business type ── */}
          {step === 1 && (
            <div style={{ animation: 'fade-up 0.3s ease both' }}>
              <div className="input-label" style={{ marginBottom: 4 }}>Step 1 of 3</div>
              <h2 style={{
                fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 600,
                color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 8,
              }}>
                Tell me about your business.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                I'll personalize your experience based on where you are.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                {[
                  { val: 'existing' as const, icon: Briefcase, label: 'I have an existing business', sub: 'Up and running' },
                  { val: 'new' as const, icon: Sparkles, label: "I'm starting a new business", sub: 'Just getting started' },
                ].map(opt => {
                  const selected = type === opt.val
                  return (
                    <button
                      key={opt.val}
                      onClick={() => setType(opt.val)}
                      style={{
                        padding: '22px 18px',
                        border: `1.5px solid ${selected ? 'var(--text)' : 'var(--border)'}`,
                        borderRadius: 6,
                        background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color 0.15s, background 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <opt.icon size={18} color={selected ? 'var(--text)' : 'var(--text-muted)'} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{opt.sub}</div>
                      </div>
                      {selected && (
                        <div style={{
                          alignSelf: 'flex-end',
                          width: 16, height: 16, borderRadius: '50%',
                          background: 'var(--text)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                className="btn btn-primary"
                disabled={!canProceedStep1}
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Business info ── */}
          {step === 2 && (
            <div style={{ animation: 'fade-up 0.3s ease both' }}>
              <div className="input-label" style={{ marginBottom: 4 }}>Step 2 of 3</div>
              <h2 style={{
                fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 600,
                color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 8,
              }}>
                A bit about you.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                Fido uses this to personalize your experience and address you properly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
                <div>
                  <label className="input-label">Business Name *</label>
                  <input
                    className="input-line"
                    placeholder="Acme Co."
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Your Name *</label>
                  <input
                    className="input-line"
                    placeholder="Jane Smith"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Industry *</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    style={{
                      width: '100%', border: 'none',
                      borderBottom: '1.5px solid var(--border-strong)',
                      background: 'transparent', padding: '10px 0',
                      fontFamily: 'Inter, sans-serif', fontSize: 15,
                      color: industry ? 'var(--text)' : 'var(--text-muted)',
                      outline: 'none', cursor: 'pointer',
                      appearance: 'none',
                    }}
                  >
                    <option value="" disabled>Select industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Website <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: 10 }}>(optional)</span></label>
                  <input
                    className="input-line"
                    placeholder="https://yourbusiness.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">City *</label>
                  <input
                    className="input-line"
                    placeholder="San Francisco"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="input-label">State *</label>
                    <input
                      className="input-line"
                      placeholder="CA"
                      maxLength={2}
                      value={state}
                      onChange={e => setState(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <label className="input-label">ZIP Code *</label>
                    <input
                      className="input-line"
                      placeholder="94103"
                      maxLength={10}
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ padding: '13px 20px' }}>← Back</button>
                <button
                  className="btn btn-primary"
                  disabled={!canProceedStep2}
                  style={{ flex: 1, justifyContent: 'center', padding: '13px' }}
                  onClick={() => setStep(3)}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Bank link ── */}
          {step === 3 && (
            <div style={{ animation: 'fade-up 0.3s ease both' }}>
              <div className="input-label" style={{ marginBottom: 4 }}>Step 3 of 3</div>
              <h2 style={{
                fontFamily: 'Platypi, serif', fontSize: 22, fontWeight: 600,
                color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 8,
              }}>
                Connect your bank account.
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                Fido works best when it can see your numbers.
              </p>

              {/* Why connect card */}
              <div style={{
                background: 'var(--blue-soft)',
                border: '1px solid rgba(37,99,235,0.14)',
                borderRadius: 6,
                padding: '16px 18px',
                marginBottom: 28,
                display: 'flex',
                gap: 12,
              }}>
                <ShieldCheck size={16} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>Why connect?</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                    Fido uses your transaction data to run financial analysis, surface insights, and build your funding profile. Your data is <strong>read-only</strong> and never shared with third parties.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', gap: 8 }}
                  onClick={() => setBankLinked(true)}
                >
                  <Link size={14} />
                  {bankLinked ? '✓ Bank connected' : 'Connect with Plaid →'}
                </button>
                {bankLinked && (
                  <div style={{
                    textAlign: 'center', fontSize: 12,
                    color: 'var(--green)', fontFamily: 'IBM Plex Mono, monospace',
                  }}>
                    Chase ···· 4821 connected
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)} style={{ padding: '13px 20px' }}>← Back</button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '13px', fontSize: 15 }}
                  onClick={handleFinish}
                >
                  Let's Get Started!
                </button>
              </div>

              {!bankLinked && (
                <div style={{ textAlign: 'center', marginTop: 14 }}>
                  <button
                    onClick={handleFinish}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 13, color: 'var(--text-muted)',
                      textDecoration: 'underline',
                    }}
                  >
                    Skip for now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
