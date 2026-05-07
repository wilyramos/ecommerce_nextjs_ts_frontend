// File: frontend/app/(admin)/admin/slider/[id]/preview/page.tsx
import { notFound }            from "next/navigation";
import Link                    from "next/link";
import { SliderService }       from "@/src/services/slider-service";
import { SliderBannerSlide }   from "@/components/banner/SliderBannerSlide";

interface Props {
    params: Promise<{ id: string }>;
}

// Metadatos de layout del banner para el panel de info
const LAYOUT_LABELS: Record<string, string> = {
    "default":            "Default",
    "image-left":         "Imagen Izquierda",
    "image-center":       "Imagen Centro",
    "image-center-split": "Centro Dividido",
    "background-media":   "Fondo con Media",
    "promo-box":          "Caja Promocional",
    "fullbleed":          "Full Bleed",
    "split-diagonal":     "Diagonal",
    "minimal":            "Minimal",
    "countdown":          "Countdown",
    "video":              "Video",
};

export default async function SliderBannerPreviewPage({ params }: Props) {
    const { id }  = await params;
    const banner  = await SliderService.getById(id);

    if (!banner) notFound();

    const layout = banner.design.layout;
    const theme  = banner.design.theme;

    return (
        <div className="min-h-screen flex flex-col">

            {/* ── Barra superior ─────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/admin/slider/${id}`}
                        className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                    >
                        ← Editar
                    </Link>
                    <span className="text-zinc-700">|</span>
                    <h1 className="text-zinc-200 text-sm font-medium truncate max-w-xs">
                        {banner.title ?? "Sin título"}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
                        style={{
                            backgroundColor: banner.isActive ? "#14532d" : "#27272a",
                            color:           banner.isActive ? "#4ade80" : "#71717a",
                        }}>
                        {banner.isActive ? "Activo" : "Inactivo"}
                    </span>
                    <Link
                        href="/admin/slider"
                        className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                    >
                        Listado
                    </Link>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full">

                {/* ── Preview principal ───────────────────── */}
                <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3">
                        Preview
                    </p>
                    <div className="rounded-xl overflow-hidden ring-1 ring-zinc-800">
                        <SliderBannerSlide banner={banner} />
                    </div>
                </div>

                {/* ── Info del banner ─────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Diseño */}
                    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Diseño
                        </p>
                        <div className="space-y-2">
                            <Row label="Layout" value={LAYOUT_LABELS[layout] ?? layout} />
                            <Row label="Tema"   value={theme.charAt(0).toUpperCase() + theme.slice(1)} />
                            {banner.design.bgColor && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">Color Fondo</span>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-sm ring-1 ring-zinc-700"
                                            style={{ backgroundColor: banner.design.bgColor }}
                                        />
                                        <span className="text-xs text-zinc-300 font-mono">
                                            {banner.design.bgColor}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {banner.design.accentColor && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">Acento</span>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-sm ring-1 ring-zinc-700"
                                            style={{ backgroundColor: banner.design.accentColor }}
                                        />
                                        <span className="text-xs text-zinc-300 font-mono">
                                            {banner.design.accentColor}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Contenido
                        </p>
                        <div className="space-y-2">
                            <Row label="Tipo"      value={banner.contentType.toUpperCase()} />
                            {banner.title       && <Row label="Título"      value={banner.title} />}
                            {banner.subtitle    && <Row label="Subtítulo"   value={banner.subtitle} />}
                            {banner.description && <Row label="Descripción" value={banner.description} truncate />}
                            <Row label="Destino" value={banner.destUrl} mono truncate />
                        </div>
                    </div>

                    {/* Precio */}
                    {banner.price?.current !== undefined && (
                        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                Precio
                            </p>
                            <div className="space-y-2">
                                <Row label="Actual"   value={`${banner.price.currency} ${banner.price.current.toFixed(2)}`} />
                                {banner.price.compare !== undefined && (
                                    <Row label="Antes" value={`${banner.price.currency} ${banner.price.compare.toFixed(2)}`} />
                                )}
                                {banner.price.label  && <Row label="Etiqueta" value={banner.price.label} />}
                                {banner.price.suffix && <Row label="Sufijo"   value={banner.price.suffix} />}
                                {banner.price.note   && <Row label="Nota"     value={banner.price.note} />}
                            </div>
                        </div>
                    )}

                    {/* Programación */}
                    {(banner.schedule?.startsAt ?? banner.schedule?.endsAt ?? banner.countdown?.endsAt) && (
                        <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-5 space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                Programación
                            </p>
                            <div className="space-y-2">
                                {banner.schedule?.startsAt && (
                                    <Row
                                        label="Inicia"
                                        value={new Date(banner.schedule.startsAt).toLocaleString("es-PE")}
                                    />
                                )}
                                {banner.schedule?.endsAt && (
                                    <Row
                                        label="Termina"
                                        value={new Date(banner.schedule.endsAt).toLocaleString("es-PE")}
                                    />
                                )}
                                {banner.countdown?.endsAt && (
                                    <Row
                                        label="Countdown"
                                        value={new Date(banner.countdown.endsAt).toLocaleString("es-PE")}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Acciones ────────────────────────────── */}
                <div className="flex items-center gap-3 pb-6">
                    <Link
                        href={`/admin/slider/${id}`}
                        className="px-6 py-2.5 bg-white text-zinc-900 text-sm font-semibold rounded-md hover:bg-zinc-100 transition-colors"
                    >
                        Editar banner
                    </Link>
                    <Link
                        href="/admin/slider"
                        className="px-6 py-2.5 text-sm text-zinc-400 border border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors"
                    >
                        Volver al listado
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ── Helper UI ───────────────────────────────────────────────
function Row({
    label,
    value,
    mono     = false,
    truncate = false,
}: {
    label:    string;
    value:    string;
    mono?:    boolean;
    truncate?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <span className="text-xs text-zinc-500 shrink-0">{label}</span>
            <span
                className={`text-xs text-zinc-300 text-right ${mono ? "font-mono" : ""} ${truncate ? "truncate max-w-[180px]" : ""}`}
                title={truncate ? value : undefined}
            >
                {value}
            </span>
        </div>
    );
}