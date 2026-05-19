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
        <div className="w-full h-full select-none bg-background text-foreground">
            <div className="flex justify-end mb-2 pr-1">
                <button
                    onClick={clearFilters}
                    className="text-[11px] font-bold text-muted-foreground hover:text-action-cta transition-colors outline-none"
                >
                    Limpiar filtros
                </button>
            </div>

            <Table className="w-full text-start border-collapse text-xs md:text-sm">
                <TableHeader className="bg-background-secondary sticky top-0 z-10 border-b border-border">
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
                                className="p-1 text-center font-bold text-foreground align-middle"
                            >
                                {i === 0 && (
                                    <Input
                                        placeholder="Nombre"
                                        value={nameFilter.value}
                                        onChange={(e) => nameFilter.setValue(e.target.value)}
                                        className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground placeholder-muted-foreground/50 focus:border-muted-foreground/60 transition-colors outline-none"
                                    />
                                )}
                                {i === 1 && (
                                    <Input
                                        placeholder="SKU"
                                        value={skuFilter.value}
                                        onChange={(e) => skuFilter.setValue(e.target.value)}
                                        className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground placeholder-muted-foreground/50 focus:border-muted-foreground/60 transition-colors outline-none"
                                    />
                                )}
                                {i === 2 && (
                                    <Select
                                        value={priceSort.value || undefined}
                                        onValueChange={priceSort.setValue}
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Precio" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border border-border rounded-sm text-foreground">
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
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Stock" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border border-border rounded-sm text-foreground">
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
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Marca" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-auto bg-background border border-border rounded-sm text-foreground">
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
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-auto bg-background border border-border rounded-sm text-foreground">
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
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border border-border rounded-sm text-foreground">
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
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Nuevo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border border-border rounded-sm text-foreground">
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
                                        <SelectTrigger className="h-8 text-xs bg-background border border-border/60 rounded-sm px-2 text-foreground outline-none">
                                            <SelectValue placeholder="Destacado" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border border-border rounded-sm text-foreground">
                                            <SelectItem value="true">Sí</SelectItem>
                                            <SelectItem value="false">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </TableHead>
                        ))}

                        <TableHead className="p-1 text-center font-bold text-foreground align-middle w-[80px]">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-border/40">
                    {noProducts ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                className="text-center py-8 text-muted-foreground font-medium"
                            >
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.products.map((p) => (
                            <TableRow
                                key={p._id}
                                className="hover:bg-background-secondary/60 transition-colors"
                            >
                                <TableCell className="p-3 w-[230px] font-medium text-foreground">
                                    <Link
                                        href={`/admin/products/${p._id}`}
                                        className="flex flex-col md:flex-row gap-2.5 items-center outline-none"
                                    >
                                        {p.imagenes?.[0] ? (
                                            <div className="h-8 w-8 relative flex-shrink-0 bg-background-secondary border border-border/40 rounded-sm overflow-hidden flex items-center justify-center p-0.5">
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
                                            <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-sm border border-border/40 bg-background-secondary text-muted-foreground/50 text-[9px] font-bold uppercase tracking-wider">
                                                No img
                                            </div>
                                        )}
                                        <span className="line-clamp-2 max-w-[180px] text-foreground leading-snug">
                                            {p.isFrontPage && (
                                                <span className="text-[10px] font-bold text-action-cta mr-1 tracking-wide">
                                                    [FRONT]
                                                </span>
                                            )}
                                            {p.nombre}
                                        </span>
                                    </Link>
                                </TableCell>

                                <TableCell className="p-3 text-center w-[120px] font-mono font-medium text-muted-foreground">
                                    {p.sku}
                                </TableCell>

                                <TableCell className="p-3 text-center w-[90px] font-semibold text-foreground">
                                    S/ {p.precio?.toFixed(2)}
                                </TableCell>

                                <TableCell className="p-3 text-center w-[90px] font-semibold text-foreground">
                                    {p.stock}
                                </TableCell>

                                <TableCell className="p-3 text-center w-[130px] font-medium text-muted-foreground">
                                    {p.brand?.nombre || "—"}
                                </TableCell>

                                <TableCell className="p-3 text-center w-[130px] font-medium text-muted-foreground">
                                    —
                                </TableCell>

                                {/* Estado */}
                                <TableCell className="p-3 text-center w-[60px]">
                                    <div className="flex justify-center">
                                        {p.isActive ? (
                                            <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                                        ) : (
                                            <X className="w-4 h-4 text-destructive" strokeWidth={2.5} />
                                        )}
                                    </div>
                                </TableCell>

                                {/* Nuevo */}
                                <TableCell className="p-3 text-center w-[60px]">
                                    <div className="flex justify-center">
                                        {p.esNuevo ? (
                                            <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                                        ) : (
                                            <X className="w-4 h-4 text-destructive" strokeWidth={2.5} />
                                        )}
                                    </div>
                                </TableCell>

                                {/* Destacado */}
                                <TableCell className="p-3 text-center w-[60px]">
                                    <div className="flex justify-center">
                                        {p.esDestacado ? (
                                            <Check className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                                        ) : (
                                            <X className="w-4 h-4 text-destructive" strokeWidth={2.5} />
                                        )}
                                    </div>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell className="p-3 text-center w-[80px]">
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