# Leonardo Acha Boiano - Portfolio Website

This is the **canonical, tool-agnostic rulebook** for every AI coding agent working in this repo
(Codex, Cursor, Claude Code, and any other). Codex and Cursor read this `AGENTS.md` by default;
Claude Code imports it from `CLAUDE.md`. Edit shared rules here, in one place.

Personal engineering website for a robotics/mechatronics engineer. It functions as a personal
brand, engineering portfolio, modern CV, technical blog, future media hub, and recruiter/researcher
landing page.

- **Domain:** leonardoachaboiano.com
- **GitHub:** https://github.com/leonardoAB1/leonardoachaboiano.com
- **Local folder:** `leonardoachaboiano.com`

## This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your
training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices.

## Stack

- **Framework:** Next.js (latest stable, App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS - brand color `#02777C`, dark/light mode via `darkMode: 'class'`
- **Animations:** Framer Motion (subtle only)
- **Content:** MDX for blog and project content
- **Tooling:** Biome (formatting and linting)
- **Package manager:** pnpm
- **Deployment:** Vercel (Hobby - free tier)

## Engineer Profile

Leonardo is a robotics/mechatronics engineer with experience in:

- Robotics software
- Embedded systems
- Hardware/software integration
- Manufacturing and design for manufacturing (DFM)
- cryoEM visualization research
- International engineering experience
- Future engineering/maker YouTube content

## Brand and Tone

The site must feel:

- Intellectually ambitious, elegant, engineering-focused
- Calm, minimal, highly professional
- Authentic - "serious engineer building meaningful systems", not "startup influencer"

**Do NOT make it look like:**

- Generic startup landing page
- Crypto/Web3 aesthetic
- Flashy agency portfolio
- Overly artistic experimental website
- Childish dev portfolio

**Visual inspiration:** Apple engineering pages, high-end research labs, modern robotics companies,
calm Swiss/Japanese-inspired minimalism.

## Design Rules

- **Typography:** modern, elegant, readable, engineering aesthetic
- **Color:** neutral, sophisticated, slightly technical. Avoid oversaturated colors. Dark/light mode
  support. Use `#02777C` as the primary brand color
- **Spacing:** generous whitespace, premium feel
- **Animations:** choreographed entrance motion (stagger, fade+slide) using shared variants in
  `src/lib/motion-variants.ts`. All motion respects `prefers-reduced-motion` via
  `MotionConfig reducedMotion="user"`. No particles or background effects
- **Avoid:** overusing gradients, glassmorphism everywhere, visual noise

### Design References

Use these portfolios as quality and style calibration for layout, spacing, typography, and component
decisions. Do not copy - use as a bar:

- https://imsezer.com
- https://emilianovb.com
- https://www.afraiman.com
- https://bradylin.com
- https://codewithstu.tv

**Live reference fetch (mandatory before significant visual work).** Before Figma screens, new home
or marketing sections, design-system layout or typography choices, or other decisions where peer
calipers matter, **fetch each URL above** with your HTTP or web-fetch tool so the snapshot is
current. If a URL fails to load, say so and rely on the written rules here only. From each fetch,
brief **layout** notes (page frame, navigation, section rhythm, lists/grids, density) and **visual
design** notes (typography scale, color roles, imagery, components, personality boundary) are
required - a short bullet list per site is enough. Align decisions with Brand/Tone and Design Rules
here, not with a clone of any one reference.

## Pages

1. **Home** - Hero + featured projects + engineering philosophy + technical domains + recent
   writing/videos + timeline + contact CTA
2. **Projects** - Deep project cards with title, description, technologies, images/videos, GitHub,
   engineering challenges, lessons learned, system diagrams
3. **About** - Human and ambitious without arrogance. Philosophy, interdisciplinary mindset,
   international trajectory
4. **CV/Resume** - Clean downloadable resume, timeline layout, education, experience, skills,
   certifications, languages, publications
5. **Blog/Notes** - MDX-based, clean typography, code snippets, diagrams, equations,
   tags/categories, SEO
6. **Media/YouTube** - Future-proof: embedded videos, playlists, thumbnails, technical talks
7. **Contact** - Minimal form + LinkedIn + GitHub + email

## Architecture

General principles: reusable components, organized folders with clear naming, scalable and
maintainable modular sections, clean semantic HTML, fully responsive, excellent SEO (metadata,
OpenGraph, sitemap, robots.txt), fast loading, accessible, analytics-ready.

Features: responsive navbar, smooth scrolling, project filtering, theme toggle (dark/light), SEO
metadata + OpenGraph, sitemap + robots.txt, analytics-ready structure, optional command palette.

### Server vs Client Components

Default to Server Components. Only add `"use client"` when the component needs:

- React state (`useState`, `useReducer`)
- Browser hooks (`useEffect`, `usePathname`, `useTheme`)
- Event handlers that mutate state
- Framer Motion animations (require browser APIs)

Use the `AnimatedSection` wrapper pattern: a Server Component fetches data, a Client Component wraps
it for animation. Never fetch data in Client Components when a Server Component parent can do it.

### Folder structure

```
src/
|-- app/           # Next.js App Router routes only
|-- components/
|   |-- ui/        # Primitive design system atoms
|   |-- layout/    # Navbar, Footer, Container, Section
|   |-- home/      # Home-page-specific sections
|   |-- projects/  # Project list and detail components
|   |-- blog/      # Blog list and post components
|   |-- cv/        # CV-specific components
|   |-- media/     # Video embed components
|   |-- shared/    # Used across 2+ contexts
|-- content/       # MDX files (posts/, projects/)
|-- lib/           # Pure utilities, no React
|-- types/         # TypeScript interfaces
|-- hooks/         # Custom React hooks (client-only)
|-- styles/        # Non-Tailwind CSS (katex, etc.)
```

### Import alias

Always use `@/` for imports. Never use relative `../` paths.

### TypeScript

- Strict mode enabled - no `any`, no `as unknown as X`
- Define explicit return types on all exported functions
- Use interfaces for object shapes (not inline types)
- All component props must have a named interface

## Hosting

- Prefer **free and open-source tools** at every layer of the stack
- Willing to pay only for hosting if necessary - keep it cheap (domain ~$10-15/year is acceptable)
- **Vercel Hobby plan** covers this project entirely for free (personal portfolio = allowed use)
- Avoid Vercel-specific APIs (`@vercel/kv`, `@vercel/blob`, etc.) - keep the app
  **provider-agnostic** so migration is always an afternoon's work, not a rewrite
- If migration is ever needed: Cloudflare Pages (free, unlimited bandwidth) is the preferred
  alternative; a self-hosted VPS (Hetzner/DigitalOcean) is the fallback
- For any future backend needs (database, file storage), choose provider-agnostic options (Supabase,
  Cloudflare R2, etc.)

## Writing Style

- **No em dashes.** Use a regular hyphen (-) if a separator is needed. This applies everywhere:
  commit messages, PR descriptions, code comments, MDX content, and any generated text.

## Code Style

- **No assistant or tool attribution** in source, docs, MDX, or site UI. Do not add signatures,
  footers, badges, or bylines that credit any AI or assistant tool (for example "Made with Cursor",
  "Built with [tool]", "Generated by [tool]", "AI-generated", `Co-Authored-By:` trailer lines, or
  HTML/markdown blocks whose only purpose is attribution). This applies to commits, code, comments,
  MDX, README, PR descriptions, issue text, and config.
- Biome enforces formatting - do not add manual formatting that conflicts
- No comments unless the WHY is non-obvious; no docstrings or multi-line comment blocks
- Named exports only (no default exports except Next.js pages and layouts)
- Keep components focused - if a component exceeds ~150 lines, split it

## Git and Commits

Follow the Conventional Commits standard. Every commit message must:

- Be a single sentence, lowercase, no period at the end
- Use the format: `type: short description`
- Never include AI/tool signatures, co-author lines, or attribution footers

**Allowed types:** `feat` (new feature or page section), `fix` (bug fix), `chore` (tooling, config,
dependencies), `style` (formatting, visual tweaks, no logic change), `refactor` (restructuring
without behavior change), `docs` (content or documentation changes), `perf` (performance
improvements), `test` (adding or updating tests).

**Examples:**

```
feat: add hero section with animated entrance
chore: install biome and configure formatting rules
fix: correct active link state in navbar
refactor: extract timeline into reusable component
```

**Branch naming:** use issue-linked branch names. Slash-style names are allowed and preferred for
new work: `type/issueNumber-short-description` (e.g. `feat/1-scaffold`, `feat/3-navbar`,
`fix/11-contact-form`).

**Commits:** stage and commit sequentially in logical groups - never one large commit per branch.
Each commit should represent one coherent unit of change (e.g. scaffold files, then dependencies,
then config).

**PR workflow:** each PR references its issue (`Closes #N`). Squash merge into `main` (the only
allowed strategy). Branch auto-deletes after merge. No direct pushes to `main`.

## Worktree Convention

Every feature, fix, or non-trivial change is developed in a dedicated git worktree. This keeps each
branch's working tree fully isolated - no stashing, no dirty state bleeding between tasks.

Worktrees live inside a gitignored `worktrees/` directory at the root of the main repo. Under it,
one folder per branch **category** (`feat`, `fix`, `chore`, `perf`, `style`, `refactor`, `docs`,
`test`), and inside each category the worktree folder is named only by the branch's **leaf** - the
part after `type/` (e.g. `5-blog`). The category lives in the folder path, never repeated in the
leaf. Replacing `/` with the OS separator in the branch name and prefixing `worktrees/` always
yields the right path: branch `feat/5-blog` checks out at `worktrees/feat/5-blog`.

```
Projects/
  leonardoachaboiano.com/                 <- main repo (main branch only)
  leonardoachaboiano.com/worktrees/       <- all worktrees live here (gitignored)
    feat/
      5-blog/                             <- worktree for branch feat/5-blog
    fix/
      12-nav/                             <- worktree for branch fix/12-nav
```

Create one before starting work, from the primary repo directory:

```
git worktree add "worktrees/feat/5-blog" feat/5-blog
```

Remove it after the PR is merged:

```
git worktree remove "worktrees/feat/5-blog"
git branch -d feat/5-blog
```

Rules:

- The `main` branch in the primary repo directory is never used for feature work - only to pull
  upstream changes
- `node_modules` and `.next` are not shared between worktrees; run `pnpm install` and the build fresh
  in each one
- Never run `git worktree add` from inside an existing worktree - always run it from the primary
  repo directory

## Collaboration and Explanation Requirements

Leonardo is technically strong as an engineer (robotics/software background) but relatively new to
modern frontend development. This project is both a production website and a mentorship-style
learning experience. Do not oversimplify - explain frontend ecosystem concepts thoroughly, but at an
engineer's level. Avoid a beginner-tutorial tone.

For **every** implementation, explain:

1. **What** you are doing and why
2. **Why** this approach is considered good practice
3. **Alternatives** that exist and their tradeoffs
4. **How** this fits into professional frontend/software architecture
5. **Frontend ecosystem concepts** - do not over-simplify, but do explain thoroughly

- **When creating files/folders:** explain the purpose of each folder, why files are organized that
  way, and how the structure scales in real-world projects.
- **When writing code:** explain important TypeScript syntax, React/Next.js concepts (App Router,
  Server vs Client Components, etc.), Tailwind utility choices, responsive design decisions, SEO and
  accessibility considerations, and performance considerations.
- **When introducing a new library or feature:** why it exists and what problem it solves, how it
  compares to alternatives, and when engineers should or should not use it.
- **When making design decisions:** explain UX reasoning, visual hierarchy, typography/layout
  rationale, and how the choice supports engineering credibility.

**Code format:** (1) explain the goal, (2) explain the architecture/design decision, (3) show the
code, (4) explain the important parts, (5) explain how it connects to the broader application. If
multiple valid approaches exist, compare them, recommend one, and explain why.

**Code quality and educational clarity are equally important.**
