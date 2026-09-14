// File: frontend/components/ui/NavigationMenuV3.tsx
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu-v3"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative z-10 flex max-w-full flex-1 items-center justify-start",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-8 w-max items-center justify-center rounded-radius-md bg-transparent px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors duration-fast outline-none hover:bg-surface-secondary hover:text-text-primary focus:bg-surface-secondary focus:text-text-primary focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface-primary disabled:pointer-events-none disabled:text-text-disabled data-[state=open]:bg-surface-secondary data-[state=open]:text-text-primary"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="relative top-[0.5px] ml-1 h-3 w-3 text-text-tertiary transition-transform duration-normal group-data-[state=open]:rotate-180 group-hover:text-text-primary"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "left-0 top-0 w-full data-[motion=from-end]:slide-in-from-right-48 data-[motion=from-start]:slide-in-from-left-48 data-[motion=to-end]:slide-out-to-right-48 data-[motion=to-start]:slide-out-to-left-48 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-2 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-radius-xl group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-border-primary group-data-[viewport=false]/navigation-menu:bg-surface-primary group-data-[viewport=false]/navigation-menu:text-text-primary group-data-[viewport=false]/navigation-menu:shadow-xl",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute left-0 top-full flex justify-start">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-left relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-radius-xl border border-border-primary/80 bg-surface-primary/95 text-text-primary shadow-xl backdrop-blur-md transition-[width,height] duration-normal data-[state=closed]:animate-out data-[state=closed]:zoom-out-98 data-[state=open]:animate-in data-[state=open]:zoom-in-98 md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2.5 rounded-radius-md p-1.5 text-xs text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary focus:bg-surface-secondary focus:text-text-primary",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-[2px] border border-border-primary bg-surface-primary shadow-xs" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}