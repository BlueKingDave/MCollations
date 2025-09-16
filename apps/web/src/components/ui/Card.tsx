"use client"

import React from 'react'

type Background =
  | 'surface-primary'
  | 'surface-secondary'
  | 'surface-accent'
  | 'secondary'
  | 'secondary-light'
  | 'features'
  | 'features-light'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  hover?: boolean
  background?: Background
  role?: string
  'aria-label'?: string
  tabIndex?: number
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
}

export default function Card({
  children,
  className = '',
  hover = false,
  background = 'surface-primary',
  role,
  'aria-label': ariaLabel,
  tabIndex,
  onClick,
  ...props
}: CardProps) {
  const cardVariants = {
    'surface-primary': 'bg-surface-primary border-neutral-100',
    'surface-secondary': 'bg-surface-secondary border-neutral-100',
    'surface-accent': 'bg-surface-accent border-neutral-200',
    'secondary': 'bg-secondary border-neutral-100',
    'secondary-light': 'bg-secondary-light border-neutral-100',
    'features': 'bg-features border-neutral-100',
    'features-light': 'bg-features-light border-neutral-100'
  }
  
  const baseClasses = 'border-2 rounded-lg shadow-md overflow-hidden'
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-300' : ''
  const interactiveClasses = onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2' : ''
  
  const cardProps = {
    className: `${baseClasses} ${cardVariants[background]} ${hoverClasses} ${interactiveClasses} ${className}`,
    role: onClick ? 'button' : role,
    'aria-label': ariaLabel,
    tabIndex: onClick ? (tabIndex ?? 0) : tabIndex,
    onClick,
    onKeyDown: onClick ? (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick(e)
      }
    } : undefined,
    ...props
  }
  
  return (
    <div {...cardProps}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 pt-4 ${className}`}>
      {children}
    </div>
  )
}
