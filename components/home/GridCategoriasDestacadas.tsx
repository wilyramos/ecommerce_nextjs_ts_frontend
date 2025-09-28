import type { CategoryListResponse } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GridCategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {
    if (!categorias?.length) return null;

    return (
        <section className="container mx-auto px-4 py-10 max-w-7xl">
            <header>
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Novedades de Gophone
                </h2>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* Principal */}
                {categorias[0] && (
                    <article className="col-span-2 md:col-span-3 lg:col-span-4 group">

                        <div className="mt-2 text-center flex flex-col md:flex-row items-center bg-white md:gap-10 md:p-6">

                            <Image
                                src={categorias[0].image || "/logo.png"}
                                alt={categorias[0].nombre}
                                width={1200}
                                height={400}
                                className="w-full h-40 sm:h-56 md:h-72 lg:h-80 object-cover rounded-lg"
                                priority
                            />
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                                <Link
                                    href={`/categorias/${categorias[0].slug}`}
                                    className="hover:text-black transition"
                                >
                                    {categorias[0].nombre}
                                </Link>
                            </h3>
                        </div>
                    </article>
                )}

                {/* Secundarias */}
                {categorias.slice(1, 5).map((cat) => (
                    <article
                        key={cat._id}
                        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                        <Image
                            src={cat.image || "/logo.png"}
                            alt={cat.nombre}
                            width={200}
                            height={200}
                            className="w-full h-32 sm:h-40 object-contain"
                        />
                        <div className="p-2 sm:p-3 text-center">
                            <h3 className="text-sm sm:text-base font-medium">
                                <Link
                                    href={`/categorias/${cat.slug}`}
                                    className="hover:text-black transition"
                                >
                                    {cat.nombre}
                                </Link>
                            </h3>
                            <Button
                                asChild
                                size="sm"
                                variant="secondary"
                                className="mt-1 sm:mt-2 inline-block md:opacity-0 md:group-hover:opacity-100 transition"
                            >
                                <Link href={`/categorias/${cat.slug}`}>Ver más</Link>
                            </Button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
