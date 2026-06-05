"use client";

import { useState } from "react";
import { Plus, Trash2, X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { diccionarioColores } from "@/src/utils/constants/colores";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryAttribute } from "@/src/schemas/category.schema";

type Props = { defaultAttributes?: CategoryAttribute[] };

export default function AttributeFields({ defaultAttributes }: Props) {
    const [attributes, setAttributes] = useState<CategoryAttribute[]>(
        defaultAttributes ?? []
    );

    const update = (fn: (draft: CategoryAttribute[]) => void) => {
        const draft = structuredClone(attributes);
        fn(draft);
        setAttributes(draft);
    };

    const handleNameChange = (i: number, val: string) => update((d) => { d[i].name = val; });
    const handleValueChange = (i: number, j: number, val: string) => update((d) => { d[i].values[j] = val; });
    const handleIsVariantChange = (i: number, val: boolean) => update((d) => { d[i].isVariant = val; });
    const addAttribute = () => setAttributes((prev) => [...prev, { name: "", values: [""], isVariant: false }]);
    const removeAttribute = (i: number) => update((d) => { d.splice(i, 1); });
    const addValue = (i: number) => update((d) => { d[i].values.push(""); });
    const removeValue = (i: number, j: number) => update((d) => { d[i].values.splice(j, 1); });

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Label className="text-base font-semibold">
                    Atributos del producto
                    {attributes.length > 0 && (
                        <Badge variant="secondary" className="ml-2 font-normal">{attributes.length}</Badge>
                    )}
                </Label>
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={addAttribute}>
                    <Plus className="h-4 w-4 mr-2" /> Añadir atributo
                </Button>
            </div>

            <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

            {/* Grid responsive: 1 col móvil, 2 col tablet, 3 col escritorio */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {attributes.map((attr, i) => {
                    const isColor = attr.name.toLowerCase() === "color";
                    return (
                        <Card key={i} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/30">
                                <CardTitle className="text-sm font-bold truncate">
                                    {attr.name || `Atributo ${i + 1}`}
                                </CardTitle>
                                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeAttribute(i)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-4 p-4 flex-grow">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-muted-foreground">Nombre</Label>
                                    <Input value={attr.name} onChange={(e) => handleNameChange(i, e.target.value)} placeholder="Ej: Color, Talla..." className="h-9" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">Valores</Label>
                                    <div className="space-y-2">
                                        {attr.values.map((val, j) => (
                                            <div key={j} className="flex gap-2 items-center">
                                                {isColor ? (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="w-full justify-between h-9 text-sm font-normal px-2">
                                                                <div className="flex items-center gap-2 truncate">
                                                                    {val && diccionarioColores[val.toLowerCase()] && (
                                                                        <div className={cn("h-4 w-4 rounded-full border border-gray-200", diccionarioColores[val.toLowerCase()])} />
                                                                    )}
                                                                    {val || "Seleccionar color..."}
                                                                </div>
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0 w-[240px]">
                                                            <Command>
                                                                <CommandInput placeholder="Buscar color..." />
                                                                <CommandList className="max-h-[200px]">
                                                                    <CommandEmpty>Color no encontrado.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {Object.keys(diccionarioColores).map((color) => (
                                                                            <CommandItem key={color} onSelect={() => handleValueChange(i, j, color)}>
                                                                                <Check className={cn("mr-2 h-4 w-4", val === color ? "opacity-100" : "opacity-0")} />
                                                                                <div className={cn("mr-2 h-4 w-4 rounded-full border", diccionarioColores[color])} />
                                                                                {color}
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <Input value={val} onChange={(e) => handleValueChange(i, j, e.target.value)} placeholder="Ej: Rojo, M..." className="h-9" />
                                                )}

                                                {attr.values.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeValue(i, j)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="ghost" size="sm" className="h-8 text-xs w-full" onClick={() => addValue(i)}>
                                        <Plus className="h-3.5 w-3.5 mr-1" /> Añadir valor
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t">
                                    <Switch checked={attr.isVariant ?? false} onCheckedChange={(v) => handleIsVariantChange(i, v)} />
                                    <Label className="text-xs font-medium cursor-pointer">Variante de producto</Label>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}