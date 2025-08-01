import CheckoutSelector from '@/components/checkout/CheckoutSelector';
// import ClientCheckoutWrapper from "@/components/checkout/mercadopago/ClientCheckoutWrapper";
// import LoadScriptMercadoPago from "@/components/checkout/mercadopago/LoadScriptMercadoPago";

export default function PaymentPage() {

    return (
        <>

            {/* <LoadScriptMercadoPago /> */}
            <h1 className="text-2xl font-bold mb-4">Selecciona tu método de pago</h1>
            {/* <ClientCheckoutWrapper /> */}
            {/* Selección de pasarela de pago */}
            <CheckoutSelector />

            {/* <ClientCheckoutWrapper /> */}

        </>
    );
}