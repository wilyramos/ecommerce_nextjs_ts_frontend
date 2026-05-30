'use client';

import * as React from "react";
import { DollarSign, Clock, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { type SliderBanner } from "@/src/schemas/slider.schema";

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
}

export default function PromoSection({ initialData, fields, fieldErrors }: SectionProps) {
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const parseInitialDate = (dateVal?: Date | string | null): Date | null => {
        if (!dateVal) return null;
        const d = new Date(dateVal);
        return isNaN(d.getTime()) ? null : d;
    };

    const initialDateObj = parseInitialDate(fields?.["countdown.endsAt"] || initialData?.countdown?.endsAt);

    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | null>(initialDateObj);
    const [timeString, setTimeString] = React.useState<string>(
        initialDateObj ? format(initialDateObj, "HH:mm") : "00:00"
    );

    const combineDateAndTime = (baseDate: Date | null, timeStr: string): string => {
        if (!baseDate) return "";
        const [hours, minutes] = timeStr.split(":").map(Number);
        const finalDate = new Date(baseDate);
        finalDate.setHours(hours || 0, minutes || 0, 0, 0);
        return finalDate.toISOString();
    };

    return (
        <div className="grid grid-cols-1  gap-2">
            {/* ── Precio ───────────────────────────────────────────────── */}
            <Card className="border-[color:var(--color-border)] bg-background w-full overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-2 border-b border-[color:var(--color-border)]/60 pb-4">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Precio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Moneda</Label>
                            <Input
                                name="price.currency"
                                readOnly
                                defaultValue={val("price.currency", initialData?.price?.currency ?? "S/")}
                                className="h-10 text-xs bg-background-secondary/60 border-border/40 rounded-sm cursor-not-allowed max-w-[40px]"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Precio actual</Label>
                            <Input
                                name="price.current"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={val("price.current", initialData?.price?.current?.toString())}
                                className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("price.current") ? "border-destructive" : "border-border/40"}`}
                            />
                            {err("price.current") && <p className="text-[10px] text-destructive">{err("price.current")}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Precio comparativo</Label>
                            <Input
                                name="price.compare"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={val("price.compare", initialData?.price?.compare?.toString())}
                                className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("price.compare") ? "border-destructive" : "border-border/40"}`}
                            />
                            {err("price.compare") && <p className="text-[10px] text-destructive">{err("price.compare")}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Etiqueta</Label>
                            <Input
                                name="price.label"
                                defaultValue={val("price.label", initialData?.price?.label)}
                                placeholder="Desde, Solo hoy..."
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Sufijo</Label>
                            <Input
                                name="price.suffix"
                                defaultValue={val("price.suffix", initialData?.price?.suffix)}
                                placeholder="/ mes, c/u..."
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Countdown ────────────────────────────────────────────── */}
            <Card className="border-[color:var(--color-border)] bg-background w-full overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-2 border-b border-[color:var(--color-border)]/60 pb-4">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Countdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                    <div className="space-y-1">
                        <Label className="text-xs">Etiqueta del contador</Label>
                        <Input
                            name="countdown.label"
                            defaultValue={val("countdown.label", initialData?.countdown?.label)}
                            placeholder="La oferta termina en:"
                            className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                        />
                    </div>

                    <div className="space-y-1 flex flex-col justify-between">
                        <Label className="text-xs">Fecha de finalización</Label>

                        {/* Pipeline nativo de envío a través del input oculto unificado */}
                        <input
                            type="hidden"
                            name="countdown.endsAt"
                            value={combineDateAndTime(date, timeString)}
                        />

                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex-1">
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`w-full h-10 px-3 justify-between text-left font-normal text-xs bg-background-secondary rounded-sm ${err("countdown.endsAt") ? "border-destructive" : "border-border/40"} ${!date && "text-muted-foreground"}`}
                                        >
                                            <span className="truncate capitalize">
                                                {date ? format(date, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                            </span>
                                            <ChevronDownIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date ?? undefined}
                                            onSelect={(newDate) => {
                                                if (newDate) setDate(newDate);
                                                setOpen(false);
                                            }}
                                            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="w-28 shrink-0">
                                <Input
                                    type="time"
                                    value={timeString}
                                    onChange={(e) => setTimeString(e.target.value)}
                                    className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>
                        </div>
                        {err("countdown.endsAt") && <p className="text-[10px] text-destructive mt-1">{err("countdown.endsAt")}</p>}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input type="hidden" name="countdown.showDays" value="false" />
                        <input
                            type="checkbox"
                            name="countdown.showDays"
                            value="true"
                            defaultChecked={initialData?.countdown?.showDays ?? true}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                        <Label className="text-xs cursor-pointer select-none">Mostrar días</Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}