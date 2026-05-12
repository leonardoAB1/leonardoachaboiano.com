# Design reference notes (Phase A)

Fetched for calibration before home layout (issue #6). Short layout and visual bullets per site; not for copying assets or distinctive motifs.

## https://imsezer.com

**Layout**

- Single-column narrative with strong hero; content reads top-to-bottom with clear blocks (proof points, stats, featured work).
- Top nav: Home, About, Projects, Contact, Images; persistent horizontal links.
- Section rhythm: hero headline and CTAs, then credibility strips (three highlights), profile + stats row, featured work grid, connect footer, tech stack band.
- Featured work: large cards with imagery and secondary links to deep projects.
- Density: moderate; hero is sparse; below adds proof and portfolio density.

**Visual design**

- Strong display headline hierarchy; uppercase micro-label for role; primary + secondary CTAs after hero line.
- neutrals with restrained accent; photography and product thumbnails carry color.
- Outlined / filled button contrast; cards with imagery; interactive tech stack section implied.
- **Boundary for this site:** avoid duplicating heavy illustration stacks; keep calmer than stat-heavy marketing blocks if it reads as consumer product.

## https://emilianovb.com

**Layout**

- Long-scroll single page; numbered section labels (01/05, 02/05) and strong segmentation (Selected Work, Experience, Credentials, About, Contact).
- HUD-style meta in chrome (sys, lat/lon, frame id); nav via scroll cues.
- Selected work: vertical list of projects with tags inline; very long single column.
- Contact closes with minimal outbound links.

**Visual design**

- Technical, terminal-adjacent microcopy; monospace or systematic labeling feel.
- High contrast structure; project titles as focal type; tag chips dense under titles.
- **Boundary for this site:** do **not** adopt full HUD / sci-fi chrome; optional subtle label line only; keep Swiss/minimal shell per brand rules.

## https://afraiman.com

**Layout**

- Case-study forward: stacked blocks with challenge / solution pattern; metrics highlighted (4x, $8M, etc.).
- Technical capabilities in grouped bullet columns after case studies; résumé blocks below.
- Single column, reading like an extended engineering report.

**Visual design**

- Headings + metric callouts; lists of skills per case; restrained academic/engineering tone.
- **Boundary for this site:** adopt clarity of challenge/solution for future project pages; home philosophy section can stay shorter and less metric-heavy.

## https://bradylin.com

**Layout**

- Simple hero: large friendly headline, short paragraph, anchor to featured works.
- Featured works: list of project names + dates + one-liner; connect band at bottom.
- Very open vertical spacing; low component count.

**Visual design**

- Approachable, readable; large serif/sans headline contrast (from content structure); minimal chrome.
- **Boundary for this site:** borrow straightforward hero + list simplicity; avoid overly casual tone in copy.

## https://codewithstu.tv

**Layout**

- Homepage as index: hero with role label and topic links; repeated section headers with comment-style labels (`// things_i_write_about`); card lists for articles, OSS, projects; timeline of roles.
- Multi-band vertical layout; each band is a feed.

**Visual design**

- Developer-blog identity: code-comment motifs, tags on cards, dense metadata (dates, read time).
- **Boundary for this site:** do **not** import comment syntax or dev-blog chrome; useful reference for clear section titling and feed rhythm later (blog / projects).

---

## Synthesis: direction for leonardoachaboiano.com (issue #6)

**Adopt**

- Calm **hero**: eyebrow (brand-colored, uppercase tracking) + one strong display line + one supporting paragraph + **two CTAs** (primary to `/projects`, secondary to `/cv`), aligned with imsezer / bradylin clarity without their imagery dependency.
- **Philosophy**: single column, max-w prose; `Heading` + two short `Text` blocks; optional `Separator`; wrapped in `AnimatedSection` for subtle entrance.
- **Technical domains**: **2-column tablet / 4-column desktop grid** of `Card` tiles (title + one line), hairline `border-border`, `bg-surface-0`, no photography required; inspired by afraiman capability clarity but calmer density.

**Reject for this brand**

- emilianovb HUD / frame numbers / sys status line as primary decor.
- codewithstu `//` section labels and blog-index density on the home hero.
- Loud stat grids and extra animation on the first paint (keep motion to `AnimatedSection` only).

---

# Dev handoff (Figma + implementation)

## Token mapping

Use existing CSS theme in `src/app/globals.css`: `brand`, `ink-1`…`ink-4`, `surface-0`…`surface-2`, `border`. Components use Tailwind semantic classes (`text-ink-*`, `bg-surface-*`, etc.).

## Layout constants

| Element | Value |
|---------|--------|
| Content max width | `max-w-5xl` via `Container` (`64rem`) |
| Horizontal padding | `px-6 sm:px-8` |
| Section vertical rhythm | `py-16 sm:py-24` via `Section` |
| Hero top spacing | Extra top padding `pt-8` inside first section so headline clears navbar mentally |
| Domain grid | `gap-4 sm:gap-6`; grid `sm:grid-cols-2 lg:grid-cols-4` |

## Components

| Block | Implementation |
|-------|----------------|
| Hero | Server `Hero.tsx`: `Container`, `Eyebrow`, `Heading` as `h1` `size="xl"`, `Text` `size="lg"`, `Link` + `buttonClasses` |
| Philosophy | Server `EngineeringPhilosophy.tsx` inside `AnimatedSection` |
| Domains | Server `TechnicalDomains.tsx` with static domain list inside `AnimatedSection` |
| Motion | `"use client"` `AnimatedSection.tsx` only; `framer-motion` `whileInView`, once, small y/opacity |

## Figma file

Prior session: [leonardoachaboiano.com - Home wireframe](https://www.figma.com/design/JAz0Xx6d8MQS3dPJW8fCOt) (`JAz0Xx6d8MQS3dPJW8fCOt`). Local variables should mirror tokens (Light/Dark).

### Figma checklist (complete in editor if MCP unavailable)

1. **Desktop 1440** frame: extend existing `Home / Desktop` wrapper with:
   - **Hero:** eyebrow, display headline (max ~900px text width), lead (~680px), CTA row (primary filled brand + secondary outline).
   - **Philosophy:** section label optional; H2 + two body blocks; 64–96px vertical gap from hero.
   - **Technical domains:** 4 equal cards in a row, `gap` 24, border 1px token, radius ~16.
2. **Mobile 390** frame: stack hero, philosophy, domains (domain cards 1 column or 2×2).
3. **Dark mode:** duplicate desktop frame; switch variable mode to Dark; confirm brand text on `surface-0` / `surface-1`.

Implementation below matches this spec in code.
