"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Pending } from "@/components/shared/Pending";
import { trackEvent } from "@/lib/analytics/events";
import type { Product } from "@/lib/products/types";

export function FAQAccordion({ faqs, productSlug }: { faqs: Product["faqs"]; productSlug?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section tone="paper">
      <Container className="max-w-3xl">
        <h2 className="section-title">
          Preguntas frecuentes
        </h2>

        <div className="mt-8 divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-card)]">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => {
                    const next = isOpen ? null : i;
                    setOpenIndex(next);
                    if (next !== null) {
                      trackEvent({ name: "faq_open", question: faq.question, productSlug });
                    }
                  }}
                >
                  <span className="text-card font-semibold text-[var(--color-ink)]">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[var(--color-ink-soft)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-card text-[var(--color-ink)]">
                    <Pending value={faq.answer} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
