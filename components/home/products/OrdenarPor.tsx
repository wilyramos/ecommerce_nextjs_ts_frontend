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
];

export default function OrdenarPor({ pathname }: { pathname?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentValue = searchParams.get("sort") || "";

    const selected = sortOptions.find((opt) => opt.value === currentValue) || sortOptions[0];

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if(value){
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative w-64 max-w-xs text-sm text-gray-700">
            <Listbox value={selected.value} onChange={handleChange}>
                <div className="relative">
                    <Listbox.Button className="w-full cursor-pointer border border-gray-200 bg-white rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none hover:ring-1 hover:ring-indigo-500">
                        <div className="flex items-center gap-2">
                            <HiOutlineSortDescending className="text-indigo-600 text-xl" />
                            <span>{selected.label}</span>
                        </div>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
                        {sortOptions.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className={({ active }) =>
                                    `cursor-pointer select-none px-4 py-2 ${active ? "bg-indigo-100 text-indigo-700" : "text-gray-800"
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex justify-between items-center">
                                        <span>{option.label}</span>
                                        {selected && <FaCheck className="text-indigo-600 text-xs" />}
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