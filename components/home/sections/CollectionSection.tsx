// components/home/CollectionSection.tsx
import { HomepageSection } from "@/src/schemas/collection.schema";
import CollectionGrid from "@/components/home/sections/CollectionGrid";
import CollectionCarousel from "@/components/home/sections/CollectionCarousel";
import SectionHeader from "@/components/home/sections/SectionHeader";

interface Props {
    section: HomepageSection;
    slug: string;
}

export default function CollectionSection({ section, slug }: Props) {
    const { collection, products } = section;

    if (!products.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-4">
            <SectionHeader
                title={collection.name}
                viewAllHref={`/colecciones/${slug}`}
            />

            {collection.homepageLayout === "carousel" ? (
                <CollectionCarousel products={products} />
            ) : (
                <CollectionGrid products={products} />
            )}
        </section>
    );
}