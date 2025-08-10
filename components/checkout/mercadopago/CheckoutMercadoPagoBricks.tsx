"use client";

import { Payment } from "@mercadopago/sdk-react";
import { toast } from "sonner";
import { processPaymentMP } from "@/actions/checkout/process-mp-payment";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStore } from "@/src/store/checkoutStore";
import { handlePaymentSuccess } from "@/src/payments/handlePaymentSuccess";

export type PaymentPayload = {
    transaction_amount: number;
    token: string;
    description: string;
    installments: number;
    payment_method_id: string;
    issuer_id: string;
    payer: {
        email: string;
        identification: {
            type: string;
            number: string;
        };
    };
};

type MercadoPagoFormData = {
    transaction_amount: number;
    token: string;
    payment_method_id: string;
    issuer_id?: string;
};

const paymentMethodsConfig = {
    ticket: "all",
    creditCard: "all",
    prepaidCard: ["all"],
    debitCard: "all",
    mercadoPago: "all",
    bankTransfer: "all",
    digitalWallet: "all",
};

export default function CheckoutMercadoPagoBricks() {
    const { total } = useCartStore();
    const { profile, shipping } = useCheckoutStore();

    // Monto inicial (ojo: validarlo en backend)
    const initialization = { amount: total || 0 };
    const customization = { paymentMethods: paymentMethodsConfig };

    // Construir payload para backend
    const buildPaymentPayload = (
        formData: MercadoPagoFormData,
        userProfile: typeof profile
    ): PaymentPayload => ({
        transaction_amount: formData.transaction_amount || 0,
        token: formData.token,
        description: "Compra en MiTienda",
        installments: 1,
        payment_method_id: formData.payment_method_id,
        issuer_id: formData.issuer_id || "",
        payer: {
            email: userProfile?.email || "",
            identification: {
                type: userProfile?.tipoDocumento || "",
                number: userProfile?.numeroDocumento || "",
            },
        },
    });

    async function onSubmit(data: { formData: MercadoPagoFormData }) {
        console.log("Datos de pago recibidos del Brick:", data.formData);

        // Construir payload seguro
        const paymentPayload = buildPaymentPayload(data.formData, profile);

        try {
            // Procesar pago en backend
            const responseData = await processPaymentMP(paymentPayload);
            console.log("Respuesta de Mercado Pago:", responseData);

            switch (responseData.status) {
                case "approved":
                    if (!shipping) return;
                    handlePaymentSuccess(responseData, shipping);
                    toast.success("✅ Pago aprobado con éxito");
                    break;

                case "pending":
                    toast.info("⏳ El pago está pendiente de confirmación");
                    break;

                case "in_process":
                    toast.info("🔍 El pago está en revisión");
                    break;

                case "rejected":
                    toast.error(`❌ Pago rechazado: ${responseData.status_detail || "Intenta otro medio"}`);
                    break;

                default:
                    toast.warning(`⚠️ Estado desconocido: ${responseData.status}`);
            }
        } catch (error) {
            console.error("Error procesando pago:", error);
            toast.error(
                error instanceof Error ? error.message : "Error procesando el pago"
            );
        }
    }

    function onError(error: unknown) {
        console.error("Error en el Brick:", error);
        toast.error("Hubo un error al cargar el formulario de pago");
    }

    function onReady() {
        console.log("Brick de pago cargado correctamente ✅");
    }

    return (
        <Payment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
            onError={onError}
            onReady={onReady}
        />
    );
}