"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";

import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { FormMediaField } from "@/components/form/FormMediaField";

import {
    SliderLayoutEnum,
    SliderThemeEnum,
    SliderObjectFitEnum,
    type SliderBanner,
} from "@/src/schemas/slider.schema";
import { z } from "zod";

type SliderTheme = z.infer<typeof SliderThemeEnum>;
type SliderLayout = z.infer<typeof SliderLayoutEnum>;

interface ColorPalette {
    bgColor: string;
    accentColor: string;
    textColor: string;
}

interface SliderFormProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
    generalError?: string;
}

const LAYOUT_LABELS: Record<SliderLayout, string> = {
    "image-only": "Solo imagen",
    "default": "Default (Media Derecha)",
    "media-left": "Media Izquierda",
    "background-media": "Fondo con Media",
};

const THEME_PRESETS: Record<Exclude<SliderTheme, "custom">, ColorPalette> = {
    dark: { bgColor: "#000000", accentColor: "#ff6000", textColor: "#a8a8a8" },
    light: { bgColor: "#ffffff", accentColor: "#ff6000", textColor: "#0f0f0f" },
};

function isVideoUrl(url: string): boolean {
    const clean = url.split("?")[0].toLowerCase();
    return (
        clean.endsWith(".mp4") ||
        clean.endsWith(".webm") ||
        clean.endsWith(".mov") ||
        clean.includes("/video/upload/")
    );
}

function parseInitialDate(dateVal?: Date | string | null): Date | null {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? null : d;
}

function combineDateAndTime(baseDate: Date | null, timeStr: string): string {
    if (!baseDate) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const finalDate = new Date(baseDate);
    finalDate.setHours(hours || 0, minutes || 0, 0, 0);
    return finalDate.toISOString();
}

export default function SliderForm({
    initialData,
    fields,
    fieldErrors,
    generalError,
}: SliderFormProps) {
    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    // ── Checkboxes Controlados ────────────────────────────────────────────────
    const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);
    const [openInNewTab, setOpenInNewTab] = useState<boolean>(initialData?.openInNewTab ?? false);
    const [showDays, setShowDays] = useState<boolean>(initialData?.countdown?.showDays ?? true);

    // ── Media ─────────────────────────────────────────────────────────────────
    const [mediaImageUrl, setMediaImageUrl] = useState(
        val("media.imageUrl", initialData?.media?.imageUrl) || ""
    );
    const [mediaVideoUrl, setMediaVideoUrl] = useState(
        val("media.videoUrl", initialData?.media?.videoUrl) || ""
    );

    function handleMediaChange(urls: string[]) {
        const url = urls[0] ?? "";
        if (!url) { setMediaImageUrl(""); setMediaVideoUrl(""); return; }
        if (isVideoUrl(url)) { setMediaVideoUrl(url); setMediaImageUrl(""); }
        else { setMediaImageUrl(url); setMediaVideoUrl(""); }
    }

    // ── Appearance ────────────────────────────────────────────────────────────
    const [theme, setTheme] = useState<SliderTheme>(
        (fields?.["design.theme"] as SliderTheme) || initialData?.design?.theme || "dark"
    );
    const [layout, setLayout] = useState<SliderLayout>(
        (fields?.["design.layout"] as SliderLayout) || initialData?.design?.layout || "default"
    );
    const [colors, setColors] = useState<ColorPalette>({
        bgColor: fields?.["design.bgColor"] || initialData?.design?.bgColor || THEME_PRESETS.dark.bgColor,
        accentColor: fields?.["design.accentColor"] || initialData?.design?.accentColor || THEME_PRESETS.dark.accentColor,
        textColor: fields?.["design.textColor"] || initialData?.design?.textColor || THEME_PRESETS.dark.textColor,
    });

    const isCustom = theme === "custom";

    useEffect(() => {
        if (!isCustom) setColors(THEME_PRESETS[theme as Exclude<SliderTheme, "custom">]);
    }, [theme, isCustom]);

    const handleColorChange = (key: keyof ColorPalette, value: string) => {
        if (!isCustom) return;
        setColors((prev) => ({ ...prev, [key]: value }));
    };

    const COLOR_LABELS: Record<keyof ColorPalette, string> = {
        bgColor: "Fondo", accentColor: "Acento", textColor: "Texto",
    };

    // ── Countdown ─────────────────────────────────────────────────────────────
    const initialCountdownDate = parseInitialDate(fields?.["countdown.endsAt"] || initialData?.countdown?.endsAt);
    const [countdownOpen, setCountdownOpen] = useState(false);
    const [countdownDate, setCountdownDate] = useState<Date | null>(initialCountdownDate);
    const [countdownTime, setCountdownTime] = useState(initialCountdownDate ? format(initialCountdownDate, "HH:mm") : "00:00");

    // ── Schedule ──────────────────────────────────────────────────────────────
    const initialStart = parseInitialDate(initialData?.schedule?.startsAt);
    const initialEnd = parseInitialDate(initialData?.schedule?.endsAt);

    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(initialStart);
    const [startTime, setStartTime] = useState(initialStart ? format(initialStart, "HH:mm") : "00:00");
    const [endDate, setEndDate] = useState<Date | null>(initialEnd);
    const [endTime, setEndTime] = useState(initialEnd ? format(initialEnd, "HH:mm") : "00:00");

    return (
        <div className="space-y-4">
            {generalError && <Alert variant="error" mode="banner">{generalError}</Alert>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-2">

                {/* ── COLUMNA PRINCIPAL ──────────────────────────────────── */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Información General */}
                    <Card className="border-[color:var(--color-border)] bg-background">
                        <CardHeader className="border-b border-[color:var(--color-border)]/60 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="title" label="Título Principal" tooltip="Texto principal visible del banner. También lo identifica en el listado del admin." />
                                <Input
                                    name="title"
                                    defaultValue={val("title", initialData?.title)}
                                    placeholder="Ej: Hero Verano 2025"
                                    className={`h-10 text-xs bg-background-secondary border rounded-sm ${err("title") ? "border-destructive" : "border-border/40"}`}
                                />
                                {err("title") && <p className="text-[10px] text-destructive">{err("title")}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <LabelWithTooltip htmlFor="subtitle" label="Subtítulo" tooltip="Texto secundario opcional." />
                                    <Input
                                        name="subtitle"
                                        defaultValue={val("subtitle", initialData?.subtitle)}
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <LabelWithTooltip htmlFor="destUrl" label="URL de Destino" tooltip="Enlace al hacer clic. Opcional." />
                                    <Input
                                        name="destUrl"
                                        defaultValue={val("destUrl", initialData?.destUrl)}
                                        placeholder="/productos/slug..."
                                        className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="hidden" name="openInNewTab" value="false" />
                                <input
                                    type="checkbox"
                                    name="openInNewTab"
                                    value="true"
                                    checked={openInNewTab}
                                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                                    className="w-4 h-4 accent-ring cursor-pointer"
                                />
                                <Label className="text-xs cursor-pointer select-none">Abrir enlace en nueva pestaña</Label>
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="description" label="Descripción" tooltip="Texto descriptivo opcional." />
                                <Textarea
                                    name="description"
                                    defaultValue={val("description", initialData?.description)}
                                    rows={2}
                                    className="text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="terms" label="Términos y condiciones" tooltip="Letra pequeña / T&C." />
                                <Textarea
                                    name="terms"
                                    defaultValue={val("terms", initialData?.terms)}
                                    rows={2}
                                    placeholder="/ mes, c/u..."
                                    className="text-xs bg-background-secondary border-border/40 rounded-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recursos del Banner */}
                    <Card className="border-[color:var(--color-border)] bg-background">
                        <CardHeader className="border-b border-[color:var(--color-border)]/60 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">Recursos del Banner</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">

                            <div className="space-y-1.5">
                                <FormMediaField
                                    name="media.imageUrl"
                                    label="Imagen o Video de Portada"
                                    folder="banners"
                                    defaultValue={mediaImageUrl || mediaVideoUrl}
                                    multiple={false}
                                    maxFiles={1}
                                    accept="both"
                                    onChange={handleMediaChange}
                                />
                                <input type="hidden" name="media.imageUrl" value={mediaImageUrl} />
                                <input type="hidden" name="media.videoUrl" value={mediaVideoUrl} />
                                {(err("media.imageUrl") || err("media.videoUrl")) && (
                                    <p className="text-[10px] text-destructive font-semibold">
                                        {err("media.imageUrl") || err("media.videoUrl")}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="media.objectFit" label="Object Fit" tooltip="Cómo se ajusta el media al contenedor." />
                                <Select
                                    name="media.objectFit"
                                    defaultValue={val("media.objectFit", initialData?.media?.objectFit ?? "cover")}
                                >
                                    <SelectTrigger className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border rounded-sm">
                                        {SliderObjectFitEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs uppercase">{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Precio */}
                    <Card className="border-[color:var(--color-border)] bg-background">
                        <CardHeader className="border-b border-[color:var(--color-border)]/60 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">Precio</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    {/* Countdown */}
                    <Card className="border-[color:var(--color-border)] bg-background">
                        <CardHeader className="border-b border-[color:var(--color-border)]/60 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">Countdown</CardTitle>
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

                            <div className="space-y-1 flex flex-col">
                                <Label className="text-xs">Fecha de finalización</Label>
                                <input
                                    type="hidden"
                                    name="countdown.endsAt"
                                    value={countdownDate ? combineDateAndTime(countdownDate, countdownTime) : ""}
                                />
                                <div className="flex flex-row gap-2 w-full">
                                    <div className="flex-1">
                                        <Popover open={countdownOpen} onOpenChange={setCountdownOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={`w-full h-10 px-3 justify-between text-left font-normal text-xs bg-background-secondary rounded-sm ${err("countdown.endsAt") ? "border-destructive" : "border-border/40"} ${!countdownDate && "text-muted-foreground"}`}
                                                >
                                                    <span className="truncate capitalize">
                                                        {countdownDate ? format(countdownDate, "PPP", { locale: es }) : <span>Elegir fecha</span>}
                                                    </span>
                                                    <ChevronDownIcon className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={countdownDate ?? undefined}
                                                    onSelect={(d) => { if (d) setCountdownDate(d); setCountdownOpen(false); }}
                                                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="w-28 shrink-0">
                                        <Input
                                            type="time"
                                            value={countdownTime}
                                            onChange={(e) => setCountdownTime(e.target.value)}
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
                                    checked={showDays}
                                    onChange={(e) => setShowDays(e.target.checked)}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <Label className="text-xs cursor-pointer select-none">Mostrar días</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── COLUMNA LATERAL ────────────────────────────────────── */}
                <aside className="space-y-6">

                    {/* Apariencia */}
                    <Card className="border-[color:var(--color-border)] bg-background">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[color:var(--color-border)]/60">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">Apariencia</CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => { setTheme("dark"); setLayout("default"); setColors(THEME_PRESETS.dark); }}
                            >
                                Reajustar
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-5">

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold">Layout</Label>
                                <Select name="design.layout" value={layout} onValueChange={(v: SliderLayout) => setLayout(v)}>
                                    <SelectTrigger className="h-9 text-xs bg-background-secondary border-border/40 rounded-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border rounded-sm">
                                        {SliderLayoutEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs">{LAYOUT_LABELS[opt]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold">Tema</Label>
                                <Select name="design.theme" value={theme} onValueChange={(v: SliderTheme) => setTheme(v)}>
                                    <SelectTrigger className="h-9 text-xs bg-background-secondary border-border/40 rounded-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border rounded-sm">
                                        {SliderThemeEnum.options.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-xs capitalize">{opt}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3 pt-2">
                                {(Object.keys(colors) as Array<keyof ColorPalette>).map((key) => (
                                    <div key={key} className="space-y-1">
                                        <Label className="text-[9px] uppercase text-muted-foreground font-semibold">{COLOR_LABELS[key]}</Label>
                                        <input type="hidden" name={`design.${key}`} value={colors[key]} />
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={colors[key]}
                                                onChange={(e) => handleColorChange(key, e.target.value)}
                                                disabled={!isCustom}
                                                className="h-8 text-[11px] font-mono uppercase bg-background-secondary border-border/40 rounded-sm"
                                                maxLength={7}
                                            />
                                            <div className="relative w-10 h-8 shrink-0 rounded border overflow-hidden">
                                                <input
                                                    type="color"
                                                    value={colors[key]}
                                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                                    disabled={!isCustom}
                                                    className="absolute inset-0 w-full h-full cursor-pointer scale-150 disabled:cursor-not-allowed disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Publicación */}
                    <Card className="border-[color:var(--color-border)] bg-background">
                        <CardHeader className="border-b border-[color:var(--color-border)]/60 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider">Publicación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-5">

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

                            <div className="space-y-1 flex flex-col">
                                <Label className="text-xs font-bold">Publicar desde</Label>
                                <input type="hidden" name="schedule.startsAt" value={startDate ? combineDateAndTime(startDate, startTime) : ""} />
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
                                                    onSelect={(d) => { if (d) setStartDate(d); setOpenStart(false); }}
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

                            <div className="space-y-1 flex flex-col">
                                <Label className="text-xs font-bold">Publicar hasta</Label>
                                <input type="hidden" name="schedule.endsAt" value={endDate ? combineDateAndTime(endDate, endTime) : ""} />
                                <div className="flex flex-row gap-2 w-full">
                                    <div className="flex-1">
                                        <Popover open={openEnd} onOpenChange={setOpenEnd}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={`w-full h-10 px-3 justify-between text-left font-normal text-xs bg-background-secondary border-border/40 rounded-sm ${err("schedule.endsAt") ? "border-destructive" : "border-border/40"} ${!endDate && "text-muted-foreground"}`}
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
                                                    onSelect={(d) => { if (d) setEndDate(d); setOpenEnd(false); }}
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

                            <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                <Label className="text-xs font-bold">Activo</Label>
                                <input type="hidden" name="isActive" value="false" />
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    value="true"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}