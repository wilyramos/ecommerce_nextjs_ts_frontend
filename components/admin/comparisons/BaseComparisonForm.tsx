// File: frontend/components/admin/comparisons/forms/BaseComparisonForm.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, GripVertical, Image as ImageIcon } from "lucide-react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

import { CreateComparisonDTOSchema, type CreateComparisonDTO } from "@/src/schemas/comparison.schema";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";
import { searchAdminProductsAction } from "@/actions/product-actions-v3";
import type { ActionState } from "@/actions/comparison.actions";

import { Button } from "@/components/ui/button";
import { AdminFormCard } from "@/components/admin/ui/form/AdminFormCard";
import { AdminField } from "@/components/admin/ui/form/AdminField";
import { AdminInput } from "@/components/admin/ui/form/AdminInput";
import { AdminTextarea } from "@/components/admin/ui/form/AdminTextarea";
import { AdminEntitySearchInput } from "@/src/features/v3/admin-search/components/admin-entity-search-input";

const CHART_COLORS = ["#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea", "#0891b2"];

type FormValues = Omit<CreateComparisonDTO, "products"> & {
    products: { id: string }[];
};

interface BaseComparisonFormProps {
    initialData?: CreateComparisonDTO & { _id?: string; productsDetails?: ProductSearchResult[] };
    isEditing?: boolean;
    actionState: ActionState<null>;
    isPending: boolean;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
}

export default function BaseComparisonForm({
    initialData,
    isEditing = false,
    actionState,
    isPending,
    onSubmit,
    onCancel,
}: BaseComparisonFormProps) {
    const [selectedProducts, setSelectedProducts] = useState<ProductSearchResult[]>(
        initialData?.productsDetails || []
    );

    const {
        register,
        control,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: initialData?.title || "",
            metaDescription: initialData?.metaDescription || "",
            veredictoRapido: initialData?.veredictoRapido || "",
            products: initialData?.products?.map((id) => ({ id })) || [],
            especificaciones: initialData?.especificaciones || [],
            faqItems: initialData?.faqItems || [],
        },
    });

    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
        control,
        name: "faqItems",
    });
    const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
        control,
        name: "especificaciones",
    });
    const { replace: replaceProd } = useFieldArray({ control, name: "products" });

    const watchedSpecs = watch("especificaciones");

    // Sincronizar errores emitidos por el Server Action
    useEffect(() => {
        if (actionState?.errors) {
            Object.entries(actionState.errors).forEach(([field, msgs]) => {
                setError(field as Path<FormValues>, { type: "server", message: msgs[0] });
            });
        }
    }, [actionState, setError]);

    // Transformación reactiva de datos para el RadarChart
    const radarData = useMemo(() => {
        if (!watchedSpecs || watchedSpecs.length === 0 || selectedProducts.length < 2) {
            return [];
        }

        return watchedSpecs.map((spec, index) => {
            const entry: Record<string, string | number> = {
                subject: spec.key?.trim() ? spec.key : `Criterio ${index + 1}`,
            };

            selectedProducts.forEach((product, pIndex) => {
                const scoreValue = Number(spec.scores?.[pIndex]);
                entry[`product_${product._id}`] = isNaN(scoreValue) ? 0 : Math.min(100, Math.max(0, scoreValue));
            });

            return entry;
        });
    }, [watchedSpecs, selectedProducts]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const currentValues = watch();
        const productIds = selectedProducts.map((p) => p._id);

        const dataToValidate: CreateComparisonDTO = {
            ...currentValues,
            products: productIds,
        };

        const validation = CreateComparisonDTOSchema.safeParse(dataToValidate);

        if (!validation.success) {
            toast.error("Hay errores en el formulario. Revisa los campos marcados en rojo.");
            validation.error.issues.forEach((issue) => {
                let pathStr = issue.path.join(".");
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

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── COLUMNA IZQUIERDA: FORMULARIO PRINCIPAL ── */}
            <div className="lg:col-span-2 space-y-6">
                {/* Información General */}
                <AdminFormCard title="Información General" description="Datos principales para identificar la comparativa">
                    <div className="space-y-4">
                        <AdminField label="Título de la Comparativa" htmlFor="title" error={errors.title?.message} required>
                            <AdminInput
                                id="title"
                                {...register("title")}
                                hasError={!!errors.title}
                                placeholder="Ej. iPhone 15 vs Galaxy S24"
                            />
                        </AdminField>

                        <AdminField label="Veredicto Rápido" htmlFor="veredictoRapido" error={errors.veredictoRapido?.message} required>
                            <AdminTextarea
                                id="veredictoRapido"
                                {...register("veredictoRapido")}
                                hasError={!!errors.veredictoRapido}
                                placeholder="Resumen directo de quién gana y por qué..."
                                rows={4}
                            />
                        </AdminField>
                    </div>
                </AdminFormCard>

                {/* Especificaciones Comparativas - Tabla + RadarChart */}
                <AdminFormCard
                    title="Especificaciones y Métricas"
                    description="Tabla de captura estructurada de especificaciones con proyección en gráfico de radar."
                    error={errors.especificaciones?.root?.message}
                    headerAction={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                appendSpec({
                                    key: "",
                                    values: selectedProducts.map(() => ""),
                                    scores: selectedProducts.map(() => 0),
                                    isKeyDifference: false,
                                })
                            }
                            disabled={selectedProducts.length < 2}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Añadir Fila
                        </Button>
                    }
                >
                    <div className="space-y-6">
                        {/* Vista de Radar Dinámica */}
                        {selectedProducts.length >= 2 && radarData.length > 0 && (
                            <div className="bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                        Proyección Radar de Rendimiento
                                    </span>
                                    <span className="text-[11px] text-zinc-500 font-mono">Puntuación: 0 - 100</span>
                                </div>
                                <div className="w-full h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                            <PolarGrid stroke="#e4e4e7" />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: "#52525b", fontSize: 11, fontWeight: 500 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "8px",
                                                    border: "1px solid #e4e4e7",
                                                    fontSize: "12px",
                                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                                                iconType="circle"
                                            />
                                            {selectedProducts.map((product, pIndex) => (
                                                <Radar
                                                    key={product._id}
                                                    name={product.nombre}
                                                    dataKey={`product_${product._id}`}
                                                    stroke={CHART_COLORS[pIndex % CHART_COLORS.length]}
                                                    fill={CHART_COLORS[pIndex % CHART_COLORS.length]}
                                                    fillOpacity={0.25}
                                                />
                                            ))}
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Tabla de Captura de Especificaciones */}
                        {selectedProducts.length < 2 ? (
                            <div className="text-sm text-zinc-400 text-center py-8 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-lg">
                                Selecciona al menos 2 productos en la barra lateral para habilitar la tabla de especificaciones.
                            </div>
                        ) : specFields.length === 0 ? (
                            <div className="text-sm text-zinc-400 text-center py-8 bg-zinc-50/50 border border-dashed border-zinc-200 rounded-lg">
                                No hay especificaciones registradas. Haz clic en <strong>Añadir Fila</strong> para comenzar.
                            </div>
                        ) : (
                            <div className="overflow-x-auto border border-zinc-200 rounded-xl bg-white shadow-2xs">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                                        <tr>
                                            <th className="px-3 py-2.5 w-[220px]">Característica</th>
                                            <th className="px-2 py-2.5 text-center w-[60px]" title="Diferencia Clave">
                                                Clave
                                            </th>
                                            {selectedProducts.map((product) => (
                                                <th key={product._id} className="px-3 py-2.5 min-w-[200px] border-l border-zinc-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative h-6 w-6 rounded bg-white overflow-hidden flex-shrink-0 border border-zinc-200 flex items-center justify-center">
                                                            {product.imagenes?.[0] ? (
                                                                <Image
                                                                    src={product.imagenes[0]}
                                                                    alt={product.nombre}
                                                                    fill
                                                                    sizes="24px"
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />
                                                            )}
                                                        </div>
                                                        <span className="truncate text-zinc-800 font-semibold">{product.nombre}</span>
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="px-2 py-2.5 w-[40px] text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {specFields.map((field, index) => {
                                            const specError = errors.especificaciones?.[index];

                                            return (
                                                <tr
                                                    key={field.id}
                                                    className={`hover:bg-zinc-50/40 transition-colors ${
                                                        specError ? "bg-destructive/5" : ""
                                                    }`}
                                                >
                                                    {/* Nombre de la Característica */}
                                                    <td className="p-2 align-top">
                                                        <AdminInput
                                                            {...register(`especificaciones.${index}.key`)}
                                                            hasError={!!specError?.key}
                                                            placeholder="Ej. Batería, Chipset..."
                                                            className="h-8"
                                                        />
                                                        {specError?.key && (
                                                            <p className="text-[10px] text-destructive mt-1 font-medium">
                                                                {specError.key.message}
                                                            </p>
                                                        )}
                                                    </td>

                                                    {/* Checkbox Diferencia Clave */}
                                                    <td className="p-2 align-middle text-center">
                                                        <input
                                                            type="checkbox"
                                                            {...register(`especificaciones.${index}.isKeyDifference`)}
                                                            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                                                        />
                                                    </td>

                                                    {/* Columnas por Producto (Valor + Puntaje) */}
                                                    {selectedProducts.map((_, pIndex) => {
                                                        const valError = specError?.values?.[pIndex];
                                                        const scoreError = specError?.scores?.[pIndex];

                                                        return (
                                                            <td key={pIndex} className="p-2 align-top border-l border-zinc-100">
                                                                <div className="flex gap-1.5 items-start">
                                                                    <div className="flex-1 min-w-0">
                                                                        <AdminInput
                                                                            {...register(`especificaciones.${index}.values.${pIndex}`)}
                                                                            hasError={!!valError}
                                                                            placeholder="Valor descriptivo..."
                                                                            className="h-8"
                                                                        />
                                                                        {valError && (
                                                                            <p className="text-[10px] text-destructive mt-0.5 font-medium truncate">
                                                                                {valError.message}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="w-16 flex-shrink-0">
                                                                        <AdminInput
                                                                            type="number"
                                                                            min={0}
                                                                            max={100}
                                                                            {...register(`especificaciones.${index}.scores.${pIndex}`, {
                                                                                valueAsNumber: true,
                                                                            })}
                                                                            hasError={!!scoreError}
                                                                            placeholder="Pts"
                                                                            className="h-8 text-center px-1 font-mono"
                                                                        />
                                                                        {scoreError && (
                                                                            <p className="text-[10px] text-destructive mt-0.5 font-medium text-center truncate">
                                                                                {scoreError.message}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Botón Eliminar Fila */}
                                                    <td className="p-2 align-middle text-center">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-zinc-400 hover:text-destructive hover:bg-red-50"
                                                            onClick={() => removeSpec(index)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </AdminFormCard>

                {/* Preguntas Frecuentes (FAQ) */}
                <AdminFormCard
                    title="Preguntas Frecuentes (FAQ)"
                    headerAction={
                        <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ pregunta: "", respuesta: "" })}>
                            <Plus className="w-4 h-4 mr-2" /> Añadir FAQ
                        </Button>
                    }
                >
                    <div className="space-y-4">
                        {faqFields.map((field, index) => {
                            const faqError = errors.faqItems?.[index];
                            return (
                                <div
                                    key={field.id}
                                    className="flex gap-2 items-start group p-3 bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-200 transition-colors"
                                >
                                    <div className="mt-2 text-muted-foreground cursor-grab">
                                        <GripVertical size={16} />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <AdminField error={faqError?.pregunta?.message}>
                                            <AdminInput
                                                {...register(`faqItems.${index}.pregunta`)}
                                                hasError={!!faqError?.pregunta}
                                                placeholder="Escribe la pregunta..."
                                            />
                                        </AdminField>
                                        <AdminField error={faqError?.respuesta?.message}>
                                            <AdminTextarea
                                                {...register(`faqItems.${index}.respuesta`)}
                                                hasError={!!faqError?.respuesta}
                                                placeholder="Respuesta detallada..."
                                                rows={2}
                                            />
                                        </AdminField>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => removeFaq(index)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            );
                        })}
                        {faqFields.length === 0 && (
                            <p className="text-xs text-center text-muted-foreground">Sin preguntas frecuentes.</p>
                        )}
                    </div>
                </AdminFormCard>
            </div>

            {/* ── COLUMNA DERECHA: SIDEBAR DE CONFIGURACIÓN ── */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
                {/* Selector de Productos */}
                <AdminFormCard
                    title="Productos a Comparar"
                    description="Selecciona mínimo 2 productos del catálogo."
                    error={errors.products?.root?.message || errors.products?.message}
                >
                    <AdminEntitySearchInput<ProductSearchResult>
                        title="Buscar Productos"
                        placeholder="Buscar por nombre, SKU..."
                        buttonLabel="Seleccionar Productos"
                        multiple={true}
                        selectedItems={selectedProducts}
                        onChange={(items) => {
                            setSelectedProducts(items);
                            replaceProd(items.map((item) => ({ id: item._id })));
                        }}
                        searchAction={async (query, limit) => {
                            return await searchAdminProductsAction(query, limit);
                        }}
                        keyExtractor={(item) => item._id}
                        renderItem={(item) => (
                            <div className="flex items-center gap-3 w-full">
                                <div className="relative h-9 w-9 bg-zinc-100 rounded border border-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {item.imagenes?.[0] ? (
                                        <Image
                                            src={item.imagenes[0]}
                                            alt={item.nombre}
                                            fill
                                            sizes="36px"
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <ImageIcon className="w-4 h-4 text-zinc-300" />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col items-start min-w-0">
                                    <span className="text-xs font-medium text-zinc-900 truncate w-full text-left">
                                        {item.nombre}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                        SKU: {item.sku || "N/A"} • S/{" "}
                                        {item.precio !== undefined ? item.precio.toFixed(2) : "0.00"}
                                    </span>
                                </div>
                            </div>
                        )}
                        renderSelectedCard={(item) => ({
                            title: item.nombre,
                            subtitle: item.sku ? `SKU: ${item.sku}` : "Sin SKU",
                            imageUrl: item.imagenes?.[0] || undefined,
                        })}
                        emptyMessage="No hay productos seleccionados."
                    />
                </AdminFormCard>

                {/* SEO y Metadatos */}
                <AdminFormCard title="SEO y Metadatos">
                    <AdminField label="Meta Descripción">
                        <AdminTextarea
                            {...register("metaDescription")}
                            rows={3}
                            placeholder="Descripción corta para motores de búsqueda..."
                        />
                    </AdminField>
                </AdminFormCard>

                {/* Acciones Finales */}
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={onCancel} className="text-xs flex-1" disabled={isPending}>
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