import { Info, ImageIcon, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SliderContentTypeEnum, SliderObjectFitEnum, SliderBorderStyleEnum, type SliderBanner } from "@/src/schemas/slider.schema";
import ProductReferenceSelector from "../../shared/ProductReferenceSelector";

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
}

export default function GeneralSection({ initialData, fields, fieldErrors }: SectionProps) {
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const getRefId = (ref: SliderBanner["product"] | SliderBanner["brand"] | SliderBanner["category"]) => {
        if (!ref) return "";
        return typeof ref === "string" ? ref : (ref as { _id: string })._id ?? "";
    };

    const currentReferenceId = fields?.referenceId || getRefId(initialData?.product) || getRefId(initialData?.brand) || getRefId(initialData?.category);

    return (
        <div className="space-y-6">
            {/* INFORMACIÓN GENERAL */}
            <section className="p-6 border rounded-lg space-y-4 ">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <h2 className="text-[11px] font-bold uppercase tracking-wider">Información General</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo de Contenido</Label>
                        <Select name="contentType" defaultValue={val("contentType", initialData?.contentType ?? "product")}>
                            <SelectTrigger className={err("contentType") ? "border-red-500" : ""}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SliderContentTypeEnum.options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>{opt.toUpperCase()}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <ProductReferenceSelector
                            name="referenceId"
                            initialId={currentReferenceId}
                            initialProduct={
                                initialData?.product &&
                                    typeof initialData.product === "object" &&
                                    "_id" in initialData.product &&
                                    "nombre" in initialData.product &&
                                    "precio" in initialData.product
                                    ? {
                                        _id: initialData.product._id,
                                        nombre: initialData.product.nombre,
                                        precio: initialData.product.precio,
                                        imagenes: initialData.product.imagenes,
                                    }
                                    : null
                            }
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Título Principal</Label>
                    <Input name="title" defaultValue={val("title", initialData?.title)} className={err("title") ? "border-red-500" : ""} />
                    {err("title") && <p className="text-red-500 text-xs">{err("title")}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Subtítulo</Label>
                        <Input name="subtitle" defaultValue={val("subtitle", initialData?.subtitle)} />
                    </div>
                    <div className="space-y-2">
                        <Label>URL de Destino</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input name="destUrl" className={`pl-10 ${err("destUrl") ? "border-red-500" : ""}`} defaultValue={val("destUrl", initialData?.destUrl)} placeholder="/productos/slug..." />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Descripción Corta</Label>
                    <Textarea name="description" defaultValue={val("description", initialData?.description)} rows={2} />
                </div>
            </section>

            {/* MULTIMEDIA */}
            <section className="p-6 border rounded-lg space-y-4 ">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 " />
                    <h2 className="text-[11px] font-bold uppercase tracking-wider">Multimedia</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>URL Imagen (Obligatorio)</Label>
                        <Input name="media.imageUrl" defaultValue={val("media.imageUrl", initialData?.media.imageUrl)} className={err("media.imageUrl") ? "border-red-500" : ""} />
                    </div>
                    <div className="space-y-2">
                        <Label>Texto Alternativo (Alt)</Label>
                        <Input name="media.altText" defaultValue={val("media.altText", initialData?.media.altText)} className={err("media.altText") ? "border-red-500" : ""} />
                    </div>
                </div>

                {/* NUEVOS: Campos de Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>URL Video (Opcional)</Label>
                        <Input name="media.videoUrl" defaultValue={val("media.videoUrl", initialData?.media.videoUrl)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Poster del Video (URL)</Label>
                        <Input name="media.videoPoster" defaultValue={val("media.videoPoster", initialData?.media.videoPoster)} placeholder="Imagen previa al play" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Object Fit</Label>
                        <Select name="media.objectFit" defaultValue={val("media.objectFit", initialData?.media.objectFit ?? "cover")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {SliderObjectFitEnum.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Borde Imagen</Label>
                        <Select name="media.border" defaultValue={val("media.border", initialData?.media.border ?? "none")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {SliderBorderStyleEnum.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
        </div>
    );
}