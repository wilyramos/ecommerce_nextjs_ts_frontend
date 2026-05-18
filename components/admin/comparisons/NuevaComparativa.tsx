"use client";

//File: frontend/components/admin/comparisons/NuevaComparativa.tsx
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

import React from 'react'

export default function NuevaComparativa() {


    const router = useRouter();

    return (
        <Button
            onClick={() => router.push("/admin/comparisons/new")}
            className="flex items-center gap-2"
        >
            <FiPlus className="h-4 w-4" />
            <span>Nuevo</span>
        </Button>
    );
}