// File: frontend/components/admin/ui/admin-stat-card.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

export function AdminStatCard({ label, value, subValue, className }: AdminStatCardProps) {
  return (
    <div className={cn("bg-white border border-zinc-200/80 rounded-lg p-2", className)}>
      <span className="text-[11px] font-medium text-zinc-500 block leading-none">{label}</span>
      <p className="font-mono text-lg font-bold text-zinc-900 tracking-tight mt-1">{value}</p>
      {subValue && <p className="text-[10px] text-zinc-400 mt-0.5">{subValue}</p>}
    </div>
  );
}