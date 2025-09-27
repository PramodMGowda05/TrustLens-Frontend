"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

const sidebarVariants = cva(
  "group flex h-full flex-col transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        sidebar: "w-64 data-[collapsed=true]:w-16",
        "mobile-sidebar": "w-64",
      },
      collapsible: {
        icon: "",
        button: "",
      },
    },
    defaultVariants: {
      variant: "sidebar",
    },
  }
)

type SidebarContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

type SidebarProviderProps = React.PropsWithChildren<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

function SidebarProvider({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(true)
  const isMobile = useIsMobile()

  const open = controlledOpen ?? internalOpen
  const onOpenChange = setControlledOpen ?? setInternalOpen

  React.useEffect(() => {
    if (isMobile) {
      onOpenChange(false)
    } else {
      onOpenChange(true)
    }
  }, [isMobile, onOpenChange])

  const contextValue = React.useMemo(
    () => ({ open, onOpenChange }),
    [open, onOpenChange]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

const SidebarRoot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> &
    React.PropsWithChildren<Pick<SidebarProviderProps, "onOpenChange">> &
    VariantProps<typeof sidebarVariants>
>(
  (
    {
      className,
      children,
      variant = "sidebar",
      collapsible,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange: setOpen } = useSidebar()
    const isMobile = useIsMobile()

    const handleOpenChange = onOpenChange ?? setOpen

    if (isMobile && variant === "sidebar") {
      return null
    }

    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ variant }), className)}
        data-collapsed={!open}
        {...props}
      >
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </aside>
    )
  }
)
SidebarRoot.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <header
      ref={ref}
      className={cn(
        "flex h-16 shrink-0 items-center gap-4 border-b px-6",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("grid gap-2 p-3", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("grid", className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

type SidebarMenuButtonProps = ButtonProps & {
  isActive?: boolean
  tooltip?: Omit<
    React.ComponentProps<typeof TooltipContent>,
    "content" | "children"
  > & { children: React.ReactNode }
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ asChild, tooltip, isActive, ...props }, ref) => {
  const { open } = useSidebar()

  const button = (
    <Button
      ref={ref}
      variant="ghost"
      className="group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-0"
      asChild
      {...props}
    />
  )

  if (!open && tooltip) {
    const { children: tooltipContent, ...tooltipProps } = tooltip
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          {...tooltipProps}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarFooter = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <footer
      ref={ref}
      className={cn(
        "sticky bottom-0 mt-auto flex h-16 shrink-0 items-center gap-4 border-t px-6",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Header: SidebarHeader,
  Content: SidebarContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  Footer: SidebarFooter,
})

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  sidebarVariants,
}
