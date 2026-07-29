// File: frontend/components/admin/discounts/DiscountFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DiscountFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    const applySearchDebounced = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`/admin/discounts?${params.toString()}`);
        });
    }, 400);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        applySearchDebounced(value);
    };

    const handleReset = () => {
        setSearchTerm("");
        startTransition(() => {
            router.push("/admin/discounts");
        });
    };

    return (
        <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Buscar por código de cupón..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="text-xs h-8"
                />
            </div>

            {searchTerm && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                    Limpiar
                </Button>
            )}
        </div>
    );
}