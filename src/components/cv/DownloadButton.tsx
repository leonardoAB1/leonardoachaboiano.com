import type { ReactElement } from "react";
import { buttonClasses } from "@/components/ui/Button";

export function DownloadButton(): ReactElement {
  return (
    <a
      className={buttonClasses({ variant: "primary", size: "md" })}
      download
      href="/cv/leonardo-acha-boiano-cv.pdf"
    >
      Download CV (PDF)
    </a>
  );
}
