"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Check } from "lucide-react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface BarcodeScannerProps {
    onBarcodeDetected: (barcode: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function BarcodeScanner({
    onBarcodeDetected,
    isOpen,
    onClose,
}: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanned, setScanned] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Resetear estados al abrir el diálogo
    useEffect(() => {
        if (isOpen) {
            setScanned(false);
            setError(null);
        }
    }, [isOpen]);

    // Inicialización y limpieza de html5-qrcode
    useEffect(() => {
        if (!isOpen) return;

        // Pequeño delay para asegurar que el contenedor DOM renderizado por Radix esté disponible
        const timer = setTimeout(() => {
            const scannerContainer = document.getElementById("qr-scanner");
            if (!scannerContainer) return;

            const scanner = new Html5QrcodeScanner(
                "qr-scanner",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.CODE_128,
                        Html5QrcodeSupportedFormats.CODE_39,
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.UPC_A,
                        Html5QrcodeSupportedFormats.QR_CODE,
                    ],
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    setScanned(true);
                    setError(null);
                    onBarcodeDetected(decodedText);

                    setTimeout(() => {
                        scanner.clear().catch(() => { });
                        onClose();
                    }, 2000);
                },
                (err) => {
                    if (!err.includes("No code")) {
                        console.log("Escaneando...");
                    }
                }
            );

            scannerRef.current = scanner;
        }, 50);

        return () => {
            clearTimeout(timer);
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => { });
                scannerRef.current = null;
            }
        };
    }, [isOpen, onBarcodeDetected, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-md p-6 gap-4" showCloseButton={!scanned}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                        <Camera className="w-5 h-5 text-action-cta" />
                        {scanned ? "Código detectado" : "Escanear código de barras"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground text-left">
                        {!scanned 
                            ? "Apunta la cámara del celular directamente hacia el código de barras del producto." 
                            : "El código ha sido procesado y registrado con éxito."
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Contenedor del Visor del Escáner */}
                {!scanned ? (
                    <div
                        id="qr-scanner"
                        className="w-full aspect-square bg-background-secondary rounded-md overflow-hidden border border-border/40"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 gap-3">
                        <div className="w-16 h-16 bg-action-cta/10 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                            <Check className="w-8 h-8 text-action-cta" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            ¡Código detectado correctamente!
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                        <p className="text-xs text-destructive">{error}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}