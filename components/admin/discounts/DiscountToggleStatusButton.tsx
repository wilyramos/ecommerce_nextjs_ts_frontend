// File: frontend/components/admin/discounts/DiscountToggleStatusButton.tsx

"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleDiscountStatusAction } from "@/actions/discount-actions";
import { toast } from "sonner";

interface Props {
    id: string;
    isActive: boolean;
}

export default function DiscountToggleStatusButton({ id, isActive }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const res = await toggleDiscountStatusAction(id);
            if (res?.ok) {
                toast.success(res.message);
            } else if (res?.error) {
                toast.error(res.error);
            }
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isPending}
        >
            {isPending ? "Procesando..." : isActive ? "Desactivar" : "Activar"}
        </Button>
    );
}