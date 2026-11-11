"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/events";

/** Dispara product_view una vez al entrar a la página de un producto. */
export function ProductViewTracker({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName?: string;
}) {
  useEffect(() => {
    trackEvent({ name: "product_view", productSlug, productName });
  }, [productSlug, productName]);
  return null;
}
