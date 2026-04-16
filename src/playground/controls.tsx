'use client';

interface ControlsProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Controls({ theme, onThemeChange }: ControlsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border-default)',
        background: 'var(--color-surface-sunken)',
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-content-primary)',
          fontFamily: 'var(--font-family)',
        }}
      >
        Notion Mail — Email Row Playground
      </span>
      <div style={{ flex: 1 }} />
      <button
        onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
        style={{
          padding: '4px 12px',
          borderRadius: 6,
          border: '1px solid var(--color-border-default)',
          background: 'var(--color-surface-base)',
          color: 'var(--color-content-primary)',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
        }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}
