import React from 'react'

type Background =
  | 'surface-primary'
  | 'surface-secondary'
  | 'surface-accent'
  | 'features'
  | 'features-light'
  | 'primary'
  | 'secondary'

interface SectionProps {
  children?: React.ReactNode
  background?: Background
  className?: string
  id?: string
  'data-section'?: string
}

export default function Section({
  children,
  background = 'surface-primary',
  className = '',
  id = '',
  'data-section': dataSection,
}: SectionProps) {
  const backgroundVariants = {
    'surface-primary': 'bg-surface-primary',
    'surface-secondary': 'bg-surface-secondary', 
    'surface-accent': 'bg-surface-accent',
    'features': 'bg-features',
    'features-light': 'bg-features-light',
    'primary': 'bg-primary',
    'secondary': 'bg-secondary'
  }

  return (
    <section 
      id={id}
      data-section={dataSection || background}
      className={`py-16 lg:py-24 ${backgroundVariants[background] || backgroundVariants['surface-primary']} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  centered?: boolean
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeaderProps) {
  // Check if inverse text is requested
  const isInverse = className.includes('text-inverseText')
  
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isInverse ? 'text-inverseText' : 'text-primaryText'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-3xl mx-auto ${isInverse ? 'text-inverseText/80' : 'text-secondaryText'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
