"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { type SliderBanner } from "@/src/schemas/slider.schema";

interface SectionProps {
    initialData?: SliderBanner;
    fieldErrors?: Record<string, string[]>;
}

export default function ScheduleSection({ initialData, fieldErrors }: SectionProps) {
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const parseInitialDate = (dateVal?: Date | string | null): Date | null => {
        if (!dateVal) return null;
        const d = new Date(dateVal);
        return isNaN(d.getTime()) ? null : d;
    };

    const initialStart = parseInitialDate(initialData?.schedule?.startsAt);
    const initialEnd = parseInitialDate(initialData?.schedule?.endsAt);

    const [openStart, setOpenStart] = React.useState(false);
    const [openEnd, setOpenEnd] = React.useState(false);

    const [startDate, setStartDate] = React.useState<Date | null>(initialStart);
    const [startTime, setStartTime] = React.useState<string>(initialStart ? format(initialStart, "HH:mm") : "00:00");

    const [endDate, setEndDate] = React.useState<Date | null>(initialEnd);
    const [endTime, setEndTime] = React.useState<string>(initialEnd ? format(initialEnd, "HH:mm") : "00:00");

    const combineDateAndTime = (baseDate: Date | null, timeStr: string): string => {
        if (!baseDate) return "";
        const [hours, minutes] = timeStr.split(":").map(Number);
        const finalDate = new Date(baseDate);
        finalDate.setHours(hours || 0, minutes || 0, 0, 0);
        return finalDate.toISOString();
    };

    return (
        <Card className="border-[color:var(--color-border)] bg-background">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-[color:var(--color-border)]/60 pb-4">
                <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground/80" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">

                {/* Orden de aparición */}
                <div className="space-y-1">
                    <Label className="text-xs font-bold">Orden de aparición</Label>
                    <Input
                        name="order"
                        type="number"
                        min="0"
                        defaultValue={initialData?.order ?? 0}
                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                    />
                </div>

                {/* Publicar desde */}
                <div className="space-y-1 flex flex-col">
                    <Label className="text-xs font-bold">Publicar desde</Label>
                    <input
                        type="hidden"
                        name="schedule.startsAt"
                        value={combineDateAndTime(startDate, startTime)}
                    />
                    <div className="flex flex-row gap-2 w-full">
                        <div className="flex-1">
                            <Popover open={openStart} onOpenChange={setOpenStart}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full h-10 px-3 justify-between text-left font-normal text-xs bg-background-secondary border-border/40 rounded-sm ${!startDate && "text-muted-foreground"}`}
                                    >
                                        <span className="truncate capitalize">
                                            {startDate ? format(startDate, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                        </span>
                                        <ChevronDownIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate ?? undefined}
                                        onSelect={(date) => {
                                            if (date) setStartDate(date);
                                            setOpenStart(false);
                                        }}

                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="w-28 shrink-0">
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Publicar hasta */}
                <div className="space-y-1 flex flex-col">
                    <Label className="text-xs font-bold">Publicar hasta</Label>
                    <input
                        type="hidden"
                        name="schedule.endsAt"
                        value={combineDateAndTime(endDate, endTime)}
                    />
                    <div className="flex flex-row gap-2 w-full">
                        <div className="flex-1">
                            <Popover open={openEnd} onOpenChange={setOpenEnd}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full h-10 px-3 justify-between text-left font-normal text-xs bg-background-secondary rounded-sm ${err("schedule.endsAt") ? "border-destructive" : "border-border/40"} ${!endDate && "text-muted-foreground"}`}
                                    >
                                        <span className="truncate capitalize">
                                            {endDate ? format(endDate, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                        </span>
                                        <ChevronDownIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate ?? undefined}
                                        onSelect={(date) => {
                                            if (date) setEndDate(date);
                                            setOpenEnd(false);
                                        }}

                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="w-28 shrink-0">
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                            />
                        </div>
                    </div>
                    {err("schedule.endsAt") && (
                        <p className="text-[10px] text-destructive mt-1">{err("schedule.endsAt")}</p>
                    )}
                </div>

                {/* Estado Activo */}
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <Label className="text-xs font-bold">Activo</Label>
                    <input type="hidden" name="isActive" value="false" />
                    <input
                        type="checkbox"
                        name="isActive"
                        value="true"
                        defaultChecked={initialData?.isActive ?? true}
                        className="w-4 h-4 accent-blue-600"
                    />
                </div>
            </CardContent>
        </Card>
    );
}