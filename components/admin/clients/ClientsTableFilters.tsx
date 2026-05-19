"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ClientsTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [filters, setFilters] = useState({
        nombre: searchParams.get("nombre") || "",
        email: searchParams.get("email") || "",
        telefono: searchParams.get("telefono") || "",
        numeroDocumento: searchParams.get("numeroDocumento") || "",
        rol: searchParams.get("rol") || "",
    });

    const handleFilterChange = useDebouncedCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    }, 400);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };

    const inputClasses = "h-8 w-full pl-8 text-xs bg-background border-border/40 focus:border-muted-foreground/60 rounded-sm";

    return (
        <tr className="bg-background-secondary/50 border-b border-border/60">
            {[
                { name: "nombre", placeholder: "Nombre" },
                { name: "email", placeholder: "Email" },
                { name: "telefono", placeholder: "Teléfono" },
                { name: "numeroDocumento", placeholder: "Documento" },
                { name: "rol", placeholder: "Rol" },
            ].map((field) => (
                <td key={field.name} className="p-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/60" />
                        <Input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name as keyof typeof filters]}
                            onChange={handleChange}
                            className={inputClasses}
                        />
                    </div>
                </td>
            ))}
        </tr>
    );
}