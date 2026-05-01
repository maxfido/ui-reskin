import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Banknote, Building2, TrendingUp, Presentation, Globe, ArrowRight } from 'lucide-react'
import type { Skill } from '../../data/skills'

const ICONS: Record<string, React.ElementType> = {
  BarChart3, Banknote, Building2, TrendingUp, Presentation, Globe,
}

export default function SkillCard({ skill }: { skill: Skill }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const Icon = ICONS[skill.icon] ?? BarChart3

  return (
    <div
      onClick={() => skill.available && navigate(`/dashboard/skill/${skill.id}`)}
      onMouseEnter={() => skill.available && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '18px 20px',
        borderRadius: 20,
        border: hovered
          ? `1.5px solid ${skill.color}`
          : '1.5px solid var(--border)',
        background: hovered ? `${skill.color}0d` : 'var(--bg-surface)',
        cursor: skill.available ? 'pointer' : 'default',
        transition: 'border-color 0.18s, background 0.18s, box-shadow 0.18s, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hovered ? 'scale(1.015)' : 'scale(1)',
        boxShadow: hovered ? `0 4px 18px ${skill.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
        opacity: skill.available ? 1 : 0.55,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        background: hovered ? `${skill.color}20` : skill.available ? `${skill.color}12` : 'var(--bg-elevated)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        marginTop: 1,
        transition: 'background 0.18s',
      }}>
        <Icon
          size={17}
          color={skill.available ? skill.color : 'var(--text-muted)'}
          style={{ transition: 'transform 0.18s', transform: hovered ? 'scale(1.15)' : 'scale(1)' }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: hovered ? skill.color : 'var(--text)',
            transition: 'color 0.15s',
          }}>
            {skill.name}
          </div>
          {skill.available ? (
            <ArrowRight
              size={13}
              color={hovered ? skill.color : 'var(--text-muted)'}
              style={{ flexShrink: 0, transition: 'transform 0.18s, color 0.15s', transform: hovered ? 'translateX(3px)' : 'none' }}
            />
          ) : (
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 9, letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}>
              Soon
            </span>
          )}
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          {skill.description}
        </div>
      </div>
    </div>
  )
}
