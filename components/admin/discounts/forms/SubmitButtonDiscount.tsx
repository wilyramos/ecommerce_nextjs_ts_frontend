// File: frontend/components/admin/discounts/forms/SubmitButtonDiscount.tsx

"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitButtonDiscount() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Guardar Promoción"}
        </Button>
    );
}