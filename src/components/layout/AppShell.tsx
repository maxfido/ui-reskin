import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAppStore } from '../../store/appStore'

export default function AppShell() {
  const { onboarded } = useAppStore()
  if (!onboarded) return <Navigate to="/onboarding" replace />

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
        <Outlet />
      </main>
    </div>
  )
}
