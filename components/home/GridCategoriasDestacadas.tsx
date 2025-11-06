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
            <header className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-500">
                        Categorías{" "}
                        <span className="text-white bg-gray-950 px-2">
                            Destacadas
                        </span>
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