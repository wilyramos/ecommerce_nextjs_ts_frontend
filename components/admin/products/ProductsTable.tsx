//File: frontend/components/admin/products/ProductsTable.tsx

"use client";

import Link from "next/link";
import Image from "next/image";

import ProductMenuAction from "./ProductMenuActionts";
import type { TApiProduct } from "@/src/schemas";

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Props para ProductsTable
 * 
 * El componente solo recibe lo que necesita:
 * - products: array de productos a mostrar
 * 
 * No recibe categorías ni marcas porque esos datos
 * ya vienen en cada producto (brand, category)
 */
interface ProductsTableProps {
    products: TApiProduct[];
}

/**
 * ProductsTable
 * 
 * Tabla de administración de productos.
 * Muestra toda la información relevante de cada producto.
 * 
 * Características:
 * - Imagen del producto
 * - Nombre (clickeable, abre detalles)
 * - SKU
 * - Precio
 * - Stock (con colores según cantidad)
 * - Marca
 * - Categoría
 * - Estado (Activo/Inactivo)
 * - Menú de acciones (editar, duplicar, eliminar)
 * 
 * La tabla es responsiva:
 * - En mobile: muestra menos columnas
 * - En tablet: muestra más
 * - En desktop: muestra todo
 */
export default function ProductsTable({ products }: ProductsTableProps) {
    const noProducts = !products || products.length === 0;

    return (
        <div className="w-full h-full flex flex-col text-foreground border border-border/40 rounded-lg overflow-hidden bg-background">
            {/* Contenedor scrolleable para la tabla */}
            <div className="flex-1 min-h-0 overflow-auto">
                <Table>
                    {/* ═════════════════════════════════════════════════════════ */}
                    {/* ENCABEZADOS */}
                    {/* ═════════════════════════════════════════════════════════ */}
                    <TableHeader>
                        <TableRow className="hover:bg-transparent bg-muted/50 sticky top-0">
                            {/* Columna: Producto (Imagen + Nombre) */}
                            <TableHead className="w-[44%] min-w-[220px] text-[11px] ">
                                Producto
                            </TableHead>

                            {/* Columna: SKU (oculta en móvil) */}
                            <TableHead className="hidden sm:table-cell w-[13%] text-[11px] ">
                                SKU
                            </TableHead>

                            {/* Columna: Precio */}
                            <TableHead className="w-[9%] text-[11px] ">
                                Precio
                            </TableHead>

                            {/* Columna: Stock */}
                            <TableHead className="w-[8%] text-[11px] ">
                                Stock
                            </TableHead>

                            {/* Columna: Marca (oculta en tablet y abajo) */}
                            <TableHead className="hidden md:table-cell w-[10%] text-[11px] ">
                                Marca
                            </TableHead>

                            {/* Columna: Categoría (oculta en pantallas pequeñas) */}
                            <TableHead className="hidden lg:table-cell w-[11%] text-[11px] ">
                                Categoría
                            </TableHead>

                            {/* Columna: Estado */}
                            <TableHead className="w-[9%] text-[11px]  text-center">
                                Estado
                            </TableHead>

                            {/* Columna: Acciones */}
                            <TableHead className="w-[6%] text-center font-semibold" />
                        </TableRow>
                    </TableHeader>

                    {/* ═════════════════════════════════════════════════════════ */}
                    {/* CUERPO DE LA TABLA */}
                    {/* ═════════════════════════════════════════════════════════ */}
                    <TableBody>
                        {noProducts ? (
                            // Mensaje cuando no hay productos
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="text-center py-14 text-muted-foreground text-[13px]"
                                >
                                    No se encontraron productos.
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Renderizar cada producto
                            products.map((product) => (
                                <TableRow
                                    key={product._id}
                                    className="group hover:bg-muted/30 transition-colors"
                                >
                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Producto (Imagen + Nombre) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="py-2.5">
                                        <Link
                                            href={`/admin/products/${product._id}`}
                                            className="flex gap-2.5 items-center focus-visible:outline-none group-hover:opacity-80 transition-opacity"
                                        >
                                            {/* Imagen del Producto */}
                                            {product.imagenes?.[0] ? (
                                                <div className="h-9 w-9 relative shrink-0 rounded-[var(--radius-sm)] border border-border bg-background-secondary overflow-hidden flex items-center justify-center p-0.5">
                                                    <Image
                                                        src={product.imagenes[0]}
                                                        alt={product.nombre}
                                                        width={36}
                                                        height={36}
                                                        className="object-contain mix-blend-multiply"
                                                        quality={20}
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                // Placeholder si no hay imagen
                                                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background-secondary text-muted-foreground text-[9px] font-bold uppercase tracking-wider">
                                                    No img
                                                </div>
                                            )}

                                            {/* Nombre del Producto */}
                                            <div className="flex flex-col gap-0.5">


                                                {/* Nombre del producto */}
                                                <span className="line-clamp-2 leading-snug text-[13px] font-medium group-hover:text-action-cta transition-colors">
                                                    {product.nombre}
                                                </span>
                                            </div>
                                        </Link>
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: SKU (oculta en móvil) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="hidden sm:table-cell py-2.5">
                                        <code className="text-[12px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded ">
                                            {product.sku}
                                        </code>
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Precio */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="py-2.5 tabular-nums text-[13px] font-medium ">
                                        S/ {product.precio?.toFixed(2)}
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Stock (con colores según cantidad) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="py-2.5">
                                        <span
                                            className={cn(
                                                "inline-flex items-center justify-center w-10 h-6 text-[11px] ",
                                                product.stock === undefined
                                                    ? "bg-muted/15 text-muted-foreground"
                                                    : product.stock === 0
                                                        ? "bg-destructive/15 text-destructive "
                                                        : product.stock <= 5
                                                            ? "bg-warning/15 text-warning "
                                                            : "bg-success/15 text-success "
                                            )}
                                        >
                                            {product.stock !== undefined ? product.stock : "—"}
                                        </span>
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Marca (oculta en tablet y abajo) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="hidden md:table-cell py-2.5 text-[13px] text-muted-foreground max-w-[110px] truncate">
                                        {product.brand?.nombre || "—"}
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Categoría (oculta en pantallas pequeñas) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="hidden lg:table-cell py-2.5 text-[13px] text-muted-foreground max-w-[120px] truncate">
                                        {"—"}
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Estado (Activo/Inactivo) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="py-2.5">
                                        <div className="flex justify-center">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 text-[10px] px-1 rounded-full ",
                                                    product.isActive
                                                        ? "bg-success/15 text-success border border-success/30"
                                                        : "bg-destructive/15 text-destructive border border-destructive/30"
                                                )}
                                            >

                                                {/* Texto de estado */}
                                                {product.isActive ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* ───────────────────────────────────────── */}
                                    {/* CELDA: Acciones (Menú) */}
                                    {/* ───────────────────────────────────────── */}
                                    <TableCell className="py-2.5">
                                        <div className="flex justify-center">
                                            <ProductMenuAction
                                                productId={product._id}
                                                productSlug={product.slug}
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