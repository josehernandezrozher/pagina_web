import { ReactNode } from "react";

/**
 * Contenedor de página: ancho fluido con margen lateral proporcional
 * (ver --gutter en globals.css). Cualquier utilidad de ancho máximo
 * (p. ej. max-w-3xl) sobrescribe el límite por defecto.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`site-container ${className}`}>{children}</div>;
}
