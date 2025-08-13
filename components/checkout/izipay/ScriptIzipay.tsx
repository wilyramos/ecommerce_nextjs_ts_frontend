"use client";

import React, { useState } from "react";
import Script from "next/script";
import { createPaymentIzipay, IzipayPaymentPayload } from "@/actions/checkout/create-payment-izipay";

export default function IzipaySmartform() {
  const [formToken, setFormToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [krScriptLoaded, setKrScriptLoaded] = useState(false);

  async function handlePayment() {
    if (!krScriptLoaded) {
      alert("La librería de pagos aún no está lista.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: IzipayPaymentPayload = {
      amount: 1800,
      currency: "PEN",
      orderId: "ORD-TEST-001",
      customer: {
        email: "cliente@correo.com",
        reference: "CLIENTE-001",
      },
    };

    try {
      const { formToken } = await createPaymentIzipay(payload);
      console.log("Form token recibido:", formToken);

      if (!formToken) throw new Error("No se recibió token válido");
      setFormToken(formToken);
    } catch (e) {
      setError(String(e));
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Carga la librería con callbacks para monitorear */}
      <Script
        src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
        kr-public-key="testpublickey_W20fvKe1vMLRXBXo93GveTQQyaW7brkcvKCyKYGTZUUKR"
        kr-post-url-success="/success"
        kr-language="es-ES"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("Script KR cargado con éxito");
          setKrScriptLoaded(true);
        }}
        onError={(e) => {
          console.error("Error al cargar script KR", e);
          setError("Error al cargar librería de pagos");
        }}
      />

      <link
        rel="stylesheet"
        href="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.min.css"
      />
      <Script
        src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("Script tema clásico cargado")}
        onError={(e) => console.error("Error al cargar tema clásico", e)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {formToken ? (
        <div className="kr-embedded" kr-form-token={formToken}></div>
      ) : (
        <button onClick={handlePayment} disabled={loading || !krScriptLoaded}>
          {loading ? "Preparando formulario..." : "Mostrar formulario de pago"}
        </button>
      )}
    </>
  );
}
