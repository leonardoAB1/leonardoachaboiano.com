"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FormValues {
  email: string;
  subject: string;
  message: string;
}

const inputClasses = cn(
  // Inputs are offset from the page's brand surface so they read as the same
  // material, just a step apart. Light mode: a deeper teal (mix toward the brand)
  // so the field is the tinted element and the page reads lighter. Dark mode:
  // lift toward white so the field sits above the dark surface.
  "w-full rounded-md border border-border px-3 py-2",
  "bg-[color-mix(in_srgb,var(--surface-brand),var(--color-brand)_8%)]",
  "dark:bg-[color-mix(in_srgb,var(--surface-brand),white_7%)]",
  "text-sm text-ink-1 placeholder:text-ink-4",
  "focus:outline-2 focus:outline-brand focus:outline-offset-0",
  "transition-colors duration-150",
);

const labelClasses = "block text-sm font-medium text-ink-2";
const errorClasses = "mt-1 text-sm text-red-500";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactElement;
}

function FieldWrapper({
  label,
  htmlFor,
  error,
  children,
}: FieldWrapperProps): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
      </label>
      {children}
      {error ? <p className={errorClasses}>{error}</p> : null}
    </div>
  );
}

export function ContactForm(): ReactElement {
  const t = useTranslations("Contact.Form");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // Build the validation schema with localized messages. Recreated when the
  // active locale changes so error text follows the UI language.
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("validation.emailInvalid")),
        subject: z.string().min(5, t("validation.subjectMin")),
        message: z.string().min(20, t("validation.messageMin")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormValues) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <FieldWrapper
        label={t("email")}
        htmlFor="email"
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          className={inputClasses}
          {...register("email")}
        />
      </FieldWrapper>

      <FieldWrapper
        label={t("subject")}
        htmlFor="subject"
        error={errors.subject?.message}
      >
        <input
          id="subject"
          type="text"
          placeholder={t("subjectPlaceholder")}
          className={inputClasses}
          {...register("subject")}
        />
      </FieldWrapper>

      <FieldWrapper
        label={t("message")}
        htmlFor="message"
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={6}
          placeholder={t("messagePlaceholder")}
          className={cn(inputClasses, "resize-y")}
          {...register("message")}
        />
      </FieldWrapper>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={status === "loading"}
          // Full-width on mobile for an easy tap target; on desktop it hugs its
          // content (self-start defeats the flex-column stretch) so it reads as a
          // CTA rather than a heavy full-width teal bar.
          className="w-full sm:w-auto sm:self-start"
        >
          {status === "loading" ? t("sending") : t("send")}
        </Button>

        {status === "success" && (
          <p className="text-sm text-brand">{t("success")}</p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-500">{t("error")}</p>
        )}
      </div>
    </form>
  );
}
