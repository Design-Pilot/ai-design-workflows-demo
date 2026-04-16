'use client';

import { useState } from 'react';
import { Controls } from '../playground/controls';
import { EmailRowPreview } from '../playground/email-row-preview';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--color-surface-base)' }}>
      <Controls theme={theme} onThemeChange={setTheme} />
      <div style={{ padding: '24px 40px' }}>
        <EmailRowPreview theme={theme} />
      </div>
    </div>
  );
}
