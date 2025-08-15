
import Script from "next/script";


export default function IzipayDemoForm({ formToken }: { formToken: string }) {


    return (
        <div className="p-4 max-w-lg mx-auto">
            {/* Script principal de Izipay */}
            <Script
                src="https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js"
                strategy="afterInteractive"
                data-kr-public-key="49639513:testpublickey_W20fvKe1vMLRXBXo93GveTQQyaW7brkcvKCyKYGTZUUKR"
                data-kr-language="es-ES"
            />
            <link
                rel="stylesheet"
                href="https://static.payzen.eu/static/js/krypton-client/V4.0/ext/neon-reset.min.css"
            />

            {/* Formulario incrustado con token de prueba */}
            <div
                className="kr-smart-form"
                // kr-popin="true"
                kr-card-form-expanded="true"
                kr-form-token={formToken} // <-- token demo
            ></div>
        </div>
    );
}
