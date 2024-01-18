'use client';

import * as React from "react"
import { cva } from "class-variance-authority";
import { IoClose } from "react-icons/io5";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className, { hidden: !isOpen })}
      {...props} 
      >
        {children}
        <div 
          className="absolute right-2 top-1 hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          >
            <IoClose size={23} className="text-gray-800"/>
        </div>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
