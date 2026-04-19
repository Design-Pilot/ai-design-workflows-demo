'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TagButton, type TagColor } from '@/components/tag-button/tag-button';
import { ControlRow, DemoRow } from '@/app/docs/_shared/docs-ui';
import styles from './page.module.css';

const TOC_ITEMS = [
  { id: 'interactive-preview', label: 'Interactive Preview' },
  { id: 'variants', label: 'Variants' },
  { id: 'used-in', label: 'Used In' },
  { id: 'api', label: 'API' },
] as const;

const API_PROPS: Array<{
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}> = [
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Text content of the tag. Truncates with an ellipsis when wider than 120px.',
  },
  {
    name: 'color',
    type: "'neutral' | 'yellow' | 'green' | 'blue' | 'brown'",
    default: "'neutral'",
    description:
      'Visual color variant. Each maps to a surface + content token pair from the tag color scale.',
  },
];

const COLORS: TagColor[] = ['neutral', 'yellow', 'green', 'blue', 'brown'];

const USED_IN: Array<{ name: string; href: string | null }> = [
  { name: 'Email Row', href: '/docs/components/email-row' },
];

const DEFAULT: { label: string; color: TagColor } = {
  label: 'Work',
  color: 'neutral',
};

export default function TagButtonDocs() {
  const [state, setState] = useState(DEFAULT);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<string>(TOC_ITEMS[0].id);

  useEffect(() => {
    function onScroll() {
      const threshold = 140;
      let active = TOC_ITEMS[0].id as string;
      for (const { id } of TOC_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) active = id;
      }
      setActiveSection(active);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function patch<K extends keyof typeof DEFAULT>(key: K, value: (typeof DEFAULT)[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <p className={styles.breadcrumb}>Atoms</p>
          <h1 className={styles.title}>Tag Button</h1>
          <p className={styles.description}>
            A small colored label chip used to categorize or tag content. Supports five color
            variants mapped to the tag token scale and truncates long text with an ellipsis.
          </p>
        </header>

        <div className={styles.divider} />

        {/* ── Interactive Preview ── */}
        <section id="interactive-preview" className={styles.section}>
          <h2 className={styles.sectionTitle}>Interactive Preview</h2>
          <p className={styles.sectionSubtitle}>
            Use the controls below to customize every prop in real time.
          </p>

          <div className={styles.previewOuter}>
            <div className={styles.previewToolbar}>
              <div className={styles.themeGroup}>
                <button
                  type="button"
                  className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
                  onClick={() => setTheme('light')}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </button>
              </div>
            </div>
            <div className={styles.previewCanvas} data-theme={theme}>
              <TagButton label={state.label} color={state.color} />
            </div>
          </div>

          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <h3 className={styles.controlGroupTitle}>Content</h3>
              <ControlRow label="Label" fullWidth>
                <input
                  className={styles.textInput}
                  value={state.label}
                  onChange={(e) => patch('label', e.target.value)}
                  placeholder="Tag text"
                />
              </ControlRow>
            </div>

            <div className={styles.controlGroup}>
              <h3 className={styles.controlGroupTitle}>Display</h3>
              <ControlRow label="Color" fullWidth>
                <div className={styles.segmented}>
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.segBtn} ${state.color === c ? styles.segBtnActive : ''}`}
                      onClick={() => patch('color', c)}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </ControlRow>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── Variants ── */}
        <section id="variants" className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>
          <p className={styles.sectionSubtitle}>All canonical states of the Tag Button component.</p>

          <div className={styles.demoList}>
            <DemoRow label="Default — Neutral">
              <div className={styles.demoCanvasPad}>
                <TagButton label="Work" />
              </div>
            </DemoRow>
            <DemoRow label="Yellow">
              <div className={styles.demoCanvasPad}>
                <TagButton label="Personal" color="yellow" />
              </div>
            </DemoRow>
            <DemoRow label="Green">
              <div className={styles.demoCanvasPad}>
                <TagButton label="Shipped" color="green" />
              </div>
            </DemoRow>
            <DemoRow label="Blue">
              <div className={styles.demoCanvasPad}>
                <TagButton label="Design" color="blue" />
              </div>
            </DemoRow>
            <DemoRow label="Brown">
              <div className={styles.demoCanvasPad}>
                <TagButton label="Archive" color="brown" />
              </div>
            </DemoRow>
            <DemoRow
              label="Long label (truncates)"
              note="Tag max-width is 120px — overflow clips with an ellipsis."
            >
              <div className={styles.demoCanvasConstrain}>
                <TagButton label="Quarterly planning session" color="blue" />
              </div>
            </DemoRow>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── Used In ── */}
        <section id="used-in" className={styles.section}>
          <h2 className={styles.sectionTitle}>Used In</h2>
          <p className={styles.sectionSubtitle}>Components that compose this atom.</p>

          {USED_IN.length === 0 ? (
            <p className={styles.usedInEmpty}>Not yet used in any component.</p>
          ) : (
            <div className={styles.usedInGrid}>
              {USED_IN.map((consumer) =>
                consumer.href ? (
                  <Link
                    key={consumer.name}
                    href={consumer.href}
                    className={styles.usedInCard}
                  >
                    <span className={styles.usedInName}>{consumer.name}</span>
                    <span className={styles.usedInArrow} aria-hidden>
                      →
                    </span>
                  </Link>
                ) : (
                  <span
                    key={consumer.name}
                    className={`${styles.usedInCard} ${styles.usedInCardDisabled}`}
                  >
                    <span className={styles.usedInName}>{consumer.name}</span>
                    <span className={styles.usedInSoon}>No docs yet</span>
                  </span>
                ),
              )}
            </div>
          )}
        </section>

        <div className={styles.divider} />

        {/* ── API ── */}
        <section id="api" className={styles.section}>
          <h2 className={styles.sectionTitle}>API</h2>
          <p className={styles.sectionSubtitle}>
            Props accepted by the <code className={styles.inlineCode}>TagButton</code> component.
          </p>

          <div className={styles.apiTableWrapper}>
            <table className={styles.apiTable}>
              <thead>
                <tr>
                  <th className={styles.apiTh}>Prop</th>
                  <th className={styles.apiTh}>Type</th>
                  <th className={styles.apiTh}>Default</th>
                  <th className={styles.apiTh}>Description</th>
                </tr>
              </thead>
              <tbody>
                {API_PROPS.map((prop) => (
                  <tr key={prop.name}>
                    <td className={styles.apiTd}>
                      <span className={styles.apiPropName}>{prop.name}</span>
                      {prop.required && <span className={styles.apiRequired}>required</span>}
                    </td>
                    <td className={styles.apiTd}>
                      <code className={styles.apiType}>{prop.type}</code>
                    </td>
                    <td className={styles.apiTd}>
                      {prop.default ? (
                        <code className={styles.apiType}>{prop.default}</code>
                      ) : (
                        <span className={styles.apiDash}>—</span>
                      )}
                    </td>
                    <td className={`${styles.apiTd} ${styles.apiDescription}`}>
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Table of Contents ── */}
      <aside className={styles.toc}>
        <p className={styles.tocTitle}>On this page</p>
        <nav>
          {TOC_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.tocItem} ${activeSection === item.id ? styles.tocItemActive : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
