<project>
# Leonardo Acha Boiano - Portfolio Website

Personal engineering website for a robotics/mechatronics engineer. Functions as personal brand, engineering portfolio, modern CV, technical blog, future media hub, and recruiter/researcher landing page.

- **Domain:** leonardoachaboiano.com
- **GitHub:** https://github.com/leonardoAB1/leonardoachaboiano.com
- **Local folder:** `leonardoachaboiano.com`
</project>

<stack>
- **Framework**: Next.js (latest stable, App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion (subtle only)
- **Content**: MDX for blog
- **Deployment**: Vercel (Hobby - free tier)
</stack>

<engineer>
Leonardo is a robotics/mechatronics engineer with experience in:
- Robotics software
- Embedded systems
- Hardware/software integration
- Manufacturing and design for manufacturing
- International engineering experience
- Future engineering/maker YouTube content
</engineer>

<brand>
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

**Visual inspiration:** Apple engineering pages, high-end research labs, modern robotics companies, calm Swiss/Japanese-inspired minimalism.
</brand>

<design>
**Typography:** Modern, elegant, readable, engineering aesthetic.

**Color palette:** Neutral, sophisticated, slightly technical. Avoid oversaturated colors. Dark/light mode support. Use #02777C as a primary brand color.

**Spacing:** Generous whitespace, premium feel.

**Animations:** Subtle transitions only. No excessive motion, particles, or background effects.

**Avoid:** Overusing gradients, glassmorphism everywhere, visual noise.
</design>

<pages>
1. **Home** - Hero + featured projects + engineering philosophy + technical domains + recent writing/videos + timeline + contact CTA
2. **Projects** - Deep project cards with title, description, technologies, images/videos, GitHub, engineering challenges, lessons learned, system diagrams
3. **About** - Human and ambitious without arrogance. Philosophy, interdisciplinary mindset, international trajectory
4. **CV/Resume** - Clean downloadable resume, timeline layout, education, experience, skills, certifications, languages, publications
5. **Blog/Notes** - MDX-based, clean typography, code snippets, diagrams, equations, tags/categories, SEO
6. **Media/YouTube** - Future-proof: embedded videos, playlists, thumbnails, technical talks
7. **Contact** - Minimal form + LinkedIn + GitHub + email
</pages>

<architecture>
- Reusable components
- Organized folders with clear naming
- Scalable, maintainable, modular sections
- Clean semantic HTML
- Fully responsive
- Excellent SEO (metadata, OpenGraph, sitemap, robots.txt)
- Fast loading, accessible, analytics-ready

**Features:**
- Responsive navbar
- Smooth scrolling
- Project filtering
- Theme toggle (dark/light)
- SEO metadata + OpenGraph support
- Sitemap + robots.txt
- Analytics-ready structure
- Optional: command palette
</architecture>

<hosting>
- Prefer **free and open-source tools** at every layer of the stack
- Willing to pay only for hosting if necessary - keep it cheap (domain ~$10-15/year is acceptable)
- **Vercel Hobby plan** covers this project entirely for free (personal portfolio = allowed use)
- Avoid Vercel-specific APIs (`@vercel/kv`, `@vercel/blob`, etc.) - keep the app **provider-agnostic** so migration is always an afternoon's work, not a rewrite
- If migration is ever needed: Cloudflare Pages (free, unlimited bandwidth) is the preferred alternative; self-hosted VPS (Hetzner/DigitalOcean) is the fallback
- For any future backend needs (database, file storage), choose provider-agnostic options (Supabase, Cloudflare R2, etc.)
</hosting>

<git>
Follow the Conventional Commits standard. Every commit message must:
- Be a single sentence, lowercase, no period at the end
- Use the format: `type: short description`
- Never include AI tool signatures, co-author lines, or attribution footers

**Allowed types:**
- `feat:` - new feature or page section
- `fix:` - bug fix
- `chore:` - tooling, config, dependencies
- `style:` - formatting, visual tweaks, no logic change
- `refactor:` - restructuring without behavior change
- `docs:` - content or documentation changes
- `perf:` - performance improvements
- `test:` - adding or updating tests

**Examples:**
```
feat: add hero section with animated entrance
chore: install biome and configure formatting rules
fix: correct active link state in navbar
refactor: extract timeline into reusable component
```

**Branch naming:** use issue-linked branch names. Slash-style names are allowed and preferred for new work: `type/issueNumber-short-description`.
Examples: `feat/1-scaffold`, `feat/3-navbar`, `fix/11-contact-form`

**Commits:** stage and commit sequentially in logical groups - never one large commit per branch. Each commit should represent one coherent unit of change (e.g. scaffold files, then dependencies, then config).

**PR workflow:** each PR references its issue (`Closes #N`). Squash merge into `main` (only allowed strategy). Branch auto-deletes after merge. No direct pushes to `main`.
</git>

<worktree>
Every feature, fix, or non-trivial change must be developed in a dedicated git worktree. This keeps the working tree for each branch fully isolated - no stashing, no dirty state bleeding between tasks.

**Convention:** worktrees live inside the main repo directory, mirroring the branch name as a path (replace `/` with `\`). The full path always starts with the project name as base:
```
Projects\
  leonardoachaboiano.com\                <- main repo (main branch only)
  leonardoachaboiano.com\feat\5-blog\    <- worktree for feat/5-blog
  leonardoachaboiano.com\feat\3-navbar\  <- worktree for feat/3-navbar
  leonardoachaboiano.com\fix\12-nav\     <- worktree for fix/12-nav
```

**Creating a worktree (do this before starting any feature):**
```powershell
git worktree add "feat\5-blog" feat/5-blog
cd "feat\5-blog"
claude
```

**Removing a worktree after the PR is merged:**
```powershell
git worktree remove "feat\5-blog"
git branch -d feat/5-blog
```

**List all worktrees at any time:**
```powershell
git worktree list
```

**Rules:**
- The `main` branch in the primary repo directory is never used for feature work - only to pull upstream changes
- Each Claude Code session for a feature starts from inside its worktree directory
- When Claude spawns sub-agents for complex tasks, always pass `isolation: "worktree"` to the Agent tool - this gives the sub-agent its own auto-managed worktree
- `node_modules` and `.next` are not shared between worktrees; run `npm install` and `npm run build` fresh in each one
- Never run `git worktree add` from inside an existing worktree - always run it from the primary repo directory
- Never use cd command, as it's redundant. Run all commands directly in the root directory using relative/absolute paths

**Never:**
```
# Too long / not conventional
Added the Hero component with Framer Motion animations and responsive layout

# No signatures
Co-Authored-By: Claude <noreply@anthropic.com>
```
</worktree>

<writing>
- **No em dashes.** Use a regular hyphen (-) if a separator is needed. This applies everywhere: commit messages, PR descriptions, code comments, MDX content, and any generated text.
</writing>

<collaboration>
Leonardo is technically strong as an engineer (robotics/software background) but relatively new to modern frontend development. This project is both a production website and a mentorship-style learning experience.

### For EVERY implementation, explain:

1. **What** you are doing and why
2. **Why** this approach is considered good practice
3. **Alternatives** that exist and their tradeoffs
4. **How** this fits into professional frontend/software architecture
5. **Frontend ecosystem concepts** - do not over-simplify, but do explain thoroughly

### When creating files/folders:
- Explain the purpose of each folder
- Explain why files are organized that way
- Explain how the structure scales in real-world projects

### When writing code:
- Explain important TypeScript syntax
- Explain React/Next.js concepts (App Router, Server vs Client Components, etc.)
- Explain Tailwind utility choices
- Explain responsive design decisions
- Explain SEO decisions and accessibility considerations
- Explain performance considerations

### When introducing a new library or feature:
- Why it exists and what problem it solves
- How it compares to alternatives
- When engineers should or should not use it

### When making design decisions:
- Explain UX reasoning and visual hierarchy
- Explain typography/layout rationale
- Explain how design choices support engineering credibility

### Code format:
1. Explain the goal
2. Explain the architecture/design decision
3. Show the code
4. Explain the important parts
5. Explain how it connects to the broader application

If multiple valid approaches exist: compare them, recommend one, explain why.

**Code quality and educational clarity are equally important.**
</collaboration>
