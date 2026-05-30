// File: frontend/components/admin/products/ProductsTable.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";

import type { ProductsAPIResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas/category.schema";
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
        <div className="w-full h-full text-foreground">
            <div className="flex justify-end mb-2 pr-1">
                <button
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-muted-foreground hover:text-action-cta transition-colors outline-none cursor-pointer"
                >
                    Limpiar filtros
                </button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-full">
                            <Input
                                placeholder="Nombre"
                                value={nameFilter.value}
                                onChange={(e) => nameFilter.setValue(e.target.value)}
                            />
                        </TableHead>
                        <TableHead className="w-full">
                            <Input
                                placeholder="SKU"
                                value={skuFilter.value}
                                onChange={(e) => skuFilter.setValue(e.target.value)}
                            />
                        </TableHead>
                        <TableHead className="w-[90px]">
                            <Select
                                value={priceSort.value || undefined}
                                onValueChange={priceSort.setValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Precio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Asc</SelectItem>
                                    <SelectItem value="desc">Desc</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>
                        <TableHead className="w-[90px]">
                            <Select
                                value={stockSort.value || undefined}
                                onValueChange={stockSort.setValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Stock" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Asc</SelectItem>
                                    <SelectItem value="desc">Desc</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>
                        <TableHead className="w-[130px]">
                            <Select
                                value={brandFilter.value || undefined}
                                onValueChange={brandFilter.setValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((b) => (
                                        <SelectItem key={b._id} value={b._id}>
                                            {b.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableHead>
                        <TableHead className="w-[130px]">
                            <Select
                                value={categoryFilter.value || undefined}
                                onValueChange={categoryFilter.setValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c._id} value={c._id}>
                                            {c.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableHead>
                        <TableHead className="w-[60px]">
                            <Select
                                value={activeFilter.value || undefined}
                                onValueChange={activeFilter.setValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activos</SelectItem>
                                    <SelectItem value="false">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>


                        <TableHead className="w-[80px] text-center">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {noProducts ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                className="text-center py-8 text-muted-foreground font-semibold"
                            >
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.products.map((p) => (
                            <TableRow key={p._id}>
                                <TableCell className="font-bold">
                                    <Link
                                        href={`/admin/products/${p._id}`}
                                        className="flex gap-2.5 items-center focus-visible:outline-none focus-visible:text-action-cta"
                                    >
                                        {p.imagenes?.[0] ? (
                                            <div className="h-8 w-8 relative shrink-0 bg-background-secondary border border-border rounded-[var(--radius-sm)] overflow-hidden flex items-center justify-center p-0.5">
                                                <Image
                                                    src={p.imagenes[0]}
                                                    alt={p.nombre}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain mix-blend-multiply"
                                                    quality={60}
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background-secondary text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
                                                No img
                                            </div>
                                        )}
                                        <span className="line-clamp-2 max-w-[180px] leading-snug">
                                            {p.isFrontPage && (
                                                <span className="text-[10px] font-bold text-action-cta mr-1 tracking-wide">
                                                    [FRONT]
                                                </span>
                                            )}
                                            {p.nombre}
                                        </span>
                                    </Link>
                                </TableCell>

                                <TableCell className="font-mono text-muted-foreground">
                                    {p.sku}
                                </TableCell>

                                <TableCell className="font-bold">
                                    S/ {p.precio?.toFixed(2)}
                                </TableCell>

                                <TableCell className="font-bold">
                                    {p.stock}
                                </TableCell>

                                <TableCell className="text-muted-foreground">
                                    {p.brand?.nombre || "—"}
                                </TableCell>

                                <TableCell className="text-muted-foreground">
                                    —
                                </TableCell>

                                {/* Estado */}
                                <TableCell>
                                    <div className="flex justify-center">
                                        {p.isActive ? (
                                            <Check className="w-4 h-4 text-success" strokeWidth={3} />
                                        ) : (
                                            <X className="w-4 h-4 text-destructive" strokeWidth={3} />
                                        )}
                                    </div>
                                </TableCell>




                                {/* Acciones */}
                                <TableCell>
                                    <div className="flex justify-center">
                                        <ProductMenuAction productId={p._id} productSlug={p.slug} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}