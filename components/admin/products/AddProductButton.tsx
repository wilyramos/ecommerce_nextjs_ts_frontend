"use client"

import { useRouter } from "next/navigation"


export default function AddProductButton() {


    const router = useRouter()

    return (
        <button
            onClick={() => router.push("/admin/products/new")}
            className="bg-gray-800 text-white text-sm font-bold px-4 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out"
        >
            NUEVO PRODUCTO
        </button>
    )
}
