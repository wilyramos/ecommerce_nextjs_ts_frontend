// File: frontend/app/(checkout)/checkout/page.tsx
// Pagina solo para redireccionar a la nueva ruta de checkout-v3

import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/checkout-v3");
}