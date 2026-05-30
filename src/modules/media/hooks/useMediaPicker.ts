import { useState, useCallback, useMemo } from 'react';
import type { Media, MediaFolder } from '../types/media.types';

interface UseMediaPickerOptions {
  multiple?: boolean;
  maxSelectable?: number;
  onConfirm?: (selected: Media[]) => void;
  onClose?: () => void;
}

interface UseMediaPickerReturn {
  isOpen: boolean;
  folder: MediaFolder | null;
  selected: Media[];
  selectedIds: Set<string>;
  selectionCount: number;
  isSelected: (media: Media) => boolean;
  canSelectMore: boolean;
  open: (folder: MediaFolder) => void;
  close: () => void;
  toggleSelect: (media: Media) => void;
  selectAll: (media: Media[]) => void;
  clearSelection: () => void;
  confirm: () => void;
}

export function useMediaPicker(options: UseMediaPickerOptions = {}): UseMediaPickerReturn {
  const {
    multiple = false,
    maxSelectable = 10,
    onConfirm,
    onClose,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [folder, setFolder] = useState<MediaFolder | null>(null);
  const [selected, setSelected] = useState<Media[]>([]);

  // ─── Estados Derivados Memorizados ─────────────────────────────────────────
  
  // Ahora el Set se calcula ÚNICAMENTE si el array de seleccionados cambia de verdad
  const selectedIds = useMemo(() => {
    return new Set(selected.map((m) => m._id));
  }, [selected]);

  const selectionCount = selected.length;

  const canSelectMore = useMemo(() => {
    return !multiple ? selectionCount === 0 : selectionCount < maxSelectable;
  }, [multiple, selectionCount, maxSelectable]);

  // ─── Modal Acciones ────────────────────────────────────────────────────────

  const open = useCallback((targetFolder: MediaFolder) => {
    setFolder(targetFolder);
    setSelected([]);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelected([]);
    setFolder(null);
    onClose?.();
  }, [onClose]);

  // ─── Selección Acciones ────────────────────────────────────────────────────

  // Eliminado el hack del eslint. Ahora es seguro y eficiente O(1)
  const isSelected = useCallback(
    (media: Media) => selectedIds.has(media._id),
    [selectedIds]
  );

  const toggleSelect = useCallback(
    (media: Media) => {
      setSelected((prev) => {
        const alreadySelected = prev.some((m) => m._id === media._id);

        if (alreadySelected) {
          return prev.filter((m) => m._id !== media._id);
        }

        if (!multiple) {
          return [media];
        }

        if (prev.length >= maxSelectable) {
          return prev;
        }

        return [...prev, media];
      });
    },
    [multiple, maxSelectable]
  );

  const selectAll = useCallback(
    (media: Media[]) => {
      if (!multiple) return;
      setSelected(media.slice(0, maxSelectable));
    },
    [multiple, maxSelectable]
  );

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  // ─── Confirmar Selección ───────────────────────────────────────────────────

  const confirm = useCallback(() => {
    if (selected.length === 0) return;
    
    onConfirm?.(selected);
    setIsOpen(false);
    setSelected([]);
    setFolder(null);
  }, [selected, onConfirm]);

  return {
    isOpen,
    folder,
    selected,
    selectedIds,
    selectionCount,
    isSelected,
    canSelectMore,
    open,
    close,
    toggleSelect,
    selectAll,
    clearSelection,
    confirm,
  };
}