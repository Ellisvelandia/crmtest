import { memo } from "react"
import { cn } from "@/lib/utils"

// Pre-compute class names for better performance
const CARD_BASE_CLASSES = "rounded-lg border bg-white shadow-sm"
const CARD_HEADER_CLASSES = "flex flex-col space-y-1.5 p-6"
const CARD_TITLE_CLASSES = "text-lg font-semibold leading-none tracking-tight"
const CARD_DESCRIPTION_CLASSES = "text-sm text-gray-500"
const CARD_CONTENT_CLASSES = "p-6 pt-0"
const CARD_FOOTER_CLASSES = "flex items-center p-6 pt-0"

// Memoized card components for better performance
export const Card = memo(function Card({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(CARD_BASE_CLASSES, className)}
      {...props}
    />
  )
})

export const CardHeader = memo(function CardHeader({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(CARD_HEADER_CLASSES, className)}
      {...props}
    />
  )
})

export const CardTitle = memo(function CardTitle({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(CARD_TITLE_CLASSES, className)}
      {...props}
    />
  )
})

export const CardDescription = memo(function CardDescription({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(CARD_DESCRIPTION_CLASSES, className)}
      {...props}
    />
  )
})

export const CardContent = memo(function CardContent({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(CARD_CONTENT_CLASSES, className)} 
      {...props} 
    />
  )
})

export const CardFooter = memo(function CardFooter({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(CARD_FOOTER_CLASSES, className)}
      {...props}
    />
  )
}) 