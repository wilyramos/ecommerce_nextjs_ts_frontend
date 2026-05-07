import { DollarSign, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SliderBorderStyleEnum, type SliderBanner } from "@/src/schemas/slider.schema";

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
}

export default function PromoSection({ initialData, fields, fieldErrors }: SectionProps) {
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const toDatetimeLocal = (date?: Date | string | null) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-6 border rounded-lg bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <h2 className="text-[11px] font-bold uppercase">Precio y Etiquetas</h2>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Moneda</Label>
                        <Input name="price.currency" defaultValue={val("price.currency", initialData?.price?.currency ?? "S/")} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Actual</Label>
                        <Input name="price.current" type="number" step="0.01" defaultValue={val("price.current", initialData?.price?.current?.toString())} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Antes</Label>
                        <Input name="price.compare" type="number" step="0.01" defaultValue={val("price.compare", initialData?.price?.compare?.toString())} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Etiqueta (ej: Oferta)</Label>
                        <Input name="price.label" defaultValue={val("price.label", initialData?.price?.label)} />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Sufijo (ej: /mes)</Label>
                        <Input name="price.suffix" defaultValue={val("price.suffix", initialData?.price?.suffix)} />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label className="text-xs">Nota adicional</Label>
                    <Input name="price.note" defaultValue={val("price.note", initialData?.price?.note)} placeholder="Stock limitado..." />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs">Borde Precio</Label>
                    <Select name="price.border" defaultValue={val("price.border", initialData?.price?.border ?? "none")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {SliderBorderStyleEnum.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className="p-6 border rounded-lg bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <h2 className="text-[11px] font-bold uppercase">Countdown</h2>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Título del contador</Label>
                    <Input name="countdown.label" defaultValue={val("countdown.label", initialData?.countdown?.label)} placeholder="La oferta termina en:" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">Fecha de Finalización</Label>
                    <Input name="countdown.endsAt" type="datetime-local" defaultValue={toDatetimeLocal(initialData?.countdown?.endsAt)} className={err("countdown.endsAt") ? "border-red-500" : ""} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" name="countdown.showDays" value="true" defaultChecked={initialData?.countdown?.showDays ?? true} />
                    <Label className="text-xs">Mostrar días</Label>
                </div>
            </section>
        </div>
    );
}