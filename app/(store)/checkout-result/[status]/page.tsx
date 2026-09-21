// File: frontend/app/(checkout-v3)/checkout-result/[status]/page.tsx

import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
    ArrowRight, CheckCircle2,
    Clock3, ExternalLink,
    Loader2,
    MapPin,
    Package, UserRound,
    XCircle
} from "lucide-react";

import { getSession, getTokenOptional } from "@/src/auth/dal";
import { orderService } from "@/src/services/order-v3.service";

interface Props {
  params: Promise<{ status: string }>;
  searchParams: Promise<{ order?: string }>;
}

type CheckoutStatus = "success" | "pending" | "error" | "verifying";

const STATUS_CONFIG: Record<
  CheckoutStatus,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    badgeClass: string;
    iconClass: string;
  }
> = {
  success: {
    title: "Tu compra fue confirmada",
    description:
      "Hemos recibido la confirmación de tu pago y tu pedido ya está registrado.",
    icon: <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />,
    badgeClass:
      "bg-status-success-light text-status-success border-status-success/20",
    iconClass: "bg-status-success-light text-status-success",
  },

  pending: {
    title: "Estamos esperando la confirmación",
    description:
      "Tu pedido fue registrado correctamente. El pago todavía necesita ser confirmado.",
    icon: <Clock3 className="h-7 w-7" strokeWidth={1.8} />,
    badgeClass:
      "bg-status-warning-light text-status-warning border-status-warning/20",
    iconClass: "bg-status-warning-light text-status-warning",
  },

  error: {
    title: "No pudimos completar el pago",
    description:
      "La transacción no fue confirmada. Tu pedido no se considera pagado.",
    icon: <XCircle className="h-7 w-7" strokeWidth={1.8} />,
    badgeClass:
      "bg-status-error-light text-status-error border-status-error/20",
    iconClass: "bg-status-error-light text-status-error",
  },

  verifying: {
    title: "Estamos verificando tu pago",
    description:
      "Estamos consultando el estado de la transacción. No cierres esta página.",
    icon: <Loader2 className="h-7 w-7 animate-spin" strokeWidth={1.8} />,
    badgeClass:
      "bg-status-info-light text-status-info border-status-info/20",
    iconClass: "bg-status-info-light text-status-info",
  },
};

export default async function CheckoutResultPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { status } = params;
  const orderNumber = searchParams.order;

  const validStatuses: CheckoutStatus[] = [
    "success",
    "pending",
    "error",
    "verifying",
  ];

  if (!validStatuses.includes(status as CheckoutStatus)) {
    return notFound();
  }

  if (!orderNumber) {
    return redirect("/");
  }

  const currentStatus = status as CheckoutStatus;
  const config = STATUS_CONFIG[currentStatus];

  const session = await getSession();
  const token = await getTokenOptional();

  let order = null;
  let fetchError = false;

  try {
    order = await orderService.getByOrderNumber(orderNumber, token);
  } catch (error) {
    console.error("[CheckoutResult] Error obteniendo orden:", error);
    fetchError = true;
  }

  const customerName = order?.customerProfile
    ? `${order.customerProfile.nombre} ${order.customerProfile.apellidos}`
    : null;

  const formattedTotal = order
    ? new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: order.currency === "PEN" ? "PEN" : "USD",
      }).format(order.totalPrice)
    : null;

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-2xl">

        {/* HEADER */}
        <div className="mb-7 text-center">
          <div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${config.iconClass}`}
          >
            {config.icon}
          </div>

         

          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {config.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
            {config.description}
          </p>
        </div>

        {/* RECEIPT */}
        <section className="relative overflow-hidden bg-surface-primary shadow-lg">

          {/* Top receipt perforation */}
          <div className="absolute -top-3 left-0 right-0 flex justify-between px-1">
            {Array.from({ length: 34 }).map((_, index) => (
              <span
                key={index}
                className="h-5 w-5 rounded-full bg-surface-secondary"
              />
            ))}
          </div>

          <div className="px-6 pb-8 pt-9 sm:px-10 sm:pb-10 sm:pt-10">

            {/* RECEIPT HEADER */}
            <div className="border-b border-border-primary pb-7 text-center">
              <div className="text-xl font-semibold tracking-[0.18em] text-text-primary">
                GOPHONE
              </div>
            </div>

            {/* ORDER NUMBER */}
            <div className="flex items-center justify-between gap-4 border-b border-border-primary py-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                  Número de orden
                </p>

                <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-text-primary">
                  #{order?.orderNumber ?? orderNumber}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary text-text-secondary">
                <Package className="h-5 w-5" />
              </div>
            </div>

            {fetchError || !order ? (
              <div className="border-b border-border-primary py-8 text-center">
                <p className="text-sm text-text-secondary">
                  No pudimos cargar los detalles de la orden.
                </p>

                <p className="mt-1 text-xs text-text-tertiary">
                  Conserva tu número de orden para realizar el seguimiento.
                </p>
              </div>
            ) : (
              <>
                {/* TOTAL */}
                <div className="border-b border-border-primary py-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-text-tertiary">
                        Total
                      </p>

                      <p className="mt-1 text-3xl font-semibold tracking-tight text-text-primary">
                        {formattedTotal}
                      </p>
                    </div>

                    <div className="pb-1 text-right">
                      <p className="text-[11px] uppercase tracking-wider text-text-tertiary">
                        Moneda
                      </p>
                      <p className="mt-1 text-sm font-medium text-text-secondary">
                        {order.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER */}
                <div className="grid gap-7 border-b border-border-primary py-7 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-secondary">
                      <UserRound className="h-4 w-4 text-text-secondary" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                        Cliente
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-text-primary">
                        {customerName}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {order.customerProfile.email}
                      </p>
                    </div>
                  </div>

                  {/* SHIPPING */}
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-secondary">
                      <MapPin className="h-4 w-4 text-text-secondary" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
                        Entrega
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-text-primary">
                        {order.shippingAddress.direccion}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-text-secondary">
                        {order.shippingAddress.distrito},{" "}
                        {order.shippingAddress.provincia}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAYMENT STATUS */}
                
              </>
            )}

          
          </div>

          {/* Bottom receipt perforation */}
          <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-1">
            {Array.from({ length: 34 }).map((_, index) => (
              <span
                key={index}
                className="h-5 w-5 rounded-full bg-surface-secondary"
              />
            ))}
          </div>
        </section>

        {/* STATUS MESSAGE */}
        <div className="mt-7 text-center">
          {currentStatus === "success" && (
            <p className="text-sm text-text-secondary">
              Guarda este número de orden para consultar el estado de tu
              compra.
            </p>
          )}

          {currentStatus === "pending" && (
            <p className="text-sm text-text-secondary">
              El estado se actualizará cuando recibamos la confirmación del
              medio de pago.
            </p>
          )}

          {currentStatus === "error" && (
            <p className="text-sm text-text-secondary">
              Puedes volver al carrito e intentar nuevamente con otro medio de
              pago.
            </p>
          )}

          {currentStatus === "verifying" && (
            <p className="text-sm text-text-secondary">
              La verificación puede tardar unos segundos.
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {currentStatus === "error" && (
            <Link
              href="/carrito"
              className="inline-flex h-12 items-center justify-center gap-2 bg-button-accent-bg px-6 text-sm font-medium text-button-accent-text transition-colors hover:bg-button-accent-hover"
            >
              Intentar nuevamente
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {session?.isAuth && (
            <Link
              href="/perfil/pedidos"
              className="inline-flex h-12 items-center justify-center gap-2 bg-button-primary-bg px-6 text-sm font-medium text-button-primary-text transition-colors hover:bg-button-primary-hover"
            >
              <Package className="h-4 w-4" />
              Ver mis pedidos
            </Link>
          )}

          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 border border-border-primary bg-surface-primary px-6 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Volver a la tienda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* GUEST TRACKING */}
        {!session?.isAuth && (
          <div className="mt-6 text-center">
            <p className="text-xs text-text-tertiary">
              ¿Quieres administrar y consultar tus pedidos desde tu cuenta?
            </p>

            <Link
              href={`/auth/login?redirect=/checkout-result/${currentStatus}?order=${orderNumber}`}
              className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-accent hover:underline"
            >
              Iniciar sesión o crear una cuenta
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {/* VERIFYING NOTICE */}
        {currentStatus === "verifying" && (
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-text-tertiary">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Verificando automáticamente...
          </div>
        )}
      </div>
    </main>
  );
}