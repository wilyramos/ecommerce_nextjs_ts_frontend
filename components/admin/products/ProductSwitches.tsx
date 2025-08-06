"use client"

import Switch from "react-switch"
import { useState } from "react"
import type { ProductWithCategoryResponse } from "@/src/schemas"

export default function ProductSwitches({ product }: { product?: ProductWithCategoryResponse }) {
    const [isActive, setIsActive] = useState(product?.isActive ?? true)
    const [esDestacado, setEsDestacado] = useState(product?.esDestacado ?? false)
    const [esNuevo, setEsNuevo] = useState(product?.esNuevo ?? false)


    console.log("ProductSwitches", { isActive, esDestacado, esNuevo })

    return (
        <div className="space-y-4 border-l-2 bg-white p-6 text-xs font-semibold">
            <div className="flex items-center justify-between">
                <label htmlFor="isActive" className="text-gray-700">
                    ¿Producto activo?
                </label>
                <Switch
                    id="isActive"
                    onChange={setIsActive}
                    checked={isActive}
                    onColor="#3B82F6"  // blue-600
                    offColor="#d1d5db" // gray-300
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    handleDiameter={18}
                />
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="esDestacado" className="text-gray-700">
                    ¿Es destacado?
                </label>
                <Switch
                    id="esDestacado"
                    onChange={setEsDestacado}
                    checked={esDestacado}
                    onColor="#3B82F6"  // amber-500
                    offColor="#d1d5db"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    handleDiameter={18}
                />
            </div>

            <div className="flex items-center justify-between">
                <label htmlFor="esNuevo" className="text-gray-700">
                    ¿Es nuevo?
                </label>
                <Switch
                    id="esNuevo"
                    onChange={setEsNuevo}
                    checked={esNuevo}
                    onColor="#3B82F6"  // green-500
                    offColor="#d1d5db"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    handleDiameter={18}
                />
            </div>

            <input className="hidden" type="hidden" name="isActive" value={isActive ? "true" : "false"} />
            <input className="hidden" type="hidden" name="esDestacado" id="esDestacado" value={esDestacado ? "true" : "false"} />
            <input className="hidden" type="hidden" name="esNuevo" value={esNuevo ? "true" : "false"} />
        </div>
    )
}
