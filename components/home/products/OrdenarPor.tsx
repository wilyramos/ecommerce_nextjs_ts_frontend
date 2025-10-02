"use client";

import { useRouter, useSearchParams } from "next/navigation";
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

export default function OrdenarPor({ pathname }: { pathname?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentValue = searchParams.get("sort") || "";

    const selected = sortOptions.find((opt) => opt.value === currentValue) || sortOptions[0];

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative w-48 max-w-xs text-sm">
            <Listbox value={selected.value} onChange={handleChange}>
                <div className="relative">
                    <Listbox.Button className="w-full cursor-pointer  bg-white rounded-md shadow-xs px-2 py-2">
                        <div className="flex items-center gap-2">
                            <HiOutlineSortDescending className="text-black text-xl" />
                            <span>{selected.label}</span>
                        </div>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
                        {sortOptions.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className={({ active }) =>
                                    `cursor-pointer select-none px-4 py-2 ${active ? "bg-gray-100 text-black" : "text-gray-800"
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex justify-between items-center">
                                        <span>{option.label}</span>
                                        {selected && <FaCheck className="text-black text-xs" />}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}