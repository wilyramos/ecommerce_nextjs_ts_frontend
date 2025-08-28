"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // icono moderno

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 
                 text-gray-700 text-sm font-medium 
                  hover:border-gray-400 
                 transition-colors hover:bg-blue-600"
        >
            <ArrowLeft className="w-4 h-4" />
            Volver
        </button>
    );
}
