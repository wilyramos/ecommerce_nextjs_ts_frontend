// File: frontend/app/(checkout-v3)/checkout-v3/page.tsx
import { getSession } from "@/src/auth/dal";
import CheckoutView from "@/src/components/checkout-v3/CheckoutView";

export default async function CheckoutPageWith3DS() {
  const session = await getSession();

  return (
    <CheckoutView
      user={session?.user ?? null}
      isAuth={Boolean(session?.isAuth)}
    />
  );
}