// File: components/admin/orders/OrderFiltersV2.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
    filters: {
        status?: string;
        email?: string;
        from?: string;
        to?: string;
    };
}

export default function OrderFiltersV2({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [email, setEmail] = useState(filters.email ?? "");
    const [status, setStatus] = useState(filters.status ?? "ALL");
    const [from, setFrom] = useState(filters.from ?? "");
    const [to, setTo] = useState(filters.to ?? "");

    const handleApplyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", "1");

            if (email.trim()) params.set("email", email.trim()); else params.delete("email");
            if (status !== "ALL") params.set("status", status); else params.delete("status");
            if (from) params.set("from", from); else params.delete("from");
            if (to) params.set("to", to); else params.delete("to");

            router.push(`/admin/orders?${params.toString()}`);
        });
    };

    const handleClear = () => {
        setEmail("");
        setStatus("ALL");
        setFrom("");
        setTo("");
        router.push("/admin/orders");
    };

    return (
        <form onSubmit={handleApplyFilters} className="bg-card border border-border p-4 rounded-[var(--radius-md)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Cliente (Email)</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Ej: cliente@correo.com" className="h-9 text-xs" />
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Estado Logístico</label>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos los estados</SelectItem>
                        <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Desde</label>
                <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="h-9 text-xs" />
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">Hasta</label>
                <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="h-9 text-xs" />
            </div>

            <div className="flex gap-2 sm:col-span-2 md:col-span-1">
                <Button type="submit" disabled={isPending} className="h-9 text-xs font-bold flex-1 bg-foreground text-background">
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Filtrar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleClear} className="h-9 text-xs font-bold flex-1">
                    Limpiar
                </Button>
            </div>
        </form>
    );
}