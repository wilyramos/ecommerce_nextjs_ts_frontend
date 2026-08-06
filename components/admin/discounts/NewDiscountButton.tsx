// File: frontend/components/admin/discounts/NewDiscountButton.tsx

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DiscountTypeModal from "./DiscountTypeModal";

export default function NewDiscountButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="h-8 text-xs font-bold gap-1.5"
            >
                <Plus className="w-3.5 h-3.5" />
                Nuevo Cupón
            </Button>

            <DiscountTypeModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}