//File: frontend/components/collections/CollectionHero.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import type { CatalogResponse } from "@/src/schemas/catalog";

interface Props {
    context: CatalogResponse["context"];
}

export default function CollectionHero({ context }: Props) {
    const { collectionName, collectionDesc, collectionImage, collectionColor, collectionIcon } = context;
    const hasImage = Boolean(collectionImage);
    
    // Nueva lógica: Determinar si el fondo es oscuro para saber qué color de texto usar
    // Si no hay imagen, el texto debe ser oscuro sobre fondos claros. 
    const textColorClass = hasImage ? "text-white" : "text-foreground";
    const subtextColorClass = hasImage ? "text-white/80" : "text-muted-foreground";

    return (
        <div className="relative w-full overflow-hidden" style={{ minHeight: "220px" }}>
            {hasImage ? (
                <Image
                    src={collectionImage!}
                    alt={collectionName ?? "Colección"}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
            ) : (
                <div 
                    className="absolute inset-0" 
                    style={{ backgroundColor: collectionColor || "#f4f4f5" }} 
                />
            )}

            {hasImage && <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />}

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col justify-end gap-2" style={{ minHeight: "220px" }}>
                <nav className={`flex items-center gap-1.5 text-xs ${hasImage ? "text-white/70" : "text-muted-foreground"}`}>
                    <Link href="/" className="hover:text-action-cta transition-colors">Inicio</Link> / 
                    <Link href="/colecciones" className="hover:text-action-cta transition-colors">Colecciones</Link> / 
                    <span className={`font-medium ${textColorClass}`}>{collectionName}</span>
                </nav>
                
                <div className="flex items-center gap-3">
                    {collectionIcon && <span className="text-4xl">{collectionIcon}</span>}
                    <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${textColorClass}`}>
                        {collectionName}
                    </h1>
                </div>
                {collectionDesc && <p className={`max-w-xl text-sm md:text-base ${subtextColorClass}`}>{collectionDesc}</p>}
            </div>
        </div>
    );
}