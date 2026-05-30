'use client';

import { useEffect, useRef, useId } from 'react';
import { MediaGrid } from './MediaGrid';
import { useMediaList } from '../hooks/useMediaList';
import { useMediaPicker } from '../hooks/useMediaPicker';
import { FOLDER_LABELS } from '../types/media.constants';
import type { MediaPickerProps } from '../types/media.types';

export function MediaPicker({
    folder,
    multiple = false,
    maxSelectable = 10,
    open,
    onClose,
    onConfirm,
}: MediaPickerProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const componentId = useId();

    const picker = useMediaPicker({
        multiple,
        maxSelectable,
        onConfirm,
        onClose,
    });

    const list = useMediaList({
        folder,
        limit: 30,
        autoFetch: open, // Dispara peticiones de red únicamente cuando el modal pasa a estar visible
    });

    // ── Sincronización del Estado de Apertura del Custom Hook ─────────────────

    const pickerOpenTrigger = picker.open;
    const pickerCloseTrigger = picker.close;

    useEffect(() => {
        if (open) {
            pickerOpenTrigger(folder);
        } else {
            pickerCloseTrigger();
        }
    }, [open, folder, pickerOpenTrigger, pickerCloseTrigger]);

    // ── Atajos de Teclado (Escape y Confinamiento de Foco) ─────────────────────

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // ── Control del Scroll del Body (Previene Fugas Visuales) ──────────────────

    useEffect(() => {
        if (!open) return;
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [open]);

    // ── Gestión de Accesibilidad Activa (Focus Trap Init) ──────────────────────

    useEffect(() => {
        if (open) {
            // Retrasamos el foco un milisegundo para permitir que el árbol de hidratación de React se asiente en el DOM
            const timer = setTimeout(() => dialogRef.current?.focus(), 1);
            return () => clearTimeout(timer);
        }
    }, [open]);

    if (!open) return null;

    const folderLabel = FOLDER_LABELS[folder] ?? folder;

    return (
        <>
            {/* Backdrop de Oscurecimiento */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Contenedor Dialog Modal */}
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${componentId}-title`}
                tabIndex={-1}
                className={[
                    'fixed z-50 inset-x-4 top-[5%] bottom-[5%]',
                    'mx-auto max-w-4xl w-full',
                    'flex flex-col rounded-xl border border-border bg-background shadow-2xl outline-none',
                ].join(' ')}
            >
                {/* ── Header ──────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                    <div>
                        <h2 id={`${componentId}-title`} className="text-base font-semibold text-foreground">
                            Seleccionar archivos
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                            Carpeta: <span className="text-foreground font-semibold">{folderLabel}</span>
                            {multiple && ` · Máx. ${maxSelectable} archivos`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar selector de medios"
                        className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Toolbar de Selección Múltiple ── */}
                {multiple && list.media.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/60 bg-muted/40 text-muted-foreground shrink-0 select-none">
                        <span className="text-xs font-medium">
                            {picker.selectionCount > 0
                                ? `${picker.selectionCount} seleccionado${picker.selectionCount > 1 ? 's' : ''}`
                                : 'Ninguno seleccionado'}
                        </span>

                        <div className="flex items-center gap-4">
                            {picker.selectionCount > 0 && (
                                <button
                                    type="button"
                                    onClick={picker.clearSelection}
                                    // Corregido: Reemplazado el atributo inválido por la directiva disabled nativa de HTML
                                    disabled={list.media.length === 0}
                                    className="text-xs font-semibold text-muted-foreground hover:text-foreground outline-none focus-visible:underline disabled:opacity-40"
                                >
                                    Limpiar
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => picker.selectAll(list.media)}
                                disabled={list.media.length === 0}
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors outline-none focus-visible:underline disabled:opacity-40"
                            >
                                Seleccionar todo
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Grid Scrollable Corregido ── */}
                <div className="flex-1 overflow-y-auto px-5 py-4 bg-muted/10">
                    <MediaGrid
                        media={list.media}
                        isLoading={list.isLoading}
                        isFetchingMore={list.isFetchingMore}
                        hasMore={list.hasMore}
                        error={list.error}
                        selectable={true}
                        selectedIds={picker.selectedIds}
                        canSelectMore={picker.canSelectMore}
                        onSelect={picker.toggleSelect}
                        onLoadMore={list.fetchNextPage}
                        columns={4}
                        emptyMessage={`No hay archivos en "${folderLabel}"`}
                    />
                </div>

                {/* ── Footer ───────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-background shrink-0 select-none">
                    <p className="text-xs text-muted-foreground font-medium tabular-nums">
                        {list.total} archivo{list.total !== 1 ? 's' : ''} en total
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={picker.confirm}
                            disabled={picker.selectionCount === 0}
                            className={[
                                'rounded-md px-4 py-2 text-sm font-semibold outline-none',
                                'bg-primary text-primary-foreground',
                                'hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed',
                                'transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                            ].join(' ')}
                        >
                            Confirmar
                            {picker.selectionCount > 0 && (
                                <span className="ml-1.5 tabular-nums font-bold">
                                    ({picker.selectionCount})
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}