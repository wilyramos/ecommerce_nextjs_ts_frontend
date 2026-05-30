// File: frontend/components/media/UploadProgress.tsx
'use client';

import { useId } from 'react';
import {
    CheckCircle2,
    XCircle,
    Loader2,
    FileText,
    Film,
    Image as ImageIcon,
    Clock
} from 'lucide-react';
import type { FileUploadState } from '../types/media.types';

interface UploadProgressProps {
    fileStates: FileUploadState[];
    globalProgress: number;
    uploadedCount: number;
    failedCount: number;
    totalCount: number;
}

export function UploadProgress({
    fileStates,
    globalProgress,
    uploadedCount,
    failedCount,
    totalCount,
}: UploadProgressProps) {
    const componentId = useId();
    if (fileStates.length === 0) return null;

    const hasFailed = failedCount > 0;
    const isOnlyFailed = hasFailed && uploadedCount === 0;

    const progressColor = isOnlyFailed
        ? 'bg-destructive'
        : hasFailed
            ? 'bg-amber-500'
            : 'bg-primary';

    return (
        <div className="w-full space-y-4" role="region" aria-labelledby={`${componentId}-title`}>
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span id={`${componentId}-title`} className="text-muted-foreground font-medium" aria-live="polite">
                        {uploadedCount} de {totalCount} archivos subidos
                        {hasFailed && (
                            <span className="text-destructive ml-1.5 font-normal">
                                · {failedCount} fallido{failedCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </span>
                    <span className="font-semibold tabular-nums text-foreground" aria-live="off">
                        {globalProgress >= 95 && globalProgress < 100 ? (
                            <span className="text-xs text-muted-foreground font-normal animate-pulse">Procesando...</span>
                        ) : (
                            `${globalProgress}%`
                        )}
                    </span>
                </div>

                <div
                    className="h-2 w-full rounded-full bg-muted overflow-hidden"
                    role="progressbar"
                    aria-valuenow={globalProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className={`h-full rounded-full transition-all duration-300 ease-out ${progressColor}`}
                        style={{ width: `${globalProgress}%` }}
                    />
                </div>
            </div>

            <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-1" role="list">
                {fileStates.map((state) => (
                    <FileProgressItem
                        key={`${state.file.name}-${state.file.size}`}
                        state={state}
                    />
                ))}
            </ul>
        </div>
    );
}

function FileProgressItem({ state }: { state: FileUploadState }) {
    const { file, status, progress, error } = state;

    const statusConfig = {
        idle: {
            label: 'En cola',
            color: 'text-muted-foreground',
            barColor: 'bg-muted',
            icon: <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
        },
        uploading: {
            label: progress >= 95 ? 'Procesando...' : `${progress}%`,
            color: 'text-primary font-medium tabular-nums',
            barColor: 'bg-primary',
            icon: <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
        },
        success: {
            label: 'Completado',
            color: 'text-success font-medium',
            barColor: 'bg-success',
            icon: <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
        },
        error: {
            label: 'Error',
            color: 'text-destructive font-medium',
            barColor: 'bg-destructive',
            icon: <XCircle className="h-4 w-4 text-destructive shrink-0" />
        },
    }[status];

    return (
        <li className="group relative space-y-1.5 rounded-lg border border-border/40 bg-card/50 p-2.5 transition-colors hover:bg-card">
            <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                    <FileTypeIcon mimetype={file.type} />
                    <div className="flex flex-col min-w-0">
                        <span className="truncate font-medium text-foreground pr-1" title={file.name}>
                            {file.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {formatBytes(file.size)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 text-xs select-none">
                    <span className={statusConfig.color}>
                        {statusConfig.label}
                    </span>
                    {statusConfig.icon}
                </div>
            </div>

            {status === 'uploading' && (
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ease-out ${statusConfig.barColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {status === 'error' && error && (
                <p className="text-xs text-destructive bg-destructive/10 p-1.5 rounded font-medium break-words">
                    {error}
                </p>
            )}
        </li>
    );
}

function FileTypeIcon({ mimetype }: { mimetype: string }) {
    const iconClassName = "h-4 w-4 text-muted-foreground/80 shrink-0 select-none";

    if (mimetype.startsWith('image/')) return <ImageIcon className={iconClassName} />;
    if (mimetype.startsWith('video/')) return <Film className={iconClassName} />;
    return <FileText className={iconClassName} />;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}