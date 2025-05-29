"use client";

import { useRouter } from "next/navigation";

export default function ButtonResetSearch() {
    const router = useRouter();

    const handleReset = () => {
        // Reset search params
        const url = new URL(window.location.href);
        url.searchParams.delete("query");
        url.searchParams.delete("page");
        url.searchParams.delete("limit");
        router.push(url.toString());
    };

    return (
        <button
            className="text-blue-600 hover:underline"
            onClick={handleReset}
        >
            Restablecer búsqueda
        </button>
    )
}
