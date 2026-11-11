"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { WHATSAPP_DISPLAY } from "@/lib/contact";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics/events";

const PRODUCT_LINKS = [
  { href: "/productos", label: "Créditos" },
  { href: "/seguros", label: "Seguros" },
];

const NAV_LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const WA_TOPBAR_MESSAGE = "Hola, quiero información sobre los productos de Rozher Seguros.";

/**
 * Encabezado: barra superior + barra de navegación fija.
 * En la página de inicio la navegación es transparente sobre el carrusel y se
 * vuelve azul al hacer scroll (el carrusel se desliza por debajo, ver HeroSlider).
 * En las demás páginas es azul siempre.
 *
 * Es un fragmento (dos hermanos directos del <body>) para que la barra fija
 * permanezca visible durante toda la página.
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Tono del banner que hay debajo de la barra (lo anuncia HeroSlider con el evento "hero-tone").
  const [heroTone, setHeroTone] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onTone = (e: Event) => setHeroTone((e as CustomEvent<"light" | "dark">).detail);
    window.addEventListener("hero-tone", onTone);
    return () => window.removeEventListener("hero-tone", onTone);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled && !open;
  // Letras oscuras solo cuando la barra es transparente sobre un banner claro.
  const onLight = transparent && heroTone === "light";
  const fg = onLight ? "text-[var(--color-primary)]" : "text-white";

  return (
    <>
      {/* Barra superior (solo escritorio) */}
      <div
        className="hidden shrink-0 bg-[var(--color-primary)] text-white md:block"
        style={{ height: "var(--topbar-h)" }}
      >
        <Container className="flex h-full items-center justify-end">
          <a
            href={buildWhatsAppLink(WA_TOPBAR_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ name: "whatsapp_click" })}
            className="inline-flex items-center gap-2 text-[clamp(0.875rem,1.1vw,1.125rem)] text-white/90 hover:text-white"
          >
            <MessageCircle size={18} /> WhatsApp: {WHATSAPP_DISPLAY}
          </a>
        </Container>
      </div>

      {/* Navegación principal (fija) */}
      <header
        className={`sticky top-0 z-50 shrink-0 border-b transition-colors duration-200 ${
          transparent
            ? onLight
              ? "border-[var(--color-primary)]/15 bg-transparent"
              : "border-white/20 bg-transparent"
            : "border-white/10 bg-[var(--color-primary)]"
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <Container className="flex h-full items-center">
          <Link href="/" className="flex items-center gap-3" aria-label="Rozher Seguros, inicio">
            <span
              className={`grid shrink-0 place-items-center rounded-[0.6rem] font-bold ${
                onLight ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-primary)]"
              }`}
              style={{
                height: "clamp(2.25rem, 2.9vw, 3.25rem)",
                width: "clamp(2.25rem, 2.9vw, 3.25rem)",
                fontSize: "clamp(1.1rem, 1.6vw, 1.75rem)",
              }}
            >
              R
            </span>
            <span
              className={`font-bold leading-none ${fg}`}
              style={{ fontSize: "clamp(1.25rem, 1.9vw, 2rem)" }}
            >
              Rozher <span className="font-normal">Seguros</span>
            </span>
          </Link>

          <nav className="ml-[5.8vw] hidden items-center gap-[2.8vw] md:flex">
            <ProductsDropdown fg={fg} />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-nav font-semibold transition-opacity hover:opacity-80 ${fg}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden md:block">
            <Link href="/productos/credito-nomina-imss" className="btn btn-sm btn-primary">
              Solicitar ahora
            </Link>
          </div>

          <button
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`ml-auto rounded-[var(--radius-sm)] p-2 md:hidden ${fg}`}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </Container>
      </header>

      {/* Menú móvil */}
      {open && (
        <div className="fixed inset-x-0 z-40 bg-[var(--color-primary)] text-white md:hidden" style={{ top: "var(--nav-h)" }}>
          <Container className="flex flex-col gap-1 py-4">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-white/60">
              Productos
            </p>
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-5 py-3 text-lg font-semibold hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-white/15" />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-sm)] px-3 py-3 text-lg font-semibold hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/productos/credito-nomina-imss"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-3"
            >
              Solicitar ahora
            </Link>
          </Container>
        </div>
      )}
    </>
  );
}

/** Menú desplegable "Productos" para escritorio: hover + click + teclado. */
function ProductsDropdown({ fg = "text-white" }: { fg?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 text-nav font-semibold transition-opacity hover:opacity-80 ${fg}`}
      >
        Productos
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
          >
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-1 shadow-[var(--shadow-card)]">
          {PRODUCT_LINKS.map((link) => (
            <Link
            key={link.href}
            href={link.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-[0.95rem] font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper)] hover:text-[var(--color-accent)]"
            >
            {link.label}
            </Link>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
