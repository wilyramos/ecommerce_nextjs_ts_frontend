// File: frontend/components/home/CollectionSection.tsx
import { HomepageSection } from "@/src/schemas/collection.schema";
import CollectionGrid from "@/components/home/sections/CollectionGrid";
import CollectionCarousel from "@/components/home/sections/CollectionCarousel";
import Link from "next/link";

interface Props {
    section: HomepageSection;
    slug: string;
}

export default function CollectionSection({ section, slug }: Props) {
    const { collection, products } = section;

    if (!products.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-4">

            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                        {collection.name}
                    </h2>
                </div>

                <Link
                    href={`/colecciones/${slug}`}
                    className="text-xs font-medium tracking-tight text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    Ver todo
                </Link>
            </div>

            {collection.homepageLayout === "carousel" ? (
                <CollectionCarousel products={products} />
            ) : (
                <CollectionGrid products={products} />
            )}

        </section>
    );
}