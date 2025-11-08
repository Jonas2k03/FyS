import * as React from "react"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-2)_100%)] rounded-xl border border-border shadow-[0_8px_20px_rgba(0,0,0,0.40)] ${className}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardContent }

