// File: frontend/components/home/CollectionSection.tsx
import { HomepageSection } from "@/src/schemas/collection.schema";
import CollectionGrid from "@/components/home/sections/CollectionGrid";
import CollectionCarousel from "@/components/home/sections/CollectionCarousel";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
                    <h2 className="text-xl md:text-xl font-semibold tracking-tight text-foreground whitespace-nowrap">
                        {collection.name}
                    </h2>
                </div>

                <Link
                    href={`/colecciones/${slug}`}
                    className="hidden md:flex items-center gap-1 text-sm text-foreground hover:text-action-cta font-medium transition-colors duration-200"
                >
                    Ver todo
                    <ChevronRight size={12} strokeWidth={3} />

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