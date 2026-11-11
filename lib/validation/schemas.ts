import { z } from "zod";

// Caracteres de control (salvo salto de línea/tab) no tienen cabida en un lead.
const noControlChars = (v: string) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(v);

/**
 * strictObject: rechaza campos desconocidos (evita que alguien inyecte
 * propiedades extra hacia el webhook/CRM).
 */
export const leadSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre completo.")
    .max(100, "El nombre es demasiado largo.")
    .refine(noControlChars, "Caracteres no válidos."),
  // Acepta "8680000000", "868 000 0000", "+52 868 000 0000", etc.: se cuentan los dígitos,
  // no los caracteres (10 para México; hasta 13 con lada internacional).
  phone: z
    .string()
    .trim()
    .max(24, "Escribe un teléfono válido (10 dígitos).")
    .regex(/^[0-9+\s().-]+$/, "Escribe un teléfono válido (10 dígitos).")
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 10 && digits <= 13;
    }, "Escribe un teléfono válido (10 dígitos)."),
  email: z
    .string()
    .trim()
    .max(254)
    .email("Escribe un correo válido.")
    .optional()
    .or(z.literal("")),
  productSlug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Producto no válido."),
  comments: z
    .string()
    .trim()
    .max(500, "Máximo 500 caracteres.")
    .refine(noControlChars, "Caracteres no válidos.")
    .optional(),
  /** Honeypot: campo oculto. Una persona real nunca lo llena; un bot sí. */
  website: z.string().max(200).optional(),
  /** ID compartido con el Pixel de Meta para deduplicar con Conversions API. */
  eventId: z
    .string()
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/)
    .optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
