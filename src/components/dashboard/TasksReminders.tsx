import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListChecks, Bell, ArrowRight, X, Check, Plus } from 'lucide-react'

interface Task {
  id: string
  title: string
  type: string
  reminderDate: string | null
  completed: boolean
}

interface Reminder {
  id: string
  title: string
  date: string
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Review & Approve Loan Offers',
    type: 'Open follow-up',
    reminderDate: 'Mon, May 4, 9:00 AM',
    completed: false,
  },
  {
    id: 't2',
    title: 'Upload last 3 months of bank statements',
    type: 'Document needed',
    reminderDate: 'Wed, May 6, 10:00 AM',
    completed: false,
  },
]

const INITIAL_REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Review & approve loan offers', date: 'Mon, May 4, 9:00 AM' },
  { id: 'r2', title: 'Upload bank statements', date: 'Wed, May 6, 10:00 AM' },
]

export default function TasksReminders() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS)
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)
  const [hoveredReminder, setHoveredReminder] = useState<string | null>(null)
  const [linkHovered, setLinkHovered] = useState(false)

  const openTasks = tasks.filter(t => !t.completed)

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t))
    setReminders(prev => {
      const task = tasks.find(t => t.id === id)
      if (!task) return prev
      return prev.filter(r => !r.title.toLowerCase().includes(task.title.toLowerCase().slice(0, 10)))
    })
  }

  const dismissReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  if (openTasks.length === 0 && reminders.length === 0) return null

  return (
    <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12, animation: 'fade-up 0.4s 0.04s ease both' }}>

      {/* Open Tasks */}
      {openTasks.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ListChecks size={15} color="var(--text-2)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Open tasks</span>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: 'var(--text)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '2px 10px',
              }}>
                {openTasks.length} open
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 8 }}>
              Durable follow-ups Fido is tracking across chat and the dashboard.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}>
                0 due soon
              </span>
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}>
                0 overdue
              </span>
            </div>
          </div>

          {/* Task items */}
          <div>
            {openTasks.map((task, i) => {
              const hov = hoveredTask === task.id
              return (
                <div
                  key={task.id}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < openTasks.length - 1 ? '1px solid var(--border)' : 'none',
                    background: hov ? 'var(--bg-elevated)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{task.title}</span>
                        <span style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 10,
                          background: 'rgba(37,99,235,0.08)', color: 'var(--blue)',
                          fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.04em',
                        }}>
                          Reminder linked
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{task.type}</div>
                      {task.reminderDate && (
                        <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500 }}>
                          Reminder {task.reminderDate}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => completeTask(task.id)}
                      style={{
                        flexShrink: 0,
                        padding: '5px 12px',
                        fontSize: 12, fontWeight: 500,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        background: hov ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', gap: 5,
                        marginTop: 2,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--green)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = hov ? 'var(--bg-surface)' : 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                    >
                      <Check size={11} strokeWidth={2.5} />
                      Complete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer link */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => navigate('/chat')}
              onMouseEnter={() => setLinkHovered(true)}
              onMouseLeave={() => setLinkHovered(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                color: linkHovered ? '#c94f16' : 'var(--orange)',
                transition: 'color 0.15s',
                padding: 0,
              }}
            >
              Review tasks with Fido
              <ArrowRight size={13} style={{ transition: 'transform 0.15s', transform: linkHovered ? 'translateX(3px)' : 'none' }} />
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      {reminders.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={14} color="var(--text-2)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Upcoming reminders</span>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex', borderRadius: 4, transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Plus size={15} />
            </button>
          </div>

          <div>
            {reminders.map((r, i) => {
              const hov = hoveredReminder === r.id
              return (
                <div
                  key={r.id}
                  onMouseEnter={() => setHoveredReminder(r.id)}
                  onMouseLeave={() => setHoveredReminder(null)}
                  style={{
                    padding: '13px 20px',
                    borderBottom: i < reminders.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    background: hov ? 'var(--bg-elevated)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.date}</div>
                  </div>
                  <button
                    onClick={() => dismissReminder(r.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
                      color: 'var(--text-muted)', padding: 4, borderRadius: 4, display: 'flex',
                      opacity: hov ? 1 : 0,
                      transition: 'opacity 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
