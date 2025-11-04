"use client";

import Link from "next/link";
import Image from "next/image";
import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import type { ProductsAPIResponse } from "@/src/schemas";

import {
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Check, X } from "lucide-react";

import { useRouter } from "next/navigation";

export default function ProductsTable({ products }: { products: ProductsAPIResponse | null }) {

    const router = useRouter();
    const nameFilter = useColumnFilter("nombre");
    const skuFilter = useColumnFilter("sku");
    const priceSort = useColumnFilter("precioSort");
    const stockSort = useColumnFilter("stockSort");
    const activeFilter = useColumnFilter("isActive");
    const nuevoFilter = useColumnFilter("esNuevo");
    const destacadoFilter = useColumnFilter("esDestacado");

    const noProducts = !products || products.products.length === 0;

    const clearFilters = () => {
    nameFilter.reset();
    skuFilter.reset();
    priceSort.reset();
    stockSort.reset();
    activeFilter.reset();
    nuevoFilter.reset();
    destacadoFilter.reset();

    // limpiar URL en una sola llamada
    router.replace(window.location.pathname);
  };

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex justify-end mb-2">
                <button
                    onClick={clearFilters}
                    className="ml-2 text-xs hover:underline"
                >
                    Limpiar filtros
                </button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead className="min-w-[160px]">
                            <Input
                                placeholder="Nombre"
                                value={nameFilter.value}
                                onChange={(e) => nameFilter.setValue(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </TableHead>

                        <TableHead className="hidden md:table-cell max-w-[100px]">
                            <Input
                                placeholder="SKU"
                                value={skuFilter.value}
                                onChange={(e) => skuFilter.setValue(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </TableHead>

                        <TableHead className="hidden md:table-cell text-center">
                            <Select value={priceSort.value || undefined} onValueChange={priceSort.setValue}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Precio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Asc</SelectItem>
                                    <SelectItem value="desc">Desc</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        <TableHead className="text-center">
                            <Select value={stockSort.value || undefined} onValueChange={stockSort.setValue}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Stock" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Asc</SelectItem>
                                    <SelectItem value="desc">Desc</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        <TableHead className="text-center hidden sm:table-cell">
                            <Select value={activeFilter.value || undefined} onValueChange={activeFilter.setValue}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activos</SelectItem>
                                    <SelectItem value="false">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        <TableHead className="text-center hidden sm:table-cell">
                            <Select value={nuevoFilter.value || undefined} onValueChange={nuevoFilter.setValue}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Nuevo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Sí</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        <TableHead className="hidden md:table-cell text-center">
                            <Select value={destacadoFilter.value || undefined} onValueChange={destacadoFilter.setValue}>
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Destacado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Sí</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        <TableHead className="text-right text-xs">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {noProducts ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-6">
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.products.map((product) => (
                            <TableRow key={product._id} className="text-xs">
                                <TableCell className="whitespace-nowrap">
                                    <Link href={`/admin/products/${product._id}`} className="flex items-center gap-2">
                                        {product.imagenes?.[0] ? (
                                            <Image
                                                src={product.imagenes[0]}
                                                alt={product.nombre}
                                                width={36}
                                                height={36}
                                                className="rounded border bg-muted object-cover"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 bg-muted rounded" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="truncate md:max-w-[300px]">{product.nombre}</span>
                                            <span className="md:hidden text-muted-foreground text-[11px]">
                                                S/ {product.precio?.toFixed(2)} · Stock: {product.stock}
                                            </span>
                                        </div>
                                    </Link>
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-muted-foreground">{product.sku}</TableCell>
                                <TableCell className="hidden md:table-cell">S/{product.precio?.toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>

                                <TableCell className="hidden sm:table-cell text-center">
                                    {product.isActive ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                                </TableCell>

                                <TableCell className="hidden sm:table-cell text-center">
                                    {product.esNuevo ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-center">
                                    {product.esDestacado ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                                </TableCell>

                                <TableCell className="text-right">
                                    <ProductMenuAction productId={product._id} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
