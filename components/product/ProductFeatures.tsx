import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Pending } from "@/components/shared/Pending";
import type { Product } from "@/lib/products/types";

/**
 * Características del producto (monto, plazos, tipos de crédito, etc.) y
 * tablas de referencia opcionales. Recibe datos, no los conoce de antemano.
 */
export function ProductFeatures({
  features,
  infoTables,
}: {
  features: Product["features"];
  infoTables?: Product["infoTables"];
}) {
  if (features.length === 0 && !infoTables?.length) return null;

  return (
    <Section>
      <Container>
        <h2 className="section-title">
          Características
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            // Si la última tarjeta quedaría sola en su fila, ocupa todo el ancho.
            const isLast = i === features.length - 1;
            const span = isLast
              ? `${features.length % 2 === 1 ? "sm:col-span-2" : ""} ${
                  features.length % 3 === 1 ? "lg:col-span-3" : "lg:col-span-1"
                }`
              : "";
            return (
            <div
              key={f.title}
              className={`rounded-[var(--radius-md)] border border-[var(--color-border)] p-6 ${span}`}
            >
              <h3 className="text-card-title font-bold text-[var(--color-ink)]">{f.title}</h3>
              <p className="mt-2 text-card text-[var(--color-ink)]">
                <Pending value={f.description} />
              </p>
            </div>
            );
          })}
        </div>

        {infoTables?.map((table) => (
          <div key={table.title} className="mt-12 max-w-xl">
            <h3 className="text-card-title font-bold text-[var(--color-ink)]">{table.title}</h3>
            <div className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <table className="w-full text-left text-card">
                <thead className="bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">{table.headers[0]}</th>
                    <th scope="col" className="px-5 py-3 font-semibold">{table.headers[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map(([a, b]) => (
                    <tr key={a} className="border-t border-[var(--color-border)]">
                      <td className="px-5 py-3 text-[var(--color-ink)]">{a}</td>
                      <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.note && (
              <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{table.note}</p>
            )}
          </div>
        ))}
      </Container>
    </Section>
  );
}
