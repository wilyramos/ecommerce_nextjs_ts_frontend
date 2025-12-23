import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Tooltip de ayuda / Call to Action */}
            <span className="bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-800 px-3 py-1.5 rounded-full shadow-sm border border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Asesoría Premium
            </span>

            <Link
                href="https://wa.me/51925054636?text=Hola%2C%20queria%20consultar%20sobre%20"
                target="_blank"
                rel="noopener noreferrer"
                className="
                    relative flex items-center justify-center
                    w-14 h-14 rounded-full
                    bg-[#25D366] text-white
                    shadow-[0_10px_25px_rgba(37,211,102,0.3)]
                    hover:shadow-[0_15px_35px_rgba(37,211,102,0.5)]
                    hover:scale-110 active:scale-95
                    transition-all duration-300
                    group
                "
                aria-label="Chat en WhatsApp"
            >
                {/* Efecto de pulso en el fondo */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />
                
                {/* Badge de notificación (simula un mensaje pendiente) */}
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                </span>

                <FaWhatsapp className="w-7 h-7 relative z-10 transition-transform duration-500 group-hover:rotate-[12deg]" />
            </Link>
        </div>
    );
}