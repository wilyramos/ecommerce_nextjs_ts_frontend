"use client";


import React from "react";
import { FaFileExport } from "react-icons/fa"; // Ícono opcional

export default function ExportClientsButton() {
    const handleExport = () => {
        // Aquí puedes colocar la lógica para exportar los clientes
        console.log("Exportando clientes...");
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
            <FaFileExport className="text-gray-500" />
            Exportar
        </button>
    );
}
