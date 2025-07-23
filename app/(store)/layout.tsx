import Footer from "@/components/home/Footer"
import NavBar from "@/components/navigation/NavBar"
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa" // Ícono oficial de WhatsApp


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Aviso mejorado */}
                <div className="relative w-full bg-gradient-to-r from-rose-300 via-red-500 to-red-600 text-white text-sm md:text-base font-semibold py-1 px-4 text-center shadow-md z-50">
                    <span className="inline-flex items-center justify-center gap-2">
                        <span className="text-lg md:text-xl">🚚</span>
                        <span className="uppercase tracking-wide">
                            ¡Envío en Cañete por tiempo limitado!
                        </span>
                        <span className="hidden sm:inline text-xs bg-white text-rose-600 rounded-full px-2 py-0.5 font-bold">
                            GRATIS
                        </span>
                    </span>
                </div>

                <NavBar />
                <main className="text-gray-700">{children}</main>
                <Footer />
            </div>


            <Link
                href="https://wa.me/51907103353?text=Hola%2C%20queria%20consultar%20sobre%20"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-12 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all"
                aria-label="Chat en WhatsApp"
            >
                <FaWhatsapp className="w-6 h-6" />
            </Link>

        </>
    )
}