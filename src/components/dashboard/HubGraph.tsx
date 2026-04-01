import { useState } from 'react'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { SKILLS } from '../../data/skills'
import iconColor from '../../assets/icon-color.png'

// SVG viewBox center and orbit radius
const CX = 450
const CY = 230
const R_ORBIT = 170

// Hexagonal layout: each skill gets a fixed angle (degrees from positive x-axis)
// 0°=right, 90°=down, 180°=left, -90°=up
const SKILL_ANGLES: Record<string, number> = {
  'business-analysis': 180,   // far left
  'get-funded':         0,    // far right
  'incorporate':       -120,  // upper-left
  'build-website':     -60,   // upper-right
  'growth':            120,   // lower-left
  'pitch-deck':         60,   // lower-right
}

// Lucide-compatible SVG path data for each skill node (24x24 coordinate space)
// Rendered with vectorEffect="non-scaling-stroke" so stroke stays crisp
const SKILL_ICON: Record<string, ReactElement> = {
  'business-analysis': (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  'get-funded': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </>
  ),
  'incorporate': (
    <>
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </>
  ),
  'build-website': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </>
  ),
  'growth': (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  'pitch-deck': (
    <>
      <line x1="2" y1="3" x2="22" y2="3" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </>
  ),
}

interface NodeDef {
  id: string
  label: string
  x: number
  y: number
  color: string
  available: boolean
}

function buildNodes(): NodeDef[] {
  return SKILLS.map((skill) => {
    const deg = SKILL_ANGLES[skill.id] ?? 0
    const angle = (deg * Math.PI) / 180
    return {
      id: skill.id,
      label: skill.name,
      x: CX + R_ORBIT * Math.cos(angle),
      y: CY + R_ORBIT * Math.sin(angle),
      color: skill.color,
      available: skill.available,
    }
  })
}

// Split a label into at most two lines for long names
function splitLabel(label: string): [string, string | null] {
  const words = label.split(' ')
  if (words.length <= 2) return [label, null]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

export default function HubGraph() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)
  const nodes = buildNodes()

  return (
    <div style={{ width: '100%', position: 'relative', userSelect: 'none' }}>
      <svg
        viewBox="0 0 900 480"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E85D1A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E85D1A" stopOpacity="0" />
          </radialGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind center */}
        <circle cx={CX} cy={CY} r={90} fill="url(#hub-glow)" />

        {/* Spoke lines */}
        {nodes.map((node) => {
          const isHov = hovered === node.id
          return (
            <line
              key={`line-${node.id}`}
              x1={CX} y1={CY}
              x2={node.x} y2={node.y}
              stroke={node.available ? (isHov ? node.color : '#CCCCCA') : '#E5E5E3'}
              strokeWidth={isHov ? 1.5 : 1}
              strokeDasharray={node.available ? '5 4' : '3 5'}
              opacity={node.available ? 1 : 0.4}
              style={{
                transition: 'stroke 0.2s, stroke-width 0.2s',
                animation: node.available && isHov ? 'dash 0.6s linear infinite' : 'none',
              }}
            />
          )
        })}

        {/* Center hub node */}
        <circle cx={CX} cy={CY} r={36} fill="#111110" />
        <circle cx={CX} cy={CY} r={36} fill="none" stroke="#E85D1A" strokeWidth={1.5} opacity={0.6} />
        <image
          href={iconColor}
          x={CX - 18} y={CY - 18}
          width={36} height={36}
          style={{ pointerEvents: 'none' }}
        />
        <text
          x={CX} y={CY + 52}
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize={9}
          letterSpacing="2"
          fill="#888886"
        >
          FIDO
        </text>

        {/* Skill nodes */}
        {nodes.map((node) => {
          const isHov = hovered === node.id
          const opacity = node.available ? 1 : 0.38
          const iconColor2 = isHov ? '#FFFFFF' : (node.available ? node.color : '#888886')
          const scale = 0.54
          const offset = (24 * scale) / 2

          const [line1, line2] = splitLabel(node.label)

          return (
            <g
              key={node.id}
              style={{ cursor: node.available ? 'pointer' : 'default' }}
              onMouseEnter={() => node.available && setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => node.available && navigate(`/dashboard/skill/${node.id}`)}
            >
              {/* Hover ring */}
              {isHov && (
                <circle
                  cx={node.x} cy={node.y} r={30}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={1}
                  opacity={0.3}
                  filter="url(#node-glow)"
                />
              )}

              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y} r={22}
                fill={isHov ? node.color : '#FFFFFF'}
                stroke={isHov ? node.color : '#E5E5E3'}
                strokeWidth={isHov ? 0 : 1.5}
                opacity={opacity}
                style={{ transition: 'fill 0.2s, stroke 0.2s' }}
              />

              {/* Icon */}
              <g
                transform={`translate(${node.x - offset}, ${node.y - offset}) scale(${scale})`}
                fill="none"
                stroke={iconColor2}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={opacity}
                style={{ transition: 'stroke 0.2s', vectorEffect: 'non-scaling-stroke' } as React.CSSProperties}
              >
                {SKILL_ICON[node.id]}
              </g>

              {/* Label line 1 */}
              <text
                x={node.x}
                y={node.y + (line2 ? 38 : 41)}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontSize={11}
                fontWeight={600}
                fill={node.available ? '#111110' : '#888886'}
                opacity={opacity}
              >
                {line1}
              </text>

              {/* Label line 2 (if long name) */}
              {line2 && (
                <text
                  x={node.x}
                  y={node.y + 51}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize={11}
                  fontWeight={600}
                  fill={node.available ? '#111110' : '#888886'}
                  opacity={opacity}
                >
                  {line2}
                </text>
              )}

              {/* "soon" badge */}
              {!node.available && (
                <text
                  x={node.x}
                  y={node.y + (line2 ? 63 : 54)}
                  textAnchor="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize={9}
                  fill="#888886"
                  opacity={0.6}
                >
                  soon
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
