import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SliderBanner } from "@/src/schemas/slider.schema";

interface SectionProps {
    initialData?: SliderBanner;
    fieldErrors?: Record<string, string[]>;
}

export default function ScheduleSection({ initialData, fieldErrors }: SectionProps) {
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const toDatetimeLocal = (date?: Date | string | null) => {
        if (!date) return "";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
    };

    return (
        <div className="p-4 border rounded-lg bg-white space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <h2 className="text-[11px] font-bold uppercase">Publicación y Orden</h2>
            </div>

            {/* NUEVO: Campo de Orden */}
            <div className="space-y-2">
                <Label className="text-xs">Orden de aparición</Label>
                <Input name="order" type="number" defaultValue={initialData?.order ?? 0} />
            </div>

            <div className="space-y-2">
                <Label className="text-xs">Inicia</Label>
                <Input name="schedule.startsAt" type="datetime-local" defaultValue={toDatetimeLocal(initialData?.schedule?.startsAt)} />
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Finaliza</Label>
                <Input name="schedule.endsAt" type="datetime-local" defaultValue={toDatetimeLocal(initialData?.schedule?.endsAt)} className={err("schedule.endsAt") ? "border-red-500" : ""} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
                <Label>Activo</Label>
                <input type="checkbox" name="isActive" value="true" className="w-5 h-5 accent-blue-600" defaultChecked={initialData?.isActive ?? true} />
            </div>
        </div>
    );
}