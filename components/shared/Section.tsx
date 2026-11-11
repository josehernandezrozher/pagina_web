import { ReactNode } from "react";

export function Section({
  children,
  className = "",
  tone = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "paper" | "primary";
  id?: string;
}) {
  const toneClass =
    tone === "paper"
      ? "bg-[var(--color-paper)]"
      : tone === "primary"
        ? "bg-[var(--color-primary)] text-white"
        : "bg-white";

  return (
    <section id={id} className={`py-[var(--section-y)] ${toneClass} ${className}`}>
      {children}
    </section>
  );
}
