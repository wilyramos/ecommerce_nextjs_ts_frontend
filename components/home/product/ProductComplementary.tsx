"use client";

import Link from 'next/link';
import Image from 'next/image';
import { H4, P } from '@/components/ui/TypographyV3';
import { ChevronRight } from 'lucide-react';

// Se crea una interfaz específica para el objeto esperado
interface CompProduct {
  _id: string;
  nombre: string;
  slug: string;
  precio: number;
  imagenes?: string[];
}

type ProductComplementaryProps = {
  // Aceptamos el tipo mixto que viene de MongoDB (string o populado)
  complementarios?: string[] | CompProduct[];
};

export default function ProductComplementary({ complementarios }: ProductComplementaryProps) {
  // Filtrado defensivo y aserción de tipo para garantizar que solo renderizamos objetos populados
  const validComplements = (complementarios ?? []).filter(
    (comp): comp is CompProduct => typeof comp === 'object' && comp !== null && '_id' in comp && 'nombre' in comp
  );

  if (validComplements.length === 0) return null;

  return (
    <section className="mt-6 border-t border-border-primary/80 pt-6 select-none">
      <div className="space-y-4">
        <H4 className="text-xs font-semibold uppercase">
          Completa tu compra
        </H4>

        <div className="flex flex-col gap-2.5">
          {validComplements.map((comp) => {
            const mainImage = comp.imagenes?.[0] || "/logoapp.svg";

            return (
              <Link
                key={comp._id}
                href={`/productos/${comp.slug}`}
                className="group flex items-center justify-between gap-3 rounded-radius-md border border-border-primary/80 bg-surface-primary p-2.5 outline-none transition-all duration-fast hover:border-brand-accent hover:shadow-xs focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* Contenedor de Imagen */}
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-radius-sm border border-border-primary/50 bg-surface-secondary/50 p-1">
                    <Image
                      src={mainImage}
                      alt={comp.nombre}
                      fill
                      className="object-contain p-1 transition-transform duration-normal group-hover:scale-105"
                      sizes="48px"
                      unoptimized
                    />
                  </div>

                  {/* Información del Producto */}
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-xs font-medium text-text-primary transition-colors duration-fast group-hover:text-brand-accent">
                      {comp.nombre}
                    </p>
                    <P className="text-[11px] font-semibold text-text-secondary select-all">
                      S/ {comp.precio.toFixed(2)}
                    </P>
                  </div>
                </div>

                {/* Indicador de Acción */}
                <div className="shrink-0 text-text-tertiary transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-brand-accent">
                  <ChevronRight size={16} strokeWidth={2} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}