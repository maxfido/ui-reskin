import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Banknote, Building2, TrendingUp, ArrowRight } from 'lucide-react'
import type { Skill } from '../../data/skills'

const ICONS: Record<string, React.ElementType> = {
  BarChart3, Banknote, Building2, TrendingUp,
}

export default function SkillCard({ skill }: { skill: Skill }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const Icon = ICONS[skill.icon] ?? BarChart3

  return (
    <div
      onClick={() => skill.available && navigate(`/dashboard/skill/${skill.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered && skill.available ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius: 6,
        padding: '28px 28px 24px',
        cursor: skill.available ? 'pointer' : 'default',
        opacity: skill.available ? 1 : 0.5,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered && skill.available ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Icon + availability badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40,
          background: skill.available ? `${skill.color}12` : 'var(--bg-elevated)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={skill.available ? skill.color : 'var(--text-muted)'} />
        </div>
        {!skill.available && (
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'var(--bg-elevated)',
            padding: '3px 8px',
            borderRadius: 3,
          }}>
            Soon
          </span>
        )}
      </div>

      {/* Text */}
      <div>
        <div style={{
          fontFamily: 'Platypi, serif',
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--text)',
          marginBottom: 6,
          letterSpacing: '-0.02em',
        }}>
          {skill.name}
        </div>
        <div style={{
          fontSize: 13,
          color: 'var(--text-muted)',
          lineHeight: 1.55,
        }}>
          {skill.description}
        </div>
      </div>

      {/* CTA */}
      {skill.available && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 4,
          fontSize: 13,
          fontWeight: 600,
          color: hovered ? skill.color : 'var(--text-2)',
          transition: 'color 0.15s',
        }}>
          Open
          <ArrowRight size={13} style={{ transition: 'transform 0.15s', transform: hovered ? 'translateX(3px)' : 'none' }} />
        </div>
      )}
    </div>
  )
}
