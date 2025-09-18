"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import type { UIEvent } from 'react'

interface ResponsiveCardGridProps<T> {
  items: T[]
  renderCard: (item: T, index: number) => React.ReactNode
  getItemTitle?: (item: T, index: number) => string
  mobileNavigation?: boolean
  cardWidth?: string
  className?: string
}

export default function ResponsiveCardGrid<T>({
  items,
  renderCard,
  getItemTitle,
  mobileNavigation = false,
  cardWidth = "w-80",
  className = ""
}: ResponsiveCardGridProps<T>) {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const desktopScrollContainerRef = useRef<HTMLDivElement | null>(null)
  const mobileScrollContainerRef = useRef<HTMLDivElement | null>(null)

  const CARD_WIDTH_RATIO = 0.90
  const CARD_GAP_RATIO = 0.05
  const HORIZONTAL_PADDING_RATIO = (1 - CARD_WIDTH_RATIO) / 2

  // Track active card while scrolling
  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget
      const containerCenter = el.scrollLeft + el.clientWidth / 2

      let closestIndex = activeIndex
      let smallestDistance = Number.POSITIVE_INFINITY

      Array.from(el.children).forEach((child, index) => {
        const childElement = child as HTMLElement
        const childCenter = childElement.offsetLeft + childElement.offsetWidth / 2
        const distance = Math.abs(childCenter - containerCenter)
        if (distance < smallestDistance) {
          smallestDistance = distance
          closestIndex = index
        }
      })

      if (closestIndex !== activeIndex) setActiveIndex(closestIndex)
    },
    [activeIndex]
  )

  // Jump to specific card (navigation click)
  const scrollToCard = useCallback(
    (container: HTMLDivElement | null, index: number) => {
      if (!container) return
      const targetChild = container.children[index] as HTMLElement | undefined
      if (!targetChild) return

      const targetLeft =
        targetChild.offsetLeft -
        (container.clientWidth - targetChild.offsetWidth) / 2
      const boundedTarget = Math.max(
        0,
        Math.min(targetLeft, container.scrollWidth - container.clientWidth)
      )

      container.scrollTo({ left: boundedTarget, behavior: 'smooth' })
    },
    []
  )

  const scrollToIndex = useCallback(
    (index: number) => {
      setActiveIndex(prev => (prev === index ? prev : index))
      scrollToCard(desktopScrollContainerRef.current, index)
      scrollToCard(mobileScrollContainerRef.current, index)
    },
    [scrollToCard]
  )

  // Keep navigation dots in sync on mount when mobile navigation is enabled
  useEffect(() => {
    if (mobileNavigation) {
      scrollToIndex(0)
    }
  }, [mobileNavigation, scrollToIndex])

  // Clamp active index when the data set shrinks
  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0)
      return
    }

    if (activeIndex > items.length - 1) {
      scrollToIndex(items.length - 1)
    }
  }, [items.length, activeIndex, scrollToIndex])

  return (
    <div className={className}>
      {/* Desktop: grid for 3 or fewer items, horizontal scroll for 4+ */}
      {items.length <= 3 ? (
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {items.map((item, index) => renderCard(item, index))}
        </div>
      ) : (
        <div className="hidden md:block">
          {/* Desktop navigation for 4+ items */}
          {items.length > 1 && (
            <div className="flex justify-center mb-8">
              <nav className="inline-flex bg-white border border-neutral-100/70 rounded-full shadow-sm px-3 py-2">
                <ul className="flex items-center justify-center gap-3">
                  {items.map((item, index) => {
                    const isActive = index === activeIndex
                    const label = getItemTitle ? getItemTitle(item, index) : `Carte ${index + 1}`
                    return (
                      <li key={`nav-${index}`}>
                        <button
                          type="button"
                          onClick={() => scrollToIndex(index)}
                          aria-label={label}
                          aria-current={isActive ? 'true' : 'false'}
                          className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                            isActive ? 'bg-primary scale-125' : 'bg-neutral-300 hover:bg-neutral-400'
                          }`}
                        />
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          )}

          <div
            ref={desktopScrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex
              return (
                <div
                  key={index}
                  className={`flex-none ${cardWidth} cursor-pointer transition-transform duration-300 ease-out snap-center ${
                    isActive ? 'scale-100' : 'scale-95 opacity-80'
                  }`}
                  onClick={() => scrollToIndex(index)}
                >
                  {renderCard(item, index)}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden">
        {/* Optional sticky navigation */}
        {mobileNavigation && items.length > 1 && (
          <div className="sticky top-16 z-30 mx-1 mb-4 flex justify-center">
            <nav className="inline-flex bg-white border border-neutral-100/70 rounded-full shadow-sm px-3 py-2">
              <ul className="flex items-center justify-center gap-3">
                {items.map((item, index) => {
                  const isActive = index === activeIndex
                  const label = getItemTitle ? getItemTitle(item, index) : `Carte ${index + 1}`
                  return (
                    <li key={`nav-${index}`}>
                      <button
                        type="button"
                        onClick={() => scrollToIndex(index)}
                        aria-label={label}
                        aria-current={isActive ? 'true' : 'false'}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                          isActive ? 'bg-primary scale-125' : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        )}

        {/* Horizontal carousel */}
        <div
          ref={mobileScrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: `${CARD_GAP_RATIO * 100}%`,
            paddingLeft: `${HORIZONTAL_PADDING_RATIO * 100}%`,
            paddingRight: `${HORIZONTAL_PADDING_RATIO * 100}%`
          }}
          aria-label="Parcourir les éléments"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={index}
                className={`flex-none snap-center cursor-pointer transition-transform duration-300 ease-out ${
                  isActive ? 'scale-100' : 'scale-95 opacity-80'
                }`}
                style={{
                  flexBasis: `${CARD_WIDTH_RATIO * 100}%`,
                  maxWidth: `${CARD_WIDTH_RATIO * 100}%`
                }}
                aria-roledescription="slide"
                onClick={() => scrollToIndex(index)}
              >
                {renderCard(item, index)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
