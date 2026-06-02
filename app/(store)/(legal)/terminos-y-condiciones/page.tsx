// File: frontend/app/(store)/(legal)/terminos/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Términos y Condiciones | GoPhone",
    description:
        "Términos y condiciones generales de uso del sitio web, transacciones comerciales y políticas de venta de GoPhone.",
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

export default function TerminosPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Términos y Condiciones de Uso
                </h1>
                <p className="mt-2 text-sm text-gray-500">Última actualización: Junio 2026</p>
                <p className="mt-3 text-sm text-gray-600">
                    El presente documento regula la relación comercial entre{" "}
                    <strong>{COMPANY.razonSocial}</strong> y los usuarios que acceden a su plataforma de
                    comercio electrónico. Le recomendamos leerlo detenidamente antes de realizar cualquier
                    transacción. El uso del sitio implica la aceptación plena de estos términos.
                </p>
            </header>

            <div className="space-y-10 text-sm leading-relaxed text-gray-600">

                {/* ── 1. Identificación ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        1. Identificación del Titular y Marco Legal
                    </h2>
                    <p>
                        Este sitio web es operado por <strong>{COMPANY.razonSocial}</strong>, con RUC N.°{" "}
                        <strong>{COMPANY.ruc}</strong>, con domicilio fiscal en {COMPANY.direccion},{" "}
                        {COMPANY.distrito}, {COMPANY.provincia} – {COMPANY.departamento}, {COMPANY.pais}.
                    </p>
                    <p>Estos Términos y Condiciones se rigen por las siguientes normas peruanas vigentes:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <strong>Ley N.° 29571</strong> – Código de Protección y Defensa del Consumidor.
                        </li>
                        <li>
                            <strong>Ley N.° 27291</strong> – Ley que modifica el Código Civil sobre manifestación de
                            voluntad mediante medios electrónicos.
                        </li>
                        <li>
                            <strong>Ley N.° 27269</strong> – Ley de Firmas y Certificados Digitales.
                        </li>
                        <li>
                            <strong>Ley N.° 29733</strong> y su reglamento (D.S. N.° 003-2013-JUS) – Ley de
                            Protección de Datos Personales.
                        </li>
                        <li>
                            <strong>D.Leg. N.° 1418</strong> – Decreto que fortalece la protección del consumidor
                            en materia de comercio electrónico.
                        </li>
                        <li>
                            Resoluciones y lineamientos del <strong>INDECOPI</strong> aplicables al comercio
                            electrónico y defensa del consumidor.
                        </li>
                    </ul>
                </section>

                {/* ── 2. Capacidad Legal ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        2. Capacidad Legal y Condiciones del Usuario
                    </h2>
                    <p>
                        Para realizar compras en nuestra plataforma, el usuario debe:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Ser mayor de dieciocho (18) años y tener plena capacidad legal conforme al Código Civil
                            peruano (artículo 42°).
                        </li>
                        <li>
                            Actuar en nombre propio o contar con poder suficiente para obligar a la persona jurídica
                            que representa.
                        </li>
                        <li>
                            Proporcionar datos verídicos, completos y actualizados. La información suministrada
                            tiene carácter de <strong>declaración jurada</strong>; cualquier falsedad libera a{" "}
                            {COMPANY.nombre} de responsabilidad y habilita la anulación del pedido sin reembolso
                            en caso de fraude comprobado.
                        </li>
                    </ul>
                    <p>
                        {COMPANY.nombre} se reserva el derecho de verificar la identidad del comprador antes de
                        completar una transacción y de rechazar solicitudes que generen sospechas razonables de
                        suplantación, fraude o uso indebido de medios de pago.
                    </p>
                </section>

                {/* ── 3. Registro y Cuenta de Usuario ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        3. Registro y Cuenta de Usuario
                    </h2>
                    <p>
                        El registro en la plataforma es facultativo para navegar, pero requerido para completar
                        una compra. Al registrarse, el usuario:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Es responsable de mantener la confidencialidad de sus credenciales de acceso
                            (usuario y contraseña).
                        </li>
                        <li>
                            Asume plena responsabilidad por todas las acciones realizadas bajo su cuenta.
                        </li>
                        <li>
                            Debe notificar de inmediato a {COMPANY.nombre} ante cualquier acceso no autorizado
                            o sospecha de vulneración de su cuenta, escribiendo a{" "}
                            <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
                                {COMPANY.email}
                            </a>
                            .
                        </li>
                    </ul>
                    <p>
                        {COMPANY.nombre} podrá suspender o eliminar cuentas que violen estos términos, realicen
                        actividades fraudulentas o incurran en conductas contrarias a la ley peruana, sin
                        necesidad de previo aviso.
                    </p>
                </section>

                {/* ── 4. Precios, Stock y Oferta ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        4. Precios, Disponibilidad de Stock y Validación del Pedido
                    </h2>
                    <p>
                        Todos los precios publicados en la plataforma están expresados en <strong>Soles (S/)</strong>{" "}
                        e incluyen el Impuesto General a las Ventas (IGV) del 18 %, conforme a lo dispuesto por
                        SUNAT, salvo indicación expresa en contrario.
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">4.1 Validez de la oferta</h3>
                    <p>
                        Los precios y promociones publicados tienen validez mientras el stock esté disponible y
                        salvo error tipográfico. {COMPANY.nombre} se reserva el derecho de corregir precios
                        erróneos o desactualizados antes de confirmar el pedido, informando al cliente y
                        ofreciendo la opción de cancelar sin cargo.
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">4.2 Confirmación del pedido</h3>
                    <p>La confirmación de compra está sujeta al cumplimiento simultáneo de:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Disponibilidad de stock en tiempo real al momento del pago.</li>
                        <li>Validación exitosa del pago por la pasarela o entidad bancaria correspondiente.</li>
                        <li>Verificación de datos del cliente (identidad, dirección de entrega y método de pago).</li>
                        <li>Superación de los filtros antifraude del sistema.</li>
                    </ul>
                    <p>
                        {COMPANY.nombre} se reserva el derecho de anular pedidos que no superen los filtros de
                        seguridad, realizando el reembolso íntegro al cliente dentro de los plazos indicados en
                        nuestra Política de Devoluciones.
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">4.3 Precios en promoción</h3>
                    <p>
                        Las ofertas, descuentos y precios especiales tienen vigencia limitada, son intransferibles
                        y no son acumulables con otras promociones salvo que se indique expresamente. El precio
                        aplicable es el vigente al momento en que se procesa el pago.
                    </p>
                </section>

                {/* ── 5. Métodos de Pago ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        5. Métodos de Pago y Seguridad
                    </h2>
                    <p>{COMPANY.nombre} acepta los siguientes métodos de pago:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Tarjetas de crédito y débito Visa y Mastercard (procesadas mediante pasarela segura con protocolo SSL/TLS).</li>
                        <li>Transferencias bancarias interbancarias (CCI).</li>
                        <li>Depósito bancario.</li>
                        <li>Billeteras digitales: Yape y Plin.</li>
                        <li>Pago contra entrega (sujeto a cobertura y monto máximo disponible).</li>
                    </ul>
                    <p>
                        Los datos de pago son procesados directamente por las pasarelas y entidades financieras;{" "}
                        {COMPANY.nombre} no almacena información sensible de tarjetas en sus servidores. En caso
                        de detectar una transacción sospechosa, nos reservamos el derecho de suspenderla y
                        contactar al cliente para verificar su identidad.
                    </p>
                </section>

                {/* ── 6. Comprobantes de Pago ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        6. Comprobantes de Pago
                    </h2>
                    <p>
                        Conforme al Reglamento de Comprobantes de Pago (R.S. N.° 007-99/SUNAT) y sus
                        modificatorias, el cliente debe seleccionar el tipo de comprobante (Boleta de Venta o
                        Factura) <strong>antes de finalizar la compra</strong>, proporcionando los datos
                        fiscales correspondientes (DNI o RUC, razón social y dirección).
                    </p>
                    <p>
                        Una vez emitido y declarado el comprobante ante la <strong>SUNAT</strong> no es
                        posible realizar cambios de datos, tipo de documento, ni anulaciones unilaterales.
                        La emisión de Nota de Crédito solo procederá en los casos estrictamente habilitados
                        por la normativa tributaria vigente (devoluciones aprobadas, errores de emisión, etc.).
                    </p>
                    <p>
                        Los comprobantes electrónicos serán remitidos al correo electrónico registrado por el
                        cliente en un plazo máximo de <strong>veinticuatro (24) horas</strong> tras la
                        confirmación del pago.
                    </p>
                </section>

                {/* ── 7. Despacho y Entrega ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        7. Despacho, Envío y Entrega
                    </h2>
                    <h3 className="font-semibold text-gray-800">7.1 Cobertura y plazos estimados</h3>
                    <p>
                        Las entregas se realizan a través de operadores logísticos asociados a nivel nacional.
                        Los plazos son referenciales y pueden variar por factores externos:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Lima Metropolitana:</strong> de 1 a 3 días hábiles.</li>
                        <li><strong>Provincias (ciudades principales):</strong> de 3 a 7 días hábiles.</li>
                        <li><strong>Zonas alejadas o de difícil acceso:</strong> de 7 a 15 días hábiles, sujeto a evaluación.</li>
                    </ul>
                    <p className="text-xs italic">
                        Los plazos se computan desde la confirmación del pago, no desde la fecha del pedido.
                        Días feriados nacionales o regionales no se contabilizan como días hábiles.
                    </p>
                    <h3 className="font-semibold text-gray-800 mt-2">7.2 Responsabilidad en la entrega</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            El cliente debe proporcionar una dirección completa y exacta, incluyendo referencias.
                            {COMPANY.nombre} no se responsabiliza por demoras o entregas fallidas causadas por
                            datos incorrectos o incompletos.
                        </li>
                        <li>
                            Se realizarán hasta <strong>dos (2) intentos de entrega</strong>. Si ambos fallan por
                            causas atribuibles al cliente (ausencia, dirección incorrecta, rechazo injustificado),
                            el pedido será devuelto a nuestro almacén y el cliente deberá asumir el costo logístico
                            de un nuevo envío.
                        </li>
                        <li>
                            Al momento de recibir el paquete, el cliente debe verificar que el embalaje esté
                            intacto y firmar la guía de remisión. Si detecta daños visibles en el embalaje, debe
                            indicarlo en la guía antes de firmar y notificarnos en el plazo de{" "}
                            <strong>veinticuatro (24) horas</strong>.
                        </li>
                    </ul>
                    <h3 className="font-semibold text-gray-800 mt-2">7.3 Riesgos en el transporte</h3>
                    <p>
                        El riesgo de pérdida o daño del producto se transfiere al cliente en el momento en que
                        el operador logístico entrega el paquete en la dirección indicada y se obtiene la firma
                        de recepción. Hasta ese momento, {COMPANY.nombre} es responsable del estado del producto.
                    </p>
                </section>

                {/* ── 8. Uso Aceptable de la Plataforma ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        8. Uso Aceptable de la Plataforma
                    </h2>
                    <p>El usuario se compromete a no utilizar la plataforma para:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Realizar compras con tarjetas o cuentas de terceros sin su autorización.</li>
                        <li>Introducir, difundir o almacenar datos falsos, virus informáticos o código malicioso.</li>
                        <li>
                            Intentar acceder sin autorización a sistemas, servidores o bases de datos de{" "}
                            {COMPANY.nombre} o de terceros.
                        </li>
                        <li>
                            Realizar ingeniería inversa, scraping masivo o extracción automatizada de contenidos
                            del sitio sin autorización escrita.
                        </li>
                        <li>
                            Cualquier actividad que contravenga la legislación peruana o los derechos de terceros.
                        </li>
                    </ul>
                    <p>
                        El incumplimiento de estas condiciones podrá dar lugar a la suspensión inmediata de la
                        cuenta y a las acciones legales que correspondan conforme a la Ley N.° 30096 – Ley de
                        Delitos Informáticos.
                    </p>
                </section>

                {/* ── 9. Propiedad Intelectual ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        9. Propiedad Intelectual
                    </h2>
                    <p>
                        Todo el contenido disponible en la plataforma — incluyendo, sin limitarse a, logotipos,
                        marcas, nombres comerciales, diseños, imágenes, textos, íconos, código fuente y
                        estructura del sitio — es propiedad exclusiva de <strong>{COMPANY.razonSocial}</strong>{" "}
                        o de los fabricantes y marcas licenciantes (Apple, Samsung, Xiaomi, Motorola, entre otros),
                        y se encuentra protegido por las leyes peruanas de propiedad intelectual (D.Leg. N.° 822
                        – Ley sobre el Derecho de Autor; D.Leg. N.° 1075 – Decreto que aprueba disposiciones
                        complementarias a la Decisión 486 de la Comunidad Andina).
                    </p>
                    <p>Queda expresamente prohibido:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Reproducir, distribuir o comunicar públicamente cualquier contenido del sitio sin autorización escrita.</li>
                        <li>Usar las marcas registradas de {COMPANY.nombre} o de los fabricantes para fines propios o comerciales.</li>
                        <li>Modificar, adaptar o crear obras derivadas basadas en el contenido de la plataforma.</li>
                    </ul>
                    <p>
                        Las marcas de los fabricantes comercializados en la tienda son marcas
                        registradas de sus respectivos titulares. {COMPANY.nombre} actúa como distribuidor
                        autorizado y no tiene relación de propiedad sobre dichas marcas. Por ello cada producto cuenta con su propia garantía oficial del fabricante, y cualquier reclamo relacionado con defectos de fabricación o servicio técnico debe ser canalizado directamente con el fabricante o su red autorizada, conforme a los términos de garantía establecidos por cada marca.
                    </p>
                </section>

                {/* ── 10. Protección de Datos ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        10. Protección de Datos Personales
                    </h2>
                    <p>
                        En cumplimiento de la <strong>Ley N.° 29733</strong> – Ley de Protección de Datos
                        Personales y su Reglamento (D.S. N.° 003-2013-JUS), informamos que los datos personales
                        recopilados durante el proceso de compra y registro son tratados por{" "}
                        {COMPANY.razonSocial} con los siguientes fines:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Procesamiento y gestión de pedidos y pagos.</li>
                        <li>Emisión de comprobantes de pago y cumplimiento de obligaciones tributarias.</li>
                        <li>Coordinación de envíos y servicio postventa.</li>
                        <li>Comunicaciones comerciales y promociones (con opción de baja en cualquier momento).</li>
                        <li>Cumplimiento de obligaciones legales ante entidades reguladoras.</li>
                    </ul>
                    <p>
                        Los datos son almacenados en servidores con medidas de seguridad adecuadas y no son
                        compartidos con terceros ajenos a la operación del servicio, salvo mandato legal. El
                        cliente puede ejercer sus derechos <strong>ARCO</strong> (Acceso, Rectificación,
                        Cancelación y Oposición) escribiendo a{" "}
                        <a href={`mailto:${COMPANY.email}`} className="text-blue-600 hover:underline">
                            {COMPANY.email}
                        </a>{" "}
                        con el asunto Solicitud ARCO – [Nombre completo]. Atenderemos su solicitud en los
                        plazos establecidos por ley.
                    </p>
                    <p>
                        Para mayor detalle, consulte nuestra{" "}
                        <Link href="/politicas-de-privacidad" className="text-blue-600 hover:underline">
                            Política de Privacidad
                        </Link>
                        .
                    </p>
                </section>

                {/* ── 11. Cookies ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        11. Uso de Cookies y Tecnologías de Rastreo
                    </h2>
                    <p>
                        Nuestra plataforma utiliza cookies propias y de terceros para mejorar la experiencia de
                        navegación, recordar preferencias del usuario, analizar el tráfico del sitio y, en su
                        caso, mostrar publicidad relevante. Al continuar navegando, el usuario acepta su uso.
                        Puede configurar su navegador para bloquear o eliminar cookies, aunque esto puede
                        afectar la funcionalidad del sitio.
                    </p>
                </section>

                {/* ── 12. Limitación de Responsabilidad ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        12. Limitación de Responsabilidad
                    </h2>
                    <p>
                        {COMPANY.nombre} no asume responsabilidad por:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Interrupciones, errores o indisponibilidad del sitio web por causas de fuerza mayor,
                            mantenimiento programado o fallos de terceros (proveedores de servicios de internet,
                            servidores, pasarelas de pago).
                        </li>
                        <li>
                            Daños indirectos, lucro cesante o perjuicios derivados del uso indebido del sitio o
                            de los productos adquiridos.
                        </li>
                        <li>
                            Contenidos de sitios externos enlazados desde nuestra plataforma.
                        </li>
                        <li>
                            Accesos no autorizados a la cuenta del usuario por descuido en la custodia de sus
                            credenciales.
                        </li>
                    </ul>
                    <p>
                        En todo caso, la responsabilidad máxima de {COMPANY.nombre} frente al cliente se
                        limita al <strong>monto efectivamente pagado</strong> por el producto o servicio
                        objeto de la controversia, sin perjuicio de los derechos irrenunciables reconocidos
                        por la Ley N.° 29571.
                    </p>
                </section>

                {/* ── 13. Modificaciones ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        13. Modificaciones a los Términos y Condiciones
                    </h2>
                    <p>
                        {COMPANY.nombre} se reserva el derecho de modificar estos Términos y Condiciones en
                        cualquier momento, ya sea por cambios normativos, operativos o de política comercial.
                        Las modificaciones entrarán en vigor desde su publicación en este sitio. Para pedidos
                        ya realizados y en proceso, aplicará la versión vigente al momento de la transacción.
                        Se recomienda revisar periódicamente esta página.
                    </p>
                </section>

                {/* ── 14. Jurisdicción ── */}
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                        14. Jurisdicción, Ley Aplicable y Solución de Controversias
                    </h2>
                    <p>
                        Estos Términos y Condiciones se rigen e interpretan de conformidad con las leyes de
                        la <strong>República del Perú</strong>. Ante cualquier controversia derivada de la
                        interpretación, cumplimiento o ejecución de este documento, las partes procurarán
                        resolverla de manera directa y de buena fe.
                    </p>
                    <p>
                        Si no se alcanzara un acuerdo, el cliente puede acudir al{" "}
                        <strong>Servicio de Atención al Ciudadano del INDECOPI</strong> (línea gratuita{" "}
                        <strong>0-800-4-4040</strong> / Lima <strong>224-7800</strong> /{" "}
                        <a
                            href="https://www.indecopi.gob.pe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            www.indecopi.gob.pe
                        </a>
                        ) o al <strong>Servicio de Arbitraje de Consumo</strong> (SISAC) como mecanismo
                        alternativo de resolución de disputas.
                    </p>
                    <p>
                        En caso de recurrir a la vía judicial, las partes se someten expresamente a la
                        competencia de los jueces y tribunales del <strong>Distrito Judicial de Cañete</strong>,
                        renunciando a cualquier otro fuero que pudiera corresponderles.
                    </p>
                </section>

                {/* ── Contacto ── */}
                <section className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-2 mt-8">
                    <h2 className="text-lg font-semibold text-gray-900">Contacto y Soporte</h2>
                    <p>
                        Para consultas sobre estos Términos o cualquier aspecto de su compra, puede
                        contactarnos por los siguientes medios:
                    </p>
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