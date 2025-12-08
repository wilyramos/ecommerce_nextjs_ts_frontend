import {
    Phone,
    Mail,
    MapPin,
    MessageSquare,
    Clock,
    SendHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function ContactoSoportePage() {
    return (
        <section className="max-w-5xl mx-auto px-4 space-y-8">

            {/* Título */}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Contacto y Soporte
            </h1>

            {/* Intro */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                    Si necesitas ayuda, tienes una consulta o requieres soporte con tu pedido,
                    en <b>Gophone</b> estamos listos para ayudarte. Puedes comunicarte con nosotros
                    mediante los siguientes canales:
                </p>
            </div>

            {/* Información de contacto */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-5">

                <h2 className="font-semibold text-gray-900 text-lg">
                    Nuestros canales oficiales
                </h2>

                <ul className="space-y-4 text-sm text-gray-700">

                    {/* WhatsApp */}
                    <li className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-green-600 mt-1" />
                        <div>
                            <p className="font-medium">WhatsApp</p>
                            <a
                                href="https://api.whatsapp.com/send?phone=51925054636&text=Hola%20Gophone,%20necesito%20ayuda"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black hover:underline"
                            >
                                +51 925 054 636
                            </a>
                        </div>
                    </li>

                    {/* Email */}
                    <li className="flex items-start gap-3">
                        <Mail className="w-5 h-5 mt-1" />
                        <div>
                            <p className="font-medium">Correo electrónico</p>
                            <a
                                href="mailto:contacto@gophone.pe"
                                className="text-black hover:underline"
                            >
                                contacto@gophone.pe
                            </a>
                        </div>
                    </li>

                    {/* Dirección */}
                    <li className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                            <p className="font-medium">Dirección</p>
                            Jr. O Higgins 120, San Vicente de Cañete
                        </div>
                    </li>

                    {/* Horario */}
                    <li className="flex items-start gap-3">
                        <Clock className="w-5 h-5 mt-1" />
                        <div>
                            <p className="font-medium">Horario de atención</p>
                            Lun–Sáb 10am – 7pm
                        </div>
                    </li>

                </ul>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-5">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Envíanos un mensaje
                </h2>

                <form className="space-y-4">

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            required
                            className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Escribe tu nombre"
                        />
                    </div>

                    {/* Correo */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            required
                            className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    {/* Mensaje */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">
                            Mensaje
                        </label>
                        <textarea
                            rows={4}
                            required
                            className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Cuéntanos en qué podemos ayudarte"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-gray-800 transition"
                    >
                        Enviar
                        <SendHorizontal className="w-4 h-4" />
                    </button>
                </form>
            </div>

            {/* Mensaje final */}
            <p className="text-[11px] text-gray-400 italic text-center">
                Nuestro equipo responderá lo antes posible.
            </p>

            {/* Volver al inicio */}
            <div className="text-center mt-6">
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                    Volver al inicio
                </Link>
            </div>

        </section>
    );
}
