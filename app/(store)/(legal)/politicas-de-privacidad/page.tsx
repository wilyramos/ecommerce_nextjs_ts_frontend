// File: frontend/app/%28store%29/%28legal%29/politicas-de-privacidad/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Privacidad | GoPhone",
    description: "Conozca cómo GoPhone protege, utiliza y recopila sus datos personales de acuerdo con la Ley N.° 29733 de Protección de Datos Personales en el Perú.",
};

export default function PoliticasPrivacidadPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Políticas de Privacidad
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Última actualización: Mayo 2026
                </p>
            </header>

            <div className="space-y-8 text-sm leading-relaxed text-gray-600">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">1. Compromiso de Privacidad e Información General</h2>
                    <p>
                        En GoPhone nos tomamos muy en serio la seguridad y confidencialidad de la información de nuestros usuarios. Esta Política de Privacidad detalla con total transparencia el proceso de recopilación, almacenamiento, uso, resguardo y transferencia de sus datos personales, cumpliendo estrictamente con lo normado por la <strong>Ley N.° 29733 (Ley de Protección de Datos Personales)</strong>, su Reglamento aprobado mediante Decreto Supremo N.° 003-2013-JUS, y las directivas emitidas por la Autoridad Nacional de Protección de Datos Personales (ANPD).
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">2. Titularidad del Banco de Datos Personales</h2>
                    <p>
                        Los datos personales recabados a través de cualquier formulario web, proceso de pago, registro de usuario o canal oficial de comunicación serán incorporados de forma automatizada a un banco de datos de tipo Cliente o Usuarios, cuya titularidad y control corresponden de forma exclusiva a GoPhone. Dicho banco de datos cumple con las medidas de seguridad organizativas y técnicas exigidas legalmente y está inscrito (o en proceso de inscripción) en el Registro Nacional de Protección de Datos Personales.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">3. Datos Personales Objeto de Tratamiento</h2>
                    <p>
                        Para operar de manera óptima dentro del comercio electrónico y brindar soporte técnico, GoPhone recopila únicamente datos pertinentes, proporcionales y necesarios:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Identificación:</strong> Nombres, apellidos, número de Documento Nacional de Identidad (DNI), Carné de Extranjería (CE) o Registro Único de Contribuyentes (RUC).</li>
                        <li><strong>Contacto:</strong> Dirección de correo electrónico, número de teléfono celular o fijo.</li>
                        <li><strong>Logística de Despacho:</strong> Dirección física de envío de productos (Calle, número, departamento, distrito, provincia, referencias).</li>
                        <li><strong>Información de Transacción:</strong> Datos de facturación, detalles del pedido e historial de transacciones realizadas en la plataforma (no almacenamos directamente credenciales bancarias ni números de tarjetas de crédito, los cuales son procesados de forma cifrada por pasarelas de pago externas certificadas con PCI-DSS).</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">4. Finalidades Obligatorias y Opcionales del Tratamiento</h2>
                    <p>
                        El tratamiento de los datos personales recopilados se realiza bajo el consentimiento libre, previo, expreso e informado del usuario, clasificándose en:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Finalidades Principales (Necesarias para la ejecución contractual):</strong>
                            <ul className="list-circle pl-5 mt-1 space-y-1">
                                <li>Gestionar la creación, autenticación y mantenimiento de las cuentas de usuario.</li>
                                <li>Procesar las compras en línea, validar medios de pago y emitir los comprobantes electrónicos correspondientes (Boletas/Facturas).</li>
                                <li>Coordinar la logística de envío, despacho y entrega física de los productos adquiridos.</li>
                                <li>Brindar servicio de atención al cliente, soporte postventa, gestión de garantías de fábrica y atención formal a solicitudes registradas en el Libro de Reclamaciones Virtual.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Finalidades Secundarias (Opcionales y sujetas a consentimiento específico):</strong>
                            <ul className="list-circle pl-5 mt-1 space-y-1">
                                <li>Enviar boletines informativos, ofertas promocionales, cupones de descuento, lanzamientos de productos de marcas asociadas (Apple, Samsung, Xiaomi) y prospección comercial.</li>
                                <li>Realizar encuestas voluntarias de satisfacción y estudios de mercado internos para la mejora continua del servicio.</li>
                            </ul>
                        </li>
                    </ul>
                    <p className="mt-2 text-xs italic">
                        Nota: La negativa a autorizar las finalidades secundarias no condiciona, limita, ni impide en absoluto la ejecución de los procesos de compra o los contratos principales con GoPhone.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">5. Transferencia y Destinatarios de Datos Personales</h2>
                    <p>
                        GoPhone no vende, comercializa ni cede sus datos personales a terceras empresas bajo ningún concepto. El tratamiento se limita a las operaciones internas necesarias, pudiendo transferirse los datos a nivel nacional únicamente a empresas de transporte o couriers (para completar el despacho de su mercadería) y a las entidades bancarias o pasarelas de pago seleccionadas (para acreditar el cobro), quienes actúan en calidad de encargados del tratamiento bajo contratos de estricta confidencialidad.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">6. Plazo de Conservación de los Datos</h2>
                    <p>
                        Los datos personales serán conservados y tratados de forma indeterminada mientras se mantenga la relación comercial, el usuario conserve activa su cuenta en el ecommerce, o hasta que el titular de los datos ejerza su derecho de revocación del consentimiento o cancelación, siempre que no existan obligaciones contractuales, tributarias o legales que exijan su retención imperativa por plazos adicionales prescritos por la ley peruana.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">7. Derechos ARCO y Revocación del Consentimiento</h2>
                    <p>
                        Como titular legítimo de su información, usted tiene pleno derecho a ejercer las facultades de <strong>Acceso, Rectificación, Cancelación y Oposición (Derechos ARCO)</strong>, así como a revocar el consentimiento previamente otorgado para finalidades comerciales en cualquier momento.
                    </p>
                    <p>
                        Para hacer efectivo este derecho, deberá remitir una solicitud firmada adjuntando una copia legible de su DNI o documento de identidad equivalente, dirigida al correo electrónico oficial: <span className="font-medium text-gray-900">soporte@gophone.pe</span>, indicando detalladamente el derecho que desea ejercer. La atención de su solicitud se efectuará dentro de los plazos perentorios establecidos en el Reglamento de la Ley de Protección de Datos Personales. De considerar vulnerados sus derechos, puede interponer una reclamación ante la Autoridad Nacional de Protección de Datos Personales (ANPD).
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">8. Modificaciones a la Presente Política</h2>
                    <p>
                        GoPhone se reserva el derecho de modificar, actualizar o complementar esta Política de Privacidad de manera discrecional en cualquier momento para adaptarla a cambios legislativos, jurisprudenciales o prácticas comerciales. Cualquier cambio sustancial será publicado directamente en este enlace e informado debidamente a través de los canales de contacto habituales.
                    </p>
                </section>
            </div>
        </main>
    );
}