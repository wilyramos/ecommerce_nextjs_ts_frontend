// File: frontend/src/modules/page/admin/PageForm.tsx
"use client";

import RichTextEditorExtended from "@/components/ui/RichTextEditorExtended";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageActionState } from "../page.schema";
import { Settings2, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageFormProps {
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        content: string;
        isActive: boolean;
        seo?: {
            metaTitle?: string;
            metaDescription?: string;
        };
    };
    actionState: PageActionState;
}

export default function PageForm({ initialData, actionState }: PageFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            {/* COLUMNA PRINCIPAL: Contenido Estructural */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-4 space-y-0 border-b border-border/60">
                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <FormInput
                            label="Título de la Página"
                            name="title"
                            defaultValue={initialData?.title}
                            placeholder="Ej: Cambios y Devoluciones"
                            errors={actionState.errors?.title}
                        />

                        <FormInput
                            label="Ruta de acceso personalizada (Slug / Opcional)"
                            name="slug"
                            defaultValue={initialData?.slug}
                            placeholder="Ej: cambios-y-devoluciones"
                            errors={actionState.errors?.slug}
                            description="Si se deja vacío, el sistema autogenerará uno optimizado basado en el título."
                        />

                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                                Cuerpo / Contenido de la Página
                            </label>
                            <RichTextEditorExtended
                                name="content"
                                initialHTML={initialData?.content || ""}
                                placeholder="Escribe el contenido institucional enriquecido (HTML) aquí..."
                                
                            />
                            {actionState.errors?.content?.map((err, idx) => (
                                <p key={idx} className="text-xs font-medium text-destructive mt-0.5">
                                    {err}
                                </p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* COLUMNA LATERAL: Configuración de Estado y SEO */}
            <div className="space-y-6">
                {/* Panel de publicación y Estado */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-4 space-y-0 border-b border-border/60">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Publicación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <FormSelectStatus
                            label="Visibilidad en Tienda"
                            name="isActive"
                            defaultValue={initialData?.isActive !== false ? "true" : "false"}
                            errors={actionState.errors?.isActive}
                        />
                    </CardContent>
                </Card>

                {/* Panel Optimización en Buscadores (SEO) */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-4 space-y-0 border-b border-border/60">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Motores de Búsqueda (SEO)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <FormInput
                            label="Meta Título (Google)"
                            name="metaTitle"
                            defaultValue={initialData?.seo?.metaTitle}
                            placeholder="Máximo 60 caracteres recomendado"
                            errors={actionState.errors?.["seo.metaTitle"]}
                        />

                        <FormTextArea
                            label="Meta Descripción"
                            name="metaDescription"
                            defaultValue={initialData?.seo?.metaDescription}
                            placeholder="Resumen corto de la página para los buscadores (Máx 160 caracteres)..."
                            rows={4}
                            errors={actionState.errors?.["seo.metaDescription"]}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ── SUBCOMPONENTES INTERNOS CONTROLADOS ──────────────────────────────────

interface FormInputProps {
    label: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    errors?: string[];
    description?: string;
}

function FormInput({ label, name, defaultValue = "", placeholder, errors, description }: FormInputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">{label}</label>
            <Input
                type="text"
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={errors ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {description && !errors && <p className="text-xs text-muted-foreground">{description}</p>}
            {errors?.map((err, idx) => (
                <p key={idx} className="text-xs font-medium text-destructive mt-0.5">
                    {err}
                </p>
            ))}
        </div>
    );
}

interface FormTextAreaProps {
    label: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    rows?: number;
    errors?: string[];
}

function FormTextArea({ label, name, defaultValue = "", placeholder, rows = 5, errors }: FormTextAreaProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">{label}</label>
            <Textarea
                name={name}
                defaultValue={defaultValue}
                placeholder={placeholder}
                rows={rows}
                className={errors ? "border-destructive focus-visible:ring-destructive resize-y" : "resize-y"}
            />
            {errors?.map((err, idx) => (
                <p key={idx} className="text-xs font-medium text-destructive mt-0.5">
                    {err}
                </p>
            ))}
        </div>
    );
}

interface FormSelectProps {
    label: string;
    name: string;
    defaultValue: string;
    errors?: string[];
}

function FormSelectStatus({ label, name, defaultValue, errors }: FormSelectProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">{label}</label>
            <Select name={name} defaultValue={defaultValue}>
                <SelectTrigger className={errors ? "border-destructive focus:ring-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">Visible / Publicado</SelectItem>
                    <SelectItem value="false">Oculto / Inactivo</SelectItem>
                </SelectContent>
            </Select>
            {errors?.map((err, idx) => (
                <p key={idx} className="text-xs font-medium text-destructive mt-0.5">
                    {err}
                </p>
            ))}
        </div>
    );
}