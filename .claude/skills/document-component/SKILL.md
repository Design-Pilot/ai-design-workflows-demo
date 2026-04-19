---
name: document-component
description: Auto-generate or refresh a component documentation page under `src/app/docs/components/<name>/` (or `src/app/docs/atoms/<name>/`) with the same structure as the Email Row docs — header, Interactive Preview (auto-inferred controls), Variants, Behaviors, API props table, and sticky TOC. Reads the component source at `src/components/<name>/` as the canonical spec. Use when the user says "document component", "generate docs for X", "create docs page for X", "update docs for X", or invokes /document-component.
---

# document-component

Generate a full component documentation page that looks and behaves exactly like the Email Row docs page at [src/app/docs/components/email-row/page.tsx](src/app/docs/components/email-row/page.tsx). The skill reads the component source, infers everything it can (API, Interactive Preview controls, Variants), proposes Behaviors candidates for user confirmation, then writes the page, updates the sidebar, and verifies the route renders.

**Scope:** exactly one component per invocation. Takes the component folder name as input (e.g. `tag-button`, `checkbox`).

**Inputs the skill discovers or asks for:**
- Component name (from the user prompt or slash command argument).
- Component kind (`atoms` | `components` | `patterns`) — derived from the existing [src/app/docs/nav.tsx](src/app/docs/nav.tsx) entry; ask if ambiguous.
- One-paragraph component description — ask the user if not obvious from source comments.
- Confirmation of proposed Behaviors sections (skill lists candidates, user accepts / renames / drops).

**Hard rules:**
- Never hardcode a pixel or hex value in generated CSS. Reuse existing tokens from [src/tokens/](src/tokens).
- Never invoke Figma MCPs from this skill. This is a code-only workflow.
- Confirmation gate before writing any file (Step 6).
- Fix-loop cap of 3 iterations during verification (Step 9).

---

## Checklist (use TodoWrite, visible to the user)

Create these 11 todos at Step 0 and mark each `in_progress` → `completed` as you hit it. This list is the contract with the user — do not skip items.

1. Discover component and parse source (props, utils, conditional logic).
2. Resolve nav entry (existing "Soon" vs new) AND — for atoms — scan for consumers.
3. Extract shared docs UI helpers (first run only; idempotent).
4. Infer Interactive Preview controls from prop types.
5. Auto-generate Variants list.
6. Propose Behaviors candidates and confirm plan with user.
7. Write `page.tsx` and `page.module.css` for the component docs route.
8. Update [src/app/docs/nav.tsx](src/app/docs/nav.tsx) — flip `soon: true` → `soon: false` or add new entry.
9. Verify: run lint, check the route serves without runtime errors, take a screenshot. Cap at 3 fix iterations.
10. Surface any unmapped props (ReactNode, functions, exotic types) in a final report.
11. Summarize for the user: path of new page, nav change, behaviors included, unmapped props.

---

## Step 0 — Parse input and set up

1. Resolve the component name from the user prompt or slash command argument. Strip any leading `/document-component `. If not provided, ask: "Which component should I document? (folder name under `src/components/`)".
2. Confirm `src/components/<name>/` exists. If not, list available folders with `ls src/components` and ask the user to pick.
3. Create the TodoWrite list above.

---

## Step 1 — Discover component and parse source

Read all files under `src/components/<name>/`. Typical layout: `<name>.tsx`, `<name>.module.css`, sometimes `utils.ts` / `types.ts` / `index.ts`.

From `<name>.tsx` extract:

**a) Props interface.** Find the `export interface <Name>Props { ... }` block (or `type <Name>Props`). For each prop collect: `name`, `type` (raw TypeScript), `optional` (trailing `?`), `defaultValue` (from the destructured signature `function X({ prop = value, ... })`), and the JSDoc or inline comment immediately preceding it if present.

**b) Helper functions defined in the component file.** Top-level `function` declarations that are NOT the component export. Email Row has `formatSenders`. These are candidate Behaviors.

**c) Utility imports from the same folder.** `import { ... } from './utils'` or `./<name>-utils`. Email Row has `formatDate` from `./utils`. Read that file too — each exported function is a candidate Behavior.

**d) Conditional renders keyed on props.** Grep for `{<propName> && ...}` and `{<propName> ? ... : ...}` inside the JSX. These tell you which props gate which UI — useful both for Variants and Behaviors.

Record everything in a structured in-memory note you'll reference in Steps 4–6.

---

## Step 2 — Resolve nav entry (and, for atoms, scan consumers)

### 2a — Nav entry

Read [src/app/docs/nav.tsx](src/app/docs/nav.tsx). Search for an item whose `label` matches the component name (case-insensitive, hyphens allowed). Three cases:

- **Match with `soon: true`.** Use that entry. Remember which `section` (`Tokens` / `Atoms` / `Components` / `Patterns`) it's in — this decides the output folder: `src/app/docs/<section-lower>/<name>/`.
- **Match with `soon: false`.** Docs already exist. Read the existing page and plan to update it in place (overwrite at Step 7, but preserve the file path).
- **No match.** Ask the user which section to add it under. Default to `Components`. Output folder follows the section.

### 2b — Scan for consumers (atoms only)

If the resolved section is `Atoms`, find which other components consume this atom. This feeds a "Used in" section on the generated docs page so designers can jump from an atom to the compositions that rely on it.

1. Grep across `src/components/` for imports of the atom. Match both alias and relative forms:
   - `from '@/components/<name>/<name>'`
   - `from '../<name>/<name>'`
   - `from './<name>/<name>'`
2. For each matching file, the **consumer** is the owning component folder — i.e. the immediate subfolder under `src/components/`. Deduplicate.
3. Exclude the atom's own folder (a component importing itself, e.g. via a barrel).
4. Exclude matches under `src/app/` — those are routes and data files, not components.
5. For each consumer folder name, look up its nav entry:
   - If it has a nav entry with `soon: false`, record its `href` so the docs page can link to it.
   - If it has `soon: true` or no entry, record just the display name (no link).
6. Build a structured list: `[{ name: 'Email Row', slug: 'email-row', href: '/docs/components/email-row' | null }, ...]`.

If the list is empty, still emit the section with an empty-state message ("Not yet used in any component") — future usage will populate it. If the component is NOT an atom, skip this scan entirely.

---

## Step 3 — Extract shared docs UI helpers (first run only)

Check whether `src/app/docs/_shared/docs-ui.tsx` exists.

**If it does NOT exist**, do this one-time extraction:

1. Create `src/app/docs/_shared/docs-ui.tsx` exporting three components: `Toggle`, `ControlRow`, `DemoRow`. Copy them verbatim from [src/app/docs/components/email-row/page.tsx](src/app/docs/components/email-row/page.tsx) (lines ~49–96 in the current file — re-read to get exact source). Update the import path for `styles` to point at the new shared CSS module.
2. Create `src/app/docs/_shared/docs-ui.module.css` and move the relevant class rules from [src/app/docs/components/email-row/page.module.css](src/app/docs/components/email-row/page.module.css) — the ones used by the extracted helpers: `.toggle`, `.toggleOn`, `.toggleThumb`, `.controlRow`, `.controlRowFull`, `.controlLabel`, `.controlValue`, `.controlValueFull`, `.demoItem`, `.demoMeta`, `.demoLabel`, `.demoNote`, `.demoCanvas`. Keep them in their original order, preserve tokens.
3. Edit [src/app/docs/components/email-row/page.tsx](src/app/docs/components/email-row/page.tsx) to `import { Toggle, ControlRow, DemoRow } from '@/app/docs/_shared/docs-ui'` and delete the local definitions. Where the local definitions used `styles.foo`, the shared components already reference `sharedStyles.foo` via the shared CSS module — no change needed at the import sites since `<Toggle>` / `<ControlRow>` / `<DemoRow>` tag names stay identical.
4. Delete the moved class rules from [page.module.css](src/app/docs/components/email-row/page.module.css).
5. Run `npm run lint` — if it fails, fix before proceeding.

**If it exists already**, skip this step entirely.

Mark the todo complete either way.

---

## Step 4 — Infer Interactive Preview controls from props

For every prop from Step 1a, decide a control using this mapping. Types are matched after stripping `undefined` and surrounding whitespace.

| Prop type | Control | Default seed value |
|---|---|---|
| `string` | text input (`<input>` styled `.textInput`) | value of `defaultValue` if present, else the prop name in title case |
| `boolean` | `<Toggle>` | `defaultValue` or `false` |
| `number` | number input | `defaultValue` or `0` |
| `Date` | segmented `Today` / `This year` / `Past year` with a `computeDate(preset)` helper in the page | `'today'` |
| union of string literals (e.g. `'sm' \| 'md' \| 'lg'`) | segmented with one button per literal | first literal |
| `Array<T>` where `T` includes `{ label: string; ... }` | chip editor (copy from email-row's labels editor) | `[]` |
| Object like `{ label: string; color: TagColor }` | one text input for `label` + one select for other keys if their type is a known union; else text input | empty fields |
| `ReactNode` / function / `on*` prop / unmapped | **skip the Interactive Preview control**; still include in API table | — |

**Grouping in the UI:** Split controls into three groups mirroring Email Row:
- **Content** — string / text-ish props (sender, subject, preview, label, count, date).
- **State** — boolean props whose name matches `/^is|has/` (isRead, isSelected, isDisabled, hasError, etc.).
- **Display** — boolean props starting with `show` + any `labels` / `category` / trailing-asset-style props. Conditionally render sub-inputs (e.g. category label input only when `showCategory` is true — this is the Email Row pattern).

**Seed values for Interactive Preview:** Use realistic sample content per type — never placeholder text like `"lorem ipsum"`. For Email Row the seed was `sender: "Jordan Lee", subject: "Q3 design review notes"` etc. Generate equivalents appropriate to the component's domain.

Write your control plan into the in-memory note.

---

## Step 5 — Auto-generate Variants list

Goal: mirror the Email Row Variants section — a grid of labeled demo rows, each highlighting one state.

Default variants to generate:

1. **`Default`** — all props at their default values.
2. **One variant per boolean prop** that is `false` by default — flip it to `true`. Label = title-cased prop name (e.g. `isRead` → `"Read"`, `isSelected` → `"Selected"`, `isDisabled` → `"Disabled"`).
3. **One variant per `show*` prop** — set it to `true` and populate its associated data prop with a sensible value (e.g. `showCategory: true` + `category: { label: 'Work', color: 'neutral' }`).
4. **One variant per object / array prop that has a visible UI effect** — e.g. `labels: [{ label: 'Design' }, { label: 'Figma' }]`.

Skip variants for props that produce no visible change on their own. If the count is <3, that's fine; if >8, keep the first 8 and note the omissions in the final report.

---

## Step 6 — Propose Behaviors candidates and confirm plan

Behaviors sections are demo sections that illustrate non-trivial runtime logic (not derivable from a single prop toggle). Candidates come from Step 1b (helper functions) and Step 1c (utility imports).

For each candidate, construct a short proposal:

- **Section title** — derived from function name. `formatDate` → `"Date Formats"`. `formatSenders` → `"Sender Groupings"`. `truncateWithEllipsis` → `"Truncation"`.
- **Inferred cases** — inspect the function body. For `formatDate` the three cases are the three `if` branches. For `formatSenders` the two cases are "≤3 senders" and "4+ senders".
- **Proposed demo rows** — one `DemoRow` per case, with a plausible label + note.

Present a combined plan to the user. Format:

```
I'm about to generate docs for <name>. Here's the plan:

## Interactive Preview
- Content: <list of controls>
- State: <list of controls>
- Display: <list of controls>

## Variants (N)
- Default
- <variant 2>
- <variant 3>
...

## Behaviors
- <Behavior 1>: <N cases>
- <Behavior 2>: <N cases>
(none inferred — will skip Behaviors sections)

## Used in (atoms only)
- <Consumer 1> (linked → /docs/components/<slug>)
- <Consumer 2> (not yet documented — name only)
(omit this block entirely for non-atoms; for atoms with no consumers show "None yet")

## API
- <N> props — full table auto-generated from <Name>Props.

## Unmapped props (will appear only in API)
- <prop> (<type>) — reason

Output path: src/app/docs/<section>/<name>/
Nav change: "Soon" → active (existing entry in <section>) OR new entry in <section>.

Approve? (yes / edit)
```

**Wait for explicit approval.** If the user says "edit", take their adjustments and re-present. Do not proceed to Step 7 until they say yes / proceed / go / looks good.

---

## Step 7 — Write `page.tsx` and `page.module.css`

Use [references/page-template.md](references/page-template.md) as the scaffold. It's a fully worked template based on the Email Row page. Follow it exactly for structure; fill in the `{{...}}` placeholders from the data gathered in Steps 1–6.

Write `src/app/docs/<section>/<name>/page.tsx` and `src/app/docs/<section>/<name>/page.module.css`. The CSS file should import from or copy only the page-specific rules from [references/page-styles-template.md](references/page-styles-template.md) — the shared helpers' rules live in `_shared/docs-ui.module.css` (created at Step 3) and do NOT need to be duplicated.

**Section order (atoms).** For atoms, place the Used In section AFTER Variants and AFTER any Behaviors sections, but BEFORE API. Include a matching `used-in` entry in `TOC_ITEMS` between the last behavior id and `api`. For non-atoms, skip the Used In section entirely.

**Used In section shape (atoms only).** Render a simple card list. Each item shows the consumer component name and links to its docs route when available; consumers without docs render as dimmed, non-interactive chips.

```tsx
<div className={styles.divider} />
<section id="used-in" className={styles.section}>
  <h2 className={styles.sectionTitle}>Used In</h2>
  <p className={styles.sectionSubtitle}>Components that compose this atom.</p>

  <div className={styles.usedInGrid}>
    {/* For each consumer: */}
    <Link href="/docs/components/email-row" className={styles.usedInCard}>
      <span className={styles.usedInName}>Email Row</span>
      <span className={styles.usedInArrow} aria-hidden>→</span>
    </Link>
    {/* Consumer without docs: */}
    <span className={`${styles.usedInCard} ${styles.usedInCardDisabled}`}>
      <span className={styles.usedInName}>Some Other Component</span>
      <span className={styles.usedInSoon}>No docs yet</span>
    </span>
  </div>
  {/* Empty state if zero consumers: */}
  <p className={styles.usedInEmpty}>Not yet used in any component.</p>
</section>
```

Add these classes to `page.module.css` (they use only existing tokens — see [references/page-styles-template.md](references/page-styles-template.md) for the canonical rules to paste).

**Token rule reminder.** Every CSS value must reference a custom property from `src/tokens/*`. Never emit a raw pixel, hex, rgb, or unit literal unless it's a structural layout value already used in the Email Row page (e.g. `2px` for toggle thumb offsets, `999px` for chip radius, `1px` for hairlines). When in doubt, look up what the email-row page uses and mirror it.

---

## Step 8 — Update `src/app/docs/nav.tsx`

Two cases (from Step 2):

- **Existing `soon: true` entry.** Edit that item's `soon` to `false` and verify the `href` matches the page you just wrote. If `href` is wrong, fix it.
- **No existing entry.** Add a new item to the appropriate section's `items` array: `{ label: '<Title Case Name>', href: '/docs/<section>/<name>', soon: false }`.

Do not reorder other items. Do not touch sections you don't need to touch.

---

## Step 9 — Verify

Run these in order. Cap at 3 fix iterations total across all checks.

1. **`npm run lint`** on the full project. If errors are scoped to the new files or the nav/email-row edits, fix and rerun. If they're pre-existing, ignore and note in the final report.
2. **Dev server.** Use `preview_start` (or reuse the running server from `preview_list`) and navigate to the new route via `preview_eval`. Check `preview_console_logs` with `level: 'error'` — zero errors is the bar.
3. **Snapshot.** Call `preview_snapshot` and confirm the page has: the H1 title, the Interactive Preview heading, the Variants heading, each Behavior heading you included, the API heading, and a populated `<tbody>` under the API table with the expected row count. Screenshot it with `preview_screenshot` for the final report (note: screenshots occasionally come back blank — don't block on that; the snapshot + console logs are the source of truth).
4. **Interactive smoke test.** `preview_click` the first Toggle, then `preview_snapshot` again — confirm state changed. Skip if the component has no boolean props.

If a check fails, diagnose by reading the generated file + console logs, edit source, and re-verify. After 3 iterations stop and report the remaining issue in Step 11.

---

## Step 10 — Report unmapped props

List any props that ended up in the API table but not in the Interactive Preview (ReactNode, functions, exotic unions). Note them in the final summary so the user knows what isn't interactively demonstrable.

---

## Step 11 — Final summary

Output to the user:

- Path of the new / updated page (as a clickable markdown link).
- Nav change made.
- Sections generated (counts: N variants, M behaviors, P API rows).
- Unmapped props (if any).
- Verification result: lint pass/fail, route loads, console clean.
- Any unresolved issues from the fix-loop cap.

Keep it under 10 lines.

---

## Reference files

- [references/page-template.md](references/page-template.md) — the full `page.tsx` scaffold. Start here.
- [references/page-styles-template.md](references/page-styles-template.md) — the page-specific `page.module.css` rules (excludes shared helpers that live in `_shared/docs-ui.module.css`).
- [references/prop-inference-examples.md](references/prop-inference-examples.md) — worked examples of the Step 4 type-to-control mapping, including tricky cases (nested objects, arrays of objects, union literals).

---

## Known edge cases

- **Component has no props interface.** Render the API table as "This component takes no props." and skip the Interactive Preview section entirely; still generate Variants (just one row — default) and any Behaviors found in the source.
- **Component already has a docs page.** Preserve the file path; overwrite contents. Flag in the final report that an existing page was replaced.
- **Component exports multiple components from one file.** Document only the one whose name matches the folder (e.g. `email-row.tsx` exports `EmailRow`). Mention the others in the final report.
- **Type imports from outside the component folder.** For a type like `TagColor` imported from `../tag-button/tag-button`, treat it as an opaque string union in the API table. For the Interactive Preview, if the target type is a union of string literals, you may read that file to extract the literals and render a segmented control; otherwise, skip.
- **CSS Module class naming conflicts.** If your generated `page.module.css` uses class names that collide with `_shared/docs-ui.module.css`, rename the local ones. Never edit the shared module from this step.
