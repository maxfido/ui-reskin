import { useState } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import FundingForm from './components/FundingForm'
import ChatBar from './components/ChatBar'
import type { Section, UserProfile } from './types'

const SECTION_TITLES: Record<Section, string> = {
  funding: 'Home',
  accounts: 'Connected Accounts',
  plan: 'Free Plan',
}

function PlaceholderView({ title }: { title: string }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)',
      fontFamily: 'IBM Plex Mono, monospace',
      fontSize: 11, letterSpacing: '0.08em',
    }}>
      {title} — coming soon
    </div>
  )
}

export default function App() {
  const [section, setSection] = useState<Section>('funding')
  const [user, setUser] = useState<UserProfile | null>(null)

  function handleFormSubmit(profile: UserProfile) {
    setUser(profile)
    console.log('Let\'s Go!', profile)
  }

  const firstName = user?.firstName || 'Max'

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: 'var(--bg-base)',
      overflow: 'hidden',
    }}>
      <Sidebar
        active={section}
        onChange={setSection}
        firstName={firstName}
      />

      {/* Main content column */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflow: 'hidden',
      }}>
        <TopBar title={SECTION_TITLES[section]} />

        {/* Scrollable content area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {section === 'funding' && (
            <FundingForm onSubmit={handleFormSubmit} />
          )}
          {section === 'accounts' && (
            <PlaceholderView title="Connected Accounts" />
          )}
          {section === 'plan' && (
            <PlaceholderView title="Free Plan" />
          )}
        </div>

        <ChatBar />
      </div>
    </div>
  )
}
