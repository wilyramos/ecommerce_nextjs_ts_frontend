// File: frontend/components/admin/comparisons/forms/ComparisonForm.tsx
"use client";

import { useEffect, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";

import { createComparisonAction, updateComparisonAction, type ActionState } from "@/actions/comparison.actions";
import { CreateComparisonDTOSchema, type CreateComparisonDTO } from "@/src/schemas/comparison.schema";
import { cn } from "@/lib/utils"; // <-- IMPORTANTE: Para aplicar clases condicionales

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ComparisonFormProps {
    initialData?: CreateComparisonDTO & { _id?: string };
    isEditing?: boolean;
}

type FormValues = Omit<CreateComparisonDTO, "products"> & {
    products: { id: string }[];
};

type ActionFunction = (prevState: ActionState<null>, formData: FormData) => Promise<ActionState<null>>;

export default function ComparisonForm({ initialData, isEditing = false }: ComparisonFormProps) {
    const router = useRouter();
    const [isPendingClient, startTransition] = useTransition();

    const actionToUse = (isEditing && initialData?._id
        ? updateComparisonAction.bind(null, initialData._id)
        : createComparisonAction) as ActionFunction;

    const [state, formAction, isPendingServer] = useActionState<ActionState<null>, FormData>(
        actionToUse, 
        null
    );
    const isPending = isPendingClient || isPendingServer;

    const { register, control, watch, setError, clearErrors, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            title: initialData?.title || "",
            metaDescription: initialData?.metaDescription || "",
            veredictoRapido: initialData?.veredictoRapido || "",
            products: initialData?.products?.map(id => ({ id })) || [{ id: "" }, { id: "" }],
            especificaciones: initialData?.especificaciones || [],
            faqItems: initialData?.faqItems || [],
        },
    });

    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqItems" });
    const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({ control, name: "especificaciones" });
    const { fields: prodFields, append: appendProd, remove: removeProd } = useFieldArray({ control, name: "products" });

    const watchProducts = watch("products");

    useEffect(() => {
        if (!state) return;
        if (state.ok) {
            toast.success(state.message || "Operación exitosa");
            router.push("/admin/comparisons");
        } else {
            toast.error(state.error);
            if (state.errors) {
                Object.entries(state.errors).forEach(([field, msgs]) => {
                    setError(field as Path<FormValues>, { type: "server", message: msgs[0] });
                });
            }
        }
    }, [state, router, setError]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const currentValues = watch();

        const dataToValidate: CreateComparisonDTO = {
            ...currentValues,
            products: currentValues.products.map(p => p.id).filter(id => id.trim() !== ""),
        };

        const validation = CreateComparisonDTOSchema.safeParse(dataToValidate);

        if (!validation.success) {
            toast.error("Hay errores en el formulario. Revisa los campos marcados en rojo.");
            
            validation.error.issues.forEach((issue) => {
                let pathStr = issue.path.join(".");
                
                // Mapeo especial para productos:
                // Zod lo ve como `products.0`, pero RHF espera `products.0.id`
                if (issue.path[0] === "products" && typeof issue.path[1] === "number") {
                    pathStr = `products.${issue.path[1]}.id`;
                }

                setError(pathStr as Path<FormValues>, { type: "manual", message: issue.message });
            });
            return;
        }

        const formData = new FormData();
        const valid = validation.data;
        formData.append("title", valid.title);
        if (valid.metaDescription) formData.append("metaDescription", valid.metaDescription);
        formData.append("veredictoRapido", valid.veredictoRapido);
        formData.append("products", JSON.stringify(valid.products));
        formData.append("especificaciones", JSON.stringify(valid.especificaciones));
        formData.append("faqItems", JSON.stringify(valid.faqItems));

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* COLUMNA IZQUIERDA: FORMULARIO PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Info General */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="title" className={cn("text-xs font-bold", errors.title && "text-destructive")}>
                                Título de la Comparativa *
                            </Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Ej. iPhone 15 vs Samsung Galaxy S24"
                                className={cn("text-xs", errors.title && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.title && <p className="text-[10px] text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="veredictoRapido" className={cn("text-xs font-bold", errors.veredictoRapido && "text-destructive")}>
                                Veredicto Rápido *
                            </Label>
                            <Textarea
                                id="veredictoRapido"
                                {...register("veredictoRapido")}
                                placeholder="Resumen directo de la comparativa..."
                                className={cn("text-xs", errors.veredictoRapido && "border-destructive focus-visible:ring-destructive")}
                                rows={3}
                            />
                            {errors.veredictoRapido && <p className="text-[10px] text-destructive">{errors.veredictoRapido.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Especificaciones */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className={cn(errors.especificaciones && "text-destructive")}>Especificaciones</CardTitle>
                            <CardDescription>Generado dinámicamente según productos seleccionados.</CardDescription>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendSpec({ key: "", values: watchProducts.map(()=>""), scores: watchProducts.map(()=>0), isKeyDifference: false })}
                            disabled={watchProducts.length < 2}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Añadir Atributo
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {errors.especificaciones?.root && (
                            <p className="text-xs text-destructive">{errors.especificaciones.root.message}</p>
                        )}
                        {specFields.map((field, index) => {
                            const specError = errors.especificaciones?.[index];

                            return (
                                <div key={field.id} className={cn("p-4 border rounded-lg bg-accent/20 relative group transition-colors", specError && "border-destructive bg-destructive/5")}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                                        onClick={() => removeSpec(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                                        <div className="space-y-1">
                                            <Label className={cn("text-[11px]", specError?.key && "text-destructive")}>Característica</Label>
                                            <Input 
                                                {...register(`especificaciones.${index}.key`)} 
                                                placeholder="Ej. Batería" 
                                                className={cn("h-8 text-xs bg-white", specError?.key && "border-destructive")} 
                                            />
                                            {specError?.key && <p className="text-[10px] text-destructive">{specError.key.message}</p>}
                                        </div>
                                        <div className="flex items-end pb-1">
                                            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-medium text-foreground">
                                                <input type="checkbox" {...register(`especificaciones.${index}.isKeyDifference`)} className="rounded border-border" />
                                                Destacar como Diferencia Clave
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                                        {watchProducts.map((_, pIndex) => {
                                            const valError = specError?.values?.[pIndex];
                                            const scoreError = specError?.scores?.[pIndex];

                                            return (
                                                <div key={pIndex} className="bg-white p-3 rounded border shadow-sm space-y-2">
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Producto {pIndex + 1}</p>
                                                    <div className="space-y-1">
                                                        <Input 
                                                            {...register(`especificaciones.${index}.values.${pIndex}`)} 
                                                            placeholder="Valor descriptivo..." 
                                                            className={cn("h-8 text-xs", valError && "border-destructive")} 
                                                        />
                                                        {valError && <p className="text-[10px] text-destructive">{valError.message}</p>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label className={cn("text-[10px]", scoreError && "text-destructive")}>Puntaje (0-100)</Label>
                                                        <div className="flex-1 space-y-1">
                                                            <Input 
                                                                type="number" 
                                                                {...register(`especificaciones.${index}.scores.${pIndex}`, { valueAsNumber: true })} 
                                                                className={cn("h-8 text-xs", scoreError && "border-destructive")} 
                                                            />
                                                            {scoreError && <p className="text-[10px] text-destructive">{scoreError.message}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Preguntas Frecuentes</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ pregunta: "", respuesta: "" })}>
                            <Plus className="w-4 h-4 mr-2" /> Añadir FAQ
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {faqFields.map((field, index) => {
                            const faqError = errors.faqItems?.[index];
                            return (
                                <div key={field.id} className="flex gap-2 items-start group">
                                    <div className="mt-2 text-muted-foreground"><GripVertical size={16} /></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="space-y-1">
                                            <Input 
                                                {...register(`faqItems.${index}.pregunta`)} 
                                                placeholder="Pregunta..." 
                                                className={cn("h-8 text-xs", faqError?.pregunta && "border-destructive")} 
                                            />
                                            {faqError?.pregunta && <p className="text-[10px] text-destructive">{faqError.pregunta.message}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Textarea 
                                                {...register(`faqItems.${index}.respuesta`)} 
                                                placeholder="Respuesta..." 
                                                className={cn("text-xs", faqError?.respuesta && "border-destructive")} 
                                                rows={2} 
                                            />
                                            {faqError?.respuesta && <p className="text-[10px] text-destructive">{faqError.respuesta.message}</p>}
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFaq(index)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* COLUMNA DERECHA: SIDEBAR DE CONFIGURACIÓN */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
                
                {/* Productos a comparar */}
                <Card>
                    <CardHeader>
                        <CardTitle className={cn(errors.products && "text-destructive")}>Productos a Comparar</CardTitle>
                        <CardDescription>Mínimo 2 productos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {errors.products?.root && (
                            <p className="text-xs text-destructive text-center">{errors.products.root.message}</p>
                        )}
                        {prodFields.map((field, idx) => {
                            const prodError = errors.products?.[idx]?.id;
                            return (
                                <div key={field.id} className="flex items-center gap-2">
                                    <div className="flex-1 space-y-1">
                                        <Label className={cn("text-[10px] uppercase", prodError && "text-destructive")}>Producto {idx + 1}</Label>
                                        <Input 
                                            {...register(`products.${idx}.id`)} 
                                            placeholder="ID de Mongo..." 
                                            className={cn("h-8 text-xs", prodError && "border-destructive focus-visible:ring-destructive")} 
                                        />
                                        {prodError && <p className="text-[10px] text-destructive">{prodError.message}</p>}
                                    </div>
                                    {idx >= 2 && (
                                        <Button type="button" variant="ghost" size="icon" className="mt-4 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeProd(idx)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                        <Button type="button" variant="secondary" size="sm" className="w-full text-xs mt-2" onClick={() => appendProd({ id: "" })}>
                            <Plus className="w-3 h-3 mr-1" /> Añadir otro producto
                        </Button>
                    </CardContent>
                </Card>

                {/* SEO */}
                <Card>
                    <CardHeader>
                        <CardTitle>SEO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <Label className="text-xs font-bold">Meta Descripción</Label>
                        <Textarea 
                            {...register("metaDescription")} 
                            rows={3} 
                            className="text-xs" 
                        />
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => router.push("/admin/comparisons")} className="text-xs flex-1">
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending} className="text-xs flex-1">
                        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isEditing ? "Guardar" : "Crear"}
                    </Button>
                </div>
            </div>
        </form>
    );
}