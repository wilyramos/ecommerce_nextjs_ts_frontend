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
        title: `${categoryName} | en GoPhone`,
        description: `Descubre la mejor selección de ${categoryName} en GoPhone. Ofertas exclusivas, precios competitivos y envío rápido.`,
        keywords: [
            categoryName,
            `comprar ${categoryName}`,
            `${categoryName} cañete`,
            `${categoryName} precio`,
            "gophone",
            "accesorios",
            "tienda de tecnología",
            "ofertas en tecnología",
            "cañete",
            "san vicente",

        ],
        openGraph: {
            title: `${categoryName} | GoPhone`,
            description: `Explora nuestra colección de ${categoryName}. Encuentra productos de calidad, con garantía y envío rápido en GoPhone.`,
            type: "website",
            url: `https://gophone.pe/categoria/${slug}`,
            siteName: "GoPhone"
        },
        twitter: {
            card: "summary_large_image",
            title: `${categoryName} | GoPhone`,
            description: `Compra ${categoryName} en GoPhone. Calidad garantizada y envío rápido.`,
        },
        icons: {
            icon: "/logomini.svg",
            apple: "/logomini.svg",
        }
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

    const atributos: Record<string, string[]> = {};
    Object.entries(restAtributos).forEach(([key, value]) => {
        if (typeof value === "string") {
            atributos[key] = value.split(",").map(item => item.trim());
        }
    });

    const limitNumber = limit ? parseInt(limit as string, 10) : 10;

    return (

        <main className="max-w-7xl mx-auto p-5">
            <section className="grid grid-cols-1 sm:grid-cols-5 gap-6">

                {/* Filtros en sidebar solo en escritorio */}
                <div className="hidden sm:block sm:col-span-1 bg-white px-2 rounded">
                    <FiltrosPorCategoria categorySlug={slug} />
                </div>

                {/* Productos */}
                <section className="sm:col-span-4 space-y-4">

                    {/* Barra responsive arriba en mobile */}
                    <div className="flex items-center justify-between gap-2 sm:hidden">
                        {/* DrawerFilters ya está dentro de FiltrosPorCategoria */}
                        {/* <Suspense fallback={<SpinnerLoading />}> */}
                        <FiltrosPorCategoria categorySlug={slug} />
                        {/* </Suspense> */}
                        <OrdenarPor pathname={`/categoria/${slug}`} />
                    </div>

                    {/* Ordenar en escritorio */}
                    <div className="hidden sm:flex sm:justify-end">
                        <OrdenarPor pathname={`/categoria/${slug}`} />
                    </div>

                    {/* Lista de productos */}
                    {/* <Suspense fallback={<SpinnerLoading />}> */}
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
                    {/* </Suspense> */}
                </section>
            </section>
        </main>
    );
}