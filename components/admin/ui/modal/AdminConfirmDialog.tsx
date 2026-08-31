// File: frontend/components/admin/ui/modal/AdminConfirmDialog.tsx
"use client";

import * as React from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Loader2 } from "lucide-react";
import { AdminModal } from "./AdminModal";
import { Button } from "@/components/ui/button";
import { AdminTextInput } from "@/components/admin/ui/form/FormInputs";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "danger" | "warning" | "info" | "success";

export interface AdminConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  /** Texto que el usuario debe tipear exactamente para habilitar la confirmación (ej: "CONFIRMAR") */
  confirmTextMatch?: string;
  confirmTextMatchPlaceholder?: string;
}

const variantIcons: Record<ConfirmVariant, React.ReactNode> = {
  danger: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  info: <Info className="w-5 h-5 text-zinc-800 shrink-0" />,
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
};

const variantButtonStyles: Record<ConfirmVariant, string> = {
  danger: "bg-red-600 hover:bg-red-700 text-white border-red-600",
  warning: "bg-amber-600 hover:bg-amber-700 text-white border-amber-600",
  info: "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
};

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
  confirmTextMatch,
  confirmTextMatchPlaceholder = "Escribe aquí para confirmar...",
}: AdminConfirmDialogProps) {
  const [typedMatch, setTypedMatch] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setTypedMatch("");
    }
  }, [open]);

  const isMatchValid = confirmTextMatch
    ? typedMatch.trim() === confirmTextMatch.trim()
    : true;

  const handleConfirm = async () => {
    if (!isMatchValid || isLoading) return;
    await onConfirm();
  };

  const handleCancel = () => {
    if (isLoading) return;
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AdminModal
      open={open}
      onOpenChange={(v) => {
        if (!isLoading) onOpenChange(v);
      }}
      size="sm"
      hideCloseButton={isLoading}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleCancel}
            className="h-8 px-4 text-xs font-semibold border-zinc-200 text-zinc-700 hover:bg-zinc-100"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={!isMatchValid || isLoading}
            onClick={handleConfirm}
            className={cn(
              "h-8 px-4 text-xs font-semibold border",
              variantButtonStyles[variant]
            )}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 border border-zinc-200 bg-zinc-50 shrink-0">
          {variantIcons[variant]}
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
            {title}
          </h3>
          <div className="text-xs text-zinc-600 leading-relaxed space-y-2">
            {description}
          </div>

          {confirmTextMatch && (
            <div className="pt-3 space-y-1.5 border-t border-zinc-100">
              <p className="text-[11px] font-semibold text-zinc-700">
                Para confirmar, escribe{" "}
                <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1 py-0.5 border border-zinc-200 select-all">
                  {confirmTextMatch}
                </span>:
              </p>
              <AdminTextInput
                value={typedMatch}
                onChange={(e) => setTypedMatch(e.target.value)}
                placeholder={confirmTextMatchPlaceholder}
                disabled={isLoading}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </AdminModal>
  );
}