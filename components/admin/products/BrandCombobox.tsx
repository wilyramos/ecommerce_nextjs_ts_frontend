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
    value?: string;
}

export default function BrandCombobox({ brands, value: defaultValue }: BrandComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(defaultValue || "");

    return (
        <div>
            <input type="hidden" name="brand" value={value || ""} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full border border-gray-300 rounded-lg p-3 justify-between text-left font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {value
                            ? brands.find((b) => b._id === value)?.nombre
                            : "Selecciona una marca..."}
                        <ChevronsUpDown className="opacity-50 w-4 h-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0"
                >
                    <Command>
                        <CommandInput placeholder="Buscar marca..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No se encontró la marca.</CommandEmpty>
                            <CommandGroup>
                                {brands.map((brand) => (
                                    <CommandItem
                                        key={brand._id}
                                        value={brand._id}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {brand.nombre}
                                        <Check
                                            className={cn(
                                                "ml-auto",
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