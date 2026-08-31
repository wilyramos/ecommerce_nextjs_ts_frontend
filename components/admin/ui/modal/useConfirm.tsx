// File: frontend/components/admin/ui/modal/useConfirm.tsx
"use client";

import * as React from "react";
import { AdminConfirmDialog, type ConfirmVariant } from "./AdminConfirmDialog";

export interface ConfirmOptions {
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  confirmTextMatch?: string;
  confirmTextMatchPlaceholder?: string;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = React.createContext<ConfirmContextType | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = React.useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = React.useCallback((confirmed: boolean) => {
    if (dialogState) {
      dialogState.resolve(confirmed);
      setDialogState(null);
    }
  }, [dialogState]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialogState && (
        <AdminConfirmDialog
          open={dialogState.isOpen}
          onOpenChange={(open) => {
            if (!open) handleClose(false);
          }}
          title={dialogState.options.title}
          description={dialogState.options.description}
          confirmLabel={dialogState.options.confirmLabel}
          cancelLabel={dialogState.options.cancelLabel}
          variant={dialogState.options.variant || "danger"}
          confirmTextMatch={dialogState.options.confirmTextMatch}
          confirmTextMatchPlaceholder={dialogState.options.confirmTextMatchPlaceholder}
          onConfirm={() => handleClose(true)}
          onCancel={() => handleClose(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm debe usarse dentro de un <ConfirmDialogProvider>");
  }
  return context.confirm;
}