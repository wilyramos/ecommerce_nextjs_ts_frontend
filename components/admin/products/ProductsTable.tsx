"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

import ProductMenuAction from "./ProductMenuActionts";
import { useColumnFilter } from "@/hooks/useColumnFilter";
import type { ProductsAPIResponse } from "@/src/schemas";

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
import { Brand } from "@/src/services/brands";
import type { CategoryListResponse } from "@/src/schemas";


export default function ProductsTable({
    products,
    categories,
    brands,
}: {
    products: ProductsAPIResponse | null;
    categories: CategoryListResponse;
    brands: Brand[]; // Replace BrandType with the actual type
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
        <div className="w-full overflow-x-auto">
            <div className="flex justify-start my-2">
                <button
                    onClick={clearFilters}
                    className="ml-2 text-xs hover:underline cursor-pointer"
                >
                    Limpiar filtros
                </button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        {/* Nombre */}
                        <TableHead className="min-w-[180px] p-0">
                            <Input
                                placeholder="Nombre"
                                value={nameFilter.value}
                                onChange={(e) => nameFilter.setValue(e.target.value)}
                                className="h-8 text-xs rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                            />
                        </TableHead>

                        {/* SKU */}
                        <TableHead className="hidden md:table-cell min-w-[120px] p-0">
                            <Input
                                placeholder="SKU"
                                value={skuFilter.value}
                                onChange={(e) => skuFilter.setValue(e.target.value)}
                                className="h-8 text-xs rounded-none border border-border border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </TableHead>

                        {/* Precio */}
                        <TableHead className="text-center min-w-[100px] p-0">
                            <Select
                                value={priceSort.value || undefined}
                                onValueChange={priceSort.setValue}
                            >
                                <SelectTrigger className=" text-xs  focus-visible:ring-0 focus-visible:ring-offset-0 w-full h-8 rounded-none">
                                    <SelectValue placeholder="Precio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Asc</SelectItem>
                                    <SelectItem value="desc">Desc</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        {/* Stock */}
                        <TableHead className="text-center min-w-[90px] p-0">
                            <Select
                                value={stockSort.value || undefined}
                                onValueChange={stockSort.setValue}
                            >
                                <SelectTrigger className="h-8 text-xs rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full">
                                    <SelectValue placeholder="Stock" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Asc</SelectItem>
                                    <SelectItem value="desc">Desc</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        {/* Marca */}
                        <TableHead className="text-center min-w-[130px] p-0">
                            <Select
                                value={brandFilter.value || undefined}
                                onValueChange={brandFilter.setValue}
                            >
                                <SelectTrigger className="h-8 text-xs rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full">
                                    <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableHead>

                        <TableHead className="text-center min-w-[130px] p-0">
                            <Select
                                value={categoryFilter.value || undefined}
                                onValueChange={categoryFilter.setValue}
                            >
                                <SelectTrigger className="h-8 text-xs rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 w-full">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category._id} value={category._id}>
                                            {category.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableHead>

                        {/* Estado */}
                        <TableHead className="text-center hidden sm:table-cell min-w-[110px] p-0">
                            <Select
                                value={activeFilter.value || undefined}
                                onValueChange={activeFilter.setValue}
                            >
                                <SelectTrigger className="h-8 text-xs rounded-none border border-border border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activos</SelectItem>
                                    <SelectItem value="false">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        {/* Nuevo */}
                        <TableHead className="text-center hidden sm:table-cell min-w-[100px] p-0">
                            <Select
                                value={nuevoFilter.value || undefined}
                                onValueChange={nuevoFilter.setValue}
                            >
                                <SelectTrigger className="h-8 text-xs rounded-none border border-border border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                    <SelectValue placeholder="Nuevo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Sí</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        {/* Destacado */}
                        <TableHead className="text-center hidden md:table-cell min-w-[120px] p-0">
                            <Select
                                value={destacadoFilter.value || undefined}
                                onValueChange={destacadoFilter.setValue}
                            >
                                <SelectTrigger className="h-8 text-xs rounded-none border border-border border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                    <SelectValue placeholder="Destacado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Sí</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableHead>

                        {/* Acciones */}
                        <TableHead className="text-right text-xs min-w-[80px] border border-border">
                            Acciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {noProducts ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-6">
                                No se encontraron productos.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.products.map((product) => (
                            <TableRow key={product._id} className="text-xs">
                                <TableCell className="whitespace-nowrap">
                                    <Link
                                        href={`/admin/products/${product._id}`}
                                        className="flex items-center gap-2"
                                    >
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
                                            <span className="truncate md:max-w-[300px]">
                                                {product.nombre}
                                            </span>
                                            <span className="md:hidden text-muted-foreground text-[11px]">
                                                S/ {product.precio?.toFixed(2)} · Stock: {product.stock}
                                            </span>
                                        </div>
                                    </Link>
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                    {product.sku}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    S/{product.precio?.toFixed(2)}
                                </TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.brand?.nombre || "-"}</TableCell>
                                <TableCell>{ "-"}</TableCell>

                                <TableCell className="hidden sm:table-cell text-center">
                                    {product.isActive ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-600" />
                                    )}
                                </TableCell>

                                <TableCell className="hidden sm:table-cell text-center">
                                    {product.esNuevo ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-600" />
                                    )}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-center">
                                    {product.esDestacado ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-600" />
                                    )}
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
