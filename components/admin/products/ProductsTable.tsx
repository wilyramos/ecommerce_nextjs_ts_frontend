// Neutral palette applied version of ProductsTable
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";

import type { ProductsAPIResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";
import { Brand } from "@/src/services/brands";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function ProductsTable({ products, categories, brands }: {
    products: ProductsAPIResponse | null;
    categories: CategoryListResponse;
    brands: Brand[];
}) {
    const router = useRouter();

    const nameFilter = useColumnFilter("nombre");
    const skuFilter = useColumnFilter("sku");
    const priceSort = useColumnFilter("precioSort");
    const stockSort = useColumnFilter("stockSort");
    const brandFilter = useColumnFilter("brand");
    const activeFilter = useColumnFilter("isActive");
    const nuevoFilter = useColumnFilter("esNuevo");
    const destacadoFilter = useColumnFilter("esDestacado");
    const categoryFilter = useColumnFilter("category");

    const noProducts = !products || products.products.length === 0;

    const clearFilters = () => {
        [
            nameFilter,
            skuFilter,
            priceSort,
            stockSort,
            brandFilter,
            activeFilter,
            nuevoFilter,
            destacadoFilter,
            categoryFilter,
        ].forEach((f) => f.reset());

        router.replace(window.location.pathname);
    };

    return (
        <div className="w-full overflow-x-auto pb-2 text-xs text-zinc-600 bg-gray-50">
            <div className="flex justify-end my-1 pr-1">
                <button
                    onClick={clearFilters}
                    className="text-[11px] font-semibold text-zinc-600 hover:text-black"
                >
                    Limpiar filtros
                </button>
            </div>

            <Table className="min-w-full table-auto border-separate border-spacing-0 text-zinc-600">
                <TableHeader className="bg-gray-50 border-b sticky top-0 shadow-sm">
                    <TableRow>
                        {[
                            nameFilter,
                            skuFilter,
                            priceSort,
                            stockSort,
                            brandFilter,
                            categoryFilter,
                            activeFilter,
                            nuevoFilter,
                            destacadoFilter,
                        ].map((filter, i) => (
                            <TableHead
                                key={i}
                                className="p-1 text-center bg-gray-50 text-zinc-600"
                            >
                                {i === 0 && (
                                    <Input
                                        placeholder="Nombre"
                                        value={nameFilter.value}
                                        onChange={(e) => nameFilter.setValue(e.target.value)}
                                        className="h-8 text-xs focus:border-black bg-gray-50 text-black placeholder:text-zinc-400"
                                    />
                                )}
                                {i === 1 && (
                                    <Input
                                        placeholder="SKU"
                                        value={skuFilter.value}
                                        onChange={(e) => skuFilter.setValue(e.target.value)}
                                        className="h-8 text-xs focus:border-black bg-gray-50 text-black placeholder:text-zinc-400"
                                    />
                                )}
                                {i === 2 && (
                                    <Select
                                        value={priceSort.value || undefined}
                                        onValueChange={priceSort.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Precio" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="asc">Asc</SelectItem>
                                            <SelectItem value="desc">Desc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 3 && (
                                    <Select
                                        value={stockSort.value || undefined}
                                        onValueChange={stockSort.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Stock" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="asc">Asc</SelectItem>
                                            <SelectItem value="desc">Desc</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 4 && (
                                    <Select
                                        value={brandFilter.value || undefined}
                                        onValueChange={brandFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Marca" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-auto bg-gray-50 text-black">
                                            {brands.map((b) => (
                                                <SelectItem key={b._id} value={b._id}>
                                                    {b.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 5 && (
                                    <Select
                                        value={categoryFilter.value || undefined}
                                        onValueChange={categoryFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-auto bg-gray-50 text-black">
                                            {categories.map((c) => (
                                                <SelectItem key={c._id} value={c._id}>
                                                    {c.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 6 && (
                                    <Select
                                        value={activeFilter.value || undefined}
                                        onValueChange={activeFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="true">Activos</SelectItem>
                                            <SelectItem value="false">Inactivos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 7 && (
                                    <Select
                                        value={nuevoFilter.value || undefined}
                                        onValueChange={nuevoFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Nuevo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="true">Sí</SelectItem>
                                            <SelectItem value="false">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                {i === 8 && (
                                    <Select
                                        value={destacadoFilter.value || undefined}
                                        onValueChange={destacadoFilter.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-gray-50 text-black">
                                            <SelectValue placeholder="Destacado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-50 text-black">
                                            <SelectItem value="true">Sí</SelectItem>
                                            <SelectItem value="false">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </TableHead>
                        ))}

                        <TableHead className="p-1 text-xs w-[80px] text-zinc-600 bg-gray-50">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {noProducts ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                className="text-center py-6 text-sm text-zinc-600"
                            >
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.products.map((p) => (
                            <TableRow
                                key={p._id}
                                className="text-xs border-b hover:bg-gray-50"
                            >
                                <TableCell className="p-2 w-[230px] text-black">
                                    <Link
                                        href={`/admin/products/${p._id}`}
                                        className="flex flex-col md:flex-row gap-1"
                                    >
                                        {p.imagenes?.[0] ? (
                                            <div className="h-8 w-8">
                                                <Image
                                                    src={p.imagenes[0]}
                                                    alt={p.nombre}
                                                    width={30}
                                                    height={30}
                                                    className="rounded border bg-gray-50 object-cover"
                                                    quality={1}
                                                />
                                            </div>
                                        ) : (
                                            <div className="
                                                h-8 w-8 flex items-center justify-center rounded border bg-gray-100 text-zinc-400 text-[10px]
                                            ">
                                                no image
                                            </div>
                                        )}
                                        <span className="line-clamp-3 max-w-[180px] text-black">
                                            {p.isFrontPage && (<span className="italic mr-1 text-orange-400 font-bold">[FrontPage]</span>)}{p.nombre}
                                        </span>
                                    </Link>
                                </TableCell>

                                <TableCell className="p-2 text-center w-[120px] text-zinc-600">
                                    {p.sku}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[90px] text-black">
                                    S/{p.precio?.toFixed(2)}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[90px] text-black">
                                    {p.stock}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[130px] text-zinc-600">
                                    {p.brand?.nombre || "-"}
                                </TableCell>

                                <TableCell className="p-2 text-center w-[130px] text-zinc-600">
                                    -
                                </TableCell>

                                {/* Estado */}
                                <TableCell className="p-2 text-center w-[60px]">
                                    {p.isActive ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-600" />
                                    )}
                                </TableCell>

                                {/* Nuevo */}
                                <TableCell className="p-2 text-center w-[60px]">
                                    {p.esNuevo ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-600" />
                                    )}
                                </TableCell>

                                {/* Destacado */}
                                <TableCell className="p-2 text-center w-[60px]">
                                    {p.esDestacado ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-600" />
                                    )}
                                </TableCell>

                                {/* Acciones */}
                                <TableCell className="p-2 text-center w-[80px]">
                                    <ProductMenuAction productId={p._id} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
