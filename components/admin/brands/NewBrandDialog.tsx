"use client";


import { createBrandAction } from "@/actions/brand/create-brand-action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/components/ui/ErrorMessage";


import React, { useActionState, useEffect, useState } from 'react'
import UploadBrandImage from "./UploadBrandImage";
import { toast } from "sonner";

export default function NewBrandDialog({ trigger }: { trigger: React.ReactNode }) {

    const [open, setOpen] = useState(false);

    const [state, dispatch] = useActionState(createBrandAction, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors.length) {
            state.errors.forEach(err => toast.error(err));
        }
        if (state.success) {
            toast.success(state.success);
            setOpen(false);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nueva Marca</DialogTitle>
                </DialogHeader>

                <form action={dispatch} className="space-y-4">
                    {state.errors && state.errors.map((error, index) => (
                        <ErrorMessage key={index}>{error}</ErrorMessage>
                    ))}
                    <Input name="nombre" placeholder="Nombre" />
                    <Input name="descripcion" placeholder="Descripción" />

                    <UploadBrandImage
                    // defaultImage={brand.logo}
                    />

                    <Button type="submit">Crear</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
