"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// one provider per tooltip keeps it drop-in; delay/skip settings match across the admin
function Tooltip({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipPrimitive.Provider delayDuration={150} skipDelayDuration={300}>
            <TooltipPrimitive.Root data-slot="tooltip" {...props}>
                {children}
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

// fade + small slide in / out (keyframes: .tooltip-content in globals.css)
function TooltipContent({
    className,
    sideOffset = 6,
    children,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    "tooltip-content z-50 rounded-md bg-black px-2.5 py-1.5 text-xs text-white shadow-md select-none",
                    className
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="fill-black" width={10} height={5} />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent }
