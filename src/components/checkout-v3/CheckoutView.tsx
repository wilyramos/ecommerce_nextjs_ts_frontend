// File: frontend/components/checkout-v3/CheckoutView.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Lock,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { useCheckoutFlow } from "@/hooks/useCheckoutFlow";

import type { CustomerProfile, ShippingAddress } from "@/src/schemas/order.schema";
import type { User } from "@/src/schemas";

import CustomerProfileSection from "@/components/checkout-v2/form/CustomerProfileSection";
import ShippingAddressSection from "@/components/checkout-v2/form/ShippingAddressSection";
import OrderSummary from "@/components/checkout-v2/summary/OrderSummary";
import { ButtonV3 } from "@/components/ui/ButtonV3";

const DEFAULT_PROFILE: CustomerProfile = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  tipoDocumento: undefined,
  numeroDocumento: "",
};

const DEFAULT_ADDRESS: ShippingAddress = {
  departamento: "",
  provincia: "",
  distrito: "",
  direccion: "",
  numero: "",
  pisoDpto: "",
  referencia: "",
};

interface CheckoutViewProps {
  user: User | null;
  isAuth: boolean;
}

export default function CheckoutView({ user, isAuth }: CheckoutViewProps) {
  const [mounted, setMounted] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const { cart, total } = useCartStore();

  const {
    customerProfile,
    shippingAddress,
    notes,
    appliedDiscount,
    setCustomerProfile,
    setShippingAddress,
    setNotes,
  } = useCheckoutStoreV2();

  const {
    isLoading,
    is3DSLoading,
    formErrors,
    setFormErrors,
    handlePayClick,
  } = useCheckoutFlow();

  useEffect(() => {
    setMounted(true);

    if (user && isAuth) {
      const current = useCheckoutStoreV2.getState().customerProfile ?? DEFAULT_PROFILE;
      setCustomerProfile({
        ...current,
        nombre: current.nombre || user.nombre || "",
        apellidos: current.apellidos || (user as unknown as { apellidos?: string }).apellidos || "",
        email: user.email || current.email || "",
        telefono: current.telefono || (user as unknown as { telefono?: string }).telefono || "",
        numeroDocumento:
          current.numeroDocumento ||
          (user as unknown as { numeroDocumento?: string }).numeroDocumento ||
          "",
      });
    }
  }, [user, isAuth, setCustomerProfile]);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-text-tertiary" />
      </div>
    );
  }

  const isFreeShipping = appliedDiscount?.isFreeShipping ?? false;
  const shippingCost = isFreeShipping ? 0 : total < 49 ? 10 : 0;
  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const finalTotal = Math.max(0, total + shippingCost - discountAmount);
  const isFormValid =
    customerProfile !== null &&
    shippingAddress !== null &&
    Object.keys(formErrors).length === 0;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* Resumen Móvil */}
      <div className="w-full border-b border-border-primary/60 bg-surface-primary lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileSummary(!showMobileSummary)}
          className="flex w-full items-center justify-between px-4 py-3 text-xs outline-none"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-text-secondary" />
            <span className="font-medium text-text-primary">
              {showMobileSummary ? "Ocultar pedido" : "Mostrar pedido"}
            </span>
            {showMobileSummary ? (
              <ChevronUp className="size-3.5 text-text-tertiary" />
            ) : (
              <ChevronDown className="size-3.5 text-text-tertiary" />
            )}
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums text-text-primary">
            S/ {finalTotal.toFixed(2)}
          </span>
        </button>

        {showMobileSummary && (
          <div className="border-t border-border-primary/40  p-4">
            <OrderSummary />
          </div>
        )}
      </div>

      {/* Formulario */}
      <div className="flex flex-1 justify-center bg-surface-primary py-7 sm:py-9 lg:justify-end">
        <div className="w-full max-w-xl space-y-6 px-4 sm:px-8 lg:pr-12 xl:pr-16">

          {is3DSLoading && (
            <div className="flex items-center gap-2.5 rounded-radius-md border border-border-primary bg-surface-secondary px-3.5 py-2.5 text-xs text-text-secondary">
              <Loader2 className="size-3.5 animate-spin text-text-primary" />
            </div>
          )}

          <div className="space-y-6">
            <CustomerProfileSection
              values={customerProfile ?? DEFAULT_PROFILE}
              errors={formErrors}
              lockedEmail={isAuth && user?.email ? user.email : undefined}
              isAuth={isAuth}
              onChange={(field, value) => {
                const current =
                  useCheckoutStoreV2.getState().customerProfile ?? DEFAULT_PROFILE;
                setCustomerProfile({ ...current, [field]: value });
                setFormErrors((prev) => {
                  const updated = { ...prev };
                  delete updated[`customerProfile.${field}`];
                  return updated;
                });
              }}
              disabled={isLoading || is3DSLoading}
            />

            <ShippingAddressSection
              values={shippingAddress ?? DEFAULT_ADDRESS}
              notes={notes}
              errors={formErrors}
              onChange={(field, value) => {
                const current =
                  useCheckoutStoreV2.getState().shippingAddress ?? DEFAULT_ADDRESS;
                setShippingAddress({ ...current, [field]: value });
                setFormErrors((prev) => {
                  const updated = { ...prev };
                  delete updated[`shippingAddress.${field}`];
                  return updated;
                });
              }}
              onNotesChange={setNotes}
              disabled={isLoading || is3DSLoading}
            />
          </div>

          {/* CTA Móvil */}
          <div className="pt-2 lg:hidden">
            <ButtonV3
              variant="default"
              size="lg"
              className="h-11 w-full rounded-full text-xs font-semibold shadow-xs cursor-pointer"
              onClick={handlePayClick}
              disabled={
                isLoading || is3DSLoading || cart.length === 0 || !isFormValid
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-3.5 animate-spin" /> Procesando
                </>
              ) : (
                <>
                  <Lock className="mr-2 size-3.5" /> Pagar S/ {finalTotal.toFixed(2)}
                </>
              )}
            </ButtonV3>
          </div>
        </div>
      </div>

      {/* Resumen Desktop */}
      <div className="hidden border-l border-border-primary/60 bg-surface-secondary/50 lg:flex lg:w-[50%] xl:w-[50%] rounded-l-4xl">
        <div className="sticky top-14 h-max w-full max-w-md space-y-4 px-8 py-9">
          <div className=" p-4">
            <OrderSummary />
          </div>

          <ButtonV3
            variant="default"
            size="lg"
            className="h-11 w-full rounded-full text-xs font-semibold shadow-xs cursor-pointer"
            onClick={handlePayClick}
            disabled={
              isLoading || is3DSLoading || cart.length === 0 || !isFormValid
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-3.5 animate-spin" /> Procesando
              </>
            ) : (
              <>
                <Lock className="mr-2 size-3.5" /> Pagar S/ {finalTotal.toFixed(2)}
              </>
            )}
          </ButtonV3>
        </div>
      </div>
    </div>
  );
}