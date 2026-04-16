'use client';

import { useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useThemeShortcut(setTheme: (update: (prev: Theme) => Theme) => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 't' && e.key !== 'T') return;
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (target && target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setTheme]);
}
