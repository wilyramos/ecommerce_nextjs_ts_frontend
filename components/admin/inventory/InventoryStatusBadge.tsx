// File: frontend/components/admin/inventory/InventoryStatusBadge.tsx

import { Badge } from "@/components/ui/badge";

interface Props {
    stock: number;
}

export default function InventoryStatusBadge({ stock }: Props) {
    if (stock === 0) {
        return (
            <Badge variant="destructive" size="sm" className="font-bold uppercase">
                Agotado
            </Badge>
        );
    }

    if (stock <= 5) {
        return (
            <Badge variant="warning" size="sm" className="font-bold uppercase">
                Bajo Stock
            </Badge>
        );
    }

    return (
        <Badge variant="success" size="sm" className="font-bold uppercase">
            Óptimo
        </Badge>
    );
}