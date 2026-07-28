// File: components/admin/orders/OrderPDFPrintModal.tsx
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Printer, FileText, PackageCheck, Truck } from "lucide-react";

interface Props {
    orderIds: string[];
    trigger?: React.ReactNode;
    defaultType?: "packing_slip" | "sale_note" | "shipping_label";
}

type DocType = "packing_slip" | "sale_note" | "shipping_label";
type PageFormat = "A4" | "thermal_80mm";

function buildOrdersPDFUrl(orderIds: string[], type: DocType, format: PageFormat): string {
    const params = new URLSearchParams({
        ids: orderIds.join(","),
        type,
        format,
    });
    return `/api/admin/orders/pdf?${params.toString()}`;
}

export default function OrderPDFPrintModal({ orderIds, trigger, defaultType = "packing_slip" }: Props) {
    const [open, setOpen] = useState(false);
    const [docType, setDocType] = useState<DocType>(defaultType);
    const [format, setFormat] = useState<PageFormat>("A4");

    const handleGenerate = () => {
        if (orderIds.length === 0) return;

        const pdfUrl = buildOrdersPDFUrl(orderIds, docType, format);
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Printer className="w-3.5 h-3.5 mr-1.5" /> Documentos PDF ({orderIds.length})
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-sm font-bold flex items-center gap-2">
                        <Printer className="w-4 h-4 text-primary" /> Generador de Documentos Logísticos
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Selecciona el formato para {orderIds.length} orden(es) seleccionada(s).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* 1. Tipo de Documento */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            1. Tipo de Documento
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setDocType("packing_slip")}
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-2.5 transition-colors text-xs cursor-pointer ${
                                    docType === "packing_slip"
                                        ? "border-primary bg-primary/5 text-foreground font-semibold"
                                        : "border-muted bg-card hover:bg-muted/50 text-muted-foreground"
                                }`}
                            >
                                <PackageCheck className={`mb-1 h-4 w-4 ${docType === "packing_slip" ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-[11px] text-center">Guía Empaque</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDocType("shipping_label")}
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-2.5 transition-colors text-xs cursor-pointer ${
                                    docType === "shipping_label"
                                        ? "border-primary bg-primary/5 text-foreground font-semibold"
                                        : "border-muted bg-card hover:bg-muted/50 text-muted-foreground"
                                }`}
                            >
                                <Truck className={`mb-1 h-4 w-4 ${docType === "shipping_label" ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-[11px] text-center">Rótulo Courier</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setDocType("sale_note")}
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-2.5 transition-colors text-xs cursor-pointer ${
                                    docType === "sale_note"
                                        ? "border-primary bg-primary/5 text-foreground font-semibold"
                                        : "border-muted bg-card hover:bg-muted/50 text-muted-foreground"
                                }`}
                            >
                                <FileText className={`mb-1 h-4 w-4 ${docType === "sale_note" ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-[11px] text-center">Nota Venta</span>
                            </button>
                        </div>
                    </div>

                    {/* 2. Formato de Impresión */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            2. Formato de Impresión
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormat("A4")}
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-2.5 transition-colors text-xs cursor-pointer ${
                                    format === "A4"
                                        ? "border-primary bg-primary/5 text-foreground font-semibold"
                                        : "border-muted bg-card hover:bg-muted/50 text-muted-foreground"
                                }`}
                            >
                                <span className="font-bold">Hoja A4</span>
                                <span className="text-[10px] opacity-80">Estándar (PDF)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormat("thermal_80mm")}
                                className={`flex flex-col items-center justify-between rounded-md border-2 p-2.5 transition-colors text-xs cursor-pointer ${
                                    format === "thermal_80mm"
                                        ? "border-primary bg-primary/5 text-foreground font-semibold"
                                        : "border-muted bg-card hover:bg-muted/50 text-muted-foreground"
                                }`}
                            >
                                <span className="font-bold">Térmico / Adhesivo</span>
                                <span className="text-[10px] opacity-80">Ticketera o ZPL</span>
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleGenerate} size="sm" className="w-full text-xs">
                        <Printer className="w-3.5 h-3.5 mr-2" /> Visualizar e Imprimir Rótulo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}