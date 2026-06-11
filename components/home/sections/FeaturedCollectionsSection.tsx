// File: frontend/components/home/product/FeaturedCollectionsSection.tsx
import { SectionResponse, SectionBlock } from "@/src/schemas/section.schema";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";

interface FeaturedCollectionsSectionProps {
    section: SectionResponse;
    columns: number;
}

export default function FeaturedCollectionsSection({ section, columns }: FeaturedCollectionsSectionProps) {
    return (
        <section className="space-y-6">
            <SectionHeader title={section.title} />
            <div
                className="grid gap-4"
                style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Math.floor(100 / columns) - 2}%), 1fr))`
                }}
            >
                {section.blocks.map((block: SectionBlock, idx) => {
                    // Evaluación estricta: Solo es un enlace válido si existe, no es nulo y no es un string vacío
                    const hasValidLink = typeof block.linkTo === "string" && block.linkTo.trim() !== "";

                    const FeaturedBlockContent = (
                        <div
                            className="group relative block overflow-hidden"
                            style={{
                                aspectRatio: columns <= 2 ? "16/7" : columns === 3 ? "4/3" : "1/1"
                            }}
                        >
                            {block.imageUrl ? (
                                <Image
                                    src={block.imageUrl}
                                    alt={block.title || "Colección"}
                                    fill
                                    sizes={`(max-width: 640px) 100vw, ${Math.floor(100 / columns)}vw`}
                                    className="object-contain transition-transform duration-700 group-hover:scale-101"
                                    priority={idx < 3}
                                    unoptimized={true}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-background-secondary to-muted" />
                            )}

                            {/* Gradiente sutil para legibilidad del texto */}
                            <div className="absolute inset-0 bg-gradient-to-t" />

                            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-1">
                                {block.title && (
                                    <h3 className="text-white font-black text-lg uppercase tracking-[0.1em]">
                                        {block.title}
                                    </h3>
                                )}
                                {block.subtitle && (
                                    <p className="text-white/80 text-xs font-medium uppercase tracking-widest mt-1 line-clamp-1">
                                        {block.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    );

                    // Al usar prefijos diferentes en los keys para Link y div eliminamos cualquier conflicto de hidratación de React
                    if (hasValidLink) {
                        return (
                            <Link
                                key={`link-${block._id || idx}`}
                                href={block.linkTo!.trim()}
                                className="block outline-none focus-visible:ring-2 focus-visible:ring-action-cta rounded-[var(--radius-lg)]"
                            >
                                {FeaturedBlockContent}
                            </Link>
                        );
                    }

                    return (
                        <div
                            key={`static-${block._id || idx}`}
                            className="block rounded-[var(--radius-lg)] overflow-hidden"
                        >
                            {FeaturedBlockContent}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}