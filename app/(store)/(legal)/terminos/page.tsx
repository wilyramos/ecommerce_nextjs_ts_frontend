// File: frontend/app/%28store%29/%28legal%29/terminos/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos y Condiciones | GoPhone",
    description: "Términos y condiciones generales de uso del sitio web, transacciones comerciales y políticas de venta de GoPhone.",
};

export default function TerminosPage() {
    return (
        <main className="container mx-auto max-w-4xl px-6 py-12 text-gray-800">
            <header className="mb-10 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Términos y Condiciones de Uso
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Última actualización: Mayo 2026
                </p>
            </header>

            <div className="space-y-8 text-sm leading-relaxed text-gray-600">
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">1. Aspectos Generales y Obligatoriedad</h2>
                    <p>
                        Este documento establece los Términos y Condiciones que regulan el acceso, navegación y transacciones comerciales ejecutadas en el sitio web de GoPhone. El uso de esta plataforma, el registro de un usuario o la adquisición de cualquier producto implican la aceptación expresa, total e incondicional de todas las estipulaciones vigentes al momento de la transacción. Si no está de acuerdo con estos términos, deberá abstenerse de utilizar el sitio.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">2. Capacidad Legal y Registro de Usuario</h2>
                    <p>
                        Para efectuar compras en esta tienda virtual, los usuarios deben ser mayores de dieciocho (18) años y contar con plena capacidad legal para contratar según el Código Civil peruano. Los datos provistos durante el proceso de compra o la creación de una cuenta tienen carácter de declaración jurada; por ende, el usuario se compromete a proporcionar información exacta, vigente, completa y verídica, siendo responsable por los perjuicios que la falsedad de estos datos pueda ocasionar a GoPhone o a terceros.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">3. Precios, Stock y Proceso de Validación</h2>
                    <p>
                        Todos los precios de los productos están expresados en Soles (S/) e incluyen el Impuesto General a las Ventas (IGV). Los costos de envío se calculan de forma independiente y se detallan de manera previa a la confirmación del pago.
                    </p>
                    <p>
                        Toda solicitud de compra ingresada a través de la plataforma web está sujeta a un proceso de validación obligatoria por parte de GoPhone. La transacción se considerará confirmada únicamente cuando se verifique satisfactoriamente: (a) la disponibilidad de stock físico real en nuestros almacenes, (b) la acreditación y aprobación del pago por parte de la pasarela de pagos correspondiente, y (c) la consistencia de los datos de facturación e identidad del cliente. GoPhone se reserva el derecho de anular de forma unilateral cualquier orden que no supere este filtro de seguridad, procediendo con el reembolso íntegro del dinero al mismo medio de pago utilizado.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">4. Emisión de Comprobantes de Pago Electrónicos</h2>
                    <p>
                        Conforme al Reglamento de Comprobantes de Pago del Perú, el cliente debe elegir de manera definitiva el tipo de documento electrónico que requiere antes de finalizar su compra: Boleta de Venta o Factura. Una vez emitido el comprobante por nuestros sistemas y enviado a la SUNAT, no será posible realizar ningún tipo de modificación, cambio de documento ni corrección de datos (RUC, Razón Social, DNI o Nombres), bajo estricta responsabilidad del adquirente.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">5. Condiciones de Despacho y Entrega</h2>
                    <p>
                        Las entregas se efectuarán estrictamente dentro de las zonas de cobertura y plazos indicados en la sección de envíos, con énfasis prioritario en San Vicente de Cañete. El usuario asume la total responsabilidad por la exactitud de la dirección de entrega ingresada. El transportista realizará un máximo de dos (2) intentos de entrega en la dirección consignada; en caso de que ambos resulten fallidos por causas ajenas a GoPhone (ausencia del cliente, dirección inaccesible, etc.), el producto retornará a los almacenes centrales y el cliente deberá asumir el costo logístico de un nuevo envío. La recepción del producto debe ser realizada por una persona mayor de edad, quien firmará la conformidad de la entrega.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">6. Propiedad Intelectual</h2>
                    <p>
                        Todos los contenidos, marcas, logos, diseños, estructuras de código, textos, fotografías e interfaces gráficas alojadas en este sitio web son propiedad exclusiva de GoPhone o han sido debidamente licenciados por sus fabricantes (Apple, Samsung, Xiaomi, entre otros). Queda estrictamente prohibida su reproducción, distribución, comunicación pública o transformación sin la autorización expresa y por escrito de los titulares.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">7. Jurisdicción y Solución de Controversias</h2>
                    <p>
                        Estos Términos y Condiciones se rigen, interpretan y ejecutan de conformidad con las leyes vigentes de la República del Perú, incluyendo de forma especial el Código de Protección y Defensa del Consumidor (Ley N.° 29571). Ante cualquier discrepancia, controversia o reclamación que no pueda resolverse mediante los mecanismos de trato directo, las partes renuncian expresamente al fuero de sus domicilios y se someten a la competencia territorial exclusiva de los Jueces y Tribunales de la provincia de Cañete, Lima, Perú.
                    </p>
                </section>
            </div>
        </main>
    );
}