// File: frontend/components/admin/categories-v3/BaseCategoryForm.tsx
"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm, useFieldArray, type Path, useWatch } from "react-hook-form";
import { Plus, Trash2, X, AlertCircle } from "lucide-react";

import {
  AdminForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/admin/ui/form/FormRoot";
import {
  AdminTextInput,
  AdminTextarea,
  AdminSwitch,
} from "@/components/admin/ui/form/FormInputs";
import { FormSection, FormGrid } from "@/components/admin/ui/form/FormLayouts";
import { FormActions } from "@/components/admin/ui/form/FormActions";
import { FormMediaField } from "@/components/form/FormMediaField";
import { Button } from "@/components/ui/button";
import { diccionarioColores } from "@/src/utils/constants/colores";

import type { CategoryResponse, CategoryTreeItem } from "@/src/schemas/category-v3.schema";
import type { ActionState } from "@/actions/category-v3.actions";

export interface FormCategoryValues {
  nombre: string;
  slug: string;
  descripcion: string;
  parent: string;
  image: string;
  order: number;
  isActive: boolean;
  attributes: {
    name: string;
    values: string[];
    isVariant: boolean;
    isFilterable: boolean;
    icon: string;
  }[];
}

interface BaseCategoryFormProps {
  initialData?: CategoryResponse;
  tree: CategoryTreeItem[];
  isEditing?: boolean;
  actionState: ActionState<null>;
  isPending: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const flattenTreeForSelect = (
  nodes: CategoryTreeItem[],
  level: number = 0,
  path: string = ""
): { id: string; name: string }[] => {
  let result: { id: string; name: string }[] = [];
  for (const node of nodes) {
    const currentPath = level === 0 ? node.nombre : `${path} > ${node.nombre}`;
    result.push({ id: node._id, name: currentPath });
    if (node.children && node.children.length > 0) {
      result = result.concat(flattenTreeForSelect(node.children, level + 1, currentPath));
    }
  }
  return result;
};

// ── COMPONENTE DE GESTIÓN DE VALORES EN TABLA CON VALIDACIÓN DE DUPLICADOS ─────
function AttributeValuesTable({
  attributeName,
  values,
  onChange,
  error,
}: {
  attributeName: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  error?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isColor = attributeName.trim().toLowerCase().includes("color");

  const handleAddValue = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const exists = values.some(
      (v) => v.toLowerCase().trim() === trimmed.toLowerCase()
    );

    if (exists) {
      setLocalError(`El valor "${trimmed}" ya está agregado.`);
      return;
    }

    onChange([...values, trimmed]);
    setInputValue("");
    setLocalError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const handleRemoveValue = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
    setLocalError(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold tracking-wide text-zinc-700 select-none flex items-center gap-1">
          Valores del Atributo <span className="text-red-500 font-mono">*</span>
        </label>
        <span className="text-[11px] font-mono text-zinc-400 font-medium">
          {values.length} valor{values.length !== 1 ? "es" : ""}
        </span>
      </div>

      {/* Input de Adición con validación */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <AdminTextInput
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (localError) setLocalError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isColor
                ? "Ej. Titanio Natural, Azul Sierra..."
                : "Ej. 8GB, 16GB, 256GB..."
            }
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddValue}
          disabled={!inputValue.trim()}
        >
          <Plus />
          Añadir
        </Button>
      </div>

      {/* Mensaje de Error (Duplicado o Validación Global) */}
      {(localError || error) && (
        <p className="text-[11px] font-medium text-red-600 flex items-center gap-1 animate-in fade-in-50">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{localError || error}</span>
        </p>
      )}

      {/* Tabla Estructurada de Valores */}
      {values.length > 0 ? (
        <div className="border border-zinc-200 bg-white overflow-hidden">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="py-2 px-3 w-12 text-center">#</th>
                <th className="py-2 px-3">Valor</th>
                {isColor && <th className="py-2 px-3 w-28">Muestra</th>}
                <th className="py-2 px-3 w-12 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {values.map((val, idx) => {
                const normalized = val.toLowerCase().trim();
                const colorClass = isColor ? diccionarioColores[normalized] : null;

                return (
                  <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-2 px-3 text-center text-zinc-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 font-medium text-zinc-900">
                      {val}
                    </td>
                    {isColor && (
                      <td className="py-2 px-3">
                        {colorClass ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 ${colorClass}`}
                            />
                            <span className="text-[11px] text-zinc-500 font-mono">
                              Detectado
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-dashed border-zinc-300 bg-zinc-100 shrink-0"
                              title="Sin muestra registrada"
                            />
                            <span className="text-[10px] text-amber-600 font-mono">
                              Sin muestra
                            </span>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="py-2 px-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveValue(idx)}
                        title="Eliminar valor"
                      >
                        <X />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center select-none">
          <p className="text-[12px] text-zinc-400">
            No has añadido valores para este atributo. Escribe un valor arriba y presiona Enter.
          </p>
        </div>
      )}
    </div>
  );
}

export default function BaseCategoryForm({
  initialData,
  tree,
  isEditing = false,
  actionState,
  isPending,
  onSubmit,
  onCancel,
  onDelete,
}: BaseCategoryFormProps) {
  const parentOptions = useMemo(() => {
    const flattened = flattenTreeForSelect(tree);
    if (!isEditing || !initialData) return flattened;
    return flattened.filter(
      (cat) => cat.id !== initialData._id && !cat.name.includes(initialData.nombre)
    );
  }, [tree, isEditing, initialData]);

  const form = useForm<FormCategoryValues>({
    defaultValues: {
      nombre: initialData?.nombre || "",
      slug: initialData?.slug || "",
      descripcion: initialData?.descripcion || "",
      parent: initialData?.parent ? String(initialData.parent) : "",
      image: initialData?.image || "",
      order: initialData?.order ?? 0,
      isActive: initialData?.isActive ?? true,
      attributes:
        initialData?.attributes?.map((attr) => ({
          name: attr.name,
          values: Array.isArray(attr.values) ? attr.values : [],
          isVariant: attr.isVariant ?? false,
          isFilterable: attr.isFilterable ?? true,
          icon: attr.icon || "",
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const attributesValues = useWatch({
    control: form.control,
    name: "attributes",
  });

  useEffect(() => {
    if (actionState?.errors) {
      Object.entries(actionState.errors).forEach(([field, messages]) => {
        form.setError(field as Path<FormCategoryValues>, {
          type: "server",
          message: messages[0],
        });
      });
    }
  }, [actionState, form]);

  const handleFormSubmit = (data: FormCategoryValues) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre.trim());
    if (data.descripcion) formData.append("descripcion", data.descripcion.trim());
    if (data.slug) formData.append("slug", data.slug.trim());
    if (data.parent && data.parent.trim() !== "") {
      formData.append("parent", data.parent.trim());
    }
    if (data.image) formData.append("image", data.image.trim());
    formData.append("order", String(data.order));
    formData.append("isActive", String(data.isActive));

    const mappedAttributes = data.attributes.map((attr) => {
      // Deduplicación final de seguridad antes del envío
      const uniqueValues = Array.from(
        new Set(attr.values.map((v) => v.trim()).filter(Boolean))
      );

      return {
        name: attr.name.trim(),
        values: uniqueValues,
        isVariant: Boolean(attr.isVariant),
        isFilterable: Boolean(attr.isFilterable),
        icon: attr.icon && attr.icon.trim() !== "" ? attr.icon.trim() : null,
      };
    });

    formData.append("attributes", JSON.stringify(mappedAttributes));
    onSubmit(formData);
  };

  return (
    <AdminForm {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── COLUMNA PRINCIPAL (2 COLUMNAS) ── */}
          <div className="lg:col-span-2 space-y-6">
            <FormSection
              title="Información General"
              description="Detalles descriptivos e identificadores de la categoría."
            >
              <FormField
                control={form.control}
                name="nombre"
                rules={{
                  required: "El nombre es obligatorio",
                  minLength: { value: 2, message: "Mínimo 2 caracteres" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Nombre de la Categoría</FormLabel>
                    <FormControl>
                      <AdminTextInput
                        placeholder="Ej. Laptops y Computadoras"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <AdminTextarea
                        placeholder="Breve descripción visible para los clientes..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Opcional. Ayuda al posicionamiento SEO y navegación.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Atributos Dinámicos"
              description="Propiedades e íconos compartidos por los productos asociados a esta categoría."
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      name: "",
                      values: [],
                      isVariant: false,
                      isFilterable: true,
                      icon: "",
                    })
                  }
                >
                  <Plus />
                  Añadir Atributo
                </Button>
              }
            >
              {fields.length === 0 ? (
                <p className="text-[12px] text-zinc-400 py-2">
                  No hay atributos definidos. Puedes agregar especificaciones como Color, Marca, Memoria RAM, etc.
                </p>
              ) : (
                <div className="space-y-6">
                  {fields.map((fieldItem, idx) => {
                    const currentAttrName = attributesValues?.[idx]?.name || "";

                    return (
                      <div
                        key={fieldItem.id}
                        className="border border-zinc-200 bg-zinc-50/50 p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3">
                          <div className="flex-1 max-w-md">
                            <FormField
                              control={form.control}
                              name={`attributes.${idx}.name`}
                              rules={{ required: "Nombre de atributo requerido" }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel required>Nombre del Atributo</FormLabel>
                                  <FormControl>
                                    <AdminTextInput
                                      placeholder="Ej. Color, Memoria RAM, Almacenamiento..."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(idx)}
                            title="Eliminar atributo"
                          >
                            <Trash2 />
                          </Button>
                        </div>

                        {/* ── GESTIÓN DE VALORES EN TABLA CON DEDUPLICACIÓN ── */}
                        <FormField
                          control={form.control}
                          name={`attributes.${idx}.values`}
                          rules={{
                            validate: (val) =>
                              val && val.length > 0
                                ? true
                                : "Debe ingresar al menos un valor para este atributo",
                          }}
                          render={({ field, fieldState }) => (
                            <AttributeValuesTable
                              attributeName={currentAttrName}
                              values={field.value || []}
                              onChange={field.onChange}
                              error={fieldState.error?.message}
                            />
                          )}
                        />

                        {/* ── ÍCONO DEL ATRIBUTO ── */}
                        <FormField
                          control={form.control}
                          name={`attributes.${idx}.icon`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FormMediaField
                                  name={`attributes.${idx}.icon`}
                                  folder="general"
                                  label="Ícono del Atributo"
                                  defaultValue={field.value}
                                  multiple={false}
                                  maxFiles={1}
                                  accept="image"
                                  onChange={(urls) => field.onChange(urls[0] || "")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center gap-6 pt-3 border-t border-zinc-200">
                          <FormField
                            control={form.control}
                            name={`attributes.${idx}.isVariant`}
                            render={({ field }) => (
                              <AdminSwitch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                label="Permite variantes"
                              />
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`attributes.${idx}.isFilterable`}
                            render={({ field }) => (
                              <AdminSwitch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                label="Visible en filtros"
                              />
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </FormSection>
          </div>

          {/* ── COLUMNA LATERAL (IMAGEN Y CONFIGURACIÓN) ── */}
          <div className="lg:col-span-1 space-y-6">
            <FormSection
              title="Imagen de Portada"
              description="Imagen descriptiva para banners y cabeceras de catálogo."
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FormMediaField
                        name="image"
                        folder="general"
                        defaultValue={field.value}
                        multiple={false}
                        maxFiles={1}
                        accept="image"
                        onChange={(urls) => field.onChange(urls[0] || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection
              title="Estructura y Jerarquía"
              description="Ubicación de la categoría dentro del catálogo."
            >
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría Padre</FormLabel>
                    <FormControl>
                      <select
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-900"
                      >
                        <option value="">-- Categoría Raíz (Principal) --</option>
                        {parentOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Déjalo vacío para crear una categoría principal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug Personalizado (URL)</FormLabel>
                    <FormControl>
                      <AdminTextInput
                        placeholder="ej-laptops-computadoras"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Opcional. Se autogenera si se deja en blanco.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormGrid cols={1}>
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posición / Orden</FormLabel>
                      <FormControl>
                        <AdminTextInput
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormGrid>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <AdminSwitch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Categoría Activa"
                    description="Controla la visibilidad pública en el catálogo."
                  />
                )}
              />
            </FormSection>
          </div>
        </div>

        {/* ── BARRA INFERIOR DE ACCIONES ── */}
        <FormActions
          isPending={isPending}
          onCancel={onCancel}
          onDelete={onDelete}
          showDelete={isEditing && Boolean(onDelete)}
          saveLabel={isEditing ? "Guardar cambios" : "Crear Categoría"}
        />
      </form>
    </AdminForm>
  );
}