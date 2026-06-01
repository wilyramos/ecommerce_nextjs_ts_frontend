// File: frontend/app/(store)/(legal)/terminos/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones | GoPhone",
    description: "Términos y condiciones generales de uso del sitio web, transacciones comerciales y políticas de venta de GoPhone.",
};

const COMPANY = {
    nombre: "GOPHONE",
    ruc: "10725169715",
    direccion: "Jr. Bernardo O'Higgins 120, San Vicente de Cañete, Lima - Perú",
    telefono: "925054636",
    email: "soporte@gophone.pe",
};

export default function TerminosPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Términos y Condiciones de Uso
                </h1>
                <p className="mt-2 text-sm text-gray-500">Última actualización: Junio 2026</p>
            </header>

            <div className="space-y-8 text-sm leading-relaxed text-gray-600">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">1. Aspectos Generales y Obligatoriedad</h2>
                    <p>
                        Este documento establece los Términos y Condiciones que regulan el acceso y las transacciones comerciales en el sitio web de <strong>{COMPANY.nombre}</strong> (RUC: {COMPANY.ruc}). El uso de esta plataforma implica la aceptación expresa, total e incondicional de todas las estipulaciones aquí detalladas. Si no está de acuerdo, le solicitamos abstenerse de realizar transacciones.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">2. Capacidad Legal y Registro</h2>
                    <p>
                        Para comprar en nuestra plataforma, el usuario debe ser mayor de edad y tener plena capacidad legal según el Código Civil peruano. Los datos brindados tienen carácter de declaración jurada; el usuario es responsable de su veracidad y exactitud.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">3. Precios, Stock y Validación</h2>
                    <p>
                        Todos los precios están en Soles (S/) e incluyen el IGV. La confirmación de compra está sujeta a: (a) disponibilidad de stock, (b) validación del pago por la pasarela, y (c) verificación de datos del cliente. GoPhone se reserva el derecho de anular pedidos que no superen los filtros de seguridad, realizando el reembolso íntegro.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">4. Comprobantes de Pago</h2>
                    <p>
                        Conforme al Reglamento de Comprobantes de Pago del Perú, el cliente debe elegir (Boleta o Factura) antes de finalizar la compra. Una vez emitido el comprobante ante la SUNAT, no es posible realizar cambios de datos o tipo de documento.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">5. Despacho y Entrega</h2>
                    <p>
                        Las entregas se realizarán conforme a las zonas de cobertura. Se realizarán hasta dos intentos de entrega; si fallan por causas atribuibles al cliente, este deberá asumir el costo logístico de un nuevo envío.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">6. Propiedad Intelectual</h2>
                    <p>
                        Todo contenido, marca y diseño es propiedad exclusiva de {COMPANY.nombre} o de los fabricantes licenciantes. Queda prohibida su reproducción sin autorización por escrito.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">7. Protección de Datos Personales</h2>
                    <p>
                        En cumplimiento de la Ley N.° 29733, tratamos sus datos personales exclusivamente para fines contractuales y comerciales. El cliente tiene derecho a ejercer sus facultades ARCO (Acceso, Rectificación, Cancelación y Oposición) contactándonos a {COMPANY.email}.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">8. Limitación de Responsabilidad</h2>
                    <p>
                        GoPhone no se responsabiliza por fallas en servicios de terceros (ISP o pasarelas de pago) ni por daños indirectos derivados del uso indebido de los equipos. Nuestra responsabilidad se limita al monto efectivamente pagado por el producto.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">9. Jurisdicción y Controversias</h2>
                    <p>
                        Estos términos se rigen por la Ley N.° 29571 (Código de Protección y Defensa del Consumidor). Las partes se someten a la competencia de los jueces y tribunales del Distrito Judicial de Cañete para la solución de cualquier controversia.
                    </p>
                </section>

                <section className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-900">Contacto</h2>
                    <p className="mt-2">Si requiere asistencia adicional, puede contactarnos:</p>
                    <ul className="mt-2 list-none space-y-1">
                        <li><strong>Dirección:</strong> {COMPANY.direccion}</li>
                        <li><strong>WhatsApp:</strong> {COMPANY.telefono}</li>
                        <li><strong>Email:</strong> {COMPANY.email}</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}