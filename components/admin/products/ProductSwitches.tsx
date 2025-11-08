"use client"

import Switch from "react-switch"
import { useState } from "react"
import type { ProductWithCategoryResponse } from "@/src/schemas"

export default function ProductSwitches({ product }: { product?: ProductWithCategoryResponse }) {
    const [isActive, setIsActive] = useState(product?.isActive ?? true)
    const [esDestacado, setEsDestacado] = useState(product?.esDestacado ?? false)
    const [esNuevo, setEsNuevo] = useState(product?.esNuevo ?? false)
    const [isFrontPage, setIsFrontPage] = useState(product?.isFrontPage ?? false)

    const switches = [
        {
            id: "isActive",
            label: "¿Producto activo?",
            state: isActive,
            setter: setIsActive,
        },
        {
            id: "esDestacado",
            label: "¿Es destacado?",
            state: esDestacado,
            setter: setEsDestacado,
        },
        {
            id: "esNuevo",
            label: "¿Es nuevo?",
            state: esNuevo,
            setter: setEsNuevo,
        },
        {
            id: "isFrontPage",
            label: "¿Aparece en la página principal?",
            state: isFrontPage,
            setter: setIsFrontPage,
        }
    ]

    return (
        <div className="space-y-4 border-l bg-white  rounded-md p-6 text-sm font-medium black">
            {switches.map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center  justify-between">
                    <label htmlFor={id}>{label}</label>
                    <Switch
                        id={id}
                        onChange={setter}
                        checked={state}
                        onColor="#000000"  // black
                        offColor="#e5e5e5" // neutral-200
                        uncheckedIcon={false}   
                        checkedIcon={false}
                        height={20}
                        width={40}
                        handleDiameter={18}
                    />
                    <input type="hidden" name={id} value={state ? "true" : "false"} />
                </div>
            ))}
        </div>
    )
}
