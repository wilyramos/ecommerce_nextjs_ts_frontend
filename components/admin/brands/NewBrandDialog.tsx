"use client";

import React, { useActionState, useEffect, useState } from "react";
import { createBrandAction } from "@/actions/brand/create-brand-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { FormMediaField } from "@/components/form/FormMediaField";
import { toast } from "sonner";

export default function NewBrandDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const [state, dispatch] = useActionState(createBrandAction, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.errors?.length) {
      state.errors.forEach((err: string) => toast.error(err));
    }
    if (state.success) {
      toast.success(state.success);
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg border-[color:var(--color-border)] bg-[color:var(--color-background)]">
        <DialogHeader>
          <DialogTitle className="text-[color:var(--color-foreground)]">Nueva Marca</DialogTitle>
        </DialogHeader>

        <form action={dispatch} className="space-y-4">
          {state.errors?.map((error: string, index: number) => (
            <ErrorMessage key={index}>{error}</ErrorMessage>
          ))}

          <div className="space-y-1">
            <Label htmlFor="nombre">Nombre de la marca</Label>
            <Input 
              id="nombre"
              name="nombre" 
              placeholder="Ej. Apple" 
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input 
              id="descripcion"
              name="descripcion" 
              placeholder="Descripción breve de la marca" 
            />
          </div>

          {/* Campo unificado de Medios: Inyecta automáticamente el input name="logo" al Form */}
          <div className="space-y-1.5">
            <FormMediaField
              name="logo"
              label="Logo de la marca"
              folder="brands"
              multiple={false}
              maxFiles={1}
              accept="image"
            />
          </div>

          <Button type="submit" className="w-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] hover:bg-[color:var(--color-primary)]/90">
            Crear
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}