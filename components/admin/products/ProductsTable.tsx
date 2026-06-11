"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
import { cn } from "@/lib/utils";

export default function ProductsTable({
    products,
    categories,
    brands,
}: {
    products: ProductsAPIResponse | null;
    categories: CategoryListResponse;
    brands: Brand[];
}) {
    const router = useRouter();

    const nameFilter = useColumnFilter("nombre");
    const skuFilter = useColumnFilter("sku");
    const sortFilter = useColumnFilter("sort");        // precio-asc | precio-desc | stock-asc | stock-desc
    const brandFilter = useColumnFilter("brand");
    const activeFilter = useColumnFilter("isActive");
    const categoryFilter = useColumnFilter("category");

    const noProducts = !products || products.products.length === 0;

    const clearFilters = () => {
        [nameFilter, skuFilter, sortFilter, brandFilter, activeFilter, categoryFilter]
            .forEach((f) => f.reset());
        router.replace(window.location.pathname);
    };

    return (
        <div className="w-full h-full flex flex-col text-foreground">

            {/* ── Filtros ── */}
            <div className="px-1 pt-1 pb-3 space-y-2 shrink-0">
                {/* Fila 1: nombre + sku */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Buscar por nombre…"
                        value={nameFilter.value}
                        onChange={(e) => nameFilter.setValue(e.target.value)}
                        className="flex-1 h-8 text-[13px]"
                    />
                    <Input
                        placeholder="SKU"
                        value={skuFilter.value}
                        onChange={(e) => skuFilter.setValue(e.target.value)}
                        className="w-[130px] h-8 text-[13px]"
                    />
                </div>

                {/* Fila 2: selects + limpiar */}
                <div className="flex flex-wrap gap-2 items-center">
                    <Select value={brandFilter.value || undefined} onValueChange={brandFilter.setValue}>
                        <SelectTrigger className="h-8 w-[130px] text-[13px]">
                            <SelectValue placeholder="Marca" />
                        </SelectTrigger>
                        <SelectContent>
                            {brands.map((b) => (
                                <SelectItem key={b._id} value={b._id}>{b.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter.value || undefined} onValueChange={categoryFilter.setValue}>
                        <SelectTrigger className="h-8 w-[140px] text-[13px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c._id} value={c._id}>{c.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={activeFilter.value || undefined} onValueChange={activeFilter.setValue}>
                        <SelectTrigger className="h-8 w-[120px] text-[13px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Activos</SelectItem>
                            <SelectItem value="false">Inactivos</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortFilter.value || undefined} onValueChange={sortFilter.setValue}>
                        <SelectTrigger className="h-8 w-[150px] text-[13px]">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="precio-asc">Precio ↑</SelectItem>
                            <SelectItem value="precio-desc">Precio ↓</SelectItem>
                            <SelectItem value="stock-asc">Stock ↑</SelectItem>
                            <SelectItem value="stock-desc">Stock ↓</SelectItem>
                        </SelectContent>
                    </Select>

                    <button
                        onClick={clearFilters}
                        className="ml-auto text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            {/* ── Tabla ── */}
            <div className="flex-1 min-h-0 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[44%] min-w-[220px] text-[11px] uppercase tracking-wider">
                                Producto
                            </TableHead>
                            <TableHead className="hidden sm:table-cell w-[13%] text-[11px] uppercase tracking-wider">
                                SKU
                            </TableHead>
                            <TableHead className="w-[9%] text-[11px] uppercase tracking-wider">
                                Precio
                            </TableHead>
                            <TableHead className="w-[8%] text-[11px] uppercase tracking-wider">
                                Stock
                            </TableHead>
                            <TableHead className="hidden md:table-cell w-[10%] text-[11px] uppercase tracking-wider">
                                Marca
                            </TableHead>
                            <TableHead className="hidden lg:table-cell w-[11%] text-[11px] uppercase tracking-wider">
                                Categoría
                            </TableHead>
                            <TableHead className="w-[9%] text-[11px] uppercase tracking-wider text-center">
                                Estado
                            </TableHead>
                            <TableHead className="w-[6%] text-center" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {noProducts ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="text-center py-14 text-muted-foreground text-[13px]"
                                >
                                    No se encontraron productos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.products.map((p) => (
                                <TableRow key={p._id} className="group">

                                    {/* Producto */}
                                    <TableCell className="py-2.5">
                                        <Link
                                            href={`/admin/products/${p._id}`}
                                            className="flex gap-2.5 items-center focus-visible:outline-none"
                                        >
                                            {/* Imagen */}
                                            {p.imagenes?.[0] ? (
                                                <div className="h-9 w-9 relative shrink-0 rounded-[var(--radius-sm)] border border-border bg-background-secondary overflow-hidden flex items-center justify-center p-0.5">
                                                    <Image
                                                        src={p.imagenes[0]}
                                                        alt={p.nombre}
                                                        width={36}
                                                        height={36}
                                                        className="object-contain mix-blend-multiply"
                                                        quality={60}
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background-secondary text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
                                                    No img
                                                </div>
                                            )}

                                            {/* Nombre */}
                                            <span className="line-clamp-2 leading-snug text-[13px] font-medium group-hover:text-action-cta transition-colors">
                                                {p.isFrontPage && (
                                                    <span className="text-[10px] font-semibold text-action-cta mr-1 tracking-wide">
                                                        [FRONT]
                                                    </span>
                                                )}
                                                {p.nombre}
                                            </span>
                                        </Link>
                                    </TableCell>

                                    {/* SKU */}
                                    <TableCell className="hidden sm:table-cell py-2.5">
                                        <span className="font-mono text-[12px] text-muted-foreground">
                                            {p.sku}
                                        </span>
                                    </TableCell>

                                    {/* Precio */}
                                    <TableCell className="py-2.5 tabular-nums text-[13px] font-medium whitespace-nowrap">
                                        S/ {p.precio?.toFixed(2)}
                                    </TableCell>

                                    {/* Stock */}
                                    <TableCell className="py-2.5">


                                        <span
                                            className={
                                                p.stock !== undefined
                                                    ? p.stock === 0
                                                        ? "font-bold text-destructive"
                                                        : p.stock <= 5
                                                            ? "font-bold text-warning"
                                                            : "font-bold"
                                                    : "font-bold"
                                            }
                                        >
                                            {p.stock !== undefined ? p.stock : "—"}
                                        </span>
                                    </TableCell>

                                    {/* Marca */}
                                    <TableCell className="hidden md:table-cell py-2.5 text-[13px] text-muted-foreground max-w-[110px] truncate">
                                        {p.brand?.nombre || "—"}
                                    </TableCell>

                                    {/* Categoría */}
                                    <TableCell className="hidden lg:table-cell py-2.5 text-[13px] text-muted-foreground max-w-[120px] truncate">
                                        {"—"}
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell className="py-2.5">
                                        <div className="flex justify-center">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
                                                    p.isActive
                                                        ? "bg-success/10 text-success"
                                                        : "bg-destructive/10 text-destructive"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                                        p.isActive ? "bg-success" : "bg-destructive"
                                                    )}
                                                />
                                                {p.isActive ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell className="py-2.5">
                                        <div className="flex justify-center">
                                            <ProductMenuAction
                                                productId={p._id}
                                                productSlug={p.slug}
                                            />
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}