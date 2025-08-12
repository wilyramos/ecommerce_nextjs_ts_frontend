"use client";

import { MdBuild } from "react-icons/md";
import Link from "next/link";

export default function MaintenanceNotice({
    title = "Funcionalidad en mantenimiento",
    message = "Estamos mejorando esta sección para brindarte una mejor experiencia.",
    showHomeButton = true,
}) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-6 py-12">
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full mb-6">
                <MdBuild className="text-5xl animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-xl mb-6">{message}</p>
            {showHomeButton && (
                <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    Volver al inicio
                </Link>
            )}
        </div>
    );
}
