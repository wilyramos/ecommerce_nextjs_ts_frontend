import { getPurchase } from "@/src/services/purchases";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function PurchasePage({ params }: { params: Params }) {
    const { id } = await params;
    const purchase = await getPurchase(id);

    if (!purchase) {
        return (
            <div className="max-w-3xl mx-auto mt-10 text-center text-gray-500">
                Compra no encontrada
            </div>
        );
    }

    return (

        <main>

            <header className="flex items-center border-b pb-2 border-gray-300">
                <nav aria-label="Volver a compras">
                    <Link
                        href="/pos/compras"
                        className="flex items-center text-gray-600 hover:text-black"
                    >
                        <MdOutlineArrowBackIos className="mr-1" />
                        <span className="text-sm font-medium">Volver</span>
                    </Link>
                </nav>
                <h1 className="text-xl font-bold px-4">Detalles de la Compra</h1>
            </header>


            <div className="max-w-4xl mx-auto py-10 px-6">
                {/* Encabezado comprobante */}
                <div className="border-b pb-4 text-center space-y-1">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">
                        Comprobante de Compra
                    </h1>
                    <p className="text-sm text-gray-500">(Factura / Boleta)</p>
                    <p className="text-sm text-gray-600">
                        N° {purchase.numeroCompra?.toString().padStart(6, "0")}
                    </p>
                    <p className="text-xs text-gray-400">
                        Fecha:{" "}
                        {purchase.createdAt ? formatDate(purchase.createdAt) : "Sin fecha"}

                    </p>
                </div>

                {/* Proveedor */}
                <div className="mt-6">
                    <p className="text-sm text-gray-600">Proveedor:</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {purchase.proveedor}
                    </p>
                </div>

                {/* Tabla de productos */}
                <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-sky-100">
                            <tr>
                                <th className="px-2 py-1 text-left">#</th>
                                <th className="px-2 py-1 text-left">Producto</th>
                                <th className="px-2 py-1 text-center">Cantidad</th>
                                <th className="px-2 py-1 text-center">Costo U.</th>
                                <th className="px-2 py-1 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchase.items.map((item, i) => (
                                <tr
                                    key={item.productId?._id}
                                    className="border-b border-slate-200 hover:bg-gray-50"
                                >
                                    <td className="px-2 py-2">{i + 1}</td>
                                    <td className="px-2 py-2 flex items-center gap-2">
                                        {item?.productId?.imagenes?.length ? (
                                            <Image
                                                src={item.productId!.imagenes![0]}
                                                alt={item.productId?.nombre || "Sin nombre"}
                                                width={35}
                                                height={35}
                                                className="rounded"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                N/A
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-medium">{item.productId?.nombre}</p>
                                            <p className="text-xs text-gray-500">
                                                SKU: {item.productId?.sku}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Cod: {item.productId?.barcode}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        S/ {item.priceUnit.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-2 text-center font-semibold">
                                        S/ {item.totalPrice?.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totales */}
                <div className="flex justify-end mt-6">
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Importe Total</p>
                        <p className="text-2xl font-bold text-gray-800">
                            S/ {purchase.total?.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 border-t pt-4 text-xs text-gray-400 text-center">
                    <p>Este comprobante ha sido generado automáticamente</p>
                </div>
            </div>

        </main>
    );
}