import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAppStore } from '../../store/appStore'
import iconColor from '../../assets/icon-color.png'

export default function AppShell() {
  const { onboarded } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [hovered, setHovered] = useState(false)
  const isCoffeeDemo = location.pathname === '/coffee-co'

  if (!onboarded && !isCoffeeDemo) return <Navigate to="/onboarding" replace />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: 'var(--sb-width)',
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Shared top bar with Ask Fido AI button */}
        <div className="app-shell-topbar" style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '10px 24px',
          pointerEvents: 'none',
        }}>
          <button
            onClick={() => navigate('/chat')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              pointerEvents: 'all',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '7px 16px 7px 10px',
              background: '#E85D1A',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.01em',
              opacity: hovered ? 0.88 : 1,
              boxShadow: hovered
                ? '0 4px 16px rgba(232,93,26,0.45)'
                : '0 2px 8px rgba(232,93,26,0.28)',
              transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'opacity 0.15s, box-shadow 0.15s, transform 0.15s',
            }}
          >
            <img src={iconColor} alt="" style={{ width: 20, height: 20, display: 'block' }} />
            Ask Fido AI
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  )
}
