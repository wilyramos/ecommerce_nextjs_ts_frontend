"use client";

import { useEffect, useActionState, startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

// IMPORTANTE: Importamos ActionState
import {
    lineFormSchema,
    LineFormValues,
    ProductLine,
    initialState,
    ActionState
} from "@/src/schemas/line.schema";

import { createLineAction, updateLineAction } from "@/actions/line/lines.actions";

import type { Brand } from "@/src/services/brands";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

interface LineFormProps {
    initialData: ProductLine | null;
    brands: Brand[];
    categories: { _id: string; nombre: string }[];
    onSuccess: () => void;
}

export function LineForm({ initialData, brands, categories, onSuccess }: LineFormProps) {

    // 1. Configurar useActionState (Server Actions)
    // CORRECCIÓN: Tipamos prevState como ActionState en lugar de any
    const handleServerAction = async (prevState: ActionState, formData: LineFormValues): Promise<ActionState> => {
        if (initialData) {
            return await updateLineAction(prevState, { id: initialData._id, data: formData });
        } else {
            return await createLineAction(prevState, formData);
        }
    };

    const [state, formAction, isPending] = useActionState(handleServerAction, initialState);

    // 2. React Hook Form (SIN zodResolver)
    const {
        register,
        handleSubmit,
        control,
        reset,
        setError, // Necesario para setear errores manuales
        formState: { errors },
    } = useForm<LineFormValues>({
        defaultValues: {
            nombre: "",
            slug: "",
            brand: "",
            category: "",
            isActive: true,
        },
    });

    // 3. Hidratación
    useEffect(() => {
        if (initialData) {
            reset({
                nombre: initialData.nombre,
                slug: initialData.slug,
                brand: initialData.brand._id,
                category: initialData.category?._id || "",
                isActive: initialData.isActive,
            });
        } else {
            reset({ nombre: "", slug: "", brand: "", category: "", isActive: true });
        }
    }, [initialData, reset]);

    // 4. Feedback visual (Toast)
    useEffect(() => {
        if (state.timestamp) {
            if (state.success) {
                toast.success(state.message);
                onSuccess();
            } else {
                toast.error(state.message);
            }
        }
    }, [state, onSuccess]);

    // 5. Submit Handler con VALIDACIÓN MANUAL
    const onSubmit = (data: LineFormValues) => {

        // A. Limpieza de datos (Strings vacíos a undefined)
        const cleanData = {
            ...data,
            slug: data.slug === "" ? undefined : data.slug,
            category: data.category === "" ? undefined : data.category,
        };

        // B. Validación Manual con Zod
        const validation = lineFormSchema.safeParse(cleanData);

        if (!validation.success) {
            // Si falla, mapeamos los errores de Zod a React Hook Form
            let firstErrorMessage = "";

            validation.error.issues.forEach((issue, index) => {
                const fieldName = issue.path[0] as keyof LineFormValues;
                setError(fieldName, { message: issue.message });

                if (index === 0) firstErrorMessage = issue.message;
            });

            toast.error(firstErrorMessage || "Por favor revisa los campos");
            return; // DETENEMOS EL ENVÍO AQUÍ
        }

        // C. Si es válido, disparamos la Server Action
        startTransition(() => {
            formAction(cleanData);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">

            {/* Nombre */}
            <div className="grid gap-2">
                <Label htmlFor="nombre" className={errors.nombre ? "text-red-500" : ""}>Nombre</Label>
                <Input
                    id="nombre"
                    placeholder="Ej. Galaxy S24"
                    {...register("nombre")}
                    className={errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}
                    disabled={isPending}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
            </div>

            {/* Slug */}
            <div className="grid gap-2">
                <Label htmlFor="slug">Slug (Opcional)</Label>
                <Input id="slug" placeholder="galaxy-s24" {...register("slug")} disabled={isPending} />
                <p className="text-[0.8rem] text-muted-foreground">Se generará automáticamente.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Marca */}
                <div className="grid gap-2">
                    <Label className={errors.brand ? "text-red-500" : ""}>Marca</Label>
                    <Controller
                        name="brand"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                <SelectTrigger className={errors.brand ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((b) => (
                                        <SelectItem key={b._id} value={b._id}>{b.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
                </div>

                {/* Categoría */}
                <div className="grid gap-2">
                    <Label>Categoría</Label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""} disabled={isPending}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Opcional" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c._id} value={c._id}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            {/* Activo */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Activo</Label>
                </div>
                <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                    )}
                />
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
                </Button>
            </DialogFooter>
        </form>
    );
}