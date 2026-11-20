"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  font-semibold   text-md"
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
    className={cn(labelVariants(), className, `${main ? "relative pl-5 pr-5 py-3 border-b border-slate-100 text-[15px] font-semibold tracking-[-0.01em] text-slate-800 before:absolute before:left-0 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-gradient-to-b before:from-primary before:to-sky-400" : "text-[14px] font-medium text-slate-700"} ${oneInput ? "font-semibold text-md" : ""}`)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
