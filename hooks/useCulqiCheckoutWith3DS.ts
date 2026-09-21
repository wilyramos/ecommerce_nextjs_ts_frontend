// File: frontend/hooks/useCulqiCheckoutWith3DS.ts
"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CulqiCheckoutConfig } from "@/src/types/culqi";

interface UseCulqiCheckoutOptions {
  onToken: (tokenId: string) => Promise<void>;
  onOrderAsynchronous: () => void;
  onError: (error: string) => void;
  onClose?: () => void;
}

const CULQI_CHECKOUT_ORIGINS = new Set([
  "https://checkoutview.culqi.com",
  "https://js.culqi.com",
  "https://secure.culqi.com",
]);

export function useCulqiCheckoutWith3DS({
  onToken,
  onOrderAsynchronous,
  onError,
  onClose,
}: UseCulqiCheckoutOptions) {
  const callbacksRef = useRef({ onToken, onOrderAsynchronous, onError, onClose });

  const asynchronousOrderGeneratedRef = useRef<boolean>(false);
  const asynchronousFlowCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    callbacksRef.current = { onToken, onOrderAsynchronous, onError, onClose };
  }, [onToken, onOrderAsynchronous, onError, onClose]);

  const completeAsynchronousFlow = useCallback(() => {
    if (!asynchronousOrderGeneratedRef.current || asynchronousFlowCompletedRef.current) return;

    asynchronousFlowCompletedRef.current = true;
    asynchronousOrderGeneratedRef.current = false;
    console.log("[Culqi] ✅ Flujo asíncrono finalizado por el usuario");
    callbacksRef.current.onOrderAsynchronous();
  }, []);

  useEffect(() => {
    window.culqi = () => {
      const Culqi = window._culqiSingletonInstance;

      if (!Culqi) {
        console.warn("[Culqi] ⚠️ No existe instancia de CulqiCheckout");
        return;
      }

      if (Culqi.token) {
        console.log("[Culqi] ✔️ Token recibido:", Culqi.token.id);
        asynchronousOrderGeneratedRef.current = false;
        asynchronousFlowCompletedRef.current = false;

        callbacksRef.current.onToken(Culqi.token.id).catch((error: unknown) => {
          console.error("[Culqi] ❌ Error procesando token internamente:", error);
          callbacksRef.current.onError("Hubo un error al procesar el pago. Intenta de nuevo.");
        });

        Culqi.token = null;
        return;
      }

      if (Culqi.order) {
        console.log("[Culqi] ✔️ Orden asíncrona generada (CIP/QR)");
        asynchronousOrderGeneratedRef.current = true;
        asynchronousFlowCompletedRef.current = false;
        Culqi.order = null;
        return;
      }

      if (Culqi.closeEvent) {
        console.log("[Culqi] 🔔 closeEvent recibido");

        if (asynchronousOrderGeneratedRef.current) {
          completeAsynchronousFlow();
        } else {
          console.log("[Culqi] ℹ️ Modal cerrado sin pago exitoso.");
          callbacksRef.current.onClose?.();
        }

        Culqi.closeEvent = null;
        return;
      }

      if (Culqi.error) {
        console.error("[Culqi] ❌ Error de Culqi:", Culqi.error);
        asynchronousOrderGeneratedRef.current = false;
        asynchronousFlowCompletedRef.current = false;

        callbacksRef.current.onError(
          Culqi.error.user_message || Culqi.error.merchant_message || "El pago no pudo completarse."
        );

        Culqi.error = null;
        return;
      }

      console.log("[Culqi] ℹ️ Callback ejecutado sin datos relevantes (cierre manual).");
      callbacksRef.current.onClose?.();
    };
  }, [completeAsynchronousFlow]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!CULQI_CHECKOUT_ORIGINS.has(event.origin)) return;

      const data = event.data;
      if (!data) return;

      let serialized = "";
      try {
        serialized = typeof data === "string" ? data : JSON.stringify(data);
      } catch {
        return;
      }

      const normalized = serialized.toLowerCase();
      const closeIndicators = ["close", "closed", "checkout_closed", "modal_closed"];

      if (closeIndicators.some((indicator) => normalized.includes(indicator))) {
        console.log("[Culqi] 🔔 Cierre detectado vía postMessage");
        if (asynchronousOrderGeneratedRef.current) {
          completeAsynchronousFlow();
        } else {
          callbacksRef.current.onClose?.();
        }
      }
    };

    window.addEventListener("message", handleMessage, false);
    return () => window.removeEventListener("message", handleMessage, false);
  }, [completeAsynchronousFlow]);

  const openCulqiModal = useCallback((config: CulqiCheckoutConfig) => {
    const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("Culqi Public Key no definida (.env)");
    }

    if (typeof window.CulqiCheckout === "undefined") {
      throw new Error("El script de Culqi no está cargado. Intenta recargar la página.");
    }

    // Instanciar por primera vez
    if (!window._culqiSingletonInstance) {
      console.log("[Culqi] Instanciando CulqiCheckout por primera vez...");
      window._culqiSingletonInstance = new window.CulqiCheckout(publicKey, config);
    } else {
      console.log("[Culqi] Reutilizando instancia existente...");
      const instance = window._culqiSingletonInstance;

      // Actualización Type-Safe usando object spread
      instance.publicKey = publicKey;
      instance.settings = { ...(instance.settings || {}), ...config.settings };
      instance.client = { ...(instance.client || {}), ...config.client };
      instance.options = { ...(instance.options || {}), ...config.options };

      // Limpieza de residuos
      instance.token = null;
      instance.order = null;
      instance.error = null;
      instance.closeEvent = null;
    }

    const currentInstance = window._culqiSingletonInstance;

    // Verificamos que se haya instanciado correctamente antes de manipular
    if (currentInstance) {
      currentInstance.culqi = window.culqi;

      asynchronousOrderGeneratedRef.current = false;
      asynchronousFlowCompletedRef.current = false;

      console.log("[Culqi] 💳 Abriendo modal principal...");
      currentInstance.open();
    }
  }, []);

  const closeCulqiModal = useCallback(() => {
    if (window._culqiSingletonInstance) {
      try {
        window._culqiSingletonInstance.close();
      } catch (error) {
        console.error("[Culqi] ❌ Error cerrando modal:", error);
      }
    }
  }, []);

  return { openCulqiModal, closeCulqiModal };
}