"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { X, Tag, Plus } from "lucide-react";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";

interface TagsInputProps {
    initial?: string[];
}

export default function TagsInput({ initial = [] }: TagsInputProps) {
    const [tags, setTags] = useState<string[]>(initial);
    const [inputValue, setInputValue] = useState("");

    const addTag = (raw: string) => {
        const value = raw.trim().toLowerCase();
        if (!value || tags.includes(value)) return;
        setTags(prev => [...prev, value]);
        setInputValue("");
    };

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        } else if (e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <LabelWithTooltip
                    htmlFor="tags-input"
                    label="Etiquetas / Tags"
                    tooltip="Palabras clave para optimizar la búsqueda interna y SEO. Separa con Enter o coma."
                />
            </div>

            {/* Contenedor de Tags e Input */}
            <div className="flex flex-wrap gap-2 min-h-[44px] w-full border border-border/60 bg-background rounded-sm px-3 py-2 focus-within:border-muted-foreground/60 transition-colors">
                {tags.map(tag => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 bg-background-secondary border border-border/60 text-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-muted-foreground hover:text-destructive transition-colors outline-none"
                            aria-label={`Eliminar ${tag}`}
                        >
                            <X size={12} strokeWidth={2.5} />
                        </button>
                    </span>
                ))}

                <div className="flex-1 min-w-[120px] flex items-center gap-1">
                    {tags.length > 0 && <Plus className="w-3.5 h-3.5 text-muted-foreground/50" />}
                    <input
                        id="tags-input"
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? "Ej: iPhone, Premium..." : "Añadir..."}
                        className="w-full bg-transparent outline-none placeholder:text-muted-foreground/50 text-xs font-medium text-foreground"
                    />
                </div>
            </div>

            {/* Info y Acciones */}
            <div className="flex justify-between items-center px-0.5">
                <p className="text-[10px] font-medium text-muted-foreground italic">
                    {tags.length > 0
                        ? `${tags.length} etiquetas añadidas`
                        : "Presiona Enter o Coma ( , ) para confirmar."
                    }
                </p>
                {tags.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setTags([])}
                        className="text-[10px] font-bold uppercase tracking-tight text-action-cta hover:underline outline-none"
                    >
                        Limpiar todo
                    </button>
                )}
            </div>

            {/* Serialización */}
            <input type="hidden" name="tags" value={JSON.stringify(tags)} />
        </div>
    );
}