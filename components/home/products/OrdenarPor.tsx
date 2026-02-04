"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Listbox } from "@headlessui/react";
import { HiOutlineSortDescending } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";

const sortOptions = [
    { label: "Relevancia", value: "" },
    { label: "Precio: menor a mayor", value: "price-asc" },
    { label: "Precio: mayor a menor", value: "price-desc" },
    { label: "Nombre: A-Z", value: "name-asc" },
    { label: "Nombre: Z-A", value: "name-desc" },
    { label: "Más recientes", value: "recientes" },
];

type Props = {
    pathname?: string;
};

export default function OrdenarPor({ pathname }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPath = usePathname();

    const basePath = pathname || currentPath;
    const currentValue = searchParams.get("sort") || "";

    const selected =
        sortOptions.find((opt) => opt.value === currentValue) ||
        sortOptions[0];

    const handleChange = (value: string) => {
        if (value === currentValue) return;

        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }

        router.push(`${basePath}?${params.toString()}`);
    };

    return (
        <Listbox value={selected.value} onChange={handleChange}>
            <div className="relative w-56">
                <Listbox.Button
                    className="
                        w-full cursor-pointer rounded-lg 
                        bg-[var(--store-surface)] px-3 py-2
                        
                        text-sm
                    "
                >
                    <div className="flex items-center gap-2">
                        <HiOutlineSortDescending className="text-[var(--store-store-primary)]" />
                        <span className="truncate">{selected.label}</span>
                    </div>
                </Listbox.Button>

                <Listbox.Options
                    className="
                        absolute mt-1 z-20 w-full
                        bg-[var(--store-surface)]
                        border border-[var(--store-border)]
                        rounded-md shadow-lg
                        focus:outline-none text-sm
                    "
                >
                    {sortOptions.map((option) => (
                        <Listbox.Option
                            key={option.value || "default"}
                            value={option.value}
                            className={({ active }) =>
                                `cursor-pointer select-none px-3 py-2 ${active
                                    ? "bg-[var(--store-surface-hover)]"
                                    : ""
                                }`
                            }
                        >
                            {({ selected }) => (
                                <div className="flex justify-between items-center">
                                    <span>{option.label}</span>
                                    {selected && (
                                        <FaCheck className="text-[var(--store-store-primary)] text-xs" />
                                    )}
                                </div>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    );
}
