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
            className="flex items-center px-2 hover:text-rose-600 border p-2 rounded border-gray-300"
        >
            <FaFileExport className="text-gray-500" />
        </button>
    );
}
