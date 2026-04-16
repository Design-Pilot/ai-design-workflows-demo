# figma-create-email-row — Known Limitations & Run History

Narrative backing for the one-line rules in `SKILL.md`. Load this file only when you need the *why* — when a run hits an unfamiliar error, or when updating the operative rules.

---

## SLOT label text — writable via fresh `findAll → findOne` + `writeText` helper

**Status:** writable. Run 3 confirmed the text inside a slot-wrapped Tag Button can be set via two-step traversal and a loaded font. Runs 4+ confirmed the pattern only works reliably AFTER slot injection in Mode B — pre-injection writes inside `createRow()` silently fail.

**The working pattern (Mode A and Mode B post-injection):**

```js
// 1. Fresh findAll for visible Tag Buttons — document order gives [category?, slotLabel, ...extras]
const tagButtons = instance.findAll(n => n.type === 'INSTANCE' && n.name === 'Tag Button' && n.visible);
const labelBtn = tagButtons[showCategory ? 1 : 0];
// 2. findOne(TEXT) on the FRESH live reference — do NOT reuse a reference from an earlier findAll
const txt = labelBtn.findOne(n => n.type === 'TEXT');
// 3. Route through the writeText helper — it reads node.fontName, loads the master font,
//    falls back to Inter at the master's style if loadFontAsync throws.
const r = await writeText(txt, 'Comp Review');
```

**Why run 2's attempt failed but run 3 succeeded:** run 2 called `loadFontAsync(labelNode.fontName)` where `fontName` was `Momo Trust Sans Medium` — a brand font not available to Figma Desktop at the time. That threw, aborting before `.characters` could be set. The traversal itself was fine. Runs 3+ worked around it by pre-loading Inter and force-setting `fontName`, which detached the text from the master.

**Why Mode B run 4 silently failed inside `createRow()`:** label Tag Button writes called before `slotNode.appendChild(wrapper)` wrote to pre-injection virtual references. A later `findAll` after slot injection read the unchanged text. Root cause: Tag Button instances inside a pre-slot Email Row's label slot have virtual semantics that reject mutation before the parent row is settled inside the inbox slot. Fix: fold text / label writes into a post-injection pass — either one script that appends to slot FIRST then writes, or two `use_figma` calls. The skill now does the former (see Mode B Step M6).

**Current font-handling rule — self-healing, no forced Inter:** the skill no longer pre-loads Inter or hardcodes styles. The `writeText` helper (defined inline in Step 5 / M6) reads `node.fontName` from the discovered text node, tries `loadFontAsync(target)` first, and only falls back to `{family:'Inter', style: target.style}` when the master load throws. A per-font `fontCache` Map dedupes repeated failed loads so 20+ rows cost almost nothing. When the master font IS loadable (Momo Trust Sans installed and seen by Figma Desktop), text writes preserve the master binding with zero detach. When it isn't, each write detaches to Inter at the master's own style — and the helper's return value (`{ok, font, detached}`) surfaces that in the Step 8 / M9 report so it's visible, not silent.

**Why run 2 probed as unavailable on macOS:** Figma Desktop caches the available-font list at launch. If Momo Trust Sans is installed per-user instead of system-wide, or installed after Figma was launched without a full restart, `listAvailableFontsAsync()` will return zero matches and `loadFontAsync({family:'Momo Trust Sans', ...})` will throw. Re-install For All Users via Font Book, fully quit + relaunch Figma, then the self-healing helper automatically stops detaching — no skill change needed. Run 5 probed `momoAvailable: []` on 2026-04-15 despite the font being nominally installed; fell back to Inter.

**Style discoveries (probe 2026-04-15):** master fontNames as actually stored — senderUnread, titleUnread, headerTitle are `Medium`; previewUnread, dateUnread, senderRead are `Regular`. Earlier revisions of this skill hardcoded `Medium` for date and senderRead, silently writing the wrong weight. The self-healing helper reads per-node so the bug class disappears.

**Proper long-term fix (design-system change, out of scope for this skill):** add a `Label` TEXT component property to the master Tag Button component set `3:5`. Today its only property is `Type` (VARIANT). Adding a TEXT prop bound to the inner text node would make label text writable via `setProperties({ 'Label#<id>': 'Comp Review' })` on any Tag Button instance, slot-wrapped or not.

**Stale screenshot gotcha (run 3):** the first `figma_capture_screenshot` call after a slot tree mutation once returned a stale PNG (identical byte length to the pre-fix screenshot). Re-capturing at a different `scale` busts the cache. If a review shows unchanged content but diagnostic data confirms the underlying write succeeded, re-screenshot at a different scale before flagging as unresolved.

---

## Traversals that walk into SLOT subtrees can throw mid-iteration

Observed when a recursive `findAll` / walk from the Email Row instance hits the Tag Button inside the slot and tries to enumerate its virtual children. Mitigation: scope `findOne` / `findAll` to known-safe subtrees, or skip nodes whose name includes `"Labels Slot"` when walking. The Step 5 / M6 scripts use `findOne` or single-level `findAll` filters and do not recurse blindly, so they avoid this class.

---

## Inbox Template SLOT injection — `appendChild` is primary (run 4)

**Status:** `appendChild` on the slot node works reliably. `setProperties({'Slot#20:20': wrapperId})` has thrown in every observed Mode B run — it is removed from the M6 cascade entirely.

The slot region `20:3774` is a proper Figma `SLOT` node. Two injection strategies remain in the M6 cascade:

1. **Primary — `slotNode.appendChild(wrapper)`** via `getNodeByIdAsync('I<instanceId>;20:3774')`. This is what worked on the first Mode B run. The wrapper becomes a child of the slot with composed ID `I<inboxId>;20:3774;<wrapperId>`. Access it afterwards via `inbox.findOne(n => n.name === '<wrapper name>')`.
2. **Emergency fallback — flatten:** detach every wrapper child and append directly to the slot region, then remove the wrapper. Loses the single-frame wrapper semantic but keeps content in the slot.

**Historical note:** earlier versions of this skill tried `setProperties({'Slot#20:20': wrapper.id})` as tier 1 and `appendChild` as tier 2. Every observed run threw on tier 1. Removed in the run-4 pass. If a future Figma version makes `setProperties` on SLOT properties work, re-add as a preferred tier.

**Post-injection traversal:** after `appendChild` succeeds, the wrapper and its row / header children are accessible via `inbox.findOne(n => n.name === 'Slot Content')`. Row children are `wrapper.children[i]`. For text writes, the original `row.id` still aliases correctly through `getNodeByIdAsync('I' + row.id + ';' + childId)` — use that. For label Tag Button writes, prefer `wrapper.children[idx].findAll(...)` from the fresh post-injection reference (see Run 4 silent-failure note above).

---

## Run history

- **Run 1–2 (Mode A):** initial skill scaffolding. Discovered the `loadFontAsync(node.fontName)` failure mode for Momo Trust Sans. Switched to Inter pre-load.
- **Run 3 (Mode A):** confirmed the fresh-findAll / Inter-fontName pattern works for slot-wrapped Tag Button text. Hit the stale-screenshot gotcha once, fixed by re-capturing at a different scale.
- **Run 4 (Mode B first run):** confirmed `appendChild` as primary SLOT injection. Discovered read-variant child IDs (`5:789` / `5:792` / `5:793` / `5:800` / `5:790`) differ from unread (`1:101` / `1:104` / `1:105` / `1:111` / `1:102`). Discovered pre-injection label writes silently fail — fold text pass into post-injection. Updated cached reference tables and M6 recipe accordingly.
- **Run 5 (Mode B, fintech inbox):** first run using folded post-injection text pass. 11 rows across 3 date groups, 1 fix iteration for labels.

