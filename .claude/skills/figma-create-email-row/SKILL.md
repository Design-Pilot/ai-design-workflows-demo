---
name: figma-create-email-row
description: Create a configured Email Row instance OR a full Inbox Template with grouped email rows in the current Figma file. Mode A drops exactly one Email Row from the canonical playground presets. Mode B instantiates the published Inbox Template, fills its slot with date-grouped Section Headers and Email Rows, then verifies via a live screenshot review loop. Use when the user says "create email row", "design an email row", "make a new email row", "create inbox", "full inbox template", "email inbox with groups", or invokes /figma-create-email-row.
---

# figma-create-email-row

Two-mode skill that drops email content into the user's Figma file. Reads the canonical playground presets from the Phase 3 Next.js code, confirms a selected configuration with the user before touching Figma, places the instance in an empty area, then iteratively reviews a live screenshot and fixes issues (hard cap: 3 iterations for both modes).

**Scope:**
- **Mode A** — exactly one Email Row per invocation. Default path for "create email row" triggers.
- **Mode B** — one Inbox Template instance + 2–4 Section Headers + up to ~20 Email Rows, all placed inside the template's slot region. Triggered by "create inbox", "full inbox template", "email inbox with groups".

### Mode divergence map

| Concern | Mode A | Mode B |
|---|---|---|
| Scope | 1 row | 1 template + N headers + M rows |
| TodoWrite length | 8 items | 10 items |
| Confirmation gate | Step 3 | Step M4 |
| Placement parent | empty area, any container | empty area, **page root or SECTION only** |
| Screenshot scale | 2 | 1 (too big otherwise) |
| Fix-loop cap | 3 | 3 |
| SLOT label recipe (row internals) | yes | yes (per row) |
| SLOT template injection | no | yes (see Known limitations) |
| Preset tailoring | one row | per-row, date-coherent per group |
| Existing instances | — | additive only; never deletes prior instances |

**Figma file context:**
- File: `Figma MCP - Notion Mail` (key `HvPhpLOICspP0CD05ST9fL`)
- Email Row component set node ID: `3:114`
- Email Row + atoms + all variable collections (Primitives, Colors, Spacing, Radius, Size, typography) + icon components (Paperclip, Calendar) are published to the team library.

**Code spec location:** `src/components/email-row/` (component + utils) and `src/playground/email-row-preview.tsx` (canonical presets).

---

## MCP tool selection

**Writes — `use_figma` (Official Figma MCP) only.** One atomic script per run (Step 5 / M6). Load the `figma-use` skill before the first call and pass `skillNames: "figma-create-email-row,figma-use"` on every call. On script failure: read the error, fix the script, retry — scripts are atomic so there's no partial state. If a cached ID / key is stale, fall back to `search_design_system` inside `use_figma`.

**Reads — Console MCP for two calls only:** `figma_get_selection` (placement) and `figma_capture_screenshot` (live `exportAsync`, always current). Do NOT use REST `get_screenshot` as primary — it's been observed stale immediately after writes.

**Plugin probe (once per run, Step 0):** call `figma_get_status` and cache `pluginConnected`. If disconnected, skip `figma_get_selection` (default to empty-area placement) and substitute REST `get_screenshot` for captures — bust the cache by re-capturing at a different `scale` if content looks unchanged. Do NOT re-probe per call. Flip the flag on unexpected Console failures and stay on REST for the rest of the run.

---

## Cached master component reference

These IDs and keys are properties of the Email Row master component set `3:114` and its related atoms. They do NOT change across runs unless the master is restructured. Use them directly — do NOT re-query via `figma_get_component_for_development_deep` on every run.

### Email Row variant keys (ComponentSet `3:114`)

| Variant (`Read?`, `Hover?`, `Selected?`) | Variant node ID | Variant key |
|---|---|---|
| `No, No, No` (default unread) | `1:141` | `2a04f55bc6ae13d8fc1b5e32827e469637715b2f` |
| `No, Yes, No` | `3:146` | `4913886fcab5197f198816ce84c97f3880f55d1f` |
| `No, Yes, Yes` | `5:739` | `c99f72cbddc1f9e0786755a0528d3191d7d1f0f7` |
| `No, No, Yes` | `5:924` | `96ad92b63db78f7b197df7f86da0814d778831f2` |
| `Yes, No, No` (default read) | `5:779` | `a43266d4c85c4af8c6ad5348dc28fbee3ea603ec` |
| `Yes, Yes, No` | `5:801` | `6511503dbf22a4ec55a3b16768aab2453441fdab` |
| `Yes, Yes, Yes` | `5:845` | `58e9a5de0a81d10fc661e4652fa58044e737a2e8` |
| `Yes, No, Yes` | `5:949` | `2b54bec2ab81e9f75c02547e53a7fccdd4b440bf` |

Each Email Row instance has the ID pattern `<instanceId>`, and its nested children have IDs of the form `I<instanceId>;<masterChildNodeId>`.

### Stable master child IDs (inside every Email Row instance)

**CRITICAL — variants use DIFFERENT child IDs for text nodes.** Unread-family variants (`1:141` base) use `1:xxx` IDs; read-family variants (`5:779` base) use `5:xxx` IDs. Always pick the right set for the row's `isRead` flag.

**Unread variants** (`No, *, *` — node IDs 1:141, 3:146, 5:739, 5:924):

| Role | Master child ID | Usage |
|---|---|---|
| Sender name (TEXT) | `1:101` | Route through the `writeText` helper — it reads `node.fontName` from the master and handles load/fallback. |
| Title / Subject (TEXT) | `1:104` | Same. |
| Description / Preview (TEXT) | `1:105` | Same. |
| Date (TEXT) | `1:111` | Same. Master style is `Regular` — do NOT hardcode `Medium` as earlier revisions did. |
| Count `"0"` (TEXT) | `1:102` | Visibility controlled by `Count#3:2`. |
| Labels Slot (SLOT) | `1:155` | Controlled by `-> Labels#3:5` boolean. |
| Trailing Icon Button (INSTANCE) | `3:73` | Controlled by `-> Trailing Button#3:6` boolean. |
| Trailing icon Placeholder (INSTANCE inside `3:73`) | `3:68` | Swap target for Paperclip / Calendar. |

**Read variants** (`Yes, *, *` — node IDs 5:779, 5:801, 5:845, 5:949) — discovered run 4 (Mode B):

| Role | Master child ID |
|---|---|
| Sender name (TEXT) | `5:789` |
| Title / Subject (TEXT) | `5:792` |
| Description / Preview (TEXT) | `5:793` |
| Date (TEXT) | `5:800` |
| Count `"0"` (TEXT) | `5:790` |
| Labels Slot (SLOT) | `5:796` |
| Trailing Icon Button (INSTANCE) | `3:73` (same as unread) |
| Trailing icon Placeholder | `3:68` (same as unread) |

Per instance, compose the concrete ID as `I<instanceId>;<masterChildId>`. In Mode B (slot context), the composed ID extends further: `I<inboxId>;<slotRegionId>;<wrapperChildId>;<masterChildId>` — use `getNodeByIdAsync` with the full path for reliability. If the row's original creation ID is known, `getNodeByIdAsync('I' + row.id + ';' + masterChildId)` also resolves correctly (Figma aliases original IDs through slot moves).

### Component property keys on Email Row

| Property key | Type | Purpose |
|---|---|---|
| `Read?` | VARIANT | Baked in at instantiation time via variant choice. |
| `Hover?` | VARIANT | Same. |
| `Selected?` | VARIANT | Same. |
| `Count#3:2` | BOOLEAN | Toggles the `"0"` count TEXT node visibility. |
| `Category#3:3` | BOOLEAN | Toggles the category Tag Button. |
| `-> Labels#3:5` | BOOLEAN | Toggles the Labels Slot. |
| `-> Labels Slot#3:4` | SLOT | The slot property itself. Do not set directly. |
| `Trailing Assets#15:11` | BOOLEAN | Toggles the trailing assets container. |
| `-> Trailing Button#3:6` | BOOLEAN | Toggles the trailing Icon Button visibility. |

### Icon components (for trailing-icon swap)

| Icon | Master node ID | Component key |
|---|---|---|
| Paperclip | `3:30` | `96718d3a7434103943ee17148931a9bb86bd929e` |
| Calendar | `3:51` | `fd32609aabf5083732b0dfed318c0244a85b9e96` |

Both are now published to the team library, so `importComponentByKeyAsync(key)` inside `use_figma` works without the local-page fallback that run 2 needed.

### Tag Button (label) variants

The Tag Button component set is `3:5`. Its only property is `Type` (VARIANT) with values: `Neutral | Yellow | Green | Blue | Brown`. **There is no `Red`, `Orange`, or `Purple`.** Map React `TagColor` values to the nearest Figma variant:

| React `TagColor` | Figma `Type` variant |
|---|---|
| `blue` | `Blue` |
| `green` | `Green` |
| `yellow` | `Yellow` |
| `brown` | `Brown` |
| `red` | **Brown** (closest tone; flag as "fallback from red" in Step 11) |
| `orange` | **Yellow** (flag as "fallback from orange") |
| `purple` | **Blue** (flag as "fallback from purple") |

### Cache staleness guard

If any cached key returns null or throws in `importComponentByKeyAsync` / `getNodeByIdAsync`, the master has been restructured. Fall back to `search_design_system` (Official MCP) with `query: "Email Row"` (or `"Inbox Template"` / `"Section Header"`) and update the cache table in this file as part of the fix.

### Mode B — Inbox Template reference (master `20:3773`)

| Role | Node ID | Key / property |
|---|---|---|
| Master component | `20:3773` | `455a12c355e26153f56bca111e6bb4cafa06f00f` |
| Slot region | `20:3774` | component property `Slot#20:20` (type `SLOT`) |
| Sidebar frame (do NOT touch) | `20:3740` | — |
| Main content frame (do NOT touch) | `20:3775` | — |
| Top header frame — "Inbox" title + filter dropdowns (do NOT touch) | `20:3739` | — |

**Slot region geometry:** VERTICAL auto-layout, 0 gap, 1680 × 984, `clipsContent: true`, **empty by default**. No default contents to clear. The slot's single component property is `Slot#20:20`.

### Mode B — Section Header reference (master `20:3197`)

| Role | Node ID | Key / property |
|---|---|---|
| Master component | `20:3197` | `fe4462d76fce45eab034693f63c22b742a6a08f6` |
| Title TEXT child | `20:3193` | write via `I<instanceId>;20:3193` — **no component property**, mutate `.characters` directly |

**Size:** 1680 × 78 fixed. Left padding 54, right padding 40. Bottom border bound to `Border/border-default`. Title color bound to `Content/primary`. Typography: Momo Trust Sans Medium 14 / 20 / -0.3.

**Critical:** Section Header has NO component property for the title text. Route `.characters` writes through the `writeText` helper — it reads `node.fontName` from the master and handles font load + Inter fallback automatically.

### Mode B — Cached grouping annotation (from `data-development-annotations` on `20:3197`)

> Copy variants
>
> 1. Don't show for Today
> 2. Yesterday
> 3. Last 7 days
> 4. Last 30 days
> 5. Month - Anything before the last 30 days.

**Interpretation for M2:**
- `Today` rows render without any Section Header (first rows in the wrapper).
- `Yesterday`, `Last 7 days`, `Last 30 days` use those fixed literal strings as the header text.
- Anything older than the last 30 days uses the full month name as the header text (e.g. `March`, `February`, `January`, `December 2025`). Include the year suffix only when the month is in a prior calendar year.

---

## Step 0 — Mode selection

**Runs before TodoWrite.** Inspect the invoking trigger message and pick the mode:

- Trigger contains `row`, `single email`, `design an email row`, or `/figma-create-email-row` without inbox keywords → **Mode A**.
- Trigger contains `inbox`, `full inbox`, `inbox template`, `email groups`, `inbox with groups` → **Mode B**.
- Truly ambiguous → call `AskUserQuestion` with two options (Mode A / Mode B) before proceeding.

Record the chosen mode in a local variable. Use it to select the correct TodoWrite template below AND the correct execution path (Steps 1–8 for Mode A, Steps M1–M9 for Mode B).

---

## Per-run checklist

**Before doing anything else on every invocation, call `TodoWrite` with the 4-milestone checklist for the mode picked in Step 0.** The per-step execution detail is in the step-by-step section below — the TodoWrite list is intentionally coarse so the user sees progress without noise.

Discipline:
- Flip a milestone to `in_progress` **before** you start it.
- Flip it to `completed` **immediately** after it finishes.
- Never keep more than one milestone `in_progress` at a time.
- If a milestone fails or is blocked, leave it `in_progress` and add a follow-up task describing the blocker.

### Mode A checklist (4 milestones)

1. Read spec + pick preset + present config and get user confirmation (GATE — covers Steps 1–3)
2. Detect placement + build instance in Figma via one atomic `use_figma` script (covers Steps 4–5)
3. Screenshot + review-and-fix loop, max 3 iterations (covers Steps 6–7)
4. Report instance node ID, applied props, and final screenshot to user (Step 8)

### Mode B checklist (4 milestones)

1. Read spec + build date-grouped plan + present inbox plan and get user confirmation (GATE — covers Steps M1–M4)
2. Detect placement + build inbox in Figma via one atomic `use_figma` script (covers Steps M5–M6)
3. Screenshot + review-and-fix loop, max 3 iterations (covers Steps M7–M8)
4. Report all mutated node IDs + outstanding issues + any newly resolved library keys to user (covers Steps M9)

---

## Step-by-step execution

> **Mode A runs Steps 1–8 below unchanged.** Mode B skips them and runs Steps M1–M9 in the next section.

### Step 1 — Read canonical presets + code spec

**The canonical mock-data source is `src/playground/email-row-preview.tsx`.** That file holds a `PRESETS` array with pre-vetted examples covering every prop combination the Email Row supports: unread/read, with/without category, count + multi-sender, labels + colors, past-year dates, trailing icons. **Do not invent mock data from scratch** — pick a preset, optionally tweak content strings, keep the structural props as-is.

**Files to read, in this order (stop as soon as you have what you need):**
1. `src/playground/email-row-preview.tsx` — the `PRESETS` array. Source of truth for valid prop combinations and the trailing-icon allowlist (imports at top of file).
2. `src/components/email-row/email-row.tsx` — the `EmailRowProps` interface and the `formatSenders()` helper at lines 10–19. Rule for multi-sender display: ≤ 3 names → comma-joined; ≥ 4 names → `"First, Second .. Last"`.
3. `src/components/email-row/utils.ts` — `formatDate()`. Today → 12hr time; current year → `Month DD`; past year → `Month DD, YYYY`.
4. `src/components/email-row/email-row.module.css` — only if a prop → visual mapping is ambiguous. Usually skip.

**Output of this step:** a mental model of (a) the preset shapes, (b) the trailing-icon allowlist, (c) `formatSenders`, (d) `formatDate`. Do NOT proceed to Figma writes until this is loaded.

### Step 2 — Pick a preset (or tailor one) and resolve display strings

**Default path:** pick one preset at random from `PRESETS`, optionally swap the example index. Store the selected example as the config.

**Tailoring path (when the user's trigger gives context — e.g. "CEO Monday morning"):** use the context to choose the preset category first, then swap content strings (sender, subject, preview) to match the persona while keeping the structural props untouched.

**Non-negotiable rules:**
- **Senders + count coupling.** If the chosen preset has `showCount: true` AND `count >= 4`, you MUST supply a `senders: string[]` of length `count`, not a single `sender` string. The Figma "Sender name" text is then `formatSenders(senders).prefix + (suffix ? " " + suffix : "")`, flattened to a single string.
- **Trailing icon allowlist.** Valid trailing icons are only those imported at the top of `email-row-preview.tsx` and used as `trailingIcon` in at least one preset — today: `IconPaperclip` and `IconCalendar`. Never pick action-bar icons (`IconStar`, `IconArchive`, etc.). If the user explicitly asks for one not in the allowlist, stop and tell them the allowlist.
- **Date formatting.** Apply `formatDate()` literally.
- **Label colors must exist in Figma Tag Button variants.** Map React `TagColor` → Figma `Type` variant via the table in the Cached Reference section. If the mapping is a fallback (red → Brown, orange → Yellow, purple → Blue), note it and surface it in Step 11.
- **User specificity overrides the preset.** Any prop or value the user called out is locked.

**Output:** a single config object with both the raw preset values and the derived display strings:
```
{
  // Structural
  variantKey,                      // looked up from cached reference
  readState, selectedState,
  showCount, count,
  showCategory, category?,
  showLabels, labelColor? (Figma variant), labelText?,
  showTrailingAssets, trailingIcon? ('paperclip' | 'calendar' | null),

  // Text content (ready to write)
  senderDisplay,                   // flattened formatSenders output
  subject,
  preview,
  dateDisplay,                     // formatDate output
  countDisplay,                    // String(count) when showCount

  // Metadata for Step 11
  sourcePresetLabel, sourceExampleIndex,
  fallbackNotes,                   // e.g. ['label color red → Brown']
}
```

### Step 3 — Summary + confirmation (GATE)

Present a compact summary to the user in this exact shape:

```
Email Row configuration:
  Theme: <light|dark>
  State: <read/unread, default/selected>
  Content:
    Sender: <senderDisplay — note if this is a formatSenders multi-sender render>
    Subject: <subject>
    Preview: <preview>
    Date: <dateDisplay — formatted per utils.ts>
    Count: <n or "hidden">
  Category: <label + color or "hidden">
  Labels: <[{label, color}] or "none" — note any Figma variant fallbacks>
  Trailing icon: <paperclip | calendar | "hidden">
  Source preset: <PRESETS[i].label, example index j>
  Fallback notes: <list or "none">

(Placement in Figma will be resolved automatically after you confirm — a
free area on the current page, computed from existing top-level node bounds.)

Proceed? (yes / change X to Y / cancel)
```

**Rules:**
- Wait for an explicit response. Do not call any Figma write tool before the user confirms.
- If the user requests changes, update the config and re-present the summary. Loop until confirmed.
- If the user says cancel, stop and report nothing was written.

### Step 4 — Detect placement target (empty-area aware)

**Runs ONLY after Step 3 confirms.**

**Decision order:**
1. **Plugin disconnected?** Skip selection read entirely — default to empty-area placement (decision 3).
2. **Current selection is a container.** Call `mcp__figma-console__figma_get_selection` (only if `pluginConnected`). If exactly one selection and it is a `FRAME` / `GROUP` / `SECTION` / `COMPONENT` → new instance becomes a child of that node. Done.
3. **Current selection is a leaf.** Prefer the nearest ancestor frame as parent.
4. **Nothing selected → find empty space.** Inside the Step 5 `use_figma` script (not a separate call), compute the bounding box of `figma.currentPage.children` with an `absoluteBoundingBox`, then place at `{ x: minX, y: maxY + 80 }`. If the page is empty, fall back to `{ x: 0, y: 0 }`.

**Never use `figma.viewport.center`** — the viewport is wherever the user is looking, not guaranteed empty.

**Output:** `{ parentNodeId | null, placementMode: 'selection' | 'empty-area' }`. If mode is `empty-area`, position is resolved inside the Step 5 script. Store this for Step 5.

### Step 5 — Build instance in Figma (single `use_figma` script)

**Tool:** `mcp__088f94c5-52cf-4a05-80fd-32f4296aaae2__use_figma` (Official Figma MCP), with `skillNames: "figma-create-email-row,figma-use"` and `fileKey: "HvPhpLOICspP0CD05ST9fL"`.

**Prerequisite:** the `figma-use` skill MUST be loaded before this call. It documents atomic script semantics, font loading via `listAvailableFontsAsync`, and the nested-instance override patterns this script relies on.

**What the script does in one atomic pass:**
1. **Font loading is handled on-demand inside `writeText`** (step 6). The helper tries the master font (`node.fontName`) first and only falls back to Inter when `loadFontAsync` throws. On machines where the master font is loadable the text stays bound to it (no detach); otherwise it detaches to Inter at the master's own style. No pre-load needed. See `references/known-limitations.md`.
2. If placement mode is `empty-area`, compute the bounding box of top-level children and resolve `{x, y}`.
3. `importComponentByKeyAsync(variantKey)` using the cached variant key for the target `(readState, selectedState)` combination.
4. `mainComponent.createInstance()`, set its `x`/`y` (and `parent.appendChild(instance)` if a container was resolved in Step 4).
5. Set component properties in ONE `setProperties` call:
   ```js
   instance.setProperties({
     'Count#3:2': showCount,
     'Category#3:3': showCategory,
     '-> Labels#3:5': showLabels,
     'Trailing Assets#15:11': showTrailingAssets,
     '-> Trailing Button#3:6': showTrailingAssets && !!trailingIcon,
   });
   ```
6. **Write text via self-healing `writeText` helper + readback assertion.** The helper reads the master's own `fontName` from each discovered node (no hardcoded style). It tries `loadFontAsync(target)` first and only falls back to Inter at the master's style when that throws. Cached per-font so repeated failed loads are free. Returns `{ok, font, detached}` so the Step 8 report can surface which writes preserved the master binding and which detached. For unread variants use the `1:xxx` child IDs; for read variants (`Yes, *, *`) use the `5:xxx` IDs from the Cached Reference "Read variants" table.
   ```js
   const fontCache = new Map(); // key `family::style` → 'ok' | 'fail'
   const ensureLoaded = async (f) => {
     const k = f.family + '::' + f.style;
     if (fontCache.has(k)) return fontCache.get(k);
     try { await figma.loadFontAsync(f); fontCache.set(k, 'ok'); return 'ok'; }
     catch (e) { fontCache.set(k, 'fail'); return 'fail'; }
   };
   async function writeText(node, text) {
     if (text == null) return { ok: false, reason: 'null text' };
     if (!node || node.type !== 'TEXT') return { ok: false, reason: 'node missing or not TEXT' };
     const target = node.fontName;
     let used = target, detached = false;
     if ((await ensureLoaded(target)) === 'fail') {
       const fb = { family: 'Inter', style: target.style };
       if ((await ensureLoaded(fb)) === 'fail') { fb.style = 'Regular'; await ensureLoaded(fb); }
       node.fontName = fb;
       used = fb;
       detached = true;
     }
     try { node.characters = text; }
     catch (e) { return { ok: false, reason: 'write threw: ' + e.message, detached }; }
     if (node.characters !== text) return { ok: false, reason: 'readback mismatch: ' + node.characters, detached };
     return { ok: true, font: used, detached };
   }
   const byChild = (cid) => figma.getNodeByIdAsync(`I${instance.id};${cid}`);
   const writeResults = {
     sender:  await writeText(await byChild(isRead ? '5:789' : '1:101'), senderDisplay),
     title:   await writeText(await byChild(isRead ? '5:792' : '1:104'), subject),
     preview: await writeText(await byChild(isRead ? '5:793' : '1:105'), preview),
     date:    await writeText(await byChild(isRead ? '5:800' : '1:111'), dateDisplay),
   };
   if (showCount) writeResults.count = await writeText(await byChild(isRead ? '5:790' : '1:102'), countDisplay);
   ```
7. **Trailing icon swap** (only if `trailingIcon` is not null):
   ```js
   const trailingBtn = await figma.getNodeByIdAsync(`I${instance.id};3:73`);
   const placeholder = trailingBtn && trailingBtn.findOne(n => n.type === 'INSTANCE');
   if (placeholder && trailingIcon) {
     const iconKey = trailingIcon === 'calendar'
       ? 'fd32609aabf5083732b0dfed318c0244a85b9e96'   // Calendar
       : '96718d3a7434103943ee17148931a9bb86bd929e';  // Paperclip
     const iconMain = await figma.importComponentByKeyAsync(iconKey);
     placeholder.swapComponent(iconMain);
   }
   ```
8. **Slot label recipe** — fresh `findAll → findOne` routed through the `writeText` helper from step 6 (pattern pinned in `references/known-limitations.md`). Only when `showLabels && labelText`:
   ```js
   const tagButtons = instance.findAll(n => n.type === 'INSTANCE' && n.name === 'Tag Button' && n.visible);
   const labelBtn = tagButtons[showCategory ? 1 : 0];
   const slotLabelResult = { attempted: true, success: false, reason: null, detached: false };
   if (labelBtn) {
     try { labelBtn.setProperties({ Type: labelColor }); } catch (e) { slotLabelResult.reason = 'variant set failed: ' + e.message; }

     // Hide any additional default Tag Buttons beyond the one we're using.
     const extras = tagButtons.filter((b, i) => i > (showCategory ? 1 : 0));
     for (const extra of extras) { try { extra.visible = false; } catch (e) {} }

     const txt = labelBtn.findOne(n => n.type === 'TEXT');
     const r = await writeText(txt, labelText);
     slotLabelResult.success = r.ok;
     slotLabelResult.reason = r.ok ? null : (r.reason || 'no TEXT child');
     slotLabelResult.detached = !!r.detached;
   }
   ```
9. `return { instanceId: instance.id, createdNodeIds: [instance.id], mutatedNodeIds: [instance.id], writeResults, slotLabelResult, placementPosition: {x, y} };`

**Rules for the script:**
- Wrap individual operations (setProperties, text writes, slot writes) in try/catch so partial failures don't abort the whole script. The script itself is atomic, but within the script we want to collect per-op status.
- Return ALL mutated node IDs (figma-use rule 15).
- Do NOT call `console.log` — only the return value is visible.
- Do NOT wrap the code in an async IIFE — figma-use auto-wraps it.
- Pass `skillNames: "figma-create-email-row,figma-use"` in the tool call.

**On script error (not op-level error): STOP, read the error carefully, fix the script, retry.** Atomic semantics guarantee no partial state (figma-use rule 14).

### Step 6 — Screenshot the result (live if plugin connected, REST fallback otherwise)

**If `pluginConnected`:** `mcp__figma-console__figma_capture_screenshot` with `nodeId: <instanceId>` and `scale: 2`. This uses the plugin's `exportAsync` and reflects the LIVE plugin runtime state — no REST caching.

**If plugin disconnected:** `mcp__088f94c5-52cf-4a05-80fd-32f4296aaae2__get_screenshot` (REST). Watch for stale results — if content looks unchanged after a verified write, re-capture at a different `scale` (e.g. `scale: 1.5`) to bust the cache.

Store the screenshot as the "current" screenshot for Step 7.

### Step 7 — Review and fix loop (HARD CAP: 3 iterations)

**Reference sources to compare against, in order of authority:**
1. The master Email Row component image via `mcp__figma-console__figma_get_component_image` on `3:114` — design-side ground truth.
2. The Phase 3 code spec from Step 1 — structural expectations.
3. The Next.js dev server (run `npm run dev` at the repo root) if running — code-side ground truth.

**What to check:**
- Wrong variant (read state, selected state) — fixable via a targeted follow-up `use_figma` call re-importing the correct variant key and calling `instance.swapComponent(newVariantMain)`.
- Missing or unapplied boolean toggles — fixable via a targeted `setProperties` call.
- Un-set or wrong text content — fixable via a targeted `characters` write (remember to load `fontName` first).
- Sender shows single name when `count >= 4` — fix Step 2 config, re-run text write.
- Wrong trailing icon — targeted `swapComponent` on the placeholder.
- Label text still reading `"Label"` — check `slotLabelResult.success` from Step 5. If `false` and the reason indicates a transient reference issue, issue one targeted fix call. The pattern is writable (pinned in Known limitations) — a failure here usually means a reference was grabbed before the slot settled.
- Label color wrong but text succeeded — retry variant set only.

**On mismatch:**
- Identify the specific prop or text value that is wrong.
- Issue ONE targeted `use_figma` follow-up call to correct it. Do not rebuild the whole instance.
- Re-screenshot via Step 6.
- Re-compare.

**Iteration counter:** track the loop count as a local variable starting at 0. Increment on each fix. **Stop immediately after the 3rd fix attempt.** Proceed to Step 8 and report the outstanding issue plus the last screenshot.

### Step 8 — Report to user

Output to the user in this shape:

```
Email Row created.
  Instance node ID: <id>
  Placement: <"child of <parent>" OR "page root at (x, y), N px below existing content">
  Source preset: <PRESETS[i].label>
  Variant: <Read?, Hover?, Selected?>
  Instance props: <Count, Category, Labels, Trailing Assets, Trailing Button>
  Trailing icon: <paperclip | calendar | hidden>
  Label: <text + color + any fallback notes, or "none">
  Slot label experiment: <success | failed: <reason>>
  Iterations used: <0..3>
  Outstanding issues (if any): <list or "none">
[attach final Console MCP screenshot]
```


---

## Mode B execution (Steps M1–M9)

### Step M1 — Read canonical presets + code spec

Identical to Step 1. Read `src/playground/email-row-preview.tsx` (`PRESETS`), `src/components/email-row/email-row.tsx` (`formatSenders`, `EmailRowProps`), and `src/components/email-row/utils.ts` (`formatDate`). Do NOT proceed until the mental model of (a) preset shapes, (b) trailing-icon allowlist, (c) `formatSenders`, (d) `formatDate` is loaded.

### Step M2 — Build date-grouped plan

Apply the Section Header grouping annotation (cached verbatim in the Cached Reference section):

> 1. Don't show for Today
> 2. Yesterday
> 3. Last 7 days
> 4. Last 30 days
> 5. Month — Anything before the last 30 days.

Rules:
- Decide how many groups (randomize in `[2, 4]` unless the user specified a number).
- Pick contiguous buckets from the ordered list `[Today, Yesterday, Last 7 days, Last 30 days, <Month name for older>]`. "Today" does NOT produce a Section Header — rows for that bucket live above the first visible header.
- For each group, pick a random row count in `[2, 5]` unless the user specified exact counts.
- Theme (light/dark): honor user trigger specificity; otherwise random.
- For `Month` buckets, pick a real month name before the last-30-days window (e.g. if today is 2026-04-15, valid months are `March`, `February`, `January`, `December 2025`, …). Use the full month name as the header text.

Store as `inboxPlan = { theme, groups: [ { bucket, headerText?, rowCount, dateForRows } ] }`.

### Step M3 — Resolve per-row presets + tailor display strings per group

For each group's `rowCount` rows:

1. Pick a random preset from `PRESETS` (same discipline as Step 2). Rotate through presets so the inbox has variety — avoid picking the same preset index twice in one run if the preset count allows.
2. **Override the date** on the derived `dateDisplay` so it matches the group bucket:
   - `Today` → pick a random time earlier today, format via `formatDate()` (yields `12hr` time).
   - `Yesterday` → yesterday's date, formatted (yields `Month DD`).
   - `Last 7 days` → 2–6 days ago, formatted (yields `Month DD`).
   - `Last 30 days` → 8–29 days ago, formatted (yields `Month DD`).
   - `Month <Name>` → random day in that month, formatted (yields `Month DD` if current year, else `Month DD, YYYY`).
   - ALWAYS format via `formatDate()` from `utils.ts`. Never hand-format.
3. Keep the preset's other structural props (variant, labels, trailing icon, count, senders coupling) as-is. Map label colors through the Cached Reference fallback table (§ Tag Button variants). Respect the trailing-icon allowlist (paperclip, calendar only).
4. Record per-row `{variantKey, displayStrings, sourcePresetLabel, sourceExampleIndex, fallbackNotes}`.

Output: `inboxPlan.groups[i].rows[j] = { /* full config, ready to write */ }`.

### Step M4 — Summary + confirmation (GATE)

Present to the user, following the same spirit as Step 3:

```
Inbox Template configuration:
  Theme: <light|dark>
  Placement: new instance, page root (or selected SECTION), empty area below existing content
  Groups:
    [no header — Today] (N rows)
      1. <sender> — <subject> — <label>
      ...
    [Yesterday] (N rows)
      ...
    [Last 7 days] (N rows)
      ...
    [<Month name>] (N rows)
      ...
  Total: <T> rows, <H> headers
  Library keys: <cached | resolving on first run>
  Fallback notes: <list or "none">

Proceed? (yes / change X to Y / cancel)
```

**Rules:**
- Do NOT call any Figma write tool before the user confirms.
- If the user requests changes, update `inboxPlan` and re-present. Loop until confirmed.
- If the user says cancel, stop and report nothing was written.

### Step M5 — Detect placement target (runs ONLY after M4)

- If `pluginConnected`, call `mcp__figma-console__figma_get_selection`. Otherwise skip and default to empty-area placement.
- Decision:
  1. If the current selection is a SECTION, place the template as a child of that section.
  2. Otherwise place at page root. **Never nest inside an arbitrary FRAME** — 1920×1080 hides badly inside smaller containers.
  3. Nothing selected → compute `{x, y}` inside the M6 script from the bounding box of `figma.currentPage.children` with an `absoluteBoundingBox`, place at `{ x: minX, y: maxY + 120 }` (bigger gap than Mode A's `+80` because the template is 1920 wide). If the page is empty, fall back to `{0, 0}`.
- Never use `figma.viewport.center`.
- Output: `{ parentNodeId | null, placementMode: 'section' | 'page-root-empty-area' }`. Store for M6.

**Mode B is additive.** Do NOT delete or replace any pre-existing Inbox Template instances on the page.

### Step M6 — Build inbox in Figma (single atomic `use_figma` script)

**Tool:** `mcp__088f94c5-52cf-4a05-80fd-32f4296aaae2__use_figma`, with `skillNames: "figma-create-email-row,figma-use"` and `fileKey: "HvPhpLOICspP0CD05ST9fL"`.

**Prerequisite:** the `figma-use` skill MUST be loaded before the first `use_figma` call of the run (same rule as Mode A Step 5).

**Structure (all one atomic script):** structural build → slot injection → **post-injection** text / icon / label pass. The text pass is deliberately deferred to run AFTER `slotNode.appendChild(wrapper)` — run 4 confirmed that pre-injection Tag Button label writes silently fail because the Tag Button inside a pre-slot Email Row has virtual-node semantics that reject mutation until the parent row is settled in the inbox slot. Folding the text pass post-injection fixes the silent-failure class.

1. **Font loading is handled on-demand inside `writeText`** (step 8). The helper tries the master font (`node.fontName`) first and only falls back to Inter when `loadFontAsync` throws. Cached per-font so repeated failed loads across 20+ rows are free. No pre-load needed. See `references/known-limitations.md`.
2. **Resolve + import every library key in parallel.** Dedupe the row variant key set, then `Promise.all` the imports so the round-trip happens once:
   ```js
   const variantKeyList = [...new Set(inboxPlan.groups.flatMap(g => g.rows.map(r => r.variantKey)))];
   const [inboxMain, sectionHeaderMain, paperclipMain, calendarMain, ...variantMains] = await Promise.all([
     figma.importComponentByKeyAsync(inboxTemplateKey),
     figma.importComponentByKeyAsync(sectionHeaderKey),
     figma.importComponentByKeyAsync(paperclipKey),
     figma.importComponentByKeyAsync(calendarKey),
     ...variantKeyList.map(k => figma.importComponentByKeyAsync(k)),
   ]);
   const variantMainByKey = Object.fromEntries(variantKeyList.map((k, i) => [k, variantMains[i]]));
   ```
   On key-null / throw: fall back to `search_design_system` inline and record into a per-run `resolvedKeys` map. M9 updates the Cached Reference tables if new keys were resolved.
3. **Compute placement position.** If `placementMode === 'page-root-empty-area'`, compute `{x, y}` from `figma.currentPage.children` bounding box with the `+120` offset from M5. Otherwise fall back to `{0, 0}` or the selected SECTION's origin.
4. **Create the Inbox Template instance.**
   ```js
   const inbox = inboxMain.createInstance();
   inbox.x = x;
   inbox.y = y;
   if (parentNodeId) {
     const parent = await figma.getNodeByIdAsync(parentNodeId);
     parent.appendChild(inbox);
   }
   ```
5. **Build the slot wrapper frame.**
   ```js
   const wrapper = figma.createFrame();
   wrapper.name = 'Slot Content';
   wrapper.fills = [];
   wrapper.layoutMode = 'VERTICAL';
   wrapper.itemSpacing = 0;
   wrapper.paddingTop = 0; wrapper.paddingBottom = 0;
   wrapper.paddingLeft = 0; wrapper.paddingRight = 0;
   wrapper.primaryAxisSizingMode = 'AUTO';       // hug vertical
   wrapper.counterAxisSizingMode = 'FIXED';       // fixed 1680 wide
   wrapper.resize(1680, 1);
   try { wrapper.layoutSizingHorizontal = 'FIXED'; wrapper.layoutSizingVertical = 'HUG'; } catch (e) {}
   ```
6. **Structural build — create empty rows + headers, no text yet.** Collect refs for the post-injection text pass:
   ```js
   const headerRefs = [];    // { groupIndex, header, headerText }
   const rowRefs = [];       // { groupIndex, rowIndex, row, rowCfg, wrapperIdx }
   for (const [gi, group] of inboxPlan.groups.entries()) {
     if (group.bucket !== 'Today') {
       const header = sectionHeaderMain.createInstance();
       wrapper.appendChild(header);
       try { header.layoutSizingHorizontal = 'FILL'; } catch (e) {}
       headerRefs.push({ groupIndex: gi, header, headerText: group.headerText });
     }
     for (const [ri, rowCfg] of group.rows.entries()) {
       try {
         const variantMain = variantMainByKey[rowCfg.variantKey];
         const row = variantMain.createInstance();
         wrapper.appendChild(row);
         try { row.layoutSizingHorizontal = 'FILL'; } catch (e) {}
         row.setProperties({
           'Count#3:2': rowCfg.showCount,
           'Category#3:3': rowCfg.showCategory,
           '-> Labels#3:5': rowCfg.showLabels,
           'Trailing Assets#15:11': rowCfg.showTrailingAssets,
           '-> Trailing Button#3:6': rowCfg.showTrailingAssets && !!rowCfg.trailingIcon,
         });
         rowRefs.push({ groupIndex: gi, rowIndex: ri, row, rowCfg, wrapperIdx: wrapper.children.length - 1 });
       } catch (e) {
         rowRefs.push({ groupIndex: gi, rowIndex: ri, failReason: 'structural: ' + e.message });
       }
     }
   }
   ```
7. **Inject wrapper into slot (appendChild primary, flatten emergency fallback).** Pinned from run 4: `setProperties({'Slot#20:20': wrapper.id})` throws in practice and has been removed from the cascade. `appendChild` is primary.
   ```js
   let slotStrategyUsed = null;
   const slotNode = await figma.getNodeByIdAsync(`I${inbox.id};20:3774`);
   try {
     slotNode.appendChild(wrapper);
     slotStrategyUsed = 'appendChild';
   } catch (e) {
     // Emergency fallback: detach wrapper children into the slot directly, remove wrapper.
     for (const c of [...wrapper.children]) slotNode.appendChild(c);
     try { wrapper.remove(); } catch (e2) {}
     slotStrategyUsed = 'flatten';
   }
   ```
8. **Post-injection text + icon + label pass.** Runs AFTER `appendChild` so references are settled and label writes on wrapper children actually stick. Uses the self-healing `writeText` helper — master font first, Inter fallback only when `loadFontAsync` throws, cached per-font so failed loads across 20+ rows cost almost nothing. No hardcoded styles.
   ```js
   const fontCache = new Map(); // key `family::style` → 'ok' | 'fail'
   const ensureLoaded = async (f) => {
     const k = f.family + '::' + f.style;
     if (fontCache.has(k)) return fontCache.get(k);
     try { await figma.loadFontAsync(f); fontCache.set(k, 'ok'); return 'ok'; }
     catch (e) { fontCache.set(k, 'fail'); return 'fail'; }
   };
   const writeText = async (node, text) => {
     if (text == null) return { ok: false, reason: 'null text' };
     if (!node || node.type !== 'TEXT') return { ok: false, reason: 'node missing or not TEXT' };
     const target = node.fontName;
     let used = target, detached = false;
     if ((await ensureLoaded(target)) === 'fail') {
       const fb = { family: 'Inter', style: target.style };
       if ((await ensureLoaded(fb)) === 'fail') { fb.style = 'Regular'; await ensureLoaded(fb); }
       node.fontName = fb;
       used = fb;
       detached = true;
     }
     try { node.characters = text; }
     catch (e) { return { ok: false, reason: 'write threw: ' + e.message, detached }; }
     if (node.characters !== text) return { ok: false, reason: 'readback mismatch: ' + node.characters, detached };
     return { ok: true, font: used, detached };
   };
   const byComposed = (rootId, childId) => figma.getNodeByIdAsync(`I${rootId};${childId}`);

   // Unread vs read variants use different master child IDs (run 4 discovery).
   const readVariantKeys = new Set([
     'a43266d4c85c4af8c6ad5348dc28fbee3ea603ec', // Yes, No, No
     '6511503dbf22a4ec55a3b16768aab2453441fdab', // Yes, Yes, No
     '58e9a5de0a81d10fc661e4652fa58044e737a2e8', // Yes, Yes, Yes
     '2b54bec2ab81e9f75c02547e53a7fccdd4b440bf', // Yes, No, Yes
   ]);
   const idsFor = (variantKey) => readVariantKeys.has(variantKey)
     ? { sender: '5:789', title: '5:792', preview: '5:793', date: '5:800', count: '5:790' }
     : { sender: '1:101', title: '1:104', preview: '1:105', date: '1:111', count: '1:102' };

   // Write Section Header titles.
   const perHeaderResults = [];
   for (const h of headerRefs) {
     const node = await byComposed(h.header.id, '20:3193');
     const r = await writeText(node, h.headerText);
     perHeaderResults.push({ groupIndex: h.groupIndex, headerId: h.header.id, headerText: h.headerText, ...r });
   }

   // Write row content, trailing icons, and labels.
   const perRowResults = [];
   for (const ref of rowRefs) {
     if (ref.failReason) { perRowResults.push(ref); continue; }
     const { row, rowCfg, groupIndex, rowIndex, wrapperIdx } = ref;
     const ids = idsFor(rowCfg.variantKey);
     const writeResults = {};
     writeResults.sender  = await writeText(await byComposed(row.id, ids.sender),  rowCfg.senderDisplay);
     writeResults.title   = await writeText(await byComposed(row.id, ids.title),   rowCfg.subject);
     writeResults.preview = await writeText(await byComposed(row.id, ids.preview), rowCfg.preview);
     writeResults.date    = await writeText(await byComposed(row.id, ids.date),    rowCfg.dateDisplay);
     if (rowCfg.showCount) writeResults.count = await writeText(await byComposed(row.id, ids.count), rowCfg.countDisplay);

     // Trailing icon swap.
     if (rowCfg.trailingIcon) {
       try {
         const trailingBtn = await figma.getNodeByIdAsync(`I${row.id};3:73`);
         const placeholder = trailingBtn && trailingBtn.findOne(n => n.type === 'INSTANCE');
         if (placeholder) {
           const iconMain = rowCfg.trailingIcon === 'calendar' ? calendarMain : paperclipMain;
           placeholder.swapComponent(iconMain);
           writeResults.trailingIcon = { ok: true };
         } else {
           writeResults.trailingIcon = { ok: false, reason: 'placeholder not found' };
         }
       } catch (e) {
         writeResults.trailingIcon = { ok: false, reason: e.message };
       }
     }

     // Label recipe — use wrapper.children[wrapperIdx] as the fresh post-injection row reference.
     // Run 4 finding: pre-injection label writes silently fail; fresh wrapper-children traversal works.
     if (rowCfg.showLabels && rowCfg.labelText) {
       try {
         const freshRow = (slotStrategyUsed === 'appendChild' && wrapper.children[wrapperIdx]) || row;
         const tagButtons = freshRow.findAll(n => n.type === 'INSTANCE' && n.name === 'Tag Button' && n.visible);
         const labelBtn = tagButtons[rowCfg.showCategory ? 1 : 0];
         if (labelBtn) {
           try { labelBtn.setProperties({ Type: rowCfg.labelColor }); } catch (e) {}
           // Hide extra default label Tag Buttons beyond the one we're using.
           const extras = tagButtons.filter((b, i) => i > (rowCfg.showCategory ? 1 : 0));
           for (const extra of extras) { try { extra.visible = false; } catch (e) {} }
           const txt = labelBtn.findOne(n => n.type === 'TEXT');
           writeResults.label = await writeText(txt, rowCfg.labelText);
         } else {
           writeResults.label = { ok: false, reason: 'label Tag Button not found' };
         }
       } catch (e) {
         writeResults.label = { ok: false, reason: e.message };
       }
     }

     perRowResults.push({ groupIndex, rowIndex, rowId: row.id, wrapperIdx, writeResults });
   }
   ```
9. **Return.** Include the per-write readback status so the fix loop in M8 can target failed fields precisely instead of re-running the whole build.
   ```js
   return {
     templateInstanceId: inbox.id,
     wrapperFrameId: slotStrategyUsed === 'flatten' ? null : wrapper.id,
     sectionHeaderIds: perHeaderResults.map(h => h.headerId).filter(Boolean),
     rowIds: perRowResults.filter(r => r.rowId).map(r => r.rowId),
     perRowResults,
     perHeaderResults,
     slotStrategyUsed,
     resolvedKeys,
     mutatedNodeIds: [inbox.id, ...headerRefs.map(h => h.header.id), ...rowRefs.map(r => r.row && r.row.id).filter(Boolean)],
     placementPosition: { x, y },
   };
   ```

**Script-level rules (same as Mode A Step 5):**
- Per-op try/catch so partial failures don't abort the whole script.
- No `console.log` — only the return value is visible.
- No async IIFE wrap — figma-use auto-wraps it.
- Pass `skillNames: "figma-create-email-row,figma-use"` in the tool call.

**On script-level error (not op-level): STOP, read the error, fix the script, retry.** Atomic semantics guarantee no partial state.

### Step M7 — Screenshot the whole instance (scale 1)

**If `pluginConnected`:** `mcp__figma-console__figma_capture_screenshot` with `nodeId: templateInstanceId` and `scale: 1`. Scale 2 on a 1920×1080 node is too heavy on the bridge — do not use.

**If plugin disconnected:** `mcp__088f94c5-52cf-4a05-80fd-32f4296aaae2__get_screenshot` (REST) with `nodeId: templateInstanceId`.

If the returned PNG looks stale (see `references/known-limitations.md` for the stale-screenshot gotcha), re-capture at `scale: 1.5` to bust the cache.

### Step M8 — Review and fix loop (HARD CAP: 3 iterations)

**Reference sources to compare against, in order of authority:**
1. The annotation text cached in this file (group split rules, header names).
2. The Phase 3 code spec from Step M1 (preset structural expectations).
3. The Next.js dev server (run `npm run dev` at the repo root) if running, or the running playground for visual cross-check.

**What to check:**
- Wrong header text → re-run `writeText` on that header's `;20:3193` child via a targeted `use_figma` call.
- Wrong row count / missing row → create one more row instance and `wrapper.insertChild(idx, row)` at the correct position.
- Mis-ordered rows or mis-ordered groups → `wrapper.insertChild(idx, node)` to reshuffle.
- Wrong label color / text on a row → reuse the Mode A Step 7 fix recipes (targeted `setProperties` + `characters` write).
- Wrong trailing icon → targeted `swapComponent` on the placeholder.
- Missing date coherence (e.g. "Yesterday" group has a date from 5 days ago) → re-run `writeText` on `;1:111` with the corrected `formatDate` output.
- Slot strategy degraded to `appendChild` or `flatten` → flag as outstanding, DO NOT iterate on it. Note which strategy was used in M9's report.

**On mismatch:**
- Identify the specific node + prop that is wrong.
- Issue ONE targeted `use_figma` follow-up call to correct it. Do NOT rebuild the whole inbox.
- Re-screenshot via M7.
- Re-compare.

**Iteration counter:** track the loop count as a local variable starting at 0. Increment on each fix. **Stop immediately after the 3rd fix attempt.** Mode B has more moving parts than Mode A but the cap stays at 3 — more than 3 iterations means we batched too much into the initial M6 script. Escalate to the user instead of grinding.

### Step M9 — Report to user

Output to the user in this shape:

```
Inbox Template created.
  Template instance: <id>
  Slot wrapper frame: <id or "flattened into slot">
  SLOT injection strategy: <setProperties | appendChild | flatten>
  Placement: <"page root at (x, y), N px below existing content" | "child of SECTION <name>">
  Theme: <light|dark>
  Groups:
    [no header — Today] (N rows)         → rowIds: [...]
    [Yesterday] (N rows, header <id>)    → rowIds: [...]
    [Last 7 days] (N rows, header <id>)  → rowIds: [...]
    ...
  Iterations used: <0..3>
  Cache updates needed: <Inbox Template key=<key>, Section Header key=<key>, annotation text cached=<yes|no>>
  Outstanding issues (if any): <list or "none">
[attach final Console MCP screenshot]
```

If this run resolved any library keys currently listed as `<RESOLVE ON FIRST RUN>` in the Cached Reference section, call out the exact key values in the report so the next writable session can pin them.

---

## Known limitations

One-line operative rules. For rationale, run history, and failed-run postmortems see [`references/known-limitations.md`](references/known-limitations.md).

### Font handling — self-healing helper, prefers master font, falls back to Inter

The `writeText` helper in Step 5 / M6 reads `node.fontName` from the discovered text node and tries `loadFontAsync(target)` first. If that succeeds (master font available), the write proceeds with zero override — text stays bound to the master and nothing detaches. If `loadFontAsync` throws, the helper falls back to `{family:'Inter', style: target.style}`, sets `node.fontName = fb`, and accepts the detach. Both outcomes are reported as `{ok, font, detached}` so Step 8 / M9 surfaces which writes preserved the master binding. The `fontCache` Map dedupes repeated load attempts so failed loads across a 20-row inbox cost almost nothing. Never hardcode a style argument — trust `node.fontName`, which is also how the correct weight (Regular vs Medium) gets picked per field.

### SLOT label text — writable via fresh `findAll → findOne` + `writeText` helper

**Status:** writable. Use `instance.findAll(n => n.type === 'INSTANCE' && n.name === 'Tag Button' && n.visible)`, pick index `showCategory ? 1 : 0`, then `labelBtn.findOne(n => n.type === 'TEXT')`, route the TEXT node through the `writeText` helper (which handles font load / fallback). Mode B MUST do this pass AFTER `slotNode.appendChild(wrapper)` — pre-injection writes silently fail because Tag Button children have virtual semantics until the parent row is settled in the inbox slot. Mode A can do it pre- or post-slot since there's no outer slot injection.

### Tag Button has no `Red`, `Orange`, or `Purple` variants

Only `Neutral | Yellow | Green | Blue | Brown`. Map React `TagColor` values through the Cached Reference fallback table. Surface any fallback in the Step 3 / M4 summary.

### Inbox Template SLOT injection (Mode B) — `appendChild` is primary

**Status:** `setProperties({'Slot#20:20': wrapper.id})` throws in every observed run and has been **removed** from the M6 cascade. `slotNode.appendChild(wrapper)` via `getNodeByIdAsync('I<instance>;20:3774')` is the primary. Emergency fallback: flatten wrapper children directly into the slot. Post-injection traversal uses `wrapper.children[i]` for fresh references (especially for label Tag Button writes).

### SLOT subtree traversals can throw mid-iteration

Recursive `findAll` / walks from an Email Row instance can throw when enumerating Tag Button virtual children inside the slot. The Step 5 / M6 scripts use `findOne` and single-level `findAll` filters to avoid this class.

### Stale screenshot cache

The first screenshot after a slot-tree mutation has been observed to return a stale PNG (identical byte length to the pre-fix capture). Bust the cache by re-capturing at a different `scale` (e.g. 1 → 1.5). If a review shows unchanged content but the `use_figma` return value confirms the write succeeded, re-screenshot before flagging as unresolved.

---

## Happy-path budgets

**Mode A:** ≤ 5 Figma tool calls — 1 × `figma_get_status`, 1 × `figma_get_selection`, 1 × `use_figma` (Step 5), 1 × `figma_capture_screenshot` (Step 6), 0–3 × targeted follow-ups.

**Mode B:** ≤ 6 on the first run, ≤ 5 after — Mode A shape plus 1 × `search_design_system` on first run only (cached thereafter in the reference tables). The cached grouping annotation means zero `figma_get_annotations` / `get_design_context` calls.

Exceeding either budget by > 50% without a real blocker is almost always a cache miss — the model re-queried via `figma_get_component_for_development_deep` instead of using the Cached Reference tables. Fix the cache miss; don't grind out more calls.

---

## Guardrails

- **Never write to Figma before Step 3 / M4 confirmation.** If the user has not explicitly said "yes" / "proceed" / equivalent, do not call `use_figma` or any Console MCP write tool. Placement detection (`figma_get_selection`) is read-only and runs only AFTER the gate.
- **Always load the `figma-use` skill before calling `use_figma`.** It documents the atomic-script, font-loading, color-range, and page-context rules Step 5 / M6 depend on.
- **Use `PRESETS`, don't invent.** Step 1 / M1 reads `email-row-preview.tsx` once and treats it as the source of truth. Tailoring preset strings is fine; inventing structural combinations is not.
- **Use the Cached Reference tables, don't re-query.** Variant keys, master child IDs, property keys, and icon component keys are hardcoded in this skill. Do NOT call `figma_get_component_for_development_deep` on every run — it was the single biggest token leak in runs 1–2. If a key is stale, fall back to `search_design_system` and update the table.
- **Scope `findAll` to the instance's own subtree.** A page-wide `findAll` on a populated file returns hundreds of results and burns tokens on output alone.
- **Respect user specificity.** Any prop or content value the user called out in the trigger message is locked.
- **Hard cap the fix loop at 3 iterations.** Do not extend on your own judgment.
- **Mode A is one row per run.** If the user asks for multiple rows AND the trigger phrase did not select Mode B, stop and ask whether they meant Mode B or a second Mode A invocation.
- **Empty-area placement only.** Never place at raw viewport center. Use Step 4's bounding-box fallback (Mode A) or M5's (Mode B).
- **Senders / count coupling is mandatory.** `count >= 4` implies `senders[]` of length `count`, flattened via `formatSenders` for the single Figma text node.
- **Trailing icon allowlist is mandatory.** Pick only from icons imported as trailing in `email-row-preview.tsx` (today: paperclip, calendar).
- **Label color allowlist is mandatory.** Only `Neutral | Yellow | Green | Blue | Brown` are valid Figma Tag Button variants. Map React `TagColor` values per the Cached Reference table and surface any fallback in Step 3 / M4's summary.

### Mode B-specific guardrails

- **Mode B never nests inside arbitrary FRAMEs.** Only SECTION containers or page root. 1920×1080 instances hide badly inside smaller containers.
- **Mode B is additive — never deletes pre-existing Inbox Template instances.** Compute empty area below existing top-level children and drop the new template there. User's Phase 3 decision.
- **Mode B text writes go through the self-healing `writeText` helper** (master font first, Inter fallback only when `loadFontAsync` throws). Never hardcode styles — the helper reads `node.fontName` per-field so Regular vs Medium is picked from the master, not guessed.
- **Mode B hard-caps the fix loop at 3 iterations.** Same as Mode A. More than 3 means the M6 script under-batched — escalate to the user rather than grinding.
- **Mode B screenshots stay at scale 1 by default.** Only bump to 1.5 to bust a stale cache. Scale 2 on a 1920×1080 node is too heavy for the Console MCP bridge.
- **Mode B date coherence is mandatory.** Every row's `dateDisplay` MUST be consistent with the group's bucket (Yesterday rows show yesterday, Last 7 days rows show 2–6 days ago, etc.) and formatted via `formatDate()` from `utils.ts`. Never hand-format.
- **Mode B group ordering is mandatory.** Groups appear in the wrapper in this exact order: `Today → Yesterday → Last 7 days → Last 30 days → <Month>`. Skip any bucket the plan doesn't include, but never reorder.
- **Section Header title text has no component property.** Write `.characters` directly to `I<instanceId>;20:3193` via the `writeText` helper — it handles font loading and fallback just like row writes.
- **Mode B SLOT injection uses `appendChild` as primary with `flatten` as emergency fallback.** `setProperties({'Slot#20:20': ...})` throws in practice and has been removed from the cascade. See Known limitations.
