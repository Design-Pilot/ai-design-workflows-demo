# page.tsx template

This is the scaffold for `src/app/docs/<section>/<name>/page.tsx`. Fill in the `{{...}}` placeholders from the data gathered in Steps 1–6 of SKILL.md.

Placeholders:
- `{{ComponentName}}` — PascalCase (e.g. `TagButton`).
- `{{component-name}}` — kebab-case (e.g. `tag-button`).
- `{{section}}` — `atoms` | `components` | `patterns`.
- `{{componentImport}}` — full import path, e.g. `@/components/tag-button/tag-button`.
- `{{description}}` — one-paragraph component description.
- `{{tocItems}}` — array literal, see rules below.
- `{{defaultState}}` — initial state object used in Interactive Preview.
- `{{livePropsBlock}}` — JSX-ready `const liveProps = { ... }` computed from state.
- `{{interactivePreviewControls}}` — the three control groups (Content / State / Display), populated.
- `{{variantRows}}` — list of `<DemoRow>` elements for Variants section.
- `{{behaviorSections}}` — zero or more `<section>` blocks for inferred Behaviors.
- `{{apiProps}}` — `API_PROPS` array literal for the props table.

## TOC items rule

Always start with `interactive-preview` and `variants`. Append one entry per behavior section (e.g. `date-formats`, `sender-groupings`). For **atoms only**, append `used-in` after behaviors. Always end with `api`. If the component has no props, omit `interactive-preview` and `api`.

```tsx
const TOC_ITEMS = [
  { id: 'interactive-preview', label: 'Interactive Preview' },
  { id: 'variants', label: 'Variants' },
  // ...behavior sections in order...
  { id: 'used-in', label: 'Used In' }, // atoms only
  { id: 'api', label: 'API' },
] as const;
```

## Full file scaffold

```tsx
'use client';

import { useState, useEffect } from 'react';
import { {{ComponentName}} } from '{{componentImport}}';
import { Toggle, ControlRow, DemoRow } from '@/app/docs/_shared/docs-ui';
import styles from './page.module.css';
// Additional type imports as needed, e.g.:
// import type { TagColor } from '@/components/tag-button/tag-button';

const TOC_ITEMS = [
  {{tocItems}}
] as const;

const API_PROPS: Array<{
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}> = [
  {{apiProps}}
];

// If the component has a Date prop, include this helper.
// Otherwise omit it entirely.
function computeDate(preset: 'today' | 'this-year' | 'past-year'): Date {
  const now = new Date();
  if (preset === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 34, 0);
  if (preset === 'this-year') return new Date(now.getFullYear(), 2, 15);
  return new Date(2023, 0, 5);
}

const DEFAULT = {{defaultState}};

export default function {{ComponentName}}Docs() {
  const [state, setState] = useState(DEFAULT);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<string>(TOC_ITEMS[0].id);
  // Chip editor local inputs, only for props that use the chip editor control
  {{chipEditorLocalState}}

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

  {{livePropsBlock}}

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <p className={styles.breadcrumb}>{{sectionUpperCase}}</p>
          <h1 className={styles.title}>{{Title Case Name}}</h1>
          <p className={styles.description}>{{description}}</p>
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
              <{{ComponentName}} {...liveProps} />
            </div>
          </div>

          <div className={styles.controlsGrid}>
            {{interactivePreviewControls}}
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── Variants ── */}
        <section id="variants" className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>
          <p className={styles.sectionSubtitle}>All canonical states of the {{Title Case Name}} component.</p>

          <div className={styles.demoList}>
            {{variantRows}}
          </div>
        </section>

        {{behaviorSections}}

        {{usedInSection}}

        <div className={styles.divider} />

        {/* ── API ── */}
        <section id="api" className={styles.section}>
          <h2 className={styles.sectionTitle}>API</h2>
          <p className={styles.sectionSubtitle}>
            Props accepted by the <code className={styles.inlineCode}>{{ComponentName}}</code> component.
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
```

## Interactive Preview controls — example block shape

Each of the three groups (Content / State / Display) is a `<div className={styles.controlGroup}>` with a `<h3 className={styles.controlGroupTitle}>` header. The right column (`controlGroupStack`) holds State + Display stacked. See the Email Row page for the exact markup — this template replicates it byte-for-byte.

```tsx
<div className={styles.controlGroup}>
  <h3 className={styles.controlGroupTitle}>Content</h3>
  {/* One <ControlRow> per control in this group */}
</div>
<div className={styles.controlGroupStack}>
  <div className={styles.controlGroup}>
    <h3 className={styles.controlGroupTitle}>State</h3>
    {/* boolean toggles */}
  </div>
  <div className={styles.controlGroup}>
    <h3 className={styles.controlGroupTitle}>Display</h3>
    {/* show* toggles and dependent sub-controls */}
  </div>
</div>
```

## Behavior section shape

```tsx
<div className={styles.divider} />
<section id="{{kebab-id}}" className={styles.section}>
  <h2 className={styles.sectionTitle}>Behavior — {{Title}}</h2>
  <p className={styles.sectionSubtitle}>{{one-sentence description of what this behavior does}}</p>

  <div className={styles.demoList}>
    <DemoRow label="{{Case label}}" note="{{Case explanation}}">
      <{{ComponentName}} {...propsForThisCase} />
    </DemoRow>
    {/* ...more cases... */}
  </div>
</section>
```

Note: `DemoRow` in the shared `_shared/docs-ui.tsx` has been updated to accept `children` as the demo canvas contents (the Email Row version spread component props directly; the shared version should be generic). If not yet generalized, update it during the Step 3 extraction so it accepts `children`.
