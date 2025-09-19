"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";

export default function ProductSearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [query, setQuery] = useState(() => searchParams.get("query") || "");

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams();
        if (value.trim()) {
            params.set("query", value);
        } else {
            params.delete("query");
        }
        router.push(`${pathname}?${params.toString()}`);
    }, 500);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        handleSearch(value);
    };

    return (
        // <div className="relative">
            <Input
                type="text"
                value={query}
                onChange={onChange}
                placeholder="Buscar productos..."
            />
        // </div>
    );
}
