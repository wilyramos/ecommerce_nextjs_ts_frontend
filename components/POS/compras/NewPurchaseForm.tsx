"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseAction } from "@/actions/pos/add-purchase-action";
import { toast } from "sonner";
import { usePurchaseStore } from "@/src/store/purchaseStore";
import Image from "next/image";

export default function NewPurchaseForm() {
    const router = useRouter();
    const [state, dispatch] = useActionState(createPurchaseAction, {
        errors: [],
        success: "",
    });

    const [supplier, setSupplier] = useState(""); // Para el proveedor

    const items = usePurchaseStore((state) => state.items);
    const updateItem = usePurchaseStore((state) => state.updateItem);
    const removeItem = usePurchaseStore((state) => state.removeItem);
    const clearItems = usePurchaseStore((state) => state.clearItems);

    useEffect(() => {
        if (state.success) {
            clearItems();
            router.push("/pos/compras");
        }
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
    }, [state, router, clearItems]);

    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <form
            noValidate
            action={dispatch}
            className="space-y-6"
        >
            {/* Input del proveedor */}
            <div>
                <label className="block font-medium text-gray-700 mb-1">
                    Proveedor
                </label>
                <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Nombre del proveedor"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
            </div>

            {/* Lista de productos */}
            {items.length > 0 && (
                <div className=" p-4 space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                        Detalles
                    </h2>
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between gap-3 p-3 border rounded-md"
                        >
                            {/* Imagen */}
                            <div className="flex-shrink-0">
                                {item.imagen ? (
                                    <Image
                                        src={item.imagen}
                                        alt={item.nombre}
                                        width={40}
                                        height={40}
                                        className="object-cover rounded"
                                        quality={80}
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="flex-1 font-medium text-gray-700">
                                {item.nombre}
                            </div>

                            {/* Cantidad */}
                            <div>
                                <input
                                    type="number"
                                    min={1}
                                    value={item.cantidad}
                                    onChange={(e) =>
                                        updateItem(item._id, Number(e.target.value))
                                    }
                                    className="w-16 text-center border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                />
                            </div>

                            {/* Precio unitario */}
                            <div className="w-24 text-right font-medium text-gray-700">
                                s/{item.precio}
                            </div>

                            {/* Subtotal */}
                            <div className="w-24 text-right font-semibold text-gray-800">
                                s/{item.precio * item.cantidad}
                            </div>

                            {/* Eliminar */}
                            <button
                                type="button"
                                onClick={() => removeItem(item._id)}
                                className="text-red-500 hover:text-red-600 font-semibold"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-end mt-4 text-lg font-bold text-gray-800">
                        Total: s/{total}
                    </div>
                </div>
            )}

            {/* Botón para guardar la compra */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition font-medium"
                >
                    Guardar compra
                </button>
            </div>
        </form>
    );
}
