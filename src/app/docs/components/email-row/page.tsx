'use client';

import { useState, useEffect } from 'react';
import { EmailRow } from '@/components/email-row/email-row';
import type { TagColor } from '@/components/tag-button/tag-button';
import { Toggle, ControlRow, DemoRow } from '@/app/docs/_shared/docs-ui';
import styles from './page.module.css';

const TOC_ITEMS = [
  { id: 'interactive-preview', label: 'Interactive Preview' },
  { id: 'variants', label: 'Variants' },
  { id: 'date-formats', label: 'Date Formats' },
  { id: 'sender-groupings', label: 'Sender Groupings' },
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
    name: 'sender',
    type: 'string',
    required: true,
    description: 'Primary sender name. Used when `senders` is not provided or empty.',
  },
  {
    name: 'senders',
    type: 'string[]',
    description:
      'Multi-participant thread. When provided, renders the grouped sender label (see Sender Groupings).',
  },
  {
    name: 'subject',
    type: 'string',
    required: true,
    description: 'Email subject line. Rendered inline next to the preview.',
  },
  {
    name: 'preview',
    type: 'string',
    required: true,
    description: 'First-line preview text of the email body.',
  },
  {
    name: 'date',
    type: 'Date',
    required: true,
    description:
      'Message date. Formatting switches between time / month-day / month-day-year based on recency.',
  },
  {
    name: 'isRead',
    type: 'boolean',
    default: 'false',
    description: 'When true, hides the unread dot and uses the read typographic weights.',
  },
  {
    name: 'isSelected',
    type: 'boolean',
    default: 'false',
    description: 'Controls selection styling and the checkbox checked state.',
  },
  {
    name: 'showCount',
    type: 'boolean',
    default: 'false',
    description: 'Shows the message count pill after the sender name.',
  },
  {
    name: 'count',
    type: 'number',
    description: 'Value rendered in the count pill. Required when `showCount` is true.',
  },
  {
    name: 'showCategory',
    type: 'boolean',
    default: 'false',
    description: 'Renders the category tag before the sender name.',
  },
  {
    name: 'category',
    type: '{ label: string; color: TagColor }',
    description: 'Category tag shown when `showCategory` is true.',
  },
  {
    name: 'labels',
    type: 'Array<{ label: string; color: TagColor }>',
    default: '[]',
    description: 'Trailing label tags rendered next to the date.',
  },
  {
    name: 'trailingIcon',
    type: 'ReactNode',
    description: 'Optional trailing icon rendered after labels.',
  },
  {
    name: 'showTrailingAssets',
    type: 'boolean',
    default: 'true',
    description: 'When false, hides labels and the trailing icon entirely.',
  },
  {
    name: 'onSelect',
    type: '(selected: boolean) => void',
    description: 'Called when the checkbox toggles.',
  },
  {
    name: 'onClick',
    type: '() => void',
    description: 'Called when the row is clicked.',
  },
];

const DEFAULT: {
  sender: string;
  senders: string[];
  subject: string;
  preview: string;
  datePreset: 'today' | 'this-year' | 'past-year';
  isRead: boolean;
  isSelected: boolean;
  count: number;
  showCategory: boolean;
  category: { label: string };
  showTrailingAssets: boolean;
  labels: Array<{ label: string }>;
} = {
  sender: 'Jordan Lee',
  senders: [],
  subject: 'Q3 design review notes',
  preview: "Hey, just wanted to share the key takeaways from yesterday's session.",
  datePreset: 'today',
  isRead: false,
  isSelected: false,
  count: 3,
  showCategory: false,
  category: { label: 'Work' },
  showTrailingAssets: true,
  labels: [],
};

function computeDate(preset: 'today' | 'this-year' | 'past-year'): Date {
  const now = new Date();
  if (preset === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 34, 0);
  if (preset === 'this-year') return new Date(now.getFullYear(), 2, 15);
  return new Date(2023, 0, 5);
}

const STATIC_SUBJECT = 'Re: Q3 design review notes';
const STATIC_PREVIEW = "Just wanted to share the key takeaways from yesterday's session.";
const STATIC_SENDER = 'Jordan Lee';

export default function EmailRowDocs() {
  const [state, setState] = useState(DEFAULT);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [newSender, setNewSender] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [activeSection, setActiveSection] = useState<string>('interactive-preview');

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

  const now = new Date();
  const thisYearDate = new Date(now.getFullYear(), 2, 15);
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 15, 0);
  const pastYearDate = new Date(2023, 0, 5);

  const liveProps = {
    sender: state.sender,
    ...(state.senders.length > 0 && { senders: state.senders }),
    subject: state.subject,
    preview: state.preview,
    date: computeDate(state.datePreset),
    isRead: state.isRead,
    isSelected: state.isSelected,
    showCount: state.senders.length >= 2,
    count: state.senders.length,
    showCategory: state.showCategory,
    category: { label: state.category.label, color: 'neutral' as TagColor },
    showTrailingAssets: state.showTrailingAssets,
    labels: state.labels.map((l) => ({ label: l.label, color: 'neutral' as TagColor })),
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Main content ── */}
      <div className={styles.pageContent}>
        <header className={styles.pageHeader}>
          <p className={styles.breadcrumb}>Components</p>
          <h1 className={styles.title}>Email Row</h1>
          <p className={styles.description}>
            A single email list item. Displays sender, subject, preview, and date — with support for
            unread state, selection, hover actions, labels, categories, and sender grouping.
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
              <EmailRow {...liveProps} />
            </div>
          </div>

          <div className={styles.controlsGrid}>
            {/* Content */}
            <div className={styles.controlGroup}>
              <h3 className={styles.controlGroupTitle}>Content</h3>

              <ControlRow label="Sender" fullWidth>
                <input
                  className={styles.textInput}
                  value={state.sender}
                  onChange={(e) => patch('sender', e.target.value)}
                  placeholder="Sender name"
                />
              </ControlRow>

              <ControlRow label="Senders list" fullWidth>
                <div className={styles.chipEditor}>
                  <div className={styles.chipList}>
                    {state.senders.map((s, i) => (
                      <span key={i} className={styles.chip}>
                        {s}
                        <button
                          type="button"
                          className={styles.chipRemove}
                          onClick={() =>
                            patch(
                              'senders',
                              state.senders.filter((_, j) => j !== i),
                            )
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    className={styles.chipInput}
                    value={newSender}
                    placeholder="Add sender, press Enter"
                    onChange={(e) => setNewSender(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSender.trim()) {
                        patch('senders', [...state.senders, newSender.trim()]);
                        setNewSender('');
                      }
                    }}
                  />
                </div>
              </ControlRow>

              <ControlRow label="Subject" fullWidth>
                <input
                  className={styles.textInput}
                  value={state.subject}
                  onChange={(e) => patch('subject', e.target.value)}
                />
              </ControlRow>

              <ControlRow label="Preview" fullWidth>
                <input
                  className={styles.textInput}
                  value={state.preview}
                  onChange={(e) => patch('preview', e.target.value)}
                />
              </ControlRow>

              <ControlRow label="Date" fullWidth>
                <div className={styles.segmented}>
                  {(['today', 'this-year', 'past-year'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.segBtn} ${state.datePreset === p ? styles.segBtnActive : ''}`}
                      onClick={() => patch('datePreset', p)}
                    >
                      {p === 'today' ? 'Today' : p === 'this-year' ? 'This year' : 'Past year'}
                    </button>
                  ))}
                </div>
              </ControlRow>
            </div>

            {/* State + Display stacked */}
            <div className={styles.controlGroupStack}>
              <div className={styles.controlGroup}>
                <h3 className={styles.controlGroupTitle}>State</h3>
                <ControlRow label="Read">
                  <Toggle checked={state.isRead} onChange={(v) => patch('isRead', v)} />
                </ControlRow>
                <ControlRow label="Selected">
                  <Toggle checked={state.isSelected} onChange={(v) => patch('isSelected', v)} />
                </ControlRow>
              </div>

              <div className={styles.controlGroup}>
                <h3 className={styles.controlGroupTitle}>Display</h3>

                <ControlRow label="Trailing assets">
                  <Toggle
                    checked={state.showTrailingAssets}
                    onChange={(v) => patch('showTrailingAssets', v)}
                  />
                </ControlRow>

                <ControlRow label="Show category">
                  <Toggle
                    checked={state.showCategory}
                    onChange={(v) => patch('showCategory', v)}
                  />
                </ControlRow>

                {state.showCategory && (
                  <ControlRow label="Category label" fullWidth>
                    <input
                      className={styles.textInput}
                      value={state.category.label}
                      onChange={(e) =>
                        patch('category', { label: e.target.value })
                      }
                    />
                  </ControlRow>
                )}

                <ControlRow label="Labels" fullWidth>
                  <div className={styles.chipEditor}>
                    <div className={styles.chipList}>
                      {state.labels.map((l, i) => (
                        <span key={i} className={styles.chip}>
                          {l.label}
                          <button
                            type="button"
                            className={styles.chipRemove}
                            onClick={() =>
                              patch(
                                'labels',
                                state.labels.filter((_, j) => j !== i),
                              )
                            }
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className={styles.chipAddRow}>
                      <input
                        className={styles.chipInput}
                        value={newLabel}
                        placeholder="Label text, press Enter"
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newLabel.trim()) {
                            patch('labels', [...state.labels, { label: newLabel.trim() }]);
                            setNewLabel('');
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.addBtn}
                        onClick={() => {
                          if (newLabel.trim()) {
                            patch('labels', [...state.labels, { label: newLabel.trim() }]);
                            setNewLabel('');
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </ControlRow>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── Variants ── */}
        <section id="variants" className={styles.section}>
          <h2 className={styles.sectionTitle}>Variants</h2>
          <p className={styles.sectionSubtitle}>All canonical states of the Email Row component.</p>

          <div className={styles.demoList}>
            <DemoRow label="Default — Unread">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
              />
            </DemoRow>
            <DemoRow label="Read">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
                isRead
              />
            </DemoRow>
            <DemoRow label="Selected">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
                isSelected
              />
            </DemoRow>
            <DemoRow label="With category">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
                showCategory
                category={{ label: 'Work', color: 'neutral' }}
              />
            </DemoRow>
            <DemoRow label="With labels">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
                labels={[
                  { label: 'Design', color: 'neutral' },
                  { label: 'Figma', color: 'neutral' },
                ]}
              />
            </DemoRow>
            <DemoRow label="With message count">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
                showCount
                count={4}
              />
            </DemoRow>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── Behavior: Date Formats ── */}
        <section id="date-formats" className={styles.section}>
          <h2 className={styles.sectionTitle}>Behavior — Date Formats</h2>
          <p className={styles.sectionSubtitle}>
            The date renders in three formats depending on how old the email is.
          </p>

          <div className={styles.demoList}>
            <DemoRow label="Today" note="12-hour time with AM/PM — email arrived today.">
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={todayDate}
              />
            </DemoRow>
            <DemoRow
              label="This year"
              note="Abbreviated month + day — email is from the current calendar year."
            >
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
              />
            </DemoRow>
            <DemoRow
              label="Past year"
              note="Month + day + full year — email is from a previous calendar year."
            >
              <EmailRow
                sender={STATIC_SENDER}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={pastYearDate}
              />
            </DemoRow>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── Behavior: Sender Groupings ── */}
        <section id="sender-groupings" className={styles.section}>
          <h2 className={styles.sectionTitle}>Behavior — Sender Groupings</h2>
          <p className={styles.sectionSubtitle}>
            How sender names are displayed based on the number of participants in a thread.
          </p>

          <div className={styles.demoList}>
            <DemoRow
              label="Single sender"
              note="One name, rendered as-is via the sender prop."
            >
              <EmailRow
                sender="Jordan Lee"
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
              />
            </DemoRow>
            <DemoRow label="Two senders" note="Names joined with a comma.">
              <EmailRow
                sender={STATIC_SENDER}
                senders={['Jordan Lee', 'Casey Park']}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
              />
            </DemoRow>
            <DemoRow label="Three senders" note="All three names joined with commas.">
              <EmailRow
                sender={STATIC_SENDER}
                senders={['Jordan Lee', 'Casey Park', 'Alex Kim']}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
              />
            </DemoRow>
            <DemoRow
              label="Four or more senders"
              note="First two shown, then '.. LastName' suffix — suffix always visible, prefix truncates."
            >
              <EmailRow
                sender={STATIC_SENDER}
                senders={['Jordan Lee', 'Casey Park', 'Alex Kim', 'Morgan Chen']}
                subject={STATIC_SUBJECT}
                preview={STATIC_PREVIEW}
                date={thisYearDate}
              />
            </DemoRow>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ── API ── */}
        <section id="api" className={styles.section}>
          <h2 className={styles.sectionTitle}>API</h2>
          <p className={styles.sectionSubtitle}>
            Props accepted by the <code className={styles.inlineCode}>EmailRow</code> component.
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
