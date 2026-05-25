import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export function DownloadButton(): ReactElement {
  const t = useTranslations("CV");
  return (
    <Link
      className={buttonClasses({ variant: "primary", size: "md" })}
      href="/cv/pdf"
      rel="noopener noreferrer"
      target="_blank"
    >
      {t("download")}
    </Link>
  );
}
