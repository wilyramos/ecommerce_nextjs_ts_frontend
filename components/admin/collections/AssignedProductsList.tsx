"use client";

import { useTransition } from "react";
import { removeProductFromCollectionAction } from "@/src/actions/collection-action";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CollectionProduct } from "@/src/schemas/collection.schema";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
    products: CollectionProduct[];
    collectionId: string;
    slug: string;
}

export default function AssignedProductsList({ products, collectionId, slug }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = (productId: string) => {
        startTransition(async () => {
            const result = await removeProductFromCollectionAction(collectionId, slug, productId);
            if (result.success) {
                toast.success("Producto desvinculado con éxito");
            } else {
                toast.error(result.error || "Error al desvincular");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Productos Vinculados ({products.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border/40 max-h-[600px] overflow-y-auto">
                    {products.length === 0 ? (
                        <div className="p-8 text-center text-xs text-muted-foreground font-medium">
                            No hay productos asignados a esta colección todavía.
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="p-4 flex items-center justify-between hover:bg-background-secondary/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {/* Imagen usando la propiedad 'imagenes' del modelo */}
                                    <div className="w-10 h-10 rounded-sm border border-border/40 overflow-hidden relative shrink-0">
                                        <Image 
                                            src={product.imagenes?.[0] || "/placeholder.png"} 
                                            alt={product.nombre} 
                                            fill 
                                            className="object-cover" 
                                            unoptimized 
                                        />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-foreground">{product.nombre}</p>
                                        <p className="text-muted-foreground">S/ {product.precio.toFixed(2)}</p>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] h-8 font-bold uppercase tracking-wider text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemove(product._id)}
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Remover"}
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}