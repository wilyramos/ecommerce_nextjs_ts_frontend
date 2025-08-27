"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseAction } from "@/actions/pos/add-purchase-action";
import { toast } from "sonner";
import { usePurchaseStore, PurchaseItem } from "@/src/store/purchaseStore";
import Image from "next/image";
import { MdDelete } from "react-icons/md";

export default function NewPurchaseForm() {
    const router = useRouter();
    const [state, dispatch] = useActionState(createPurchaseAction, {
        errors: [],
        success: "",
    });

    const [supplier, setSupplier] = useState("");

    const items = usePurchaseStore((state) => state.items);
    const updateItem = usePurchaseStore((state) => state.updateItem);
    const removeItem = usePurchaseStore((state) => state.removeItem);
    const clearItems = usePurchaseStore((state) => state.clearItems);

    const total = items.reduce((acc, item) => acc + item.total, 0).toFixed(2);

    useEffect(() => {
        if (state.success) {
            clearItems();
            toast.success(state.success);
        }
        if (state.errors) {
            state.errors.forEach((error) => toast.error(error));
        }
    }, [state, router, clearItems]);

    const handleItemChange = (
        item: PurchaseItem,
        field: "cantidad" | "costo" | "total",
        value: number
    ) => {
        let newQuantity = item.cantidad;
        let newCosto = item.costo;

        if (field === "cantidad") newQuantity = value > 0 ? value : 0;
        if (field === "costo") newCosto = value >= 0 ? value : 0;
        if (field === "total") {
            const newTotal = value >= 0 ? value : 0;
            newCosto = newQuantity > 0 ? newTotal / newQuantity : 0;
        }
        updateItem(item.productId, newQuantity, newCosto);
    };

    return (
        <form
            noValidate
            action={dispatch}
            className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl py-10 px-4"
        >
            {/* Hidden inputs */}
            <input type="hidden" name="supplier" value={supplier} />
            <input type="hidden" name="total" value={total} />
            <input type="hidden" name="items" value={JSON.stringify(items)} />

            <div className="space-y-4">
                {/* Encabezado tipo comprobante */}
                <div className="border-b pb-4">
                    <h1 className="text-xl font-bold text-center uppercase tracking-wide">
                        Comprobante de Compra
                    </h1>
                    <p className="text-center text-sm text-gray-500">
                        (Factura / Boleta)
                    </p>
                </div>

                {/* Tabla de productos */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse  text-sm">
                        <thead className="bg-sky-100">
                            <tr className="">
                                <th className=" px-2 py-1 text-left roun">#</th>
                                <th className=" px-2 py-1 text-left">Producto</th>
                                <th className=" px-2 py-1 text-center">Cantidad</th>
                                <th className=" px-2 py-1 text-center">Costo U.</th>
                                <th className=" px-2 py-1 text-center">Total</th>
                                <th className=" px-2 py-1 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item, i) => (
                                    <tr key={item.productId} className="hover:bg-gray-50 border-b-1 border-slate-200">
                                        <td className=" px-2 py-1">{i + 1}</td>
                                        <td className=" px-2 py-1 flex items-center gap-2">
                                            {item.imagen ? (
                                                <Image
                                                    src={item.imagen}
                                                    alt={item.nombre}
                                                    width={30}
                                                    height={30}
                                                    className="rounded"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                    N/A
                                                </div>
                                            )}
                                            <span className="font-medium">{item.nombre}</span>
                                        </td>
                                        <td className=" px-2 py-1 text-center">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.cantidad}
                                                onChange={(e) =>
                                                    handleItemChange(item, "cantidad", Number(e.target.value))
                                                }
                                                className="w-16 border rounded px-1 py-0.5 text-center"
                                            />
                                        </td>
                                        <td className=" px-2 py-1 text-center">
                                            <input
                                                type="number"
                                                value={item.costo || ""}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.productId,
                                                        item.cantidad,
                                                        Number(e.target.value) || 0
                                                    )
                                                }
                                                placeholder="0.00"
                                                className="w-20 border rounded px-1 py-0.5 text-center"
                                            />
                                        </td>
                                        <td className=" px-2 py-1 text-center">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.total || ""}
                                                onChange={(e) =>
                                                    handleItemChange(item, "total", Number(e.target.value))
                                                }
                                                placeholder="0.00"
                                                className="w-24 border rounded px-1 py-0.5 text-center"
                                            />
                                        </td>
                                        <td className=" px-2 py-1 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.productId)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <MdDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className=" px-2 py-6 text-center text-gray-400 italic"
                                    >
                                        No hay productos agregados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Total general */}
                <div className="flex justify-end">
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Importe Total</p>
                        <p className="text-2xl font-bold text-gray-800">S/ {total}</p>
                    </div>
                </div>

                {/* Proveedor */}
                <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proveedor
                    </label>
                    <input
                        type="text"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="Ingrese nombre o razón social del proveedor"
                        className="w-full border rounded-lg px-3 py-2 "
                    />
                </div>

                {/* Botón guardar */}
                {items.length > 0 && (
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition font-medium"
                        >
                            Guardar compra
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}
