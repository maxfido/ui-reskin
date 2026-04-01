export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--orange)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontSize: 10, fontWeight: 700, color: '#fff',
      }}>F</div>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '4px 12px 12px 4px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 5, height: 5,
              borderRadius: '50%',
              background: 'var(--text-muted)',
              display: 'block',
              animation: `typing-dot 1.2s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
