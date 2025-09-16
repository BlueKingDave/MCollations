"use client"

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card'
import Button from '../ui/Button'
import { ChevronDown, CheckCircle } from 'lucide-react'
import { useContactModal } from '../../app/contexts/ContactModalContext'

interface SolutionDetailedContent {
  subtitle?: string
  features?: string[]
  benefits?: string
  cta?: string
}

interface Solution {
  title: string
  description?: string
  contrainte?: string
  detailedContent?: SolutionDetailedContent
  buttonText?: string
}

export default function SolutionCard({ solution }: { solution: Solution }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { openModal } = useContactModal()

  const panelId = useMemo(() => {
    const base = solution?.title?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    return `solution-panel-${base || Math.random().toString(36).slice(2)}`
  }, [solution?.title])

  const handleToggle = () => setIsExpanded(v => !v)

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }

  return (
    // ❌ h-full retiré pour laisser la carte prendre sa hauteur naturelle
    // ✅ self-start pour empêcher l’étirement si le parent a items-stretch
    <Card hover background="secondary-light" className="text-center self-start">
      <CardHeader>
        <h3 className="text-xl font-bold text-inverseText">{solution.title}</h3>
      </CardHeader>

      <CardContent>
        <p className="text-inverseText/80">{solution.description}</p>

        {solution.contrainte && <div className="my-4 border-t border-neutral-200" />}

        {solution.contrainte && (
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-success flex-shrink-0" />
            <span className="text-sm text-inverseText/70">{solution.contrainte}</span>
          </div>
        )}

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="accordion"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transition}
              className="overflow-hidden"
              id={panelId}
              aria-live="polite"
            >
              <div className="pt-6 border-t border-neutral-200 mt-4 text-left">
                {solution?.detailedContent?.subtitle && (
                  <h4 className="text-lg font-semibold text-inverseText mb-3 text-center">
                    {solution.detailedContent.subtitle}
                  </h4>
                )}

                {Array.isArray(solution?.detailedContent?.features) && (
                  <ul className="text-sm text-inverseText space-y-2 mb-4">
                    {solution.detailedContent.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-center gap-2">
                        <CheckCircle size={16} className="text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {solution?.detailedContent?.benefits && (
                  <p className="text-sm text-inverseText/80 italic mb-4 text-center">
                    {solution.detailedContent.benefits}
                  </p>
                )}

                {solution?.detailedContent?.cta && (
                  <div className="flex justify-center">
                    <Button size="sm" className="mb-2" onClick={() => openModal('quote')}>
                      {solution.detailedContent.cta}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter>
        <Button
          variant="outlineDark"
          size="sm"
          onClick={handleToggle}
          className="flex items-center gap-2 mx-auto"
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          {isExpanded ? 'Voir moins' : solution.buttonText}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
            className="inline-flex"
          >
            <ChevronDown size={16} />
          </motion.span>
        </Button>
      </CardFooter>
    </Card>
  )
}
