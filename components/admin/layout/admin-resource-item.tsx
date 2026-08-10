// File: frontend/components/admin/ui/admin-resource-item.tsx
import React from "react";
import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminResourceItemProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  price?: number;
  badge?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function AdminResourceItem({
  title,
  subtitle,
  imageUrl,
  price,
  badge,
  onRemove,
  className,
}: AdminResourceItemProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center gap-2.5 bg-white border border-zinc-200/80 p-1.5 px-2 rounded-md transition-all duration-150 hover:border-zinc-300 hover:shadow-2xs",
        className
      )}
    >
      <div className="relative h-8 w-8 flex-shrink-0 bg-zinc-100 rounded border border-zinc-200/60 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="32px"
            className="object-cover"
          />
        ) : (
          <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="truncate text-xs font-semibold text-zinc-900 leading-none">{title}</span>
        {subtitle && <span className="truncate text-[10px] text-zinc-500 mt-0.5 leading-none">{subtitle}</span>}
      </div>

      {price !== undefined && (
        <span className="text-[11px] font-medium font-mono text-zinc-700">
          S/ {price.toFixed(2)}
        </span>
      )}

      {badge}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}