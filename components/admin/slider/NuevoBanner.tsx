"use client";

import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function NuevoBanner() {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.push("/admin/slider/new")}
            className="flex items-center gap-2"
        >
            <FiPlus className="h-4 w-4" />
            <span>Nuevo</span>
        </Button>
    );
}