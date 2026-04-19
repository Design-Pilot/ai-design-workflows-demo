# Prop → Interactive Preview control: worked examples

These examples make Step 4 of SKILL.md concrete. When a generated page differs from what's shown here, adjust — the template is the contract, not these examples.

---

## 1. Simple primitives

### `sender: string`
Group: **Content**. Control: full-width text input.
```tsx
<ControlRow label="Sender" fullWidth>
  <input
    className={styles.textInput}
    value={state.sender}
    onChange={(e) => patch('sender', e.target.value)}
    placeholder="Sender name"
  />
</ControlRow>
```

### `isRead?: boolean` (default `false`)
Group: **State**. Control: Toggle.
```tsx
<ControlRow label="Read">
  <Toggle checked={state.isRead} onChange={(v) => patch('isRead', v)} />
</ControlRow>
```

### `count?: number`
Group: **Content**. Control: number input.
```tsx
<ControlRow label="Count">
  <input
    type="number"
    className={`${styles.textInput} ${styles.numberInput}`}
    value={state.count}
    onChange={(e) => patch('count', Number(e.target.value))}
  />
</ControlRow>
```

---

## 2. Union of string literals

### `size: 'sm' | 'md' | 'lg'`
Group: **Display**. Control: segmented with one button per literal.
```tsx
<ControlRow label="Size" fullWidth>
  <div className={styles.segmented}>
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <button
        key={s}
        type="button"
        className={`${styles.segBtn} ${state.size === s ? styles.segBtnActive : ''}`}
        onClick={() => patch('size', s)}
      >
        {s.toUpperCase()}
      </button>
    ))}
  </div>
</ControlRow>
```

**To extract literals from the type:** read the component file, find the prop's type declaration, split on `|`, strip quotes and whitespace. If the type is an alias imported from another file (e.g. `color: TagColor`), open that file and look for `type TagColor = 'neutral' | 'blue' | ...`. If it's not a literal union, fall back to a text input.

---

## 3. Date

### `date: Date` (Email Row pattern)
Group: **Content**. Control: segmented (Today / This year / Past year) plus a `computeDate` helper in the page.
```tsx
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
```
The `liveProps` block calls `date: computeDate(state.datePreset)`.

---

## 4. Array of objects

### `labels?: Array<{ label: string; color: TagColor }>`
Group: **Display**. Control: chip editor with a text input + Add button. Reuse the Email Row pattern verbatim — only change the prop name and the state key.

Local state for the add-chip input:
```tsx
const [newLabel, setNewLabel] = useState('');
```

Control row:
```tsx
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
              patch('labels', state.labels.filter((_, j) => j !== i))
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
```

### `senders?: string[]` (array of strings, no object)
Same chip editor but each chip stores a raw string:
```tsx
{state.senders.map((s, i) => (
  <span key={i} className={styles.chip}>
    {s}
    <button ... onClick={() => patch('senders', state.senders.filter((_, j) => j !== i))}>×</button>
  </span>
))}
```

When rendering `liveProps`, conditionally spread the array only when non-empty:
```tsx
const liveProps = {
  sender: state.sender,
  ...(state.senders.length > 0 && { senders: state.senders }),
  // ...
};
```

---

## 5. `show*` boolean that gates a dependent prop

### `showCategory?: boolean` + `category?: { label: string; color: TagColor }`
Put the toggle in **Display**. Render a conditional sub-input for the category label.
```tsx
<ControlRow label="Show category">
  <Toggle checked={state.showCategory} onChange={(v) => patch('showCategory', v)} />
</ControlRow>

{state.showCategory && (
  <ControlRow label="Category label" fullWidth>
    <input
      className={styles.textInput}
      value={state.category.label}
      onChange={(e) => patch('category', { label: e.target.value })}
    />
  </ControlRow>
)}
```

Pass a default color when computing `liveProps`:
```tsx
category: { label: state.category.label, color: 'neutral' as TagColor },
```

---

## 6. Unmapped types (skip in preview, still in API)

- `trailingIcon?: React.ReactNode` — cannot be edited interactively without a picker UI. Skip the Interactive Preview control. Include in the API table with type `ReactNode` and description "Optional trailing icon rendered after labels."
- `onSelect?: (selected: boolean) => void` — event handler, always skip from preview (but still in API).
- `className?: string` — skip from preview unless the component has fewer than 3 other props; then include as a text input under Content.

---

## 7. Deriving initial `DEFAULT` seed object

Build a single object literal. One key per prop, value = `defaultValue` from the component signature, else type-appropriate seed:

- `string` → realistic sample text, never "lorem ipsum". Take a cue from the component name (e.g. for `label` on Tag Button: `"Work"`; for `placeholder` on an input: `"Search"`).
- `boolean` → `false` unless the component only makes sense when true (e.g. `isOpen` for a modal — start `true`).
- `number` → a representative value (e.g. `count: 3`).
- array → `[]`.
- object → an object with every sub-key seeded per the same rules.

Example for Email Row:
```ts
const DEFAULT = {
  sender: 'Jordan Lee',
  senders: [],
  subject: 'Q3 design review notes',
  preview: "Hey, just wanted to share the key takeaways from yesterday's session.",
  datePreset: 'today' as const,
  isRead: false,
  isSelected: false,
  count: 3,
  showCategory: false,
  category: { label: 'Work' },
  showTrailingAssets: true,
  labels: [] as Array<{ label: string }>,
};
```

---

## 8. Building `liveProps` from state

This is the object passed to the rendered component in the Preview panel. Separate from `DEFAULT` because some values need conversion (e.g. `datePreset` → `Date`, or `category` needs a color added). Email Row's `liveProps`:

```ts
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
```

Notice two derivations: `showCount` auto-flips true when there are ≥2 senders, and the chip labels gain a default color when passed to the component. These derivations aren't auto-generated — add them when the component clearly needs them. When in doubt, pass `state` fields straight through.
