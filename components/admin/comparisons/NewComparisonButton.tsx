// File: frontend/components/admin/comparisons/NewComparisonButton.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewComparisonButton() {
    return (
        <Button asChild size="sm" className="h-9 gap-1.5 text-xs font-semibold">
            <Link href="/admin/comparisons/new">
                <Plus size={16} />
                Nueva Comparativa
            </Link>
        </Button>
    );
}