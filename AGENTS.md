# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Antigravity, Codex, etc.) when working with code in this repository.

## Repository layout

This is a **Figma-to-code design system pipeline** built around a Notion Mail Email Row component. The repo contains two things:

1. **A Next.js 16 app** — the design system implemented in code. Tokens, atoms, and the Email Row component. This is the "code spec" the Figma skill reads from at runtime.
2. **[.claude/skills/figma-create-email-row/](.claude/skills/figma-create-email-row)** — project-scoped skill that instantiates the published Email Row (Mode A) or a full Inbox Template (Mode B) into the user's current Figma file, using the Next.js code as the canonical spec.

## Dev commands

```bash
npm install
npm run dev     # Next.js dev server (http://localhost:3000)
npm run build   # production build
npm run lint    # eslint
```

There is no test runner configured.

## Next.js 16 caveat

This project uses **Next.js 16.2.3 + React 19.2.4**. APIs, conventions, and file structure may differ from older Next.js knowledge. Before writing Next.js code, check the relevant guide in `node_modules/next/dist/docs/` and honor deprecation notices — do not assume behavior from earlier versions.

## Code architecture

### Token layering (zero hardcoded values rule)

Every CSS property in component styles references a global token. The layering:

- [src/tokens/colors-raw.css](src/tokens/colors-raw.css) — flat primitives (`--raw-neutral-900`, `--raw-blue-500`, alpha variants). Mirrors the Figma `Primitives` variable collection.
- [src/tokens/colors-semantic.css](src/tokens/colors-semantic.css) — semantic names (`--color-content-primary`, `--color-surface-base`) that map to raw primitives and swap under `[data-theme="dark"]`. Theme switching happens by setting `data-theme` on an ancestor, not via CSS media query.
- [src/tokens/spacing.css](src/tokens/spacing.css), [radius.css](src/tokens/radius.css), [size.css](src/tokens/size.css), [typography.css](src/tokens/typography.css) — T-shirt scale + size/radius tokens. Keys match Figma variable names.
- [src/tokens/index.css](src/tokens/index.css) — barrel import; pulled in by [src/app/globals.css](src/app/globals.css).

When adding CSS, **never introduce a px or hex literal** — add or reuse a token instead. The token names are the interface that keeps code and Figma variables in sync.

### Styling approach

CSS Modules (`*.module.css`) per component for scoped class names. All values reference the global custom properties above. Components live under `src/components/<name>/` with a `.tsx` + `.module.css` pair (e.g. [email-row.tsx](src/components/email-row/email-row.tsx) + [email-row.module.css](src/components/email-row/email-row.module.css)).

### Email Row component

[src/components/email-row/email-row.tsx](src/components/email-row/email-row.tsx) is the canonical pattern. Hover state is CSS-only (`:hover`), not a prop — the action bar is always rendered and revealed via CSS. Date formatting is centralized in [utils.ts](src/components/email-row/utils.ts) with three cases: today → 12hr time, current year → "Mon DD", past year → "Mon DD, YYYY". **The Figma skill encodes this same logic and must stay in sync with `utils.ts`.**

Sender info container is fixed at `16vw` (viewport-relative — annotated in Figma). Multi-sender truncation (`formatSenders`) shows prefix + `.. LastName` suffix when >3 senders.

### Playground and inbox pages

- [src/app/page.tsx](src/app/page.tsx) + [src/playground/](src/playground) — interactive Email Row playground. The presets in [email-row-preview.tsx](src/playground/email-row-preview.tsx) are the **canonical configurations** the skill reads when generating rows in Figma.
- [src/app/inbox/page.tsx](src/app/inbox/page.tsx) — full Inbox Template demo (sidebar + filters + grouped rows). This is what the skill's Mode B targets.

### Adding a new route

Next.js App Router is file-system routed — each URL is a folder under [src/app/](src/app). To add `/promotions`, create `src/app/promotions/page.tsx`. Colocate the route's CSS module, data file, and hooks in the same folder (follow the pattern in [src/app/inbox/](src/app/inbox)).

### Fonts

Momo Trust Sans is loaded via `next/font/local` in [layout.tsx](src/app/layout.tsx) from [fonts/](fonts). The `--font-momo` CSS variable is applied at `<html>`.

## Working with the Figma skill

The [figma-create-email-row skill](.claude/skills/figma-create-email-row/SKILL.md) (~900 lines) is the live runtime artifact. Key properties:

- **Reads code at runtime.** The skill deliberately has no baked-in preset data — it reads [email-row.tsx](src/components/email-row/email-row.tsx), [utils.ts](src/components/email-row/utils.ts), and [email-row-preview.tsx](src/playground/email-row-preview.tsx) per run. Changes to those files flow into the next skill invocation without editing SKILL.md.
- **Writes via Official Figma MCP (`use_figma`) only.** Console MCP is used strictly for `figma_get_selection` and `figma_capture_screenshot` (live `exportAsync`). Before calling `use_figma`, the `figma-use` skill MUST be loaded and passed in `skillNames` — skipping this causes hard-to-debug failures. See the `MCP tool selection` section in SKILL.md.
- **Cached master IDs.** SKILL.md hard-codes Email Row variant node IDs + keys and stable master child IDs for text slots. Unread variants use `1:xxx` child IDs; read variants use `5:xxx`. **Do not guess** — if the master component set (`3:114`) is restructured, update the cached tables.
- **Confirmation gate before any Figma writes.** The skill presents variant + content summary and waits for explicit user confirmation. Writes are one atomic `use_figma` script per run.
- **Hard cap: 3 review/fix iterations.** If the third screenshot still shows issues, the skill stops and reports.

### Invoking the skill from different agents

- **Claude Code:** the skill loads from `.claude/skills/figma-create-email-row/` automatically. Type `/figma-create-email-row` or use a natural-language trigger like "create an email row".
- **Cursor:** the skill is available at `.cursor/skills/figma-create-email-row/` (a symlink to the canonical `.claude/skills/figma-create-email-row/` — single source of truth, no drift). Invoke from the `/` slash menu in Cursor's Agent chat, or let the agent pick it up automatically from natural language. Cursor docs: [cursor.com/docs/skills](https://cursor.com/docs/skills). **Windows note:** symlinks require `git config core.symlinks=true` and developer mode; on Windows the `.cursor/skills/figma-create-email-row` path may appear as a text file — if so, invoke the skill through the canonical `.claude/skills/figma-create-email-row/` path instead, which Cursor also reads via backward compatibility.
- **Codex:** the skill is available at `.agents/skills/figma-create-email-row/` (a symlink to the canonical `.claude/skills/figma-create-email-row/`). Codex reads **only** `.agents/skills/` — not `.claude/` or `.cursor/`. Invoke via `/skills`, `$figma-create-email-row`, or let Codex pick it up automatically from natural language. Codex docs: [developers.openai.com/codex/skills](https://developers.openai.com/codex/skills). Same Windows symlink caveat as Cursor applies.
- **Antigravity:** convention not yet verified — if your agent doesn't pick up the skill automatically from any of the folders above, ask it to "follow the instructions in `.claude/skills/figma-create-email-row/SKILL.md`". The file is plain markdown and any agent can execute it.

Figma file context: `Figma MCP - Notion Mail`, file key `HvPhpLOICspP0CD05ST9fL`, Email Row component set `3:114`.