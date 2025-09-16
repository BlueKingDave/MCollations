import { useEffect, useRef } from 'react'

export function useFocusManagement<T extends HTMLElement>() {
  const focusRef = useRef<T | null>(null)
  
  const focusElement = () => {
    focusRef.current?.focus()
  }
  
  const blurElement = () => {
    focusRef.current?.blur()
  }
  
  return { focusRef, focusElement, blurElement }
}

export function useKeyboardNavigation(
  onEscape?: (e: KeyboardEvent) => void,
  onEnter?: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.(event)
          break
        case 'Enter':
          onEnter?.(event)
          break
        default:
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, onEnter])
}

export function useAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  return { announce }
}

export function useReducedMotion() {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
    
  return prefersReducedMotion
}

