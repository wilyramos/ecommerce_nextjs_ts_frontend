// File: frontend/app/(store)/(legal)/politicas-de-cambios-y-devoluciones/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Políticas de Cambios y Devoluciones | GoPhone",
    description:
        "Conozca las condiciones, plazos y procedimientos para solicitar un cambio, devolución o hacer efectiva la garantía de sus productos en GoPhone.",
};

const COMPANY = {
    nombre: "GOPHONE",
    razonSocial: "GoPhone E.I.R.L.",
    ruc: "10725169715",
    direccion: "Jr. Bernardo O'Higgins 120",
    distrito: "San Vicente de Cañete",
    provincia: "Cañete",
    departamento: "Lima",
    pais: "Perú",
    telefono: "925054636",
    email: "soporte@gophone.pe",
    horarioAtencion: "Lunes a Sábado de 9:00 a.m. a 7:00 p.m.",
};

export default function PoliticasCambiosDevolucionesPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Políticas de Cambios y Devoluciones
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Última actualización: Junio 2026
                </p>
                <p className="mt-3 text-sm text-gray-600">
                    En <strong>{COMPANY.nombre}</strong> nos comprometemos a brindar productos de calidad y una experiencia de compra
                    transparente. Esta política describe sus derechos como consumidor y los procedimientos que seguimos para
                    atender cambios, devoluciones, garantías y reclamos, conforme a la legislación peruana vigente.
                </p>
            </header>

            <div className="space-y-10 text-sm leading-relaxed text-gray-600">

                {/* ── 1. Marco Legal ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        1. Identificación del Proveedor y Marco Legal
                    </h2>
                    <p>
                        Esta política es aplicada por <strong>{COMPANY.razonSocial}</strong>, identificada con RUC N.°{" "}
                        <strong>{COMPANY.ruc}</strong>, con domicilio fiscal en{" "}
                        {COMPANY.direccion}, {COMPANY.distrito}, {COMPANY.provincia} – {COMPANY.departamento},{" "}
                        {COMPANY.pais}.
                    </p>
                    <p>Nuestras prácticas comerciales se rigen por:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Ley N.° 29571</strong> – Código de Protección y Defensa del Consumidor y sus modificatorias.
                        </li>
                        <li>
                            <strong>Ley N.° 29965 y D.S. N.° 011-2013-PRODUCE</strong> – Régimen de garantías de productos tecnológicos.
                        </li>
                        <li>
                            <strong>D.S. N.° 050-2017-PCM</strong> – Reglamento de la Ley N.° 29733, Ley de Protección de Datos Personales.
                        </li>
                        <li>
                            Lineamientos del <strong>INDECOPI</strong> (Instituto Nacional de Defensa de la Competencia y de la Protección
                            de la Propiedad Intelectual).
                        </li>
                    </ul>
                </section>

                {/* ── 2. Derecho de Desistimiento ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        2. Derecho de Desistimiento (Devolución sin expresión de causa)
                    </h2>
                    <p>
                        De conformidad con el artículo 58° del Código de Protección y Defensa del Consumidor, para compras
                        realizadas a través de canales digitales (tienda en línea, WhatsApp, redes sociales), el cliente tiene
                        derecho a desistir de la compra dentro de los{" "}
                        <strong>siete (7) días calendario</strong> contados desde la fecha de recepción del producto, sin necesidad
                        de indicar motivo alguno.
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">2.1 Condiciones para ejercer el desistimiento</h3>
                    <p>El producto debe cumplir <em>todas</em> las siguientes condiciones:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Estar en estado nuevo, sin uso, sin desgaste visible.</li>
                        <li>
                            No tener cuentas vinculadas (Apple ID / iCloud, cuenta de Google, Samsung Account, Mi Account, etc.)
                            ni activación de ningún tipo.
                        </li>
                        <li>Conservar todos los precintos, sellos holográficos y etiquetas originales del fabricante intactos.</li>
                        <li>Incluir la caja, accesorios, manuales y documentación original completa.</li>
                        <li>Estar acompañado del comprobante de pago original (Boleta de Venta o Factura).</li>
                    </ul>
                    <h3 className="font-semibold text-gray-800 mt-2">2.2 Exclusiones al derecho de desistimiento</h3>
                    <p>No procede el desistimiento cuando:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            El producto ha sido abierto, activado o sus sellos de seguridad han sido vulnerados, salvo que presente
                            una falla de fábrica comprobada (ver sección 3).
                        </li>
                        <li>
                            Se trate de accesorios, fundas, cables, cargadores u otros consumibles cuyo embalaje ha sido abierto.
                        </li>
                        <li>El plazo de siete (7) días calendario ha vencido.</li>
                        <li>La compra se realizó de manera presencial en nuestro establecimiento físico.</li>
                    </ul>
                    <p className="text-xs italic mt-1">
                        Nota aclaratoria: El desistimiento reconocido por ley para compras digitales es independiente de la garantía
                        por defectos de fábrica. Ambos derechos pueden coexistir dentro de sus respectivos plazos.
                    </p>
                </section>

                {/* ── 3. Garantía ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        3. Garantía Legal y Cobertura por Defectos de Fábrica
                    </h2>
                    <p>
                        Todos los productos comercializados por {COMPANY.nombre} cuentan con la garantía legal mínima establecida por
                        la normativa peruana. Los smartphones y tablets nuevos de marcas como Apple, Samsung, Xiaomi, Motorola y
                        similares incluyen la garantía del fabricante, generalmente de{" "}
                        <strong>doce (12) meses</strong> desde la fecha de activación, salvo indicación expresa distinta en la
                        documentación del producto.
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">3.1 ¿Qué cubre la garantía?</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Defectos en componentes de hardware originados en el proceso de fabricación.</li>
                        <li>Fallas en la pantalla no atribuibles a golpes o presión externa (píxeles muertos, manchas de pantalla).</li>
                        <li>Problemas en la batería cuando la capacidad desciende por debajo del 80 % en condiciones normales de uso.</li>
                        <li>Fallos en cámaras, micrófonos, altavoces u otros componentes internos sin intervención externa.</li>
                        <li>Problemas de software o firmware cuando son responsabilidad del fabricante.</li>
                    </ul>
                    <h3 className="font-semibold text-gray-800 mt-2">3.2 Causales de pérdida de garantía</h3>
                    <p>La garantía queda sin efecto si se verifica cualquiera de los siguientes supuestos:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Manipulación del software: root, jailbreak, instalación de ROMs no oficiales o aplicaciones de fuentes
                            desconocidas que comprometan la integridad del sistema.
                        </li>
                        <li>
                            Daños físicos: golpes, caídas, rotura de pantalla, ingreso de líquidos, corrosión, sulfatación o exposición
                            a condiciones ambientales extremas.
                        </li>
                        <li>
                            Uso de accesorios no certificados: cargadores, cables o fundas de terceros que causen daño al dispositivo.
                        </li>
                        <li>
                            Intervención por servicio técnico no autorizado: apertura del equipo o reparaciones realizadas fuera de
                            nuestra red o la de los centros de servicio oficiales del fabricante.
                        </li>
                        <li>
                            Número de serie (IMEI) borrado, alterado o ilegible.
                        </li>
                        <li>Daños causados por desastres naturales, sobretensiones eléctricas o casos de fuerza mayor.</li>
                    </ul>
                    <h3 className="font-semibold text-gray-800 mt-2">3.3 Proceso de evaluación técnica</h3>
                    <p>
                        Recibido el equipo, nuestro servicio técnico realizará una evaluación en un plazo máximo de{" "}
                        <strong>tres (3) días hábiles</strong>. El resultado puede ser:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Falla cubierta por garantía:</strong> se procede a la reparación, sustitución del componente
                            defectuoso o cambio del equipo, según corresponda, sin costo para el cliente.
                        </li>
                        <li>
                            <strong>Daño no cubierto:</strong> se emite un informe técnico detallado. El cliente puede optar por
                            autorizar la reparación con costo o retirar el equipo sin cargo por la evaluación.
                        </li>
                        <li>
                            <strong>Imposibilidad de reparación:</strong> si el equipo no puede ser reparado dentro del plazo de
                            treinta (30) días calendario, el cliente tiene derecho a la sustitución por un producto equivalente o
                            la devolución del importe pagado.
                        </li>
                    </ul>
                </section>

                {/* ── 4. Cambios ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        4. Política de Cambios de Producto
                    </h2>
                    <p>
                        {COMPANY.nombre} acepta cambios de producto bajo las siguientes condiciones, adicionales a las señaladas
                        en la sección 2:
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">4.1 Cambio por modelo o color diferente</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Plazo: hasta <strong>siete (7) días calendario</strong> desde la recepción del producto.</li>
                        <li>El producto debe estar sin abrir, en condición nueva y con todos sus accesorios originales.</li>
                        <li>
                            Si el nuevo modelo tiene un precio mayor, el cliente abonará la diferencia. Si el precio es menor,
                            se generará un crédito a favor para futuras compras.
                        </li>
                        <li>El cambio aplica una sola vez por pedido.</li>
                    </ul>
                    <h3 className="font-semibold text-gray-800 mt-2">4.2 Cambio por falla técnica dentro de los primeros 30 días</h3>
                    <p>
                        Si el producto presenta una falla de fábrica comprobada durante los primeros{" "}
                        <strong>treinta (30) días calendario</strong> de uso, el cliente puede optar entre:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Reparación sin costo (en los términos de la sección 3).</li>
                        <li>Cambio por un producto idéntico o de características equivalentes (sujeto a disponibilidad de stock).</li>
                        <li>Devolución del importe pagado (en los términos de la sección 5).</li>
                    </ul>
                </section>

                {/* ── 5. Reembolsos ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        5. Plazos y Métodos de Reembolso
                    </h2>
                    <p>
                        Una vez aprobada la devolución por nuestro equipo, el reembolso se realizará utilizando el mismo método
                        de pago empleado en la compra original, salvo acuerdo expreso en contrario:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Tarjeta de crédito o débito:</strong> el extorno depende del procesador bancario y puede
                            demorar entre <strong>15 y 30 días hábiles</strong>, de acuerdo a las políticas de la entidad
                            financiera emisora (Visa, Mastercard, etc.).
                        </li>
                        <li>
                            <strong>Transferencia bancaria / depósito en cuenta:</strong> máximo{" "}
                            <strong>cinco (5) días hábiles</strong> a la cuenta del titular de la compra. El cliente debe
                            proporcionar el número de cuenta (CCI) y el banco destino.
                        </li>
                        <li>
                            <strong>Pago contra entrega (efectivo):</strong> máximo{" "}
                            <strong>tres (3) días hábiles</strong> desde la confirmación, mediante depósito o transferencia
                            a la cuenta indicada por el cliente.
                        </li>
                        <li>
                            <strong>Billeteras digitales (Yape, Plin):</strong> máximo{" "}
                            <strong>dos (2) días hábiles</strong> al número de celular registrado en la compra.
                        </li>
                    </ul>
                    <p className="text-xs italic mt-1">
                        Importante: Los reembolsos se procesan una vez que el producto ha sido recepcionado y verificado en
                        nuestras instalaciones. No se realizarán reembolsos parciales ni pagos a terceros distintos al titular
                        del comprobante de pago.
                    </p>
                </section>

                {/* ── 6. Costos de envío ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        6. Costos de Envío en Devoluciones y Cambios
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Falla de fábrica o error del proveedor:</strong>{" "}
                            {COMPANY.nombre} asume el costo del envío de retorno y del reenvío del producto de reemplazo.
                        </li>
                        <li>
                            <strong>Desistimiento o cambio de opinión del cliente:</strong> el costo del envío de retorno es
                            responsabilidad del cliente.
                        </li>
                        <li>
                            <strong>Cambio de modelo o color:</strong> el cliente asume el envío de retorno;{" "}
                            {COMPANY.nombre} asume el envío del nuevo producto.
                        </li>
                        <li>
                            En todos los casos, se recomienda utilizar un servicio de courier con número de guía de seguimiento.
                            {COMPANY.nombre} no se responsabiliza por productos perdidos o dañados durante el envío de retorno
                            cuando el flete es responsabilidad del cliente.
                        </li>
                    </ul>
                </section>

                {/* ── 7. Procedimiento ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        7. Procedimiento para Solicitar un Cambio, Devolución o Garantía
                    </h2>
                    <p>Para iniciar cualquier gestión, el cliente debe seguir estos pasos:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>
                            <strong>Contacto inicial:</strong> Comunicarse con nuestro equipo de soporte a través de:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>
                                    Correo electrónico:{" "}
                                    <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
                                        {COMPANY.email}
                                    </a>
                                </li>
                                <li>
                                    WhatsApp:{" "}
                                    <a
                                        href={`https://wa.me/51${COMPANY.telefono}`}
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        +51 {COMPANY.telefono}
                                    </a>
                                </li>
                                <li>Horario de atención: {COMPANY.horarioAtencion}</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Información requerida:</strong> El cliente debe proporcionar:
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Número de pedido o código de compra.</li>
                                <li>DNI o RUC del titular de la compra.</li>
                                <li>Descripción clara del motivo de la solicitud.</li>
                                <li>
                                    Evidencia visual: fotografías y/o video del estado actual del producto (incluyendo
                                    el IMEI visible en la caja o en la pantalla mediante *#06#).
                                </li>
                                <li>Comprobante de pago (Boleta o Factura) en formato digital o físico.</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Evaluación:</strong> Nuestro equipo revisará la solicitud en un plazo máximo de{" "}
                            <strong>dos (2) días hábiles</strong> y comunicará la resolución al cliente.
                        </li>
                        <li>
                            <strong>Coordinación de entrega:</strong> Una vez aprobada la solicitud, se coordinará la
                            entrega del producto en <strong>{COMPANY.direccion}, {COMPANY.distrito}</strong>, ya sea
                            de manera presencial o a través del servicio de courier acordado.
                        </li>
                        <li>
                            <strong>Resolución:</strong> Según el caso validado, se procede con el cambio, la reparación
                            o el reembolso conforme a los plazos indicados en esta política.
                        </li>
                    </ol>
                </section>

                {/* ── 8. Productos no sujetos ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        8. Productos Excluidos de Cambios y Devoluciones
                    </h2>
                    <p>Los siguientes productos no son elegibles para cambio o devolución, salvo falla de fábrica comprobada:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Accesorios abiertos: audífonos, cargadores, fundas, protectores de pantalla y cables.</li>
                        <li>Tarjetas SIM, tarjetas de memoria y licencias de software.</li>
                        <li>Equipos de segunda mano o reacondicionados, salvo los términos de garantía especificados en la venta.</li>
                        <li>Productos con signos evidentes de uso, daño físico o manipulación.</li>
                        <li>Equipos con IMEI bloqueado por robo reportado o bloqueado por operador.</li>
                    </ul>
                </section>

                {/* ── 9. Libro de Reclamaciones ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        9. Libro de Reclamaciones
                    </h2>
                    <p>
                        Conforme a lo dispuesto en el Decreto Supremo N.° 011-2011-PCM, {COMPANY.nombre} pone a disposición
                        de sus clientes el <strong>Libro de Reclamaciones Virtual</strong>. Podrá registrar su queja o reclamo
                        escribiendo a{" "}
                        <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
                            {COMPANY.email}
                        </a>{" "}
                        con el asunto: <em>Libro de Reclamaciones – [Nombre completo]</em>.
                    </p>
                    <p>
                        Atenderemos su reclamo en un plazo máximo de <strong>quince (15) días hábiles</strong> contados desde
                        la fecha de recepción, pudiendo prorrogar dicho plazo por quince (15) días hábiles adicionales,
                        comunicando tal extensión antes del vencimiento inicial.
                    </p>
                    <p>
                        Si no queda satisfecho con la respuesta, puede acudir al{" "}
                        <strong>INDECOPI</strong> (
                        <a
                            href="https://www.indecopi.gob.pe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            www.indecopi.gob.pe
                        </a>
                        ) o al Centro de Atención al Ciudadano al{" "}
                        <strong>224-7800</strong> (Lima) o la línea gratuita{" "}
                        <strong>0-800-4-4040</strong> (provincias).
                    </p>
                </section>

                {/* ── 10. Protección de datos ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        10. Tratamiento de Datos Personales
                    </h2>
                    <p>
                        Los datos personales recopilados durante el proceso de cambio, devolución o garantía serán tratados
                        únicamente para gestionar la solicitud, cumplir obligaciones legales y mejorar nuestros servicios.
                        {COMPANY.nombre} no comparte esta información con terceros ajenos al proceso de atención, salvo
                        obligación legal. Para ejercer sus derechos de acceso, rectificación, cancelación u oposición
                        (derechos ARCO), diríjase a{" "}
                        <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
                            {COMPANY.email}
                        </a>
                        .
                    </p>
                </section>

                {/* ── 11. Modificaciones ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        11. Modificaciones a esta Política
                    </h2>
                    <p>
                        {COMPANY.nombre} se reserva el derecho de actualizar esta política en cualquier momento para reflejar
                        cambios normativos, operativos o comerciales. Las modificaciones entrarán en vigor desde su publicación
                        en este sitio. Para compras ya realizadas, aplicará la versión vigente al momento de la transacción.
                        Se recomienda revisar periódicamente esta página.
                    </p>
                </section>

                {/* ── Contacto ── */}
                <section className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">Contacto para Soporte Postventa</h2>
                    <p>Si tiene alguna duda o desea iniciar una gestión, contáctenos:</p>
                    <ul className="space-y-1">
                        <li>
                            <strong>Correo:</strong>{" "}
                            <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
                                {COMPANY.email}
                            </a>
                        </li>
                        <li>
                            <strong>WhatsApp:</strong>{" "}
                            <a
                                href={`https://wa.me/51${COMPANY.telefono}`}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                +51 {COMPANY.telefono}
                            </a>
                        </li>
                        <li>
                            <strong>Dirección:</strong> {COMPANY.direccion}, {COMPANY.distrito},{" "}
                            {COMPANY.provincia} – {COMPANY.departamento}
                        </li>
                        <li>
                            <strong>Horario:</strong> {COMPANY.horarioAtencion}
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
}