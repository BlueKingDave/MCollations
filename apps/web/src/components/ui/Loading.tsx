"use client"

import React from 'react'
import { Loader2 } from 'lucide-react'

type Size = 'sm' | 'md' | 'lg' | 'xl'
type Variant = 'default' | 'light' | 'secondary'

interface LoadingProps {
  size?: Size
  text?: string
  className?: string
  variant?: Variant
}

export default function Loading({
  size = 'md',
  text = 'Loading...',
  className = '',
  variant = 'default',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const variants = {
    default: 'text-primaryText',
    light: 'text-inverseText',
    secondary: 'text-secondaryText'
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} ${variants[variant]} animate-spin`}
        aria-hidden="true"
      />
      {text && (
        <span className={`${variants[variant]} font-medium`}>
          {text}
        </span>
      )}
    </div>
  )
}

export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface-primary border-2 border-neutral-100 rounded-lg shadow-md p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-neutral-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  children?: React.ReactNode
}

export function LoadingButton({ children, isLoading = false, ...props }: LoadingButtonProps) {
  return (
    <button 
      disabled={isLoading}
      className={`${props.className || ''} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      {...props}
    >
      {isLoading ? (
        <Loading size="sm" text="" className="mr-2" />
      ) : null}
      {children}
    </button>
  )
}
