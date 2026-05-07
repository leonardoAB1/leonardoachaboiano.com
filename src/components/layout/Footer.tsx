import Link from "next/link";
import { siteConfig, socialLinks } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-8">
        <p className="text-sm text-ink-3">
          &copy; {year} {siteConfig.name}
        </p>

        <nav aria-label="Social links">
          <ul className="flex items-center gap-5" role="list">
            <li>
              <Link
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-3 transition-colors hover:text-ink-1"
              >
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-3 transition-colors hover:text-ink-1"
              >
                LinkedIn
              </Link>
            </li>
            <li>
              <Link
                href={socialLinks.email}
                className="text-sm text-ink-3 transition-colors hover:text-ink-1"
              >
                Email
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
