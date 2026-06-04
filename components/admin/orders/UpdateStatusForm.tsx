"use client";

// import { useActionState } from "react";
// import { updateOrderStatusAction } from "@/actions/order-actions";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2 } from "lucide-react";


export default function UpdateStatusForm() {

   

    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Estado del Pedido</label>
            <div className="flex items-center gap-2">

                PENDIENTE A IMPLEMENTAR
                {/* <Select  disabled={isPending}>
                    <SelectTrigger className="w-full h-9 text-xs font-semibold">
                        <SelectValue placeholder="Seleccionar Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                </Select>
                {isPending && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />} */}
            </div>
        </div>
    );
}