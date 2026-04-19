# Notion Mail — Figma ↔ Code Workflows

A hands-on playground for **designers and product managers** to explore what happens when a design system lives in both Figma and code at the same time, with AI coding agents bridging the two.

This repo ships:

- A live **Notion Mail design system** (tokens, components, full inbox demo) running as a Next.js app.
- Two **AI skills** that automate the most tedious parts of the Figma ↔ code loop — dropping configured components into Figma, and generating interactive docs pages for any component in the codebase.

You don't need to be a developer to use it. You **do** need a few tools installed so the AI agents can read the code and talk to Figma on your behalf.

---

## Table of contents

1. [What you can do with this project](#what-you-can-do-with-this-project)
2. [Prerequisites](#prerequisites)
3. [One-time setup](#one-time-setup)
4. [Running the app](#running-the-app)
5. [Routes — what you'll see in the browser](#routes--what-youll-see-in-the-browser)
6. [The two skills, explained](#the-two-skills-explained)
7. [When to run each skill (and in what order)](#when-to-run-each-skill-and-in-what-order)
8. [Workflow recipes](#workflow-recipes)
9. [Troubleshooting](#troubleshooting)
10. [Where things live](#where-things-live)

---

## What you can do with this project

| You want to… | Open this | Or run this skill |
|---|---|---|
| Browse the component library with live previews and controls | `/docs` in the browser | — |
| See a full working email inbox (light + dark mode) | `/inbox` | — |
| Drop a real, configured Email Row into your Figma file | — | `/figma-create-email-row` |
| Build a full Inbox screen in Figma with grouped emails and realistic dates | — | `/figma-create-email-row` (Mode B) |
| Generate an interactive docs page for a component (like the Email Row one) | — | `/document-component` |
| Experiment with UI ideas without touching the design system | `/prototypes/chethan` or `/prototypes/sarah` | — |

---

## Prerequisites

You'll need:

1. **Node.js 20+** — [nodejs.org](https://nodejs.org). Required to run the Next.js app.
2. **Figma desktop app** — the skills write to Figma via MCP, which only works with the desktop app open.
3. **An AI coding agent** — one of:
   - [Claude Code](https://claude.com/claude-code) (recommended — this is where the skills were built)
   - [Cursor](https://cursor.com)
   - [Codex](https://developers.openai.com/codex)
   - [Antigravity](https://antigravity.google.com) (should also work — convention not fully verified)
4. **Figma MCP access** — two MCP servers need to be connected in your agent:
   - **Official Figma MCP** (`use_figma`) — for writes to Figma files.
   - **Figma Console MCP** — for live screenshot verification.

   In Claude Code, check `/mcp` to confirm both are listed. In Cursor / Codex / Antigravity, configure MCP servers per their docs.

5. **Access to the Figma file** — the skills target the `Figma MCP - Notion Mail` file (file key `HvPhpLOICspP0CD05ST9fL`). You need edit access. If you want to run against your own Figma file, see [Using your own Figma file](#using-your-own-figma-file).

---

## One-time setup

```bash
git clone <this-repo>
cd notion-mail-components
npm install
```

Open the folder in your AI coding agent (Claude Code, Cursor, etc.) so it picks up the project-scoped skills from `.claude/skills/`, `.cursor/skills/`, or `.agents/skills/`.

Verify skills loaded: in Claude Code, type `/` — you should see `/figma-create-email-row` and `/document-component` in the slash-command list. In Cursor, open the Agent chat and type `/`. In Codex, run `/skills`.

---

## Running the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/docs`.

Other useful scripts:

```bash
npm run build   # production build
npm run lint    # eslint
```

---

## Routes — what you'll see in the browser

| Route | What it is | Who it's for |
|---|---|---|
| `/` | Redirects to `/docs` | — |
| `/docs` | Design-system home: grid of ready and "Soon" components | Everyone |
| `/docs/components/email-row` | The canonical docs page — header, **interactive preview with live controls**, variants, behaviors, API table, sticky TOC | Designers, PMs, engineers |
| `/docs/atoms/tag-button` | Same docs pattern, smaller surface | Same |
| `/inbox` | Full working Notion Mail inbox: sidebar, filters, grouped emails, hover actions, light/dark toggle (keyboard: `T`) | Best "demo this to a stakeholder" surface |
| `/promotions` | Promotions tab demo | Same |
| `/socials` | Socials tab demo | Same |
| `/prototypes/chethan` | Individual designer's experiments (e.g., `hover-experiment`) | Anyone exploring ideas |
| `/prototypes/sarah` | Empty playground scaffolded for Sarah | — |

The Interactive Preview on the Email Row docs page is the most useful thing to show a stakeholder — every prop is a live control, and the URL/hash updates so you can link to a specific configuration.

---

## The two skills, explained

### 1. `/figma-create-email-row` — build in Figma, from code

**What it does:** reads the Email Row component, utilities, and playground presets in this repo, then drops a correctly configured instance into your Figma file. No manual variant-picking, no typos, no copy-pasting props.

It has **two modes**:

- **Mode A — single Email Row.** One row from a canonical playground preset (e.g., "unread with attachment and 2 labels"). Good for spot-checking a variant.
- **Mode B — full Inbox Template.** Instantiates the published Inbox Template and fills its slot with date-grouped section headers (Today / Yesterday / Earlier this week…) plus ~15–20 email rows, each with realistic content and dates that match its group. Good for filling a screen for a stakeholder review or a narrative.

**How it talks to Figma:** via the Official Figma MCP (`use_figma`) for writes, and the Figma Console MCP for live screenshots — the skill screenshots its own work and iterates up to 3 times if it spots issues. You'll see those screenshots in the chat.

**What it asks you before writing:**
- Which preset (Mode A) or how many groups/rows (Mode B).
- Where to place the instance — select an empty frame or let it pick an empty area.
- A final confirmation summary before any Figma writes.

**Triggers:**
- Slash: `/figma-create-email-row`
- Natural language: "create an email row", "design an email row", "create inbox", "full inbox template", "email inbox with groups"

### 2. `/document-component` — generate docs, from code

**What it does:** reads a component's source in `src/components/<name>/` and generates a full docs page at `src/app/docs/components/<name>/` or `src/app/docs/atoms/<name>/` that looks and behaves exactly like the Email Row docs page:

- Header with title + description
- **Interactive preview** with auto-inferred controls for every prop
- Variants gallery
- Behaviors section (the skill proposes candidates and you confirm)
- API props table
- Sticky table of contents

It also flips the sidebar entry from "Soon" → active, runs lint, and verifies the page renders without errors.

**What it asks you:**
- One-paragraph component description (if not obvious from source).
- Which Behaviors sections to include (it proposes candidates).
- Confirmation before writing files.

**Triggers:**
- Slash: `/document-component`
- Natural language: "document component", "generate docs for tag-button", "update docs for checkbox"

This skill is **code-only** — it never touches Figma.

---

## When to run each skill (and in what order)

There's no hard order — the skills are independent. But here's how they usually chain in practice:

```
┌─────────────────────────────────────────────────────────────────────┐
│  A designer / engineer adds or updates a component in the codebase  │
│  (e.g., a new Checkbox at src/components/checkbox/checkbox.tsx)     │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
       ┌───────────────────────────────────────────────┐
       │  /document-component checkbox                 │
       │  → interactive docs page goes live at         │
       │    /docs/atoms/checkbox                       │
       │  → stakeholders can now play with it          │
       └───────────────────────────────────────────────┘
                               │
                               ▼
       ┌───────────────────────────────────────────────┐
       │  /figma-create-email-row  (or a future       │
       │   similar Figma-side skill)                   │
       │  → populate your Figma file with realistic   │
       │    instances for a review, a narrative, or   │
       │    handoff                                    │
       └───────────────────────────────────────────────┘
```

**Rule of thumb:**

- **Run `/document-component` whenever code changes.** New prop? New variant? New component folder? Re-run the skill and the docs page refreshes. PMs and designers can then open `/docs/...` to self-serve.
- **Run `/figma-create-email-row` whenever you need artifacts in Figma.** A stakeholder review, an exploration, a narrative deck — anything where you'd otherwise be manually dragging components and typing content.

You can run them in either order, and you can run them many times — both skills are idempotent (they overwrite their own outputs cleanly).

---

## Workflow recipes

### Recipe 1 — "I want to show a PM what the inbox looks like"

1. `npm run dev`
2. Open [http://localhost:3000/inbox](http://localhost:3000/inbox)
3. Press `T` to toggle light/dark mode
4. Share your screen or the localhost URL over Tailscale / ngrok / etc.

No skills needed.

### Recipe 2 — "I want to tweak an email row and see it in Figma"

1. Open `/docs/components/email-row` in the browser, play with the Interactive Preview controls until you like the configuration.
2. Open your Figma file (desktop app).
3. In your AI agent, say: **"create an email row matching the unread-with-attachment preset"** (or whichever preset fits).
4. The skill will confirm the variant + content with you, place it in Figma, and show you a screenshot.

### Recipe 3 — "I'm preparing a design review and need a full inbox in Figma"

1. Open the target Figma file.
2. Select an empty section or frame where you want the inbox to land.
3. In your AI agent: **"create a full inbox template with grouped email rows"**
4. Confirm the group count (Today / Yesterday / Earlier…) and row count when asked.
5. Review the screenshots the skill posts back; it will fix issues for up to 3 iterations before stopping.

### Recipe 4 — "I just added a new component to the codebase — I want docs for it"

1. Make sure the component exists at `src/components/<name>/<name>.tsx` (and ideally `<name>.module.css`).
2. In your AI agent: **"document the checkbox component"** (or `/document-component checkbox`)
3. Answer the skill's questions: one-paragraph description, which Behaviors to include.
4. Once it finishes, open `/docs/atoms/<name>` or `/docs/components/<name>` in the browser — your new page is live with interactive controls.

### Recipe 5 — "I want to prototype a one-off idea without touching the design system"

1. Create a folder under `src/app/prototypes/<your-name>/<idea-slug>/` with a `page.tsx`.
2. Visit `/prototypes/<your-name>/<idea-slug>`. Done.
3. The prototype is sandboxed — it won't show up in `/docs` and won't affect the design system.

---

## Troubleshooting

**The skills don't appear in my agent's slash menu.**
- Make sure you opened the project folder at the repo root (not a subfolder).
- Claude Code reads `.claude/skills/`. Cursor reads `.cursor/skills/`. Codex reads `.agents/skills/`. These are symlinks to the canonical `.claude/skills/` location. On Windows, symlinks may require enabling developer mode + `git config core.symlinks=true`.

**`use_figma` fails with "not connected" or similar.**
- Open the Figma desktop app and make sure the target file is open and focused.
- In your agent, confirm the Figma MCP server is connected (`/mcp` in Claude Code).

**Screenshots from the skill look stale.**
- The skill uses the Figma Console MCP (live `exportAsync`) for screenshots, but falls back to REST if Console is disconnected. REST can be stale right after a write — if you see something wrong, ask the skill to re-capture.

**`/document-component` says "component not found".**
- The component must live at `src/components/<name>/<name>.tsx`. Check the folder name.

**Dev server won't start.**
- Make sure you ran `npm install`. Next.js 16 + React 19 require Node 20+.

---

## Where things live

```
notion-mail-components/
├── README.md                        ← you are here
├── AGENTS.md                        ← deeper architecture notes for AI agents
├── src/
│   ├── app/
│   │   ├── docs/                    ← design system documentation site
│   │   │   ├── components/email-row/   ← canonical docs page pattern
│   │   │   └── atoms/tag-button/
│   │   ├── inbox/                   ← full working inbox demo
│   │   ├── promotions/              ← promotions tab demo
│   │   ├── socials/                 ← socials tab demo
│   │   └── prototypes/              ← individual designer playgrounds
│   ├── components/                  ← component library (email-row, checkbox, tag-button, …)
│   ├── tokens/                      ← design tokens (colors, spacing, radius, typography)
│   └── playground/                  ← canonical presets read by the Figma skill
├── .claude/skills/                  ← skill source of truth
│   ├── figma-create-email-row/SKILL.md
│   └── document-component/SKILL.md
├── .cursor/skills/                  ← symlinks → .claude/skills
└── .agents/skills/                  ← symlinks → .claude/skills
```

### Using your own Figma file

The `figma-create-email-row` skill is pre-configured for the `Figma MCP - Notion Mail` file (file key `HvPhpLOICspP0CD05ST9fL`) and references specific cached component node IDs (Email Row component set `3:114`). To point it at your own file, you'd need to:

1. Publish an Email Row component set of your own to a team library.
2. Update the "Cached master component reference" section at the top of [.claude/skills/figma-create-email-row/SKILL.md](.claude/skills/figma-create-email-row/SKILL.md) with your new node IDs and variant keys.

For now, treat the Figma skill as a **demonstration of the pattern** — the `/document-component` skill works against any codebase and is the more portable of the two.

---

## Want deeper details?

- Architecture, token layering, and Figma skill internals: [AGENTS.md](AGENTS.md)
- How the Figma skill works step-by-step: [.claude/skills/figma-create-email-row/SKILL.md](.claude/skills/figma-create-email-row/SKILL.md)
- How the docs generator works step-by-step: [.claude/skills/document-component/SKILL.md](.claude/skills/document-component/SKILL.md)
