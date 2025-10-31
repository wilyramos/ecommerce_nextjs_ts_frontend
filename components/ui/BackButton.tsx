"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-600 px-2 py-1 rounded cursor-pointer transition text-sm hover:text-black"
        >
            <ArrowLeft className="w-4 h-4" />
            Volver
        </button>
    );
}
