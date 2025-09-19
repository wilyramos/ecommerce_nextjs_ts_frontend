"use client";

import { Brand } from "@/src/services/brands";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BrandDialog from "./BrandDialog";
import Image from "next/image";

export default function BrandTable({
    brands,
}: {
    brands: Brand[];
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {brands.map((b) => (
                    <TableRow key={b._id}>
                        <TableCell>
                            {b.logo ? (
                               <Image
                                   src={b.logo}
                                   alt={b.nombre}
                                   width={100}
                                   height={100}
                                   className="h-10 w-10 object-contain"
                               />
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
                        </TableCell>
                        <TableCell>{b.nombre}</TableCell>
                        <TableCell>{b.slug}</TableCell>
                        <TableCell>
                            <Badge variant={b.isActive ? "default" : "destructive"}>
                                {b.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <BrandDialog
                                brand={b}
                                trigger={<Button size="sm" variant="outline">Editar</Button>}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
