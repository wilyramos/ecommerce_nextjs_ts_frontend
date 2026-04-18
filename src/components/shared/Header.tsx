"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCashStore } from "@/src/store/useCashStore";
import { 
    Clock, 
    User as UserIcon, 
    ShieldCheck, 
    LockKeyhole, 
    Power 
} from "lucide-react";

import { CashClosingModal } from "@/src/components/pos/CashClosingModal";
import type { User } from "@/src/schemas";

export const Header = ({ user }: { user: User }) => {
    const pathname = usePathname();
    const { isOpen, toggleModal, currentShiftId } = useCashStore();
    const [showClosingModal, setShowClosingModal] = useState(false);

    const rawSection = pathname.split("/").filter(Boolean).pop() || "Dashboard";
    const sectionMap: Record<string, string> = {
        "terminaltres": "Terminal de Ventas",
        "inventory": "Gestión de Almacén",
        "sales": "Historial de Operaciones",
    };
    
    const currentTitle = sectionMap[rawSection] || rawSection;

    return (
        <>
            <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl shrink-0 z-40">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                            GOPHONE / v3
                        </span>
                        <h2 className="text-sm font-black text-black uppercase tracking-tighter">
                            {currentTitle}
                        </h2>
                    </div>
                    
                    <div className="h-8 w-[1px] bg-slate-200" />

                    <div className="flex items-center gap-2">
                        {!isOpen ? (
                            <button 
                                onClick={() => toggleModal(true)}
                                className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-red-100 bg-red-50 text-red-500 transition-all duration-300 active:scale-95 hover:bg-red-100 group"
                            >
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Abrir Caja</span>
                                <LockKeyhole size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-1 rounded-2xl">
                                <div className="flex items-center gap-2 px-3 py-1 text-emerald-600">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Caja Online</span>
                                    <ShieldCheck size={14} />
                                </div>
                                <button 
                                    onClick={() => setShowClosingModal(true)}
                                    className="flex items-center justify-center h-8 w-8 rounded-xl bg-white border border-emerald-200 text-emerald-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                                >
                                    <Power size={14} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Clock size={12} />
                            <span className="text-[10px] font-black font-mono uppercase">
                                {new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                        <div className="text-right leading-tight">
                            <p className="text-[10px] font-black text-black uppercase">{user.nombre}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.rol}</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-black/10">
                        <UserIcon size={18} />
                    </div>
                </div>
            </header>

            {isOpen && showClosingModal && currentShiftId && user._id&& (
                <CashClosingModal 
                    userId={user._id}
                    shiftId={currentShiftId}
                    onClose={() => setShowClosingModal(false)}
                />
            )}
        </>
    );
};