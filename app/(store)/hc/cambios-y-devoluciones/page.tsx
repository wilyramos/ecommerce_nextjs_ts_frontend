
import { ShieldCheck, Undo2 } from "lucide-react";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function CambiosDevolucionesPage() {
    return (
        <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">

            {/* Título */}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Política de Cambios y Devoluciones
            </h1>

            {/* Introducción */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                    En <b>Gophone</b>, tu satisfacción es nuestra prioridad. Te recomendamos revisar tu producto apenas lo recibas para asegurarte de que esté en perfectas condiciones.
                </p>

                <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-600 mt-1" />
                    <p className="text-gray-700 text-sm leading-relaxed">
                        Si el producto presenta falla de fábrica o daño de transporte, puedes solicitar un cambio o devolución dentro de los <b>3 días hábiles</b> posteriores a la entrega.
                    </p>
                </div>
            </div>

            {/* Derecho a desistimiento */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <Undo2 className="w-5 h-5 text-gray-700" /> Derecho de Desistimiento
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
                    Puedes solicitar la devolución o cambio dentro de los <b>3 días hábiles</b> desde la entrega.
                    El producto debe estar completamente nuevo, sellado y sin uso.
                </p>

                <p className="text-xs text-gray-500 italic">
                    *No aplica para productos que hayan sido activados, personalizados o usados.
                </p>
            </div>

            {/* Condiciones */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg">Condiciones para Cambios o Devoluciones</h2>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Producto sin uso ni señales de manipulación</li>
                    <li>Caja, sellos y accesorios originales completos</li>
                    <li>Comprobante de compra (boleta o factura)</li>
                    <li>Evaluación técnica para validar estado</li>
                </ul>
            </div>

            {/* Exclusiones */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg">No aplica en</h2>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Equipos o accesorios usados o activados</li>
                    <li>Daños por golpes, humedad o mal uso</li>
                    <li>Productos sin empaques o con accesorios faltantes</li>
                    <li>Productos en liquidación o con descuentos especiales</li>
                    <li>Higiene personal (audífonos in-ear, protectores de pantalla abiertos)</li>
                </ul>
            </div>

            {/* Proceso */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg">¿Cómo solicitarlo?</h2>

                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                    <li>Escríbenos por WhatsApp o correo indicando tu número de pedido</li>
                    <li>Adjunta fotos y video del producto y empaque original</li>
                    <li>Evaluación técnica (tiempo aprox. 3 a 7 días hábiles)</li>
                </ol>
            </div>

            {/* Reembolso */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg">Reembolsos</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                    El reembolso se procesa tras la validación de producto, máximo en <b>72 horas hábiles</b>.
                    <br />
                    Se realizará por el mismo método de pago utilizado.
                </p>
            </div>

            <p className="text-[11px] text-gray-400 italic text-center">
                Al realizar una compra aceptas estas condiciones.
            </p>

            {/* Contacto */}
            <section className="bg-white rounded-xl p-5 shadow-sm mt-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    ¿Necesitas ayuda?
                </h3>

                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                        <FaWhatsapp className="text-green-600 w-5 h-5" />
                        <a
                            href="https://api.whatsapp.com/send?phone=51925054636&text=Hola%20Gophone,%20tengo%20una%20consulta"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            +51 925 054 636
                        </a>
                    </li>

                    <li className="flex items-center gap-2">
                        <FaEnvelope className="w-5 h-5" />
                        <a href="mailto:ventas@gophone.pe" className="hover:underline">
                            ventas@gophone.pe
                        </a>
                    </li>

                    <li className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-5 h-5" />
                        Jr. O Higgins 120, San Vicente de Cañete
                    </li>

                    <li className="mt-1 text-gray-600 text-xs">
                        Horario: Lun–Sáb 10am – 7pm
                    </li>
                </ul>

                <Link
                    href="/"
                    className="mt-5 inline-block bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                    Volver al inicio
                </Link>
            </section>
        </section>
    );
}
