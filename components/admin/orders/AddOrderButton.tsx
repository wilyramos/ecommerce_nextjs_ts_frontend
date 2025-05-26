"use client"

import { useRouter } from "next/navigation"

export default function AddOrderButton() {


    const router = useRouter()

    return (
        <button
            onClick={() => router.push("/admin/orders/new")}
            className="bg-gray-800 text-white font-semibold px-2 py-1 rounded-lg hover:bg-gray-950 transition-all duration-200 ease-in-out text-md cursor-pointer"
        >
            Nuevo Pedido
        </button>
    )
}
