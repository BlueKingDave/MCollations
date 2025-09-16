"use client"

import React from 'react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'outlineDark'
  | 'ghost'
  | 'theme'
  | 'theme-adaptive'
  | 'danger'

type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  openContactModal?: ((type?: string) => void) | null
  modalType?: string
  children?: React.ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  'aria-label': ariaLabel,
  openContactModal = null,
  modalType = 'general',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none inline-flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-primary text-inverseText hover:bg-primary-dark focus:ring-primary active:bg-primary-dark',
    secondary:
      'bg-white text-primaryText border-2 border-transparent hover:bg-secondary hover:text-inverseText hover:border-white focus:ring-secondary active:bg-secondary-dark',
    accent:
      'bg-accent text-inverseText border-2 border-accent hover:bg-accent-dark hover:text-inverseText focus:ring-accent active:bg-accent-light',
    outline:
      'border-2 border-secondary text-secondaryText hover:bg-secondary hover:text-inverseText focus:ring-secondary active:bg-secondary-dark',
    outlineDark:
      'bg-surface-secondary border-2 border-surface-primary text-primaryText hover:bg-secondary-light hover:text-inverseText focus:ring-secondary active:bg-secondary-dark',
    ghost: 'text-primaryText hover:bg-primary/10 focus:ring-primary',
    theme: 'text-primaryText hover:bg-primary/10 focus:ring-primary transition-colors',
    'theme-adaptive': 'hover:bg-primary/10 focus:ring-primary transition-colors',
    danger:
      'bg-error text-inverseText hover:bg-error/90 focus:ring-error active:bg-error/80',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[2rem]',
    md: 'px-6 py-3 text-base min-h-[2.75rem]',
    lg: 'px-8 py-4 text-lg min-h-[3.5rem]',
  };

  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (openContactModal) {
      e.preventDefault()
      openContactModal(modalType)
    } else if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
      onClick={handleClick}
    >
      {loading && (
        <svg
          className="mr-2 -ml-1 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
