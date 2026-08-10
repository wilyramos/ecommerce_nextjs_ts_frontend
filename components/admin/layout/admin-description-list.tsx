// File: frontend/components/admin/ui/admin-description-list.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface DescriptionItem {
  label: string;
  value: React.ReactNode;
  isMono?: boolean;
}

interface AdminDescriptionListProps {
  items: DescriptionItem[];
  className?: string;
}

export function AdminDescriptionList({ items, className }: AdminDescriptionListProps) {
  return (
    <dl className={cn("divide-y divide-zinc-100 text-xs", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-1 first:pt-0 last:pb-0">
          <dt className="text-zinc-500 font-medium text-[11px]">{item.label}</dt>
          <dd className={cn("text-zinc-900 font-semibold text-xs", item.isMono && "font-mono")}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}