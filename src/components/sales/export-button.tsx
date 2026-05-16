"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Dispara la descarga del CSV llamando al Route Handler interno.
 * Mantiene los filtros actuales de la URL automáticamente.
 */
export function ExportButton() {
    const searchParams = useSearchParams();
    const [isExporting, setIsExporting] = React.useState(false);

    const handleExport = () => {
        setIsExporting(true);

        // Construimos la URL hacia nuestra propia API interna de Next.js
        const query = searchParams.toString();
        const downloadUrl = `/api/sales/export${query ? `?${query}` : ""}`;

        // Redirección para disparar la descarga gestionada por el navegador
        window.location.assign(downloadUrl);

        // Feedback visual temporal
        setTimeout(() => setIsExporting(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="h-10 gap-2 border-[var(--color-border-default)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        >
            {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <Download className="size-4 text-blue-500" />
            )}
            <span className="hidden md:inline font-medium">Exportar CSV</span>
        </Button>
    );
}