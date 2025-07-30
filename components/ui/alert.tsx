"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        success:
          "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800 dark:text-green-200 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning:
          "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        danger:
          "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-200 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      dismissible?: boolean
      onDismiss?: () => void
    }
>(({ className, variant, dismissible = false, onDismiss, children, ...props }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "danger":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {getIcon()}
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className={dismissible ? "pr-8" : ""}>{children}</div>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
