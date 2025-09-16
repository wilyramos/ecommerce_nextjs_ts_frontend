"use client";

import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";

export default function AddProductButton() {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.push("/admin/products/new")}
            className="flex items-center gap-2"
        >
            <FiPlus className="h-4 w-4" />
            <span>Nuevo</span>
        </Button>
    );
}