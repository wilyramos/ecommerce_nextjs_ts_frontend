"use client";

import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";

export default function AddProductButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/admin/products/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-600 transition-colors"
        >
            <FiPlus className="h-4 w-4" />
            <span>Nuevo</span>
        </button>
    );
}
