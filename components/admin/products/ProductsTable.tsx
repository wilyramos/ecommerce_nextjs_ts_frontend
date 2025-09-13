import type { ProductsAPIResponse } from "@/src/schemas";
import Link from "next/link";
import { Check, X, Star as StarIcon } from "lucide-react";
import ProductMenuAction from "./ProductMenuActionts";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

export default function ProductsTable({
    products,
}: {
    products?: ProductsAPIResponse | null;
}) {
    if (!products || products.products.length === 0) {
        return (
            <div className="p-6 text-center text-gray-600 text-sm">
                No se encontraron productos
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">SKU</TableHead>
                    <TableHead className="hidden md:table-cell">Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Activo</TableHead>
                    <TableHead className="text-center">Nuevo</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Destacado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {products.products.map((product) => (
                    <TableRow key={product._id}>
                        <TableCell>
                            <Link
                                href={`/admin/products/${product._id}`}
                                className="text-gray-600 hover:text-black font-medium"
                            >
                                {product.nombre}
                            </Link>
                        </TableCell>

                        <TableCell className="hidden md:table-cell uppercase text-gray-600">
                            {product.sku}
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-gray-600">
                            S/ {product.precio?.toFixed(2)}
                        </TableCell>

                        <TableCell className="text-gray-600">{product.stock}</TableCell>

                        <TableCell className="hidden md:table-cell text-center">
                            {product.isActive ? (
                                <Check className="h-4 w-4 mx-auto text-black" />
                            ) : (
                                <X className="h-4 w-4 mx-auto text-gray-600" />
                            )}
                        </TableCell>

                        <TableCell className="text-center">
                            {product.esNuevo ? (
                                <Check className="h-4 w-4 mx-auto text-black" />
                            ) : (
                                <X className="h-4 w-4 mx-auto text-gray-600" />
                            )}
                        </TableCell>

                        <TableCell className="hidden md:table-cell text-center">
                            {product.esDestacado ? (
                                <StarIcon className="h-4 w-4 mx-auto text-black fill-black" />
                            ) : (
                                <X className="h-4 w-4 mx-auto text-gray-600" />
                            )}
                        </TableCell>

                        <TableCell className="text-right">
                            <ProductMenuAction productId={product._id} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
