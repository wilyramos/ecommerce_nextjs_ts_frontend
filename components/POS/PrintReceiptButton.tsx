//FILE: frontend/components/POS/PrintReceiptButton.tsx
"use client";

export default function PrintReceiptButton({ saleId }: { saleId: string }) {
    const handlePrint = () => {
        const url = `/api/sales/${saleId}/pdf`;
        window.open(url, "_blank"); // se abre el PDF directo
    };

    return (
        <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            Imprimir comprobante
        </button>
    );
}


// TODO: Añadir autenticación