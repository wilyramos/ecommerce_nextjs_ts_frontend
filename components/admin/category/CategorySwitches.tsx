// File: components/admin/category/CategorySwitches.tsx

"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = { isActive?: boolean };

export default function CategorySwitches({ isActive = true }: Props) {
    // Estado local para que el hidden input se mantenga sincronizado
    const [active, setActive] = useState(isActive);

    return (
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                    Categoría activa
                </Label>
                <p className="text-xs text-muted-foreground">
                    Las categorías inactivas no se muestran en la tienda.
                </p>
            </div>
            <Switch
                id="isActive"
                checked={active}
                onCheckedChange={setActive}
            />
            {/* Hidden input sincronizado — el Switch de shadcn no escribe en FormData */}
            <input type="hidden" name="isActive" value={active ? "true" : "false"} />
        </div>
    );
}