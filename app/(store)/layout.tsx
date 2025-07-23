import Footer from "@/components/home/Footer"
import NavBar from "@/components/navigation/NavBar"
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa" // Ícono oficial de WhatsApp
import { TbTruckDelivery } from "react-icons/tb";


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Aviso mejorado */}
                <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white text-center text-sm md:text-base font-medium py-2 px-4 shadow z-50">
                    <div className="inline-flex items-center justify-center gap-2">
                        <TbTruckDelivery className="text-cyan-400 text-lg" />
                        <span className="text-white">Envíos en Cañete por tiempo limitado</span>
                        <span className="hidden sm:inline bg-cyan-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                            GRATIS
                        </span>
                    </div>
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