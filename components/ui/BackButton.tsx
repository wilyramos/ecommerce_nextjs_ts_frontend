"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // icono moderno

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-800 px-2 py-1 rounded cursor-pointer border border-gray-700 hover:bg-gray-200 transition text-sm"
        >
            <ArrowLeft className="w-4 h-4" />
            Volver
        </button>
    );
}
