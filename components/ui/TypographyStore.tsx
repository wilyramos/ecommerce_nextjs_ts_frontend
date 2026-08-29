// File: frontend/components/ui/TypographyStore.tsx

import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

// H1: Título principal compacto y neutral
const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl",
      className
    )}
    {...props}
  />
)

// H2: Títulos de sección sobrios
const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      "scroll-m-20 text-xl font-medium tracking-tight text-foreground sm:text-2xl",
      className
    )}
    {...props}
  />
)

// H3: Subtítulos de sección y tarjetas
const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      "scroll-m-20 text-base font-medium tracking-tight text-foreground sm:text-lg",
      className
    )}
    {...props}
  />
)

// H4: Micro-títulos y labels de sección
const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      "scroll-m-20 text-xs font-medium uppercase tracking-wider text-muted-foreground",
      className
    )}
    {...props}
  />
)

// P: Texto corrido equilibrado
const P = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-sm leading-relaxed text-foreground/90",
      className
    )}
    {...props}
  />
)

// Lead: Introducción ligera sin exceso de peso
const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-base font-normal leading-relaxed text-muted-foreground",
      className
    )}
    {...props}
  />
)

// Muted: Texto secundario en gris atenuado
const Muted = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-xs sm:text-sm font-normal text-muted-foreground",
      className
    )}
    {...props}
  />
)

// Small: Micro-detalles y notas al pie
const Small = ({ className, ...props }: ComponentPropsWithoutRef<"small">) => (
  <small
    className={cn(
      "text-[11px] font-normal leading-tight text-muted-foreground",
      className
    )}
    {...props}
  />
)

// Label: Etiquetas de formularios y campos
const Label = ({ className, ...props }: ComponentPropsWithoutRef<"label">) => (
  <label
    className={cn(
      "text-xs font-medium text-foreground/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
)

// Price: Forespaciado para montos y totales
const Price = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
  <span
    className={cn(
      " font-medium tracking-tight text-foreground",
      className
    )}
    {...props}
  />
)

// BadgeText: Indicadores de estado o etiquetas compactas
const BadgeText = ({ className, ...props }: ComponentPropsWithoutRef<"span">) => (
  <span
    className={cn(
      "inline-flex items-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
      className
    )}
    {...props}
  />
)

// Blockquote: Cita sutil con borde gris fino
const Blockquote = ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
  <blockquote
    className={cn(
      "mt-4 border-l border-border pl-4 text-sm italic text-muted-foreground",
      className
    )}
    {...props}
  />
)

// Listas minimalistas
const Ul = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      "my-3 ml-5 list-disc space-y-1.5 text-sm text-foreground/90",
      className
    )}
    {...props}
  />
)

const Ol = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      "my-3 ml-5 list-decimal space-y-1.5 text-sm text-foreground/90",
      className
    )}
    {...props}
  />
)

const Li = ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
  <li
    className={cn(
      "leading-relaxed",
      className
    )}
    {...props}
  />
)

const InlineCode = ({ className, ...props }: ComponentPropsWithoutRef<"code">) => (
  <code
    className={cn(
      "relative rounded bg-muted px-1.5 py-0.5  text-xs font-normal text-foreground",
      className
    )}
    {...props}
  />
)

const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      "my-4 overflow-x-auto rounded-md border border-border bg-muted/40 p-3  text-xs text-foreground",
      className
    )}
    {...props}
  />
)

const Hr = ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
  <hr
    className={cn(
      "my-4 border-border/60",
      className
    )}
    {...props}
  />
)

// Tabla: Especificaciones en tonos grises
const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="my-4 w-full overflow-x-auto rounded-md border border-border">
    <table
      className={cn(
        "w-full border-collapse text-left text-xs sm:text-sm",
        className
      )}
      {...props}
    />
  </div>
)

const Tr = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/40",
      className
    )}
    {...props}
  />
)

const Th = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      "h-10 px-3.5 align-middle font-medium text-foreground bg-muted/20 text-xs uppercase tracking-wider",
      className
    )}
    {...props}
  />
)

const Td = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      "p-3.5 align-middle text-muted-foreground",
      className
    )}
    {...props}
  />
)

export {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Muted,
  Small,
  Label,
  Price,
  BadgeText,
  Blockquote,
  Ul,
  Ol,
  Li,
  InlineCode,
  Pre,
  Hr,
  Table,
  Tr,
  Th,
  Td,
}