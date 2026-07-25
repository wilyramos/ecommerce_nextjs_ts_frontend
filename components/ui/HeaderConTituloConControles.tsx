// components/ui/HeaderConTituloConControles.tsx
"use client";

import React from "react";
import type { ButtonGroupProps } from "react-multi-carousel";
import SectionHeader from "@/components/home/sections/SectionHeader";

interface Props extends ButtonGroupProps {
    title: React.ReactNode;
    viewAllHref?: string;
    label?: string;
}

export default function HeaderConTituloConControles({
    title,
    viewAllHref,
    label,
}: Props) {
    return (
        <SectionHeader
            title={title}
            subtitle={label}
            viewAllHref={viewAllHref}
        />
    );
}