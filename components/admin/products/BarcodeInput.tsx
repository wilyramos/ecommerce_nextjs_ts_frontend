"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import BarcodeScanner from "./BarcodeScanner";

interface BarcodeInputProps {
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export default function BarcodeInput({
    defaultValue = "",
    onChange,
}: BarcodeInputProps) {
    const [barcode, setBarcode] = useState(defaultValue);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleBarcodeChange = (newValue: string) => {
        setBarcode(newValue);
        onChange?.(newValue);
    };

    const handleScanComplete = (scannedCode: string) => {
        handleBarcodeChange(scannedCode);
        setIsScannerOpen(false);
    };

    return (
        <>
            <div className="space-y-1">
                <LabelWithTooltip
                    htmlFor="barcode"
                    label="Código de Barras"
                    tooltip="El código de barras del producto. Puedes escribirlo manualmente o escanearlo con la cámara."
                />

                <div className="flex gap-2">
                    <Input
                        id="barcode"
                        name="barcode"
                        value={barcode}
                        onChange={(e) => handleBarcodeChange(e.target.value)}
                        placeholder="Ej: 7501234567890"
                        className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs font-mono flex-1"
                    />

                    <button
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="h-10 px-3 bg-action-cta/10 hover:bg-action-cta/20 border border-action-cta/30 rounded transition-colors flex items-center gap-2"
                        title="Escanear código de barras con cámara"
                        aria-label="Escanear código de barras"
                    >
                        <Camera className="w-4 h-4 text-action-cta" />
                    </button>
                </div>
            </div>

            <BarcodeScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onBarcodeDetected={handleScanComplete}
            />
        </>
    );
}