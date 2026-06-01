//File: frontend/app/%28store%29/%28legal%29/politicas-de-cambios-y-devoluciones/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Cambios y Devoluciones | GoPhone",
    description: "Conozca las condiciones, plazos y procedimientos para solicitar un cambio, devolución o hacer efectiva la garantía de sus productos en GoPhone.",
};

const COMPANY = {
    nombre: "GOPHONE",
    ruc: "10725169715",
    direccion: "Jr. Bernardo O'Higgins 120",
    city: "San Vicente de Cañete, Lima - Perú",
    telefono: "925054636",
    email: "soporte@gophone.pe"
};

export default function PoliticasCambiosDevolucionesPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Políticas de Cambios y Devoluciones
                </h1>
                <p className="mt-2 text-sm text-gray-500">Última actualización: Junio 2026</p>
            </header>

            <div className="space-y-8 text-sm leading-relaxed text-gray-600">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">1. Identificación y Marco Legal</h2>
                    <p>
                        Esta política es aplicada por <strong>{COMPANY.nombre}</strong>, con RUC N.° <strong>{COMPANY.ruc}</strong>, 
                        con domicilio legal en {COMPANY.direccion}, {COMPANY.city}. 
                        Nos regimos por la Ley N.° 29571, Código de Protección y Defensa del Consumidor.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">2. Derecho de Desistimiento</h2>
                    <p>
                        Para compras realizadas por canales digitales, el cliente dispone de <strong>siete (7) días calendario</strong> 
                        tras la recepción para desistir de la compra. Para proceder, el producto debe estar:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Nuevo, sin uso, sin configuraciones de cuentas (iCloud, Google, etc.) y sin activación de garantía.</li>
                        <li>Con empaques, sellos, etiquetas y accesorios originales intactos.</li>
                        <li>Acompañado del comprobante de pago (Boleta/Factura).</li>
                    </ul>
                    <p className="text-xs italic mt-2">Nota: No aplica desistimiento en productos que hayan sido abiertos o cuyos sellos de seguridad hayan sido vulnerados, salvo falla de fábrica comprobada.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">3. Garantía por Defectos de Fábrica</h2>
                    <p>
                        Si el producto presenta una falla técnica de origen, será evaluado por nuestro servicio técnico 
                        en {COMPANY.city} en un plazo máximo de <strong>tres (3) días hábiles</strong>.
                    </p>
                    <p>La garantía queda sin efecto si se detecta:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Manipulación de software (root, jailbreak) o instalación de aplicaciones no oficiales.</li>
                        <li>Daños físicos (golpes, humedad, sulfatación) o uso de accesorios no certificados.</li>
                        <li>Intervención por servicios técnicos ajenos a nuestra red o la del fabricante.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">4. Procedimiento de Solicitud</h2>
                    <p>Para iniciar cualquier gestión, el cliente debe:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>Contactarnos vía correo a <strong>{COMPANY.email}</strong> o al WhatsApp <strong>{COMPANY.telefono}</strong>.</li>
                        <li>Proporcionar: Número de pedido, DNI del titular, evidencia fotográfica/video del estado del equipo.</li>
                        <li>Tras la validación, coordinar la entrega en {COMPANY.direccion}.</li>
                    </ol>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">5. Plazos de Reembolso</h2>
                    <p>Aprobada la devolución, el reembolso se realizará en el mismo método de pago:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Tarjetas:</strong> El extorno depende de los plazos de la entidad bancaria (15-30 días hábiles).</li>
                        <li><strong>Transferencia:</strong> Máximo 5 días hábiles a cuenta del titular de la compra.</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}