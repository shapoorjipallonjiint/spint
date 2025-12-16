"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  font-semibold   text-md"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
    & { main?: boolean }
    & { oneInput?: boolean }
>(({ className, main, oneInput, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className, `${main ? "pl-5 border-b py-2" : "text-[16px] font-light"} ${oneInput ? "font-semibold text-md" : ""}`)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
