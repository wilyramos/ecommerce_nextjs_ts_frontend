// File: frontend/components/home/HomepageSections.tsx
import { getHomepageSections } from "@/src/services/collection-service";
import CollectionSection       from "@/components/home/sections/CollectionSection";

export default async function HomepageSections() {
    // Llama a la función optimizada con tags de caché
    const sections = await getHomepageSections();

    if (!sections || !sections.length) return null;

    return (
        <div className="space-y-12 my-6">
            {sections.map((section) => (
                <CollectionSection
                    key={section.collection._id}
                    slug={section.collection.slug}
                    section={section}
                />
            ))}
        </div>
    );
}