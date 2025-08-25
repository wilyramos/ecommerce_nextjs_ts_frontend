import { FaFilePdf, FaWhatsapp, FaEnvelope, FaPlus } from "react-icons/fa";
import { useCartStore } from "@/src/store/cartStore";

export default function VentaCompletada() {
    const { saleId, resetSale } = useCartStore();

    if (!saleId) return null;

    const pdfUrl = `/api/sales/${saleId}/pdf`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=Venta%20completada%20-%20Ver%20PDF:%20${encodeURIComponent(
        window.location.origin + pdfUrl
    )}`;
    const emailUrl = `mailto:?subject=Venta Completada&body=Puedes ver la venta aquí: ${encodeURIComponent(
        window.location.origin + pdfUrl
    )}`;

    const buttonStyle =
        "flex items-center gap-2  text-black px-4 py-2  hover:bg-gray-200 rounded transition-colors";

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-700 space-y-4">
            <p className="text-lg font-semibold">¡Venta completada!</p>
            <p className="text-sm">Puedes imprimir, enviar o iniciar una nueva venta.</p>

            <div className="flex gap-3">
                {/* Abrir PDF */}
                <a href={pdfUrl} target="_blank" className={buttonStyle}>
                    <FaFilePdf /> 
                </a>

                {/* WhatsApp */}
                <a href={whatsappUrl} target="_blank" className={buttonStyle}>
                    <FaWhatsapp />
                </a>

                {/* Email */}
                <a href={emailUrl} target="_blank" className={buttonStyle}>
                    <FaEnvelope /> 
                </a>
            </div>

            {/* Nueva Venta */}
            <button onClick={resetSale} className={buttonStyle + " bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"}>
                <FaPlus /> Nueva Venta
            </button>
        </div>
    );
}
