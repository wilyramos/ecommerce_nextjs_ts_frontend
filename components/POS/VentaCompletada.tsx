// File: frontend/components/POS/VentaCompletada.tsx
"use client";

import { FaWhatsapp, FaPlus, FaCheckCircle } from "react-icons/fa";
import { useCartStore } from "@/src/store/cartStore";
import { RiPrinterFill } from "react-icons/ri";
import { useEffect, useState } from "react";

interface Props {
    onMobileClose?: () => void;
}

export default function VentaCompletada({ onMobileClose }: Props) {
    const { saleId, resetSale } = useCartStore();
    const [origin, setOrigin] = useState("");

    // Evitar errores de SSR con window.location
    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    if (!saleId) return null;

    const pdfUrl = `/api/sales/${saleId}/pdf`;

    // Generar URLs solo cuando el componente se montó en el cliente
    const absolutePdfUrl = origin ? `${origin}${pdfUrl}` : "";
    const whatsappUrl = `https://api.whatsapp.com/send?text=Venta%20completada%20-%20Ver%20PDF:%20${encodeURIComponent(absolutePdfUrl)}`;

    // Manejador para iniciar una nueva venta y cerrar el modal en móviles
    const handleNuevaVenta = () => {
        resetSale();
        if (onMobileClose) {
            onMobileClose(); // Cierra el Sheet (Drawer) en la vista móvil
        }
    };

    // Estilo para botones de acción secundaria (Círculos flotantes)
    const actionButtonStyle = "flex items-center justify-center w-12 h-12 bg-[var(--store-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-[var(--store-surface-hover)] hover:text-[var(--store-primary)] hover:border-[var(--store-primary)] rounded-full transition-all duration-200 shadow-sm hover:shadow-md";

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[var(--admin-surface)] p-6 text-center">

            {/* Ícono de Éxito */}
            <div className="w-20 h-20 bg-[var(--admin-success-bg)] rounded-full flex items-center justify-center mb-6 shadow-inner border border-[var(--admin-success)]/20 animate-in zoom-in duration-300">
                <FaCheckCircle className="text-4xl text-[var(--admin-success)]" />
            </div>

            {/* Textos */}
            <h2 className="text-2xl font-bold text-[var(--admin-text)] mb-2">
                ¡Venta Exitosa!
            </h2>
            <p className="text-sm text-[var(--admin-text-muted)] max-w-[250px]">
                El pedido ha sido procesado y registrado correctamente.
            </p>

            {/* Acciones Secundarias (Imprimir, WA) */}
            <div className="flex gap-4 mt-8 mb-8">
                <a href={pdfUrl} target="_blank" className={actionButtonStyle} title="Imprimir Recibo">
                    <RiPrinterFill size={20} />
                </a>

                {origin && (
                    <a href={whatsappUrl} target="_blank" className={actionButtonStyle} title="Enviar por WhatsApp">
                        <FaWhatsapp size={20} className="hover:text-[#25D366] transition-colors" />
                    </a>
                )}
            </div>

            {/* Acción Principal: Nueva Venta */}
            <div className="w-full mt-auto pt-6 border-t border-[var(--admin-border)]">
                <button
                    onClick={handleNuevaVenta}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-[var(--admin-primary)] text-[var(--admin-primary-text)] font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-[var(--admin-primary-hover)] shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                    <FaPlus /> Nueva Venta
                </button>
            </div>

        </div>
    );
}