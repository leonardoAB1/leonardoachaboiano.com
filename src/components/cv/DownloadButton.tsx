import type { ReactElement } from "react";
import { buttonClasses } from "@/components/ui/Button";

export function DownloadButton(): ReactElement {
  return (
    <a
      className={buttonClasses({ variant: "primary", size: "md" })}
      href="/cv/leonardo-acha-boiano-cv.pdf"
      rel="noopener noreferrer"
      target="_blank"
    >
      Download CV (PDF)
    </a>
  );
}
