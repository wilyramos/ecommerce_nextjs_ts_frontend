// File: frontend/app/(admin)/admin/slider/[id]/preview/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { SliderBannerSlide } from "@/components/banner/SliderBannerSlide";
import { SliderService } from "@/src/services/slider-service";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/ui/Typography";

interface Props {
    params: Promise<{ id: string }>;
}

const LAYOUT_LABELS: Record<string, string> = {
    "image-only": "Solo Imagen",
    "default": "Default (Media Derecha)",
    "media-left": "Media Izquierda",
    "background-media": "Fondo con Media",
};

export default async function SliderBannerPreviewPage({ params }: Props) {
    const { id } = await params;
    const banner = await SliderService.getById(id);

    if (!banner) notFound();

    const layout = banner.design.layout;
    const theme = banner.design.theme;

    return (
        <AdminPageWrapper
            title="Preview del Banner"
            breadcrumbItems={[
                { label: "Marketing", href: "/admin/marketing" },
                { label: "Slider", href: "/admin/slider" },
            ]}
            breadcrumbCurrent="Preview"
            showBackButton={true}
            actions={
                <>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/slider/${id}`}>
                            Editar
                        </Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link href="/admin/slider">
                            Listado
                        </Link>
                    </Button>
                </>
            }
        >
            <div className="space-y-6">
                {/* Vista Previa */}
                <section className="space-y-2">
                    <Muted className="uppercase tracking-widest font-bold select-none">
                        Vista Previa Comercial
                    </Muted>

                    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
                        <SliderBannerSlide banner={banner} />
                    </div>
                </section>

                {/* Info Matrices */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diseño */}
                    <Card title="Estructura y Diseño">
                        <div className="space-y-2">
                            <Row
                                label="Layout"
                                value={LAYOUT_LABELS[layout] ?? layout}
                            />

                            <Row
                                label="Tema"
                                value={theme.charAt(0).toUpperCase() + theme.slice(1)}
                            />

                            {banner.design.bgColor && (
                                <ColorRow
                                    label="Color Fondo"
                                    color={banner.design.bgColor}
                                />
                            )}

                            {banner.design.accentColor && (
                                <ColorRow
                                    label="Color Acento"
                                    color={banner.design.accentColor}
                                />
                            )}

                            {banner.design.textColor && (
                                <ColorRow
                                    label="Color Texto"
                                    color={banner.design.textColor}
                                />
                            )}
                        </div>
                    </Card>

                    {/* Contenido */}
                    <Card title="Contenido de Campaña">
                        <div className="space-y-2">
                            <Row
                                label="Nombre Interno"
                                value={banner.name}
                            />

                            {banner.tags && banner.tags.length > 0 && (
                                <Row
                                    label="Etiquetas"
                                    value={banner.tags.join(", ")}
                                />
                            )}

                            {banner.title && (
                                <Row
                                    label="Título"
                                    value={banner.title}
                                />
                            )}

                            {banner.subtitle && (
                                <Row
                                    label="Subtítulo"
                                    value={banner.subtitle}
                                />
                            )}

                            {banner.description && (
                                <Row
                                    label="Descripción"
                                    value={banner.description}
                                    truncate
                                />
                            )}

                            {banner.terms && (
                                <Row
                                    label="Términos"
                                    value={banner.terms}
                                    truncate
                                />
                            )}

                            {banner.destUrl && (
                                <Row
                                    label="Enlace Destino"
                                    value={banner.destUrl}
                                    mono
                                    truncate
                                />
                            )}
                        </div>
                    </Card>

                    {/* Precio */}
                    {banner.price?.current !== undefined && banner.price.current !== null && (
                        <Card title="Estrategia Comercial (Precios)">
                            <div className="space-y-2">
                                <Row
                                    label="Precio Actual"
                                    value={`${banner.price.currency ?? "S/"} ${banner.price.current.toFixed(2)}`}
                                />

                                {banner.price.compare !== undefined && banner.price.compare !== null && (
                                    <Row
                                        label="Precio Comparativo"
                                        value={`${banner.price.currency ?? "S/"} ${banner.price.compare.toFixed(2)}`}
                                    />
                                )}

                                {banner.price.label && (
                                    <Row
                                        label="Etiqueta"
                                        value={banner.price.label}
                                    />
                                )}

                                {banner.price.suffix && (
                                    <Row
                                        label="Sufijo"
                                        value={banner.price.suffix}
                                    />
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Programación */}
                    {(banner.schedule?.startsAt || banner.schedule?.endsAt || banner.countdown?.endsAt) ? (
                        <Card title="Cronograma y Activación">
                            <div className="space-y-2">
                                {banner.schedule?.startsAt && (
                                    <Row
                                        label="Fecha Inicio"
                                        value={new Date(banner.schedule.startsAt).toLocaleString("es-PE")}
                                    />
                                )}

                                {banner.schedule?.endsAt && (
                                    <Row
                                        label="Fecha Término"
                                        value={new Date(banner.schedule.endsAt).toLocaleString("es-PE")}
                                    />
                                )}

                                {banner.countdown?.endsAt && (
                                    <Row
                                        label="Cierre Contador"
                                        value={new Date(banner.countdown.endsAt).toLocaleString("es-PE")}
                                    />
                                )}
                            </div>
                        </Card>
                    ) : null}
                </section>
            </div>
        </AdminPageWrapper>
    );
}

/* ───────────────────────────────────────────── */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 space-y-4 text-card-foreground">
            <Muted className="uppercase tracking-widest font-bold select-none border-b border-border/60 pb-1">
                {title}
            </Muted>
            {children}
        </div>
    );
}

function ColorRow({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
            <span className="text-xs font-semibold text-muted-foreground select-none">{label}</span>
            <div className="flex items-center gap-2">
                <div
                    className="w-4 h-4 rounded-[var(--radius-sm)] border border-border shrink-0"
                    style={{ backgroundColor: color }}
                />
                <span className="text-xs font-mono font-bold text-foreground select-all">
                    {color}
                </span>
            </div>
        </div>
    );
}

function Row({ label, value, mono = false, truncate = false }: { label: string; value: string; mono?: boolean; truncate?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
            <span className="text-xs font-semibold text-muted-foreground shrink-0 select-none">
                {label}
            </span>
            <span
                className={[
                    "text-xs text-right font-bold text-foreground",
                    mono ? "font-mono" : "",
                    truncate ? "truncate max-w-[220px]" : "",
                ].join(" ")}
                title={truncate ? value : undefined}
            >
                {value}
            </span>
        </div>
    );
}