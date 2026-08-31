// File: frontend/components/admin/ui/form/FormInputs.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff, Search, X, Check, UploadCloud, Trash2 } from "lucide-react";
import { useFormField } from "./FormRoot";
import { cn } from "@/lib/utils";

// ── 1. INPUT DE TEXTO / NÚMERO BASE CON PREFIJOS Y SUFIJOS ───────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
}

export const AdminTextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", prefixNode, suffixNode, disabled, ...props }, ref) => {
    const { error } = useFormField();

    return (
      <div
        className={cn(
          "flex items-center w-full border border-zinc-200 bg-white transition-all focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900/10",
          error && "border-red-500 focus-within:border-red-600 focus-within:ring-red-500/10",
          disabled && "bg-zinc-100/70 text-zinc-400 cursor-not-allowed border-zinc-200",
          className
        )}
      >
        {prefixNode && (
          <div className="pl-3 pr-1 text-zinc-400 text-[13px] select-none flex items-center shrink-0">
            {prefixNode}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent px-3 py-2 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none disabled:cursor-not-allowed",
            prefixNode && "pl-1.5",
            suffixNode && "pr-1.5"
          )}
          {...props}
        />
        {suffixNode && (
          <div className="pr-3 pl-1 text-zinc-400 text-[13px] select-none flex items-center shrink-0">
            {suffixNode}
          </div>
        )}
      </div>
    );
  }
);
AdminTextInput.displayName = "AdminTextInput";

// ── 2. TEXTAREA MULTILÍNEA ──────────────────────────────────────────────────
export const AdminTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, disabled, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <textarea
      ref={ref}
      disabled={disabled}
      className={cn(
        "w-full border border-zinc-200 bg-white p-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 transition-all resize-y min-h-[90px] slim-scrollbar",
        error && "border-red-500 focus:border-red-600 focus:ring-red-500/10",
        disabled && "bg-zinc-100/70 text-zinc-400 cursor-not-allowed border-zinc-200",
        className
      )}
      {...props}
    />
  );
});
AdminTextarea.displayName = "AdminTextarea";

// ── 3. PASSWORD CON TOGGLE DE VISIBILIDAD ───────────────────────────────────
export const AdminPasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <AdminTextInput
        type={show ? "text" : "password"}
        ref={ref}
        className={className}
        suffixNode={
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-zinc-400 hover:text-zinc-800 transition-colors focus:outline-none p-0.5"
            tabIndex={-1}
            title={show ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        {...props}
      />
    );
  }
);
AdminPasswordInput.displayName = "AdminPasswordInput";

// ── 4. MONEDA (PEN / USD / EUR) ─────────────────────────────────────────────
export interface CurrencyInputProps extends Omit<InputProps, "onChange" | "value"> {
  currency?: "PEN" | "USD" | "EUR";
  value?: number | string | null;
  onChange?: (val: number | null) => void;
}

export const AdminCurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ currency = "PEN", value, onChange, ...props }, ref) => {
    const currencySymbols: Record<string, string> = {
      PEN: "S/",
      USD: "$",
      EUR: "€",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, "");
      if (raw === "") {
        onChange?.(null);
        return;
      }
      const parsed = parseFloat(raw);
      onChange?.(isNaN(parsed) ? null : parsed);
    };

    return (
      <AdminTextInput
        type="text"
        inputMode="decimal"
        prefixNode={
          <span className="font-mono text-zinc-600 font-bold text-xs">
            {currencySymbols[currency]}
          </span>
        }
        value={value === undefined || value === null ? "" : value}
        onChange={handleChange}
        ref={ref}
        placeholder="0.00"
        {...props}
      />
    );
  }
);
AdminCurrencyInput.displayName = "AdminCurrencyInput";

// ── 5. PORCENTAJE ───────────────────────────────────────────────────────────
export interface PercentageInputProps extends Omit<InputProps, "onChange" | "value"> {
  value?: number | string | null;
  onChange?: (val: number | null) => void;
}

export const AdminPercentageInput = React.forwardRef<HTMLInputElement, PercentageInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, "");
      if (raw === "") {
        onChange?.(null);
        return;
      }
      const parsed = parseFloat(raw);
      onChange?.(isNaN(parsed) ? null : parsed);
    };

    return (
      <AdminTextInput
        type="text"
        inputMode="decimal"
        suffixNode={<span className="font-mono text-zinc-600 font-bold text-xs">%</span>}
        value={value === undefined || value === null ? "" : value}
        onChange={handleChange}
        ref={ref}
        placeholder="0"
        {...props}
      />
    );
  }
);
AdminPercentageInput.displayName = "AdminPercentageInput";

// ── 6. SWITCH TOGGLE (Pill Rounded) ─────────────────────────────────────────
export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const AdminSwitch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      label,
      description,
      className,
    },
    ref
  ) => {
    return (
      <div className={cn("inline-flex items-start gap-3 py-1 select-none", className)}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          ref={ref}
          onClick={() => onCheckedChange?.(!checked)}
          className={cn(
            "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            checked ? "bg-zinc-900" : "bg-zinc-200 hover:bg-zinc-300"
          )}
        >
          <span
            className={cn(
              "pointer-events-none block h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
              checked ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>

        {(label || description) && (
          <div
            onClick={() => !disabled && onCheckedChange?.(!checked)}
            className="flex flex-col cursor-pointer"
          >
            {label && (
              <span className="text-[12px] font-semibold text-zinc-900 leading-none">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[11px] text-zinc-500 leading-normal mt-1">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
AdminSwitch.displayName = "AdminSwitch";

// ── 7. MULTI-SELECT CON CHIPS Y BUSCADOR ─────────────────────────────────────
export interface OptionItem {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: OptionItem[];
  value?: string[];
  onChange?: (val: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AdminMultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = "Seleccionar opciones...",
      disabled,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
      if (value.includes(val)) {
        onChange?.(value.filter((v) => v !== val));
      } else {
        onChange?.([...value, val]);
      }
    };

    const handleRemove = (val: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(value.filter((v) => v !== val));
    };

    const filtered = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="relative w-full" ref={containerRef}>
        <div
          ref={ref}
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            "min-h-[38px] w-full border border-zinc-200 bg-white p-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer transition-all focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900/10",
            disabled && "bg-zinc-100/70 text-zinc-400 cursor-not-allowed opacity-60 border-zinc-200",
            open && "border-zinc-900"
          )}
        >
          {value.length === 0 && (
            <span className="text-[13px] text-zinc-400 pl-1.5 select-none">
              {placeholder}
            </span>
          )}
          {value.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <span
                key={v}
                className="bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px] font-medium px-2 py-0.5 flex items-center gap-1 select-none"
              >
                {opt ? opt.label : v}
                <button
                  type="button"
                  onClick={(e) => handleRemove(v, e)}
                  className="text-zinc-400 hover:text-red-600 transition-colors focus:outline-none ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>

        {open && !disabled && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-zinc-200 shadow-lg">
            <div className="p-2 border-b border-zinc-100 flex items-center gap-2 bg-zinc-50/50">
              <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                className="w-full text-[12px] bg-transparent outline-none placeholder:text-zinc-400"
                placeholder="Buscar opciones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto slim-scrollbar divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <div className="p-3 text-center text-zinc-400 text-[12px]">
                  No se encontraron resultados
                </div>
              ) : (
                filtered.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "p-2.5 text-[12px] flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors",
                        isSelected && "font-semibold bg-zinc-50 text-zinc-900"
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
AdminMultiSelect.displayName = "AdminMultiSelect";

// ── 8. GESTOR DE SUBIDA DE IMÁGENES / ARCHIVOS CON DRAG & DROP ──────────────
export interface MediaFileItem {
  id: string;
  url: string;
  name?: string;
  size?: number;
}

export interface MediaUploadProps {
  value?: MediaFileItem[];
  onChange?: (files: MediaFileItem[]) => void;
  maxFiles?: number;
  maxSizeMb?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

export const AdminMediaDropzone = React.forwardRef<HTMLDivElement, MediaUploadProps>(
  (
    {
      value = [],
      onChange,
      maxFiles = 10,
      maxSizeMb = 5,
      acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
      disabled,
    },
    ref
  ) => {
    const [dragOver, setDragOver] = useState(false);

    const handleFiles = (files: FileList | null) => {
      if (!files || disabled) return;

      const newItems: MediaFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > maxSizeMb * 1024 * 1024) {
          alert(`El archivo ${file.name} excede los ${maxSizeMb}MB permitidos.`);
          continue;
        }

        const fakeUrl = URL.createObjectURL(file);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          url: fakeUrl,
          name: file.name,
          size: file.size,
        });
      }

      if (value.length + newItems.length > maxFiles) {
        alert(`No puedes subir más de ${maxFiles} archivos.`);
        return;
      }

      onChange?.([...value, ...newItems]);
    };

    const removeFile = (id: string) => {
      onChange?.(value.filter((f) => f.id !== id));
    };

    return (
      <div className="space-y-3 w-full" ref={ref}>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative",
            dragOver && "border-zinc-900 bg-zinc-100",
            disabled && "cursor-not-allowed opacity-50 bg-zinc-100"
          )}
        >
          <input
            type="file"
            multiple
            disabled={disabled}
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
          <p className="text-[13px] font-medium text-zinc-800">
            Arrastra tus archivos aquí o <span className="text-zinc-900 underline font-semibold">explora en tu equipo</span>
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">
            Formatos soportados: JPG, PNG, WebP hasta {maxSizeMb}MB por archivo. Máximo {maxFiles} archivos.
          </p>
        </div>

        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
            {value.map((item, idx) => (
              <div
                key={item.id}
                className="group relative border border-zinc-200 bg-white aspect-square overflow-hidden flex items-center justify-center"
              >
                <Image
                  src={item.url}
                  alt={item.name || "Imagen subida"}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {idx === 0 && (
                  <span className="absolute top-1 left-1 z-10 bg-zinc-900 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
AdminMediaDropzone.displayName = "AdminMediaDropzone";