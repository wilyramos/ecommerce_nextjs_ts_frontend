"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MdClear } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import type { TFilter } from "@/src/schemas";

type Props = {
    filters: TFilter[] | null;
};

export default function DrawerFiltersMain({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    const { categories = [], brands = [], atributos = [], price = [] } =
        filters?.[0] ?? {};

    const priceFilter = price?.[0] ?? null;

    const [selectedFilters, setSelectedFilters] =
        useState<Record<string, string[]>>();
    const [minPrice, setMinPrice] = useState<number>(priceFilter?.min ?? 0);
    const [maxPrice, setMaxPrice] = useState<number>(priceFilter?.max ?? 0);

    useEffect(() => {
        if (!filters) return;

        const parsed: Record<string, string[]> = {};

        const categoryVals = searchParams.getAll("category");
        if (categoryVals.length) parsed["category"] = categoryVals;

        const brandsVals = searchParams.getAll("brand");
        if (brandsVals.length) parsed["brand"] = brandsVals;

        atributos.forEach((attr) => {
            const vals = searchParams.getAll(attr.name);
            if (vals.length) parsed[attr.name] = vals;
        });

        setSelectedFilters(parsed);

        if (priceFilter) {
            const range = searchParams.get("priceRange");
            const [min, max] =
                range?.split("-").map(Number) ?? [
                    priceFilter.min ?? 0,
                    priceFilter.max ?? 0,
                ];
            setMinPrice(min);
            setMaxPrice(max);
        }
    }, [searchParams, filters, atributos, brands, categories, priceFilter]);

    if (!filters?.length) return null;

    const updateParams = (updates: Record<string, string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");

        Object.entries(updates).forEach(([key, val]) => {
            params.delete(key);
            if (val?.length) val.forEach((v) => params.append(key, v));
        });

        router.push(`/productos?${params.toString()}`);
    };

    const toggleCheckboxValue = (attr: string, val: string) => {
        const prev = selectedFilters?.[attr] ?? [];
        const upd = prev.includes(val)
            ? prev.filter((v) => v !== val)
            : [...prev, val];

        setSelectedFilters({ ...selectedFilters, [attr]: upd });
        updateParams({ [attr]: upd });
    };

    const handlePriceChange = (type: "min" | "max", val: string) => {
        const num = Math.max(0, Number(val) || 0);
        if (type === "min") {
            setMinPrice(num);
            updateParams({ priceRange: [`${num}-${maxPrice}`] });
        } else {
            setMaxPrice(num);
            updateParams({ priceRange: [`${minPrice}-${num}`] });
        }
    };

    const clearFilters = () => {
        const cleared: Record<string, null> = {};
        categories.forEach(() => (cleared["category"] = null));
        atributos.forEach((a) => (cleared[a.name] = null));
        cleared["brand"] = null;

        setSelectedFilters({});
        if (priceFilter) {
            setMinPrice(priceFilter.min ?? 0);
            setMaxPrice(priceFilter.max ?? 0);
        }

        updateParams({ ...cleared, priceRange: null, sort: null });
        setOpen(false);
    };

    const SectionTitle = ({ title }: { title: string }) => (
        <span className="uppercase tracking-wide text-sm font-semibold text-[var(--store-text-muted)]">
            {title}
        </span>
    );

    const Item = ({
        label,
        checked,
        onClick,
    }: {
        label: string;
        checked: boolean;
        onClick: () => void;
    }) => (
        <li
            onClick={onClick}
            className="
        flex items-center gap-3 py-2 px-2 rounded-md cursor-pointer select-none
        hover:bg-[var(--store-surface-hover)] transition
      "
        >
            <input
                type="checkbox"
                checked={checked}
                readOnly
                className="accent-[var(--store-primary)] pointer-events-none"
            />
            <span className="text-[13px] text-[var(--store-text)]">{label}</span>
        </li>
    );

    const SectionWrapper = ({
        title,
        children,
    }: {
        title: string;
        children: React.ReactNode;
    }) => (
        <Disclosure>
            {({ open }) => (
                <div className="border-b border-[var(--store-border)] pb-2">
                    <Disclosure.Button
                        className="
              w-full flex justify-between items-center py-3 px-1
              hover:bg-[var(--store-surface-hover)] transition
            "
                    >
                        <SectionTitle title={title} />
                        <ChevronUpIcon
                            className={`w-5 h-5 text-[var(--store-text-muted)] transition-transform ${open ? "rotate-180" : ""
                                }`}
                        />
                    </Disclosure.Button>

                    <Disclosure.Panel className="py-2">{children}</Disclosure.Panel>
                </div>
            )}
        </Disclosure>
    );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button
                    className="
            w-full sm:hidden
            
            px-3 py-2
            flex items-center gap-2 justify-center
            text-[var(--store-text)]
          "
                >
                    <VscSettings size={18} />
                    <span className="text-sm">Filtros</span>
                </button>
            </DrawerTrigger>

            <DrawerContent className="p-0 rounded-t-xl bg-[var(--store-surface)]">
                <DrawerHeader className="p-4 border-b border-[var(--store-border)]">
                    <div className="flex w-full justify-between items-center">
                        <DrawerTitle className="text-lg font-medium text-[var(--store-text)]">
                            Filtros
                        </DrawerTitle>

                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-sm text-[var(--store-error)] hover:opacity-80"
                        >
                            <MdClear size={17} />
                            Limpiar
                        </button>
                    </div>
                </DrawerHeader>

                <ScrollArea className="h-[72vh] px-4">
                    {categories.length > 0 && (
                        <SectionWrapper title="Categorías">
                            <ul>
                                {categories
                                    .slice()
                                    .sort((a, b) =>
                                        a.nombre.localeCompare(b.nombre, undefined, {
                                            sensitivity: "base",
                                        })
                                    )
                                    .map((c) => (
                                        <Item
                                            key={c.slug}
                                            label={c.nombre}
                                            checked={!!selectedFilters?.category?.includes(c.slug)}
                                            onClick={() => toggleCheckboxValue("category", c.slug)}
                                        />
                                    ))}
                            </ul>
                        </SectionWrapper>
                    )}

                    {brands.length > 0 && (
                        <SectionWrapper title="Marcas">
                            <ul>
                                {brands
                                    .slice()
                                    .sort((a, b) =>
                                        a.nombre.localeCompare(b.nombre, undefined, {
                                            sensitivity: "base",
                                        })
                                    )
                                    .map((m) => (
                                        <Item
                                            key={m.slug}
                                            label={m.nombre}
                                            checked={!!selectedFilters?.brand?.includes(m.slug)}
                                            onClick={() => toggleCheckboxValue("brand", m.slug)}
                                        />
                                    ))}
                            </ul>
                        </SectionWrapper>
                    )}

                    {atributos.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {atributos.map((attr) => (
                                <SectionWrapper key={attr.name} title={attr.name}>
                                    <ul>
                                        {attr.values.map((v) => (
                                            <Item
                                                key={v}
                                                label={v}
                                                checked={!!selectedFilters?.[attr.name]?.includes(v)}
                                                onClick={() => toggleCheckboxValue(attr.name, v)}
                                            />
                                        ))}
                                    </ul>
                                </SectionWrapper>
                            ))}
                        </div>
                    )}

                    {priceFilter && (
                        <div className="py-4">
                            <SectionTitle title="Precio" />

                            <div className="flex items-center gap-4 mt-3">
                                {(["min", "max"] as const).map((type) => (
                                    <div key={type} className="flex flex-col text-xs w-full">
                                        <label className="mb-1 text-[var(--store-text-muted)]">
                                            {type === "min" ? "Mín" : "Máx"}
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={type === "min" ? minPrice : maxPrice}
                                            onChange={(e) =>
                                                handlePriceChange(type, e.target.value)
                                            }
                                            className="
                        w-full border border-[var(--store-border)]
                        rounded px-2 py-1
                        bg-[var(--store-surface)]
                        text-[var(--store-text)]
                        focus:outline-none
                        focus:ring-1 focus:ring-[var(--store-primary)]
                      "
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
