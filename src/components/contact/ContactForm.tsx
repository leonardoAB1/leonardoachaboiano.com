"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

const inputClasses = cn(
  "w-full rounded-md border border-border bg-surface-1 px-3 py-2",
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

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
      <FieldWrapper label="Name" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          className={inputClasses}
          {...register("name")}
        />
      </FieldWrapper>

      <FieldWrapper label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          className={inputClasses}
          {...register("email")}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Subject"
        htmlFor="subject"
        error={errors.subject?.message}
      >
        <input
          id="subject"
          type="text"
          placeholder="What's this about?"
          className={inputClasses}
          {...register("subject")}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Message"
        htmlFor="message"
        error={errors.message?.message}
      >
        <textarea
          id="message"
          rows={6}
          placeholder="Your message..."
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
          className="w-full sm:w-auto"
        >
          {status === "loading" ? "Sending..." : "Send message"}
        </Button>

        {status === "success" && (
          <p className="text-sm text-brand">
            Message sent - I&apos;ll get back to you soon.
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-500">
            Something went wrong. Please try again or email me directly.
          </p>
        )}
      </div>
    </form>
  );
}
