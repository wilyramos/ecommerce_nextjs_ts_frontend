"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react"; // Icono de advertencia

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void; // Soporta funciones síncronas y asíncronas
    loading: boolean;
    title?: string;
    description?: string;
    variant?: "destructive" | "default"; // Para cambiar el color del botón (Rojo o Negro)
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    title = "¿Estás seguro?",
    description = "Esta acción no se puede deshacer.",
    variant = "destructive",
    confirmText = "Continuar",
    cancelText = "Cancelar",
}: ConfirmModalProps) => {
    // Evitamos problemas de hidratación asegurando que el componente esté montado
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Handler interno para evitar cerrar el modal si la promesa (onConfirm) aún no termina
    const handleConfirm = async (e: React.MouseEvent) => {
        e.preventDefault();
        await onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col gap-2 sm:text-left">
                    <div className="flex items-center gap-2">
                        {variant === "destructive" && (
                            <div className="rounded-full bg-red-100 p-2">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                        )}
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};