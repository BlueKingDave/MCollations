"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'

/**
 * CompanyLogoCard (no-bump, pixel-based, responsive speed)
 *
 * Key changes vs your version:
 * - Pixel-based translation with exact seam wrap (modulo) → eliminates bump
 * - Speed scales linearly with viewport width between min/max speeds
 * - Reduced motion + hover slowdowns preserved
 * - ResizeObserver re-computes measurements on layout changes
 */
interface CompanyInfo {
  id: string | number
  name: string
  logo: string
  url?: string
  alt?: string
}

interface CompanyLogoCardProps {
  companies?: CompanyInfo[]
  slowOnHover?: boolean
  autoPlay?: boolean
  minViewport?: number
  maxViewport?: number
  minSpeed?: number
  maxSpeed?: number
}

export default function CompanyLogoCard({
  companies = [],
  slowOnHover = true,
  autoPlay = true,
  // Viewport range (px) for speed interpolation
  minViewport = 320,
  maxViewport = 1440,
  // Speeds (pixels/second) at the ends of that viewport range
  minSpeed = 55,
  maxSpeed = 40,
}: CompanyLogoCardProps) {
  const [isSlowed, setIsSlowed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [pxPerMs, setPxPerMs] = useState(0.06) // default ~60px/s

  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const xRef = useRef(0) // current translateX in px

  // duplicate logos once for seamless loop
  const duplicatedLogos = [...companies, ...companies]

  // Layout measurements
  const halfWidthRef = useRef(0) // width of the original (non-duplicated) track

  const measure = useCallback((): void => {
    const track = trackRef.current
    if (!track) return
    const fullWidth = track.scrollWidth // duplicated width (2x original)
    const half = fullWidth / 2
    halfWidthRef.current = half
  }, [])

  // Compute speed based on viewport width (linear interpolation)
  const computeSpeed = useCallback(() => {
    const vw = containerRef.current?.offsetWidth || window.innerWidth || maxViewport
    const clampedVW = Math.max(minViewport, Math.min(maxViewport, vw))
    const t = (clampedVW - minViewport) / Math.max(1, (maxViewport - minViewport)) // [0,1]
    const pxPerSec = minSpeed + t * (maxSpeed - minSpeed)
    return pxPerSec / 1000 // → px per ms
  }, [minViewport, maxViewport, minSpeed, maxSpeed])

  // rAF animate
  const animate = useCallback((ts: number) => {
    if (!trackRef.current || !autoPlay) return
    if (!lastTimeRef.current) lastTimeRef.current = ts

    const dt = ts - lastTimeRef.current
    lastTimeRef.current = ts

    const speedScale = reducedMotion ? 0.1 : (isSlowed ? 0.4 : 1.0)
    const step = pxPerMs * speedScale * dt

    let x = xRef.current - step
    const seam = halfWidthRef.current

    if (seam > 0 && x <= -seam) {
      // keep remainder to avoid snapping (no-bump)
      x = x % seam
    }

    xRef.current = x
    trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`

    animationRef.current = requestAnimationFrame(animate)
  }, [autoPlay, pxPerMs, reducedMotion, isSlowed])

  // Reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // Set up ResizeObserver to recompute speed + measurements on layout changes
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      setPxPerMs(computeSpeed())
      // re-measure after resize; next frame ensures images/tailwind layout applied
      queueMicrotask(measure)
    })
    const el = containerRef.current
    if (el) ro.observe(el)
    // initial
    setPxPerMs(computeSpeed())
    measure()

    return () => ro.disconnect()
  }, [computeSpeed, measure])

  // Also re-measure when companies change (images might change width)
  useEffect(() => {
    // reset translate to avoid visible jump while widths change
    xRef.current = 0
    lastTimeRef.current = 0
    // allow next frame for images to lay out, then measure
    const id = requestAnimationFrame(() => {
      measure()
    })
    return () => cancelAnimationFrame(id)
  }, [companies, measure])

  // Start/stop animation
  useEffect(() => {
    if (autoPlay && companies.length > 0) {
      lastTimeRef.current = 0
      animationRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [animate, autoPlay, companies.length])

  // Mouse handlers for slow on hover
  const handleMouseEnter = () => { if (slowOnHover) setIsSlowed(true) }
  const handleMouseLeave = () => { if (slowOnHover) setIsSlowed(false) }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden bg-white relative group"
      role="region"
      aria-label="Company logos carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-12 sm:w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Track (duplicated logos for seamless loop) */}
      <div
        ref={trackRef}
        className="flex whitespace-nowrap carousel-scroll-js"
        style={{ willChange: reducedMotion ? 'auto' : 'transform' }}
        role="list"
        aria-label={`${companies.length} company logos`}
      >
        {duplicatedLogos.map((company, index) => (
          <div
            key={`${company.id}-${index}`}
            className="flex-shrink-0 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-center min-w-[150px] sm:min-w-[200px]"
            role="listitem"
            aria-label={`${company.name} logo`}
          >
            {company.url ? (
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity duration-200 hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-label={`Visit ${company.name} website`}
              >
                <img
                  src={company.logo}
                  alt={company.alt || `${company.name} logo`}
                  width={120}
                  height={48}
                  loading="lazy"
                  decoding="async"
                  className="object-contain w-[120px] sm:w-[150px] h-[48px] sm:h-[60px]"
                  style={{ aspectRatio: '120/48', maxHeight: '60px' }}
                />
              </a>
            ) : (
              <img
                src={company.logo}
                alt={company.alt || `${company.name} logo`}
                width={120}
                height={48}
                loading="lazy"
                decoding="async"
                className="object-contain w-[120px] sm:w-[150px] h-[48px] sm:h-[60px]"
                style={{ aspectRatio: '120/48', maxHeight: '60px' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {!autoPlay
          ? 'Carousel stopped'
          : reducedMotion
            ? 'Carousel playing slowly for accessibility'
            : isSlowed
              ? 'Carousel slowed'
              : 'Carousel playing'}
      </div>
    </div>
  )
}
