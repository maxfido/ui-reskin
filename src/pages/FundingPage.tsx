import { useNavigate } from 'react-router-dom'
import { FileText, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react'

const HOW_IT_WORKS = [
  {
    icon: Sparkles,
    title: 'Tell Fido what you need',
    body: 'Share your funding goal, amount, and timeline. Fido builds your profile automatically from your connected accounts.',
  },
  {
    icon: ShieldCheck,
    title: 'Fido finds your best matches',
    body: 'We scan hundreds of lenders and products to surface the options most likely to approve you — at the best rates.',
  },
  {
    icon: Clock,
    title: 'We handle the application',
    body: 'Fido submits documents, follows up with lenders, and keeps you updated here in real time. You step in only when needed.',
  },
]

export default function FundingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '40px 48px', maxWidth: 780, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 48, animation: 'fade-up 0.4s ease both' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: 6,
        }}>
          Home base
        </div>
        <h1 style={{
          fontFamily: 'Platypi, serif',
          fontSize: 28, fontWeight: 600,
          color: 'var(--text)', letterSpacing: '-0.03em',
          lineHeight: 1.2, marginBottom: 10,
        }}>
          Loan Application Center
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 520 }}>
          Fido monitors your applications in real time — tracking lender activity, submitting documents, and alerting you when you need to step in.
        </p>
      </div>

      <div style={{ animation: 'fade-up 0.4s 0.06s ease both' }}>

        {/* No applications card */}
        <div className="card" style={{
          padding: '52px 40px',
          textAlign: 'center',
          marginBottom: 28,
          border: '1.5px dashed var(--border-strong)',
        }}>
          <div style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <FileText size={20} color="var(--text-muted)" />
          </div>
          <h2 style={{
            fontFamily: 'Platypi, serif',
            fontSize: 20, fontWeight: 600,
            color: 'var(--text)', letterSpacing: '-0.02em',
            marginBottom: 8,
          }}>
            No applications yet
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 380, margin: '0 auto 28px' }}>
            When you start a funding application, Fido will track every step here — from submission to approval.
          </p>
          <button
            className="btn btn-primary"
            style={{ fontSize: 14, padding: '11px 24px', display: 'inline-flex', gap: 8 }}
            onClick={() => navigate('/dashboard/skill/get-funded')}
          >
            Start my first application <ArrowRight size={14} />
          </button>
        </div>

        {/* How it works */}
        <div style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9, letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 14,
        }}>
          How it works
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="card" style={{ padding: '22px 20px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--orange-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <Icon size={14} color="var(--orange)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  {step.title}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {step.body}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
