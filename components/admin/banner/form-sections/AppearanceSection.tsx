import { useState, useEffect } from "react";
import { Palette, LayoutTemplate, RotateCcw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    SliderLayoutEnum,
    SliderThemeEnum,
    type SliderBanner,
} from "@/src/schemas/slider.schema";
import { z } from "zod";

// --- TIPADO ESTRICTO ---
type SliderTheme = z.infer<typeof SliderThemeEnum>;
type SliderLayout = z.infer<typeof SliderLayoutEnum>;
type DistributionItem = "title" | "subtitle" | "description" | "price";
type DistributionSide = "leftSide" | "rightSide";

interface ColorPalette {
    bgColor: string;
    accentColor: string;
    textColor: string;
    textMutedColor: string;
}

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
}

export default function AppearanceSection({ initialData, fields }: SectionProps) {
    // --- ESTADO: TEMA Y LAYOUT ---
    const [theme, setTheme] = useState<SliderTheme>(
        (fields?.["design.theme"] as SliderTheme) || (initialData?.design.theme as SliderTheme) || "dark"
    );

    const [layout, setLayout] = useState<SliderLayout>(
        (fields?.["design.layout"] as SliderLayout) || (initialData?.design.layout as SliderLayout) || "default"
    );

    // --- ESTADO: COLORES ---
    const [colors, setColors] = useState<ColorPalette>({
        bgColor: fields?.["design.bgColor"] || initialData?.design.bgColor || "#000000",
        accentColor: fields?.["design.accentColor"] || initialData?.design.accentColor || "#ffffff",
        textColor: fields?.["design.textColor"] || initialData?.design.textColor || "#ffffff",
        textMutedColor: fields?.["design.textMutedColor"] || initialData?.design.textMutedColor || "#aaaaaa",
    });

    // --- ESTADO: DISTRIBUCIÓN ---
    const [distribution, setDistribution] = useState<Record<DistributionSide, DistributionItem[]>>({
        leftSide: (initialData?.design?.contentDistribution?.leftSide as DistributionItem[]) || [],
        rightSide: (initialData?.design?.contentDistribution?.rightSide as DistributionItem[]) || [],
    });

    const isCustom = theme === "custom";

    // Lógica de presets de colores según el tema
    useEffect(() => {
        if (theme === "dark") {
            setColors({ bgColor: "#000000", accentColor: "#3b82f6", textColor: "#ffffff", textMutedColor: "#9ca3af" });
        } else if (theme === "light") {
            setColors({ bgColor: "#ffffff", accentColor: "#2563eb", textColor: "#1f2937", textMutedColor: "#6b7280" });
        }
    }, [theme]);

    const handleColorChange = (key: keyof ColorPalette, value: string) => {
        if (!isCustom) return;
        setColors(prev => ({ ...prev, [key]: value }));
    };

    // Lógica de exclusión mutua para la distribución
    const toggleDistribution = (side: DistributionSide, item: DistributionItem) => {
        const otherSide: DistributionSide = side === "leftSide" ? "rightSide" : "leftSide";
        setDistribution(prev => {
            const isAlreadyInSide = prev[side].includes(item);
            return {
                [otherSide]: prev[otherSide].filter(i => i !== item),
                [side]: isAlreadyInSide ? prev[side].filter(i => i !== item) : [...prev[side], item]
            } as Record<DistributionSide, DistributionItem[]>;
        });
    };

    const resetAll = () => {
        setTheme("dark");
        setLayout("default");
        setDistribution({ leftSide: [], rightSide: [] });
    };

    const distributionItems: readonly DistributionItem[] = ["title", "subtitle", "description", "price"];

    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-white space-y-4 shadow-sm relative">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-pink-500" />
                        <h2 className="text-[11px] font-bold uppercase tracking-tight">Estilo Visual</h2>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-orange-500" onClick={resetAll}>
                        <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {/* SELECTOR DE LAYOUT (Recuperado) */}
                <div className="space-y-2">
                    <Label className="text-xs">Layout del Slider</Label>
                    <Select
                        name="design.layout"
                        value={layout}
                        onValueChange={(v: SliderLayout) => setLayout(v)}
                    >
                        <SelectTrigger className="h-8 text-xs font-medium bg-gray-50/50">
                            <SelectValue placeholder="Seleccionar layout" />
                        </SelectTrigger>
                        <SelectContent>
                            {SliderLayoutEnum.options.map((opt) => (
                                <SelectItem key={opt} value={opt} className="text-xs capitalize">
                                    {opt.replace(/-/g, ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* SELECTOR DE TEMA */}
                <div className="space-y-2">
                    <Label className="text-xs">Esquema de Colores</Label>
                    <Select name="design.theme" value={theme} onValueChange={(v: SliderTheme) => setTheme(v)}>
                        <SelectTrigger className="h-8 text-xs bg-gray-50/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SliderThemeEnum.options.map(opt => (
                                <SelectItem key={opt} value={opt} className="text-xs capitalize">{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {!isCustom && <p className="text-[9px] text-blue-600 font-medium italic">* Colores automáticos activos</p>}
                </div>

                {/* CAMPOS HEXADECIMALES */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                    {(Object.keys(colors) as Array<keyof ColorPalette>).map((key) => (
                        <div key={key} className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-400">{key.replace('Color', '')}</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={colors[key]}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    disabled={!isCustom}
                                    className="h-8 text-[11px] font-mono uppercase"
                                    maxLength={7}
                                />
                                <div className="relative w-10 h-8 shrink-0 rounded border overflow-hidden">
                                    <input
                                        type="color"
                                        name={`design.${key}`}
                                        value={colors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        disabled={!isCustom}
                                        className="absolute inset-0 w-full h-full cursor-pointer scale-150 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECCIÓN DISTRIBUCIÓN */}
            <div className="p-4 border rounded-lg bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-[11px] font-bold uppercase">Distribución</h2>
                </div>

                {(["leftSide", "rightSide"] as const).map((side) => (
                    <div key={side} className={`p-3 rounded-md border ${side === 'leftSide' ? 'bg-blue-50/20 border-blue-100' : 'bg-purple-50/20 border-purple-100'} space-y-3`}>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                                {side === "leftSide" ? "Lado Izquierdo" : "Lado Derecho"}
                            </p>
                            <Button type="button" variant="ghost" className="h-5 px-1 text-[9px] text-red-400 hover:bg-transparent" onClick={() => setDistribution(p => ({ ...p, [side]: [] }))}>
                                <Trash2 className="w-3 h-3 mr-1" /> Limpiar
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {distributionItems.map((item) => {
                                const isChecked = distribution[side].includes(item);
                                return (
                                    <label key={item} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${isChecked ? 'bg-white border-blue-400 shadow-sm' : 'bg-transparent border-transparent opacity-50'}`}>
                                        <input
                                            type="checkbox"
                                            name={`design.${side}`}
                                            value={item}
                                            checked={isChecked}
                                            onChange={() => toggleDistribution(side, item)}
                                            className="w-3.5 h-3.5 accent-blue-600"
                                        />
                                        <span className="text-[10px] font-medium capitalize">{item}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}