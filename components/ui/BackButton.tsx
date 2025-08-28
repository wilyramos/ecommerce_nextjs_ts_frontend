"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-900 text-white px-3 py-1 rounded text-sm"
        >
            Volver
        </button>
    );
}
