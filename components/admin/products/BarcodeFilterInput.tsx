"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import BarcodeScanner from "./BarcodeScanner";

interface BarcodeFilterInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function BarcodeFilterInput({
    value,
    onChange,
}: BarcodeFilterInputProps) {
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    return (
        <>
            <div className="relative flex items-center w-[160px]">
                <Input
                    placeholder="Código de barras…"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-8 text-[13px] font-mono pr-8 w-full"
                />
                <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="absolute right-2 text-action-cta hover:text-action-cta/80 transition-colors cursor-pointer"
                    title="Escanear con cámara"
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            <BarcodeScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onBarcodeDetected={onChange}
            />
        </>
    );
}