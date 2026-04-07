import { X } from 'lucide-react'
import iconColor from '../../assets/icon-color.png'

interface Props {
  onClose: () => void
}

const FIDO_ORANGE = '#E85D1A'

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '36px 0' }} />
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 18, marginTop: 4 }}>
      <span style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
        color: FIDO_ORANGE,
        letterSpacing: '0.08em',
        minWidth: 22,
        flexShrink: 0,
        opacity: 0.85,
      }}>{number}</span>
      <h3 style={{
        fontFamily: 'Platypi, serif',
        fontSize: 17,
        fontWeight: 600,
        color: 'var(--text)',
        letterSpacing: '0.01em',
        textTransform: 'uppercase',
        margin: 0,
      }}>{title}</h3>
    </div>
  )
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 14,
      color: 'var(--text)',
      lineHeight: 1.8,
      marginBottom: 12,
      marginLeft: 38,
    }}>{children}</p>
  )
}

function FidoAnnotation({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      borderLeft: `3px solid ${FIDO_ORANGE}`,
      paddingLeft: 14,
      marginTop: 14,
      marginLeft: 38,
    }}>
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
        <img src={iconColor} width={13} height={13} style={{ marginTop: 3, flexShrink: 0 }} />
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{children}</p>
      </div>
    </div>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div style={{ marginLeft: 38 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 4 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                textAlign: h === headers[0] ? 'left' : 'right',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                paddingBottom: 9,
                borderBottom: '1px solid var(--border)',
                fontWeight: 500,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-elevated)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '8px 0',
                  textAlign: j === 0 ? 'left' : 'right',
                  color: 'var(--text)',
                  fontWeight: j === row.length - 1 && typeof cell === 'string' && cell.startsWith('$') ? 600 : 400,
                  borderBottom: '1px solid var(--border)',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KeyValueGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 0,
      marginTop: 14,
      marginLeft: 38,
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '9px 14px',
          background: i % 2 === 0 ? 'transparent' : 'var(--bg-elevated)',
          borderBottom: i < rows.length - 2 ? '1px solid var(--border)' : 'none',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

export default function BusinessPlanModal({ onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 14,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Document cover */}
        <div style={{
          padding: '40px 52px 32px',
          borderBottom: `3px solid ${FIDO_ORANGE}`,
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4, display: 'flex',
            }}
          >
            <X size={17} />
          </button>

          {/* Prepared by */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginBottom: 32,
          }}>
            <img src={iconColor} width={14} height={14} />
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}>
              Prepared with Fido · Confidential
            </span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}>
              Business Plan
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Platypi, serif',
            fontSize: 34,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            lineHeight: 1.12,
            marginBottom: 12,
          }}>
            Maple & Main Coffee Co.
          </h1>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 16px',
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 28,
            alignItems: 'center',
          }}>
            <span>South Congress Ave, Austin, TX 78704</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Est. Q1 2025</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Specialty Coffee & Cafe</span>
          </div>

          {/* Summary metrics row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {[
              { label: 'Funding Request', value: '$85,000' },
              { label: 'Year 1 Revenue', value: '$312,000' },
              { label: 'Gross Margin', value: '61%' },
              { label: 'Break-even', value: '14 mo.' },
            ].map((m, i) => (
              <div key={m.label} style={{
                padding: '14px 18px',
                background: 'var(--bg-elevated)',
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>{m.label}</div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '-0.02em',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Document body */}
        <div style={{ padding: '36px 52px 48px' }}>

          {/* 1. Executive Summary */}
          <SectionTitle number="01" title="Executive Summary" />
          <BodyText>
            Maple & Main Coffee Co. is a specialty coffee shop and community workspace located on South Congress Avenue in Austin, Texas. The company will offer ethically sourced single-origin espresso beverages, seasonal pour-overs, and locally produced pastries in an environment intentionally designed to serve the corridor's growing population of remote professionals and daily neighborhood patrons.
          </BodyText>
          <BodyText>
            The business seeks $85,000 in startup capital, to be secured through an SBA 7(a) loan, to fund leasehold improvements, equipment procurement, and six months of operating reserves. The company is projected to reach profitability in month 14 and generate $312,000 in gross revenue in its first full year of operation.
          </BodyText>
          <FidoAnnotation>
            Austin's specialty coffee market grew 18% year-over-year in 2024. The South Congress corridor attracts approximately 14,000 daily foot-traffic visitors, and the target demographic — adults aged 25–44 employed in remote or hybrid roles — represents the fastest-growing residential segment in the 78704 zip code.
          </FidoAnnotation>

          <Divider />

          {/* 2. Company Overview */}
          <SectionTitle number="02" title="Company Overview" />
          <BodyText>
            Maple & Main Coffee Co. will be incorporated as a Texas Limited Liability Company (LLC). The company will operate a single leased retail location of approximately 1,400 square feet, including a 12-seat bar, communal work tables, and a private meeting nook available by reservation. Hours of operation will be 6:30 a.m. to 7:00 p.m. daily.
          </BodyText>

          <KeyValueGrid rows={[
            ['Legal Entity', 'Texas LLC'],
            ['EIN Status', 'Pending registration'],
            ['Location', 'South Congress Ave, Austin TX'],
            ['Square Footage', '~1,400 sq ft'],
            ['Seats', '42 (bar, tables, nook)'],
            ['FTE at Launch', '4 (owner + 3 baristas)'],
          ]} />

          <Divider />

          {/* 3. Products & Services */}
          <SectionTitle number="03" title="Products & Services" />
          <BodyText>
            Revenue will be generated across four categories. Espresso and drip coffee will serve as the primary revenue driver, supplemented by specialty seasonal beverages, a food program built on a local bakery partnership, and a retail channel offering whole-bean bags and branded merchandise.
          </BodyText>

          <Table
            headers={['Revenue Stream', 'Est. Yr 1 Revenue', '% of Mix', 'Gross Margin']}
            rows={[
              ['Espresso & Drip Coffee', '$162,240', '52%', '68%'],
              ['Specialty Beverages', '$65,520', '21%', '72%'],
              ['Food & Pastries', '$56,160', '18%', '38%'],
              ['Retail & Merchandise', '$28,080', '9%', '72%'],
              ['Total', '$312,000', '100%', '61%'],
            ]}
          />
          <FidoAnnotation>
            Retail whole-bean sales carry a 72% gross margin and scale with zero additional headcount. Fido recommends building an e-commerce add-on in Year 2 to extend this channel beyond in-store foot traffic.
          </FidoAnnotation>

          <Divider />

          {/* 4. Market Analysis */}
          <SectionTitle number="04" title="Market Analysis" />
          <BodyText>
            The U.S. specialty coffee market is valued at approximately $47.5 billion and is projected to grow at a CAGR of 11.2% through 2030 (Grand View Research, 2024). Austin's food and beverage sector has outpaced national growth rates for three consecutive years, driven by sustained in-migration from higher-cost metros.
          </BodyText>
          <BodyText>
            The primary competitive threat on South Congress consists of two established independent operators and one regional chain. Maple & Main will differentiate on sourcing transparency, workspace amenability, and community programming — dimensions on which existing operators underinvest.
          </BodyText>

          <Divider />

          {/* 5. Financial Projections */}
          <SectionTitle number="05" title="Financial Projections" />

          <Table
            headers={['', 'Year 1', 'Year 2', 'Year 3']}
            rows={[
              ['Gross Revenue', '$312,000', '$378,000', '$441,000'],
              ['Cost of Goods Sold', '$121,680', '$147,420', '$172,000'],
              ['Gross Profit', '$190,320', '$230,580', '$269,000'],
              ['Operating Expenses', '$198,400', '$204,000', '$210,000'],
              ['EBITDA', '($8,080)', '$26,580', '$59,000'],
              ['Net Income', '($11,200)', '$19,100', '$48,500'],
            ]}
          />
          <FidoAnnotation>
            Year 1 operates at a modest loss as the business ramps toward stabilized revenue. Based on comparable Austin cafe openings, Fido projects Month 14 as break-even — consistent with the 12–18 month range typical for this format and market.
          </FidoAnnotation>

          <Divider />

          {/* 6. Funding Request */}
          <SectionTitle number="06" title="Funding Request" />
          <BodyText>
            The company is requesting $85,000 in debt financing via an SBA 7(a) loan. Funds will be deployed as follows:
          </BodyText>

          <Table
            headers={['Use of Capital', 'Amount', '% of Total']}
            rows={[
              ['Leasehold improvements & buildout', '$38,000', '45%'],
              ['Equipment (espresso, grinders, POS)', '$22,000', '26%'],
              ['Working capital reserve (6 months)', '$12,000', '14%'],
              ['Opening inventory & supplies', '$9,000', '11%'],
              ['Permits, legal & contingency', '$4,000', '5%'],
              ['Total', '$85,000', '100%'],
            ]}
          />
          <FidoAnnotation>
            You qualify for an SBA 7(a) loan up to $150,000 at the current variable rate of approximately 10.5%. Fido can prepare and submit your complete loan package — typical approval for amounts under $100,000 takes 30 to 45 business days.
          </FidoAnnotation>

          <Divider />

          {/* 7. Action Plan */}
          <SectionTitle number="07" title="Action Plan" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginLeft: 38 }}>
            {[
              { n: '1', action: 'File Texas LLC formation documents', timeline: 'Week 1', skill: 'Incorporate' },
              { n: '2', action: 'Obtain EIN from IRS', timeline: 'Week 1', skill: 'Incorporate' },
              { n: '3', action: 'Submit SBA 7(a) loan application', timeline: 'Week 2', skill: 'Get Funded' },
              { n: '4', action: 'Execute commercial lease agreement', timeline: 'Week 3–4', skill: null },
              { n: '5', action: 'Build business website and online ordering', timeline: 'Month 2', skill: 'Build My Website' },
              { n: '6', action: 'Create investor / bank pitch deck', timeline: 'Month 2', skill: 'Create Pitch Deck' },
            ].map(r => (
              <div key={r.n} style={{
                display: 'grid',
                gridTemplateColumns: '22px 1fr auto auto',
                alignItems: 'center',
                gap: 14,
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  opacity: 0.6,
                }}>{r.n}</span>
                <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{r.action}</span>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>{r.timeline}</span>
                {r.skill ? (
                  <span style={{
                    fontSize: 10,
                    fontFamily: 'IBM Plex Mono, monospace',
                    color: FIDO_ORANGE,
                    background: 'rgba(232,93,26,0.07)',
                    border: '1px solid rgba(232,93,26,0.18)',
                    borderRadius: 4,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                  }}>{r.skill}</span>
                ) : <span />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 44,
            paddingTop: 22,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={iconColor} width={16} height={16} />
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
              }}>
                GENERATED BY FIDO · CONFIDENTIAL
              </span>
            </div>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: 'var(--text-muted)' }}>
              April 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
