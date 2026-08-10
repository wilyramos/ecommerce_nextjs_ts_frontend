// File: frontend/components/admin/ui/admin-code-block.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminCodeBlockProps {
  label: string;
  code: string;
}

export function AdminCodeBlock({ label, code }: AdminCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código copiado");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between bg-zinc-50/80 px-3 py-2 rounded-md border border-zinc-200/80">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {label}:
        </span>
        <code className="font-mono text-xs font-bold text-zinc-900 tracking-wide bg-zinc-200/60 px-1.5 py-0.5 rounded">
          {code}
        </code>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-6 px-2 text-[11px] gap-1 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
        {copied ? "Copiado" : "Copiar"}
      </Button>
    </div>
  );
}