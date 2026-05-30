'use client';

import { useState } from 'react';
import { MediaGrid } from '@/src/modules/media/management/MediaGrid';
import { useMediaList } from '@/src/modules/media/hooks/useMediaList';
import { useDeleteMedia } from '@/src/modules/media/hooks/useDeleteMedia';
import { FOLDER_LABELS } from '@/src/modules/media/types/media.constants';
import type { MediaFolder } from '@/src/modules/media/types/media.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminMediaPage() {
    // Estado para controlar la carpeta activa en el panel general
    const [currentFolder, setCurrentFolder] = useState<MediaFolder>('products');

    // Consumimos el hook de listado paginado con scroll infinito automático
    const { media, isLoading, isFetchingMore, hasMore, error } = useMediaList({
        folder: currentFolder,
        limit: 24,
        autoFetch: true,
    });

    // Consumimos el hook de eliminación que se conecta al Proxy DELETE de Next.js
    const { deleteMedia } = useDeleteMedia({
        onSuccess: (id) => {
            console.log(`Archivo con ID ${id} eliminado exitosamente.`);
            toast.success('Archivo eliminado correctamente de la base de datos y Cloudinary');
            // refetch(); // Refresca la grilla inmediatamente eliminando el nodo visual
        },
        onError: (err) => {
            toast.error(`Error al eliminar el archivo: ${err}`);
        }
    });

    return (
        <div className="space-y-6 p-6 bg-background rounded-sm border border-border/40">

            {/* ─── Encabezado y Selector de Carpetas ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div>
                    <h1 className="text-lg font-bold uppercase tracking-wider text-foreground">
                        Administrador de Biblioteca de Medios
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        Visualiza, organiza y limpia permanentemente los archivos multimedia del sistema.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <label htmlFor="folder-select" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Carpeta:
                    </label>
                    <Select
                        value={currentFolder}
                        onValueChange={(val) => setCurrentFolder(val as MediaFolder)}
                    >
                        <SelectTrigger id="folder-select" className="w-[180px] h-9 text-xs font-semibold rounded-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(FOLDER_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key} className="text-xs font-medium">
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ─── Grilla Operacional del Panel de Control ─── */}
            <div className="bg-card/30 rounded-lg p-4 border border-dashed">
                <MediaGrid
                    media={media}
                    isLoading={isLoading}
                    isFetchingMore={isFetchingMore}
                    hasMore={hasMore}
                    error={error}
                    selectable={false} // Desactivado: Aquí no estamos seleccionando para un formulario
                    onDelete={deleteMedia} // 🗑️ ¡CORREGIDO! Al pasarle la función, MediaCard activará la "✕" de borrado definitivo
                    columns={5} // Grilla expandida para pantallas de administración
                    emptyMessage={`La carpeta "${FOLDER_LABELS[currentFolder]}" está vacía.`}
                />
            </div>
        </div>
    );
}