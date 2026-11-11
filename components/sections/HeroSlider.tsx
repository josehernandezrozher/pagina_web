"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";

type Tone = "light" | "dark";

type Slide = {
  tab: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  /**
   * light = banner claro con la persona a la izquierda y el espacio libre a la derecha:
   *         el texto va en azul marino sobre ese espacio, sin overlay.
   * dark  = foto con overlay azul y texto blanco a la izquierda.
   */
  tone: Tone;
  /** El slide solo aparece si este producto está disponible */
  slug?: string;
  /** El slide solo aparece si hay al menos un producto disponible de esta categoría */
  category?: "credito" | "seguro" | "servicio";
};

/**
 * Carrusel de encabezado estilo banca (referencia Inbursa). Se desliza POR DEBAJO de la
 * barra de navegación (margen negativo = alto de la barra) en la página de inicio.
 * Auto-avanza, se pausa al pasar el cursor y respeta prefers-reduced-motion.
 * Con un solo slide no muestra flechas ni pestañas.
 *
 * El banner claro conserva la proporción de su imagen (1600×773) para no recortar a la
 * persona; el texto ocupa el espacio vacío de la derecha. Cada slide avisa a la barra de
 * navegación de su tono (evento "hero-tone") para que sus letras sean legibles.
 *
 * Para un slide nuevo con banner claro: imagen con el sujeto en el tercio izquierdo y el
 * resto libre, y tone: "light".
 */
const ALL_SLIDES: Slide[] = [
  {
    tab: "Crédito IMSS",
    title: "Tu pensión también puede ser tu respaldo",
    text: "Crédito personal con cobranza delegada para pensionados y trabajadores IMSS. Te asesoramos en todo el trámite.",
    ctaLabel: "Conocer el crédito",
    ctaHref: "/productos/credito-nomina-imss",
    image: "/images/hero/banner-imss.jpg",
    tone: "light",
    slug: "credito-nomina-imss",
  },
  {
    tab: "Tarjetas Aeroméxico",
    title: "Haz que cada compra cuente",
    text: "Tres tarjetas de crédito Aeroméxico Inbursa para acumular en cada compra y aprovechar beneficios de viaje.",
    ctaLabel: "Ver tarjetas",
    ctaHref: "/productos/tarjetas-aeromexico-inbursa",
    image: "/images/placeholder-wide.jpg",
    tone: "dark",
    slug: "tarjetas-aeromexico-inbursa",
  },
  {
    tab: "Seguros",
    title: "Protege lo que más te importa",
    text: "Seguros de vida, gastos médicos mayores y auto, con la asesoría de un experto para elegir la cobertura correcta.",
    ctaLabel: "Ver seguros",
    ctaHref: "/seguros",
    image: "/images/products/seguros.jpg",
    tone: "dark",
    category: "seguro",
  },
];

const INTERVAL = 6000;

export function HeroSlider({
  availableSlugs,
  availableCategories,
}: {
  availableSlugs: string[];
  availableCategories: string[];
}) {
  const SLIDES = ALL_SLIDES.filter(
    (s) =>
      (!s.slug || availableSlugs.includes(s.slug)) &&
      (!s.category || availableCategories.includes(s.category))
  );
  const multiple = SLIDES.length > 1;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!multiple || paused || reduced.current) return;
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [multiple, paused, active, SLIDES.length]);

  const go = (i: number) => setActive((i + SLIDES.length) % SLIDES.length);

  const current = SLIDES[active] ?? SLIDES[0];
  const tone: Tone = current?.tone ?? "dark";

  // Avisa a la barra de navegación del tono del slide activo.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hero-tone", { detail: tone }));
  }, [tone]);

  if (!current) return null;

  const light = tone === "light";
  const ctrl = light
    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"
    : "bg-white/20 text-white hover:bg-white/30";

  return (
    <section
      className="relative isolate -mt-[var(--nav-h)] overflow-hidden bg-[var(--color-hero-light)] md:aspect-[1600/773] md:max-h-[60rem]"
      aria-roledescription="carousel"
      aria-label="Productos destacados"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        key={active}
        role="group"
        aria-roledescription="slide"
        aria-label={`${active + 1} de ${SLIDES.length}`}
        className="hero-panel relative flex flex-col md:absolute md:inset-0"
      >
        {light ? <LightSlide slide={current} /> : <DarkSlide slide={current} />}
      </div>

      {/* Flechas circulares (solo con varios slides) */}
      {multiple && (
        <>
          <button
            onClick={() => go(active - 1)}
            aria-label="Anterior"
            className={`absolute top-1/2 left-[3vw] hidden h-[clamp(2.75rem,3.6vw,4rem)] w-[clamp(2.75rem,3.6vw,4rem)] -translate-y-1/2 place-items-center rounded-full transition md:grid ${ctrl}`}
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => go(active + 1)}
            aria-label="Siguiente"
            className={`absolute top-1/2 right-[3vw] hidden h-[clamp(2.75rem,3.6vw,4rem)] w-[clamp(2.75rem,3.6vw,4rem)] -translate-y-1/2 place-items-center rounded-full transition md:grid ${ctrl}`}
          >
            <ArrowRight size={24} />
          </button>

          {/* Pestañas inferiores (más arriba en el banner claro, para quedar sobre fondo claro) */}
          <div
            className={`absolute inset-x-0 ${
              light ? "bottom-[clamp(1rem,8vw,9rem)]" : "bottom-[clamp(1rem,3.6vw,4rem)]"
            }`}
          >
            <Container>
              <div className="flex flex-wrap justify-center gap-x-[6.25vw] gap-y-2">
                {SLIDES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-current={i === active}
                    className={`border-b-[3px] pb-1 text-nav font-semibold transition-opacity ${
                      light ? "text-[var(--color-primary)]" : "text-white"
                    } ${
                      i === active
                        ? light
                          ? "border-[var(--color-primary)]"
                          : "border-white"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {s.tab}
                  </button>
                ))}
              </div>
            </Container>
          </div>
        </>
      )}
    </section>
  );
}

/** Banner claro: la imagen manda; el texto va en el espacio libre de la derecha (en móvil, debajo de la imagen). */
function LightSlide({ slide }: { slide: Slide }) {
  return (
    <>
      <div className="relative h-[78vw] max-h-[28rem] md:absolute md:inset-0 md:h-auto md:max-h-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.image}
          alt=""
          className="h-full w-full object-cover object-[10%_15%] md:object-[center_top]"
        />
      </div>

      <div className="relative bg-[var(--color-hero-light)] pt-8 pb-12 md:flex md:flex-1 md:items-center md:bg-transparent md:pt-[var(--nav-h)] md:pb-[7vw]">
        <Container className="w-full">
          <div className="text-[var(--color-primary)] md:ml-[36.4vw] md:max-w-[50vw]">
            <h1 className="text-display font-bold">{slide.title}</h1>
            <p className="mt-[clamp(1rem,2.3vw,2.5rem)] text-lead font-semibold">{slide.text}</p>
            <div className="mt-[clamp(1.5rem,2.7vw,3rem)]">
              <Link href={slide.ctaHref} className="btn btn-primary">
                {slide.ctaLabel}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

/** Foto con overlay azul y texto blanco a la izquierda. */
function DarkSlide({ slide }: { slide: Slide }) {
  return (
    <>
      <div className="absolute inset-0 -z-10 bg-[var(--color-primary)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,2,84,0.84) 0%, rgba(0,2,84,0.62) 55%, rgba(0,2,84,0.38) 100%)",
          }}
        />
      </div>

      <div className="relative pt-[calc(var(--nav-h)+max(1.75rem,1.6vw))] pb-[clamp(3rem,6vw,7rem)] md:flex md:flex-1 md:items-center md:pt-[var(--nav-h)]">
        <Container className="w-full">
          <div className="max-w-[52rem] text-white md:ml-[7.9vw] md:max-w-[52vw]">
            <h1 className="text-display font-bold">{slide.title}</h1>
            <p className="mt-[clamp(1rem,2.3vw,2.5rem)] text-lead font-semibold">{slide.text}</p>
            <div className="mt-[clamp(1.5rem,2.7vw,3rem)]">
              <Link href={slide.ctaHref} className="btn btn-primary">
                {slide.ctaLabel}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
