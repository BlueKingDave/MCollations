import React from 'react'

type Variant = 'default' | 'light' | 'dark' | 'primary' | 'accent'

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: Variant
}

export default function Divider({
  className = '',
  variant = 'default',
  ...props
}: DividerProps) {
  const variants = {
    default: 'bg-secondary',
    light: 'bg-neutral-100',
    dark: 'bg-secondary',
    primary: 'bg-primary',
    accent: 'bg-accent'
  }

  const smoothMask = `
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 5%,
    rgba(0, 0, 0, 0.4) 15%,
    rgba(0, 0, 0, 0.2) 25%,
    transparent 45%,
    transparent 55%,
    rgba(0, 0, 0, 0.2) 75%,
    rgba(0, 0, 0, 0.4) 85%,
    rgba(0, 0, 0, 0.5) 95%,
    rgba(0, 0, 0, 0.7) 100%
  `

  return (
    <div
      className={`h-0.5 w-full ${variants[variant]} ${className}`}
      style={{
        maskImage: `linear-gradient(to right, ${smoothMask})`,
        WebkitMaskImage: `linear-gradient(to right, ${smoothMask})`
      }}
      {...props}
    />
  )
}
