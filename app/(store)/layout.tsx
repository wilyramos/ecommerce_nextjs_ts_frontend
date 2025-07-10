import Footer from "@/components/home/Footer"
import NavBar from "@/components/navigation/NavBar"
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa" // Ícono oficial de WhatsApp


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col min-h-screen ">
                <div className="w-full bg-gradient-to-r from-sky-300 via-indigo-200 to-indigo-500 text-indigo-900 text-center font-extrabold text-sm md:text-2xl py-2 px-2 z-50">
                    🚚 Envío gratis en Cañete – ¡Solo por tiempo limitado!
                </div>


                <NavBar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>

            <Link
                href="https://wa.me/51907103353?text=Hola%2C%20queria%20consultar%20sobre%20"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all "
                aria-label="Chat en WhatsApp"
            >
                <FaWhatsapp className="w-6 h-6" />
            </Link>

        </>
    )
}