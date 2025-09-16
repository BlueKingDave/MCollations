import React from 'react'

// Base Typography Components
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'display' | 'light' | 'secondary'
}

export function Heading({
  level = 'h2',
  children,
  className = '',
  variant = 'default',
  ...props
}: HeadingProps) {
  const baseClasses = {
    h1: 'text-3xl md:text-4xl font-bold text-primaryText',
    h2: 'text-2xl md:text-3xl font-semibold text-primaryText',
    h3: 'text-xl md:text-2xl font-semibold text-primaryText',
    h4: 'text-lg md:text-xl font-medium text-primaryText',
    h5: 'text-base md:text-lg font-medium text-primaryText',
    h6: 'text-sm md:text-base font-medium text-primaryText',
  }

  const variants = {
    default: '',
    display: 'font-display',
    light: 'font-light',
    secondary: 'text-secondaryText',
  }

  const classes = `${baseClasses[level]} ${variants[variant]} ${className}`
  return React.createElement(level, { className: classes, ...props }, children)
}

interface TextProps {
  size?: string
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
  children?: React.ReactNode
  className?: string
  as?: React.ElementType
  // pass through any props applicable to the rendered element
  [key: string]: any
}

export function Text({
  size = 'base',
  weight = 'normal',
  color = 'secondaryText',
  children,
  className = '',
  as = 'p',
  ...props
}: TextProps) {
  const Component = as as React.ElementType
  const classes = `text-${size} font-${weight} text-${color} ${className}`

  return (
    React.createElement(Component, { className: classes, ...props }, children)
  )
}

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children?: React.ReactNode
  className?: string
}

export function Display({
  size = 'md',
  children,
  className = '',
  ...props
}: DisplayProps) {
  const sizeClasses = {
    sm: 'text-display-sm',
    md: 'text-display-md', 
    lg: 'text-display-lg',
    xl: 'text-display-xl',
  }

  const classes = `${sizeClasses[size]} font-display font-bold text-primaryText ${className}`

  return (
    <h1 className={classes} {...props}>
      {children}
    </h1>
  )
}

export function Lead({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-lg text-secondaryText leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  )
}

export function Caption({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`text-xs text-mutedText ${className}`} {...props}>
      {children}  
    </span>
  )
}

// Specialized Typography Components
export function HeroTitle({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Display 
      size="lg" 
      className={`text-inverseText mb-6 ${className}`} 
      {...props}
    >
      {children}
    </Display>
  )
}

export function HeroSubtitle({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Text 
      size="xl" 
      color="inverseText/80" 
      className={`mb-8 max-w-3xl mx-auto ${className}`}
      {...props}
    >
      {children}
    </Text>
  )
}

export function SectionTitle({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Heading 
      level="h2" 
      className={`mb-4 ${className}`} 
      {...props}
    >
      {children}
    </Heading>
  )
}

export function SectionSubtitle({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Lead 
      className={`max-w-3xl mx-auto ${className}`} 
      {...props}
    >
      {children}
    </Lead>
  )
}

export function CardTitle({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Heading 
      level="h3" 
      className={`mb-2 ${className}`} 
      {...props}
    >
      {children}
    </Heading>
  )
}

export function CardDescription({ children, className = '', ...props }: { children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Text 
      size="base" 
      className={className} 
      {...props}
    >
      {children}
    </Text>
  )
}
