// File: frontend/app/%28store%29/%28legal%29/politicas-de-cambios-y-devoluciones/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Cambios y Devoluciones | GoPhone",
    description: "Conozca las condiciones, plazos y procedimientos para solicitar un cambio, devolución o hacer efectiva la garantía de sus productos en GoPhone.",
};

export default function PoliticasCambiosDevolucionesPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Políticas de Cambios y Devoluciones
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Última actualización: Mayo 2026
                </p>
            </header>

            <div className="space-y-8 text-sm leading-relaxed text-gray-600">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">1. Marco General e Información al Consumidor</h2>
                    <p>
                        En GoPhone, nuestro compromiso es brindar una experiencia de compra transparente y de alta calidad en tecnología premium. La presente Política de Cambios y Devoluciones se rige estrictamente por la Ley N.° 29571 (Código de Protección y Defensa del Consumidor del Perú), estableciendo los derechos, plazos y obligaciones que asumen tanto el cliente como la empresa ante un proceso de desistimiento de compra o fallas de origen técnico.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">2. Derecho de Desistimiento (Arrepentimiento de Compra)</h2>
                    <p>
                        Si el cliente opta por desistir de su compra por razones ajenas a fallas del equipo, dispondrá de un plazo máximo e improrrogable de <strong>siete (7) días calendario</strong>, contados desde la fecha de recepción física del producto, para solicitar la restitución de su dinero o el cambio por otro artículo de la tienda.
                    </p>
                    <p>
                        Para que la solicitud de desistimiento sea aceptada y declarada procedente, el producto debe cumplir concurrentemente con los siguientes requisitos físicos de fábrica:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>El artículo debe encontrarse completamente nuevo, sin indicios de uso, manipulación, ensamble ni encendido.</li>
                        <li>El empaque original, caja, sellos térmicos de seguridad, películas plásticas protectoras y etiquetas del fabricante deben estar intactos, cerrados y en perfecto estado, tal como fueron entregados.</li>
                        <li>Deberán incluirse la totalidad de accesorios, manuales, cables de carga y obsequios promocionales que integraban el empaque comercial.</li>
                        <li>Es obligatorio presentar de forma física o digital el comprobante electrónico de pago (Boleta de Venta o Factura).</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">3. Protocolo de Inspección Técnica Obligatoria</h2>
                    <p>
                        Todo dispositivo tecnológico devuelto bajo cualquier concepto será derivado obligatoriamente a nuestro servicio técnico central, ubicado en San Vicente de Cañete, para ser sometido a un control de calidad. Este proceso de evaluación tomará un plazo máximo de <strong>tres (3) días hábiles</strong>.
                    </p>
                    <p>
                        Si el informe técnico dictamina que el dispositivo presenta indicios de encendido, configuración de cuentas, remoción de sellos originales de la marca, daños físicos (raspones, quiñes, rajaduras) o daños provocados por el usuario, la solicitud de cambio o devolución será desestimada automáticamente y el producto quedará a disposición del cliente para su retiro.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">4. Canales de Atención y Procedimiento</h2>
                    <p>
                        Para iniciar formalmente una solicitud de cambio o devolución, el titular de la compra debe seguir los siguientes pasos:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Enviar un correo electrónico a <span className="font-medium text-gray-900">soporte@gophone.pe</span> o escribir a nuestro canal oficial de WhatsApp detallando el número de pedido, nombres completos y el motivo del requerimiento.</li>
                        <li>Adjuntar imágenes nítidas que demuestren el estado óptimo y sellado del empaque del producto.</li>
                        <li>Una vez validada inicialmente la información, el cliente podrá acercarse a nuestra tienda física en Jr. O Higgins 120, San Vicente de Cañete, o coordinar el envío logístico inverso (cuyo costo será asumido por el cliente en caso de desistimiento voluntario).</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">5. Plazos y Métodos de Reembolso</h2>
                    <p>
                        Una vez emitido el informe técnico de conformidad que aprueba la devolución, GoPhone procederá a gestionar el reembolso del importe económico abonado empleando el mismo método de pago utilizado en la transacción original:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Tarjetas de Crédito o Débito:</strong> Se procesará el extorno formal ante la pasarela de pagos. GoPhone emitirá el código de referencia de la operación de forma inmediata. El tiempo que tarde en verse reflejado el saldo en la cuenta del cliente depende exclusivamente de la entidad financiera emisora de la tarjeta (el plazo suele oscilar entre quince y treinta días hábiles).
                        </li>
                        <li>
                            <strong>Transferencias Directas o Efectivo:</strong> El reembolso se ejecutará mediante transferencia electrónica interbancaria hacia una cuenta de ahorros de la cual el cliente sea el titular exclusivo, en un plazo máximo de cinco (5) días hábiles.
                        </li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">6. Políticas de Garantía de Hardware por Defectos de Fábrica</h2>
                    <p>
                        Los equipos de marcas premium (Apple, Samsung, Xiaomi, entre otras) cuentan con garantías de hardware provistas por los propios fabricantes, cuyos plazos específicos e instrucciones se detallan en la documentación interna de cada producto.
                    </p>
                    <p>
                        Esta garantía se circunscribe de manera estricta a <strong>fallas técnicas latentes de fabricación</strong>. Quedan excluidas de toda cobertura las siguientes causales:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Fallas de software originadas por descargas e instalaciones de aplicaciones externas no oficiales o alteraciones en el código nativo (root, jailbreak).</li>
                        <li>Daños derivados de caídas, golpes visibles, maltrato físico, presiones extremas o manipulación indebida del chasis o pantalla.</li>
                        <li>Equipos expuestos a humedad, sulfatación o inmersión en agua, independientemente del nivel de certificación IP que posea el dispositivo.</li>
                        <li>Uso de cargadores, cables o adaptadores alternativos que provoquen fluctuaciones de voltaje o daños en el circuito de carga.</li>
                        <li>Dispositivos revisados o abiertos por talleres, laboratorios o servicios técnicos externos que no correspondan a los centros de servicio autorizados por la marca.</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}