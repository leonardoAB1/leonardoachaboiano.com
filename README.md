# leonardoachaboiano.com

Personal engineering site, live at **[leonardoachaboiano.com](https://leonardoachaboiano.com)**: portfolio, CV, and technical notes of a mechatronics engineer.

## Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, React Server Components)
- **Language**: TypeScript, strict mode
- **Styling**: Tailwind CSS with a custom design-token system, dark and light themes
- **Content**: MDX for blog posts, [next-intl](https://next-intl.dev) for five locales (en, es, de, it, fr)
- **Motion**: Framer Motion with shared entrance variants, respecting `prefers-reduced-motion`
- **CV**: downloadable PDF generated with @react-pdf/renderer from the same data that renders the page
- **Quality**: Biome (lint and format), Vitest (unit), Playwright (end-to-end)
- **Delivery**: Vercel, with release-please for automated semver releases and Lighthouse checks on preview deployments

## Local development

Requires Node 20.9+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev          # start the dev server
pnpm test         # unit tests (Vitest)
pnpm test:e2e     # end-to-end tests (Playwright, chromium)
pnpm check        # lint and format (Biome)
pnpm typecheck
pnpm build
```

## Workflow

All work happens in issue-linked branches (`type/issueNumber-description`) developed in dedicated git worktrees and squash-merged into `main` through PRs. Releases are cut automatically by release-please from conventional commit messages; every release deploys to production on Vercel.

## Structure

| Path | Contents |
|---|---|
| `src/app/[locale]/` | App Router pages, localized routes |
| `src/components/` | Reusable UI components |
| `src/lib/` | Utilities, motion variants, site config |
| `src/data/` | Structured content (skills, timeline, CV data) |
| `src/i18n/` | Locale routing and message loading |
| `messages/` | Translated UI strings per locale |
| `e2e/` | Playwright end-to-end tests |
