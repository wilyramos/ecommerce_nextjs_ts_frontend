"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TBrand } from "@/src/schemas/brands";

interface BrandComboboxProps {
    brands: TBrand[];
    value?: string; // El ID de la marca seleccionada
    onChange?: (value: string) => void; // <--- Callback para avisar al padre
}

export default function BrandCombobox({ brands, value, onChange }: BrandComboboxProps) {
    const [open, setOpen] = React.useState(false);

    // Buscamos el nombre de la marca seleccionada para mostrarlo en el botón
    const selectedBrandLabel = brands.find((b) => b._id === value)?.nombre;

    return (
        <div>
            {/* Input oculto para que el Server Action reciba el dato 'brand' automáticamente */}
            <input type="hidden" name="brand" value={value || ""} />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between text-left font-normal"
                    >
                        {selectedBrandLabel || "Selecciona una marca..."}
                        <ChevronsUpDown className="opacity-50 w-4 h-4 ml-2" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar marca..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No se encontró la marca.</CommandEmpty>
                            <CommandGroup>
                                {brands.map((brand) => (
                                    <CommandItem
                                        key={brand._id}
                                        // IMPORTANTE: value debe ser el nombre para que el buscador funcione
                                        value={brand.nombre}
                                        onSelect={() => {
                                            // 1. Aseguramos que el ID sea un string (fallback a "" si es undefined)
                                            const brandId = brand._id || "";

                                            // 2. Lógica de Toggle: Si ya estaba seleccionado, enviamos "", sino el ID
                                            const newValue = brandId === value ? "" : brandId;

                                            // 3. Ejecutamos onChange solo si existe
                                            if (onChange) {
                                                onChange(newValue);
                                            }

                                            setOpen(false);
                                        }}
                                    >
                                        {brand.nombre}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === brand._id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}