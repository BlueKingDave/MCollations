"use client"

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import { useReducedMotion } from 'framer-motion'
import { useContactModal } from '../../app/contexts/ContactModalContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const sectionThemes = {
    hero: {
      bg: 'bg-secondary/5',
      text: 'text-inverseText',
      mobileBg: 'bg-secondary/5',
      mobileBorder: 'border-primary-dark',
      titleMColor: 'text-primary',
      titleRestColor: 'text-white',
      titleMColorHover: 'text-white',
      titleRestColorHover: 'text-primary'
    },
    'surface-primary': {
      bg: 'bg-surface-primary/5',
      text: 'text-primaryText',
      mobileBg: 'bg-surface-primary/5',
      mobileBorder: 'border-neutral-200',
      titleMColor: 'text-secondary',
      titleRestColor: 'text-primary',
      titleMColorHover: 'text-primary',
      titleRestColorHover: 'text-secondary'
    },
    features: {
      bg: 'bg-surface-features/5',
      text: 'text-primaryText',
      mobileBg: 'bg-features/5',
      mobileBorder: 'border-neutral-200',
      titleMColor: 'text-secondary',
      titleRestColor: 'text-primary',
      titleMColorHover: 'text-primary',
      titleRestColorHover: 'text-secondary'
    }
  } as const

  const [currentSection, setCurrentSection] = useState<keyof typeof sectionThemes>('hero')
  const prefersReducedMotion = useReducedMotion()
  const { openModal } = useContactModal()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  useEffect(() => {
    const detectCurrentSection = () => {
      const headerHeight = 80
      const sc = window.scrollY + headerHeight
      const sections = document.querySelectorAll('[data-section]')
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].getBoundingClientRect()
        const top = rect.top + window.scrollY
        if (sc >= top) {
          const attr = sections[i].getAttribute('data-section') || 'hero'
          if (attr in sectionThemes) {
            setCurrentSection(attr as keyof typeof sectionThemes)
          } else {
            setCurrentSection('hero')
          }
          break
        }
      }
    }
    let t: ReturnType<typeof setTimeout> | null = null
    const onScroll = () => {
      if (t === null) t = setTimeout(() => { detectCurrentSection(); t = null }, 10)
    }
    detectCurrentSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', detectCurrentSection, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', detectCurrentSection)
      if (t) clearTimeout(t)
    }
  }, [])

  const currentTheme = sectionThemes[currentSection] || sectionThemes.hero

  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 w-full max-w-full
    ${currentTheme.bg} backdrop-blur-sm ${currentTheme.text} shadow-lg
    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    transition-all duration-500 ease-in-out
    ${prefersReducedMotion ? '' : 'transition-transform transition-colors'}
  `.trim()

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <>
          <div className="flex justify-between items-center py-6 relative gap-3 pr-2 lg:pr-0">
            {/* Logo / Title */}
            <div className="flex items-center h-12 flex-1 min-w-0" data-header-logo-area>
              <h1
                className="
                  font-bold ml-2 relative group cursor-pointer
                  whitespace-nowrap
                  text-4xl max-[450px]:text-3xl max-[370px]:text-2xl
                  transition-all duration-500 ease-in-out
                "
                style={{ marginLeft: 'calc(var(--logo-shrunk, 0) * 60px)' }}
              >
                <span className="transition-opacity duration-700 ease-in-out group-hover:opacity-0">
                  <span className={`${currentTheme.titleMColor} transition-colors duration-700 ease-in-out`}>M.</span>
                  <span className={`${currentTheme.titleRestColor} transition-colors duration-700 ease-in-out`}>COLLATIONS</span>
                </span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100">
                  <span className={`${currentTheme.titleMColorHover} transition-colors duration-700 ease-in-out`}>M.</span>
                  <span className={`${currentTheme.titleRestColorHover} transition-colors duration-700 ease-in-out`}>COLLATIONS</span>
                </span>
              </h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="hover:text-accent transition-colors">Accueil</Link>
              <Link href="/about" className="hover:text-accent transition-colors">À Propos</Link>
              <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
              <Link href="/products" className="hover:text-accent transition-colors">Produits</Link>
              <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>

             {/*  <Button
                variant="theme-adaptive"
                size="sm"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                className="p-2"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </Button> */}

              <Button 
                variant="primary" 
                size="sm"
                openContactModal={openModal}
                modalType="contact"
              >
                Contactez-Nous
              </Button>
            </nav>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center space-x-2 shrink-0 z-[60]">
              <button
                className="p-2 rounded-md hover:bg-surface-primary/10 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {isMenuOpen && (
            <nav
              className={`lg:hidden py-4 border-t ${currentTheme.mobileBorder} ${currentTheme.mobileBg} ${currentTheme.text} transition-all duration-500 w-full max-w-full overflow-hidden`}
            >
              <div className="flex flex-col space-y-4">
                <Link href="/" className="hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  Accueil
                </Link>
                <Link href="/about" className="hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  À Propos
                </Link>
                <Link href="/services" className="hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  Services
                </Link>
                <Link href="/products" className="hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  Produits
                </Link>
                <Link href="/faq" className="hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  FAQ
                </Link>

                {/* Theme toggle removed for now. Restore when theme hooks are enabled. */}

                <div className="pt-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    openContactModal={(type) => {
                      openModal(type)
                      setIsMenuOpen(false)
                    }}
                    modalType="contact"
                  >
                    Obtenir Une Soumission
                  </Button>
                </div>
              </div>
            </nav>
          )}
        </>
      </div>
    </header>
  )
}
