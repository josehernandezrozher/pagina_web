"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import { leadSchema, type LeadInput } from "@/lib/validation/schemas";
import { trackEvent } from "@/lib/analytics/events";
import { newEventId } from "@/lib/utils/id";
import { Container } from "@/components/shared/Container";

export function LeadForm({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [startedTracked, setStartedTracked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { productSlug, name: "", phone: "", email: "", comments: "", website: "" },
  });

  const handleFocusStart = () => {
    if (!startedTracked) {
      trackEvent({ name: "form_start", productSlug });
      setStartedTracked(true);
    }
  };

  const onSubmit = async (data: LeadInput) => {
    setStatus("idle");
    // Mismo ID en el Pixel (navegador) y en el servidor (Conversions API) para deduplicar.
    const eventId = newEventId();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, eventId }),
      });
      if (!res.ok) throw new Error("request-failed");
      trackEvent({ name: "form_submit", productSlug, productName, eventId });
      setStatus("success");
      reset({ productSlug, name: "", phone: "", email: "", comments: "", website: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Container className="max-w-xl py-16 text-center">
        <h2 className="text-2xl font-semibold text-[var(--color-ink)]">
          Recibimos tu solicitud
        </h2>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          Un asesor de Rozher Seguros te contactará en breve para hablar sobre{" "}
          {productName}.
        </p>
      </Container>
    );
  }

  return (
    <Container className="max-w-xl py-16">
      <h2 className="text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
        Solicita información
      </h2>
      <p className="mt-2 text-[var(--color-ink-soft)]">
        Completa tus datos y un asesor te contacta. Solo pedimos lo esencial.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFocusStart} className="mt-8 space-y-5" noValidate>
        <input type="hidden" {...register("productSlug")} />

        {/* Honeypot anti-bots: oculto para personas, los bots lo llenan. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            No llenar este campo
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <Field label="Nombre completo" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            autoComplete="name"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)]"
          />
        </Field>

        <Field label="Teléfono" error={errors.phone?.message}>
          <input
            {...register("phone")}
            type="tel"
            autoComplete="tel"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)]"
          />
        </Field>

        <Field label="Correo (opcional)" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)]"
          />
        </Field>

        <Field label="Comentarios (opcional)" error={errors.comments?.message}>
          <textarea
            {...register("comments")}
            rows={3}
            className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-primary)]"
          />
        </Field>

        {status === "error" && (
          <p className="text-sm text-[var(--color-pending)]">
            No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full disabled:opacity-60"
        >
          {isSubmitting ? "Enviando…" : "Enviar solicitud"}
        </button>

        <p className="text-xs text-[var(--color-ink-soft)]">
          Al enviar tus datos confirmas que leíste nuestro{" "}
          <Link href="/privacidad" className="font-medium text-[var(--color-primary)] underline">
            aviso de privacidad
          </Link>
          .
        </p>
      </form>
    </Container>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-[var(--color-pending)]">{error}</span>}
    </label>
  );
}
