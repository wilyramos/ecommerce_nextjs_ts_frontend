/* File: src/components/shared/Header.tsx 
    @Author: whramos 
    @Description: Header simplificado con mapeo estricto a variables CSS institucionales.
*/

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCashStore } from "@/src/store/useCashStore";
import { Power } from "lucide-react";
import { CashClosingModal } from "@/src/components/pos/CashClosingModal";
import type { User } from "@/src/schemas";

export const Header = ({ user }: { user: User }) => {
    const pathname = usePathname();
    const { isOpen, toggleModal, currentShiftId } = useCashStore();
    const [showClosingModal, setShowClosingModal] = useState(false);

    const rawSection = pathname.split("/").filter(Boolean).pop() || "Dashboard";
    const sectionMap: Record<string, string> = {
        "terminal": "Terminal de Ventas",
        "inventory": "Gestión de Almacén",
        "sales": "Historial de Operaciones",
        "receipts": "Comprobantes",
        "daily-summary": "Resumen del Día",
        "cash-history": "Historial de Cajas",
        "reports": "Reportes",
        "settings": "Configuración",
        "cash-shift": "Caja Actual",
    };
    
    const currentTitle = sectionMap[rawSection] || rawSection;

    return (
        <>
            <header className="flex h-12 w-full items-center justify-between border-b px-8 shrink-0 z-40 bg-[var(--color-text-inverse)] border-[var(--color-accent-warm-light)]">
                
                {/* Left: Sección */}
                <h2 className="text-base font-black text-[var(--color-text-primary)] uppercase ">
                    {currentTitle}
                </h2>

                {/* Right: Gestión de Cajas */}
                <div className="flex items-center gap-2">
                    {!isOpen ? (
                        <button 
                            onClick={() => toggleModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-sm border transition-all duration-300 active:scale-95 group bg-[var(--color-accent-warm)] border-[var(--color-accent-warm)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-warm-hover)]"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Abrir Caja</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5 bg-[var(--color-accent-warm-light)] border border-[var(--color-accent-warm)] px-3 py-1.5 rounded-sm">
                            <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
                                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Caja abierta</span>
                            </div>
                            <button 
                                onClick={() => setShowClosingModal(true)}
                                className="flex items-center justify-center h-6 w-6 rounded-sm bg-[var(--color-text-inverse)] border border-[var(--color-accent-warm)] text-[var(--color-accent-warm)] hover:bg-[var(--color-accent-warm-hover)] hover:text-[var(--color-text-inverse)] transition-all duration-300"
                                title="Cerrar caja"
                            >
                                <Power size={12} strokeWidth={3} />
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {isOpen && showClosingModal && currentShiftId && user._id && (
                <CashClosingModal 
                    userId={user._id}
                    shiftId={currentShiftId}
                    onClose={() => setShowClosingModal(false)}
                />
            )}
        </>
    );
};