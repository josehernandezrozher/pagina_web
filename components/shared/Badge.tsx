export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-sm font-medium text-[var(--color-primary)]">
      {children}
    </span>
  );
}
