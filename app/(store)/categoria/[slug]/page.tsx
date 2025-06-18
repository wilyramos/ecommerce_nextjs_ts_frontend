import { Suspense } from "react";
import type { Metadata } from "next";
import FiltrosPorCategoria from "@/components/home/categorias/FiltrosPorCategoria ";
import ListaProducts from "@/components/home/categorias/ListaProducts";
import OrdenarPor from "@/components/home/products/OrdenarPor";

type Params = Promise<{
  slug: string;
}>;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug).replace(/-/g, " ");

  return {
    title: `Productos en ${categoryName} - GoPhone`,
    description: `Explora nuestra amplia gama de productos en la categoría ${categoryName}. Encuentra lo mejor en tecnología y accesorios.`,
    keywords: [`productos`, `gophone`, categoryName, `comprar ${categoryName}`],
  };
}

export default async function pageCategoria({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const allParams = await searchParams;

  const {
    page,
    limit,
    priceRange,
    sort,
    compatibilidad,
    query,
    ...restAtributos
  } = allParams;

  const atributos: Record<string, string> = {};
  Object.entries(restAtributos).forEach(([key, value]) => {
    if (typeof value === "string") {
      atributos[key] = value;
    }
  });

  const limitNumber = limit ? parseInt(limit as string, 10) : 10;

  return (
    <main className="max-w-7xl mx-auto p-5">
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Filtros */}
        <div className="sm:col-span-1">
          <h2 className="text-lg font-semibold text-gray-500 mb-4 border-b pb-2">
            Filtros de la categoría
          </h2>
          <Suspense fallback={<div className="text-center text-gray-300 text-xs">Cargando filtros</div>}>
            <FiltrosPorCategoria categorySlug={slug} />
          </Suspense>
        </div>

        {/* Productos */}
        <section className="sm:col-span-3 space-y-4">
          {/* Ordenar por */}
          <div className="flex justify-end">
            <OrdenarPor pathname={`/categoria/${slug}`} />
          </div>

          <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando productos...</div>}>
            <ListaProducts
              category={slug}
              priceRange={priceRange as string}
              page={page as string}
              limit={limitNumber}
              sort={sort as string}
              compatibilidad={compatibilidad as string}
              query={query as string}
              atributos={atributos}
            />
          </Suspense>
        </section>
      </section>
    </main>
  );
}
