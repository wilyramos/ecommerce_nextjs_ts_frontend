import type { CategoryListResponse } from "@/src/schemas";
import Image from "next/image";
import Link from "next/link";

export default function GridCategoriasDestacadas({
    categorias,
}: {
    categorias: CategoryListResponse;
}) {
    if (!categorias?.length) return null;

    return (
        <section className="container mx-auto px-4 max-w-7xl">
            <header className="mb-6">
            <h2 className="text-xl font-medium tracking-tight text-gray-800 mb-6">
                    Novedades de Gophone
                </h2>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {/* Secundarias */}
                {categorias.slice(1, 5).map((cat) => (
                    <Link
                        key={cat._id}
                        href={`/categoria/${cat.slug}`}
                        className="group bg-white rounded-xl"
                    >
                        <div className="relative h-28 w-full overflow-hidden rounded-xl">
                            <Image
                                src={cat.image || "/logo.png"}
                                alt={cat.nombre}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="p-3 text-center">
                            <h3 className="font-medium group-hover:text-primary transition">
                                {cat.nombre}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}