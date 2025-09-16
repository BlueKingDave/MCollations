"use client"

import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValue, animate, useMotionValueEvent } from 'framer-motion'
const logoUrl = '/images/general/LogoSVGai.svg'

/**
 * Framer-first scroll behavior (small screens):
 * - FOLLOW: ax/ay/as track hero (snappy).
 * - DOWN cross: tween 600ms to header → 'shrunk'.
 * - UP cross: tween 600ms back toward hero follow target, retargeted.
 *
 * Large screens (iPad+): simple toggle
 * - If scrollY > 0 → tween to header; else → tween to hero.
 */
export default function AnimatedLogo() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  const [ready, setReady] = useState(false)

  // Cached geometry (+ mode flag for large screens)
  const metrics = useRef<null | {
    isLarge?: boolean
    triggerScroll?: number
    hero?: { baseX: number; docBottom: number; scale: number; offsetY: number }
    header?: { x: number; y: number; bottomViewport: number; scale: number }
  }>(null)
  // { isLarge, triggerScroll, hero:{ baseX, docBottom, scale, offsetY }, header:{ x,y,bottomViewport,scale } }

  // Modes: 'follow' | 'toHeader' | 'shrunk' | 'toFollow'
  const modeRef = useRef<'follow' | 'toHeader' | 'shrunk' | 'toFollow'>('follow')
  const lastBelowRef = useRef(false)

  // Motion values that the view uses
  const ax = useMotionValue(0)
  const ay = useMotionValue(0)
  const as = useMotionValue(1)

  // Active tweens
  const axAnim = useRef<any>(null)
  const ayAnim = useRef<any>(null)
  const asAnim = useRef<any>(null)

  // Retarget throttle during 'toFollow'
  const RETARGET_THROTTLE_MS = 80
  const lastRetargetTsRef = useRef(0)
  const toFollowSettleTimer = useRef<number | null>(null)

  const { scrollY } = useScroll()

  const stopTweens = () => {
    axAnim.current?.stop?.()
    ayAnim.current?.stop?.()
    asAnim.current?.stop?.()
    axAnim.current = ayAnim.current = asAnim.current = null
  }

  const setShrunkCSS = (v: number | boolean) => {
    document.documentElement.style.setProperty('--logo-shrunk', v ? '1' : '0')
  }

  const getFollowTarget = (v: number) => {
    const m = metrics.current
    if (!m || !m.hero) return { x: 0, y: 0, s: 1 }
    const { hero } = m
    return {
      x: hero.baseX,
      y: hero.docBottom - v + hero.offsetY,
      s: hero.scale,
    }
  }

  // Measure (on load / resize / layout)
  const measure = () => {
    const headerArea = document.querySelector('[data-header-logo-area]') as HTMLElement | null
    if (!headerArea) return

    // For non-homepage, set to header position immediately
    if (!isHomePage) {
      const hdRect = headerArea.getBoundingClientRect()
      ax.set(hdRect.left)
      ay.set(hdRect.top)
      as.set(48 / 200)
      setShrunkCSS(1)
      setReady(true)
      return
    }

    const heroContainer = document.querySelector('[data-hero-image]') as HTMLElement | null
    const heroImg = heroContainer?.querySelector('img') as HTMLImageElement | null
    if (!heroContainer || !heroImg) return

    const hRect = heroImg.getBoundingClientRect()
    const hdRect = headerArea.getBoundingClientRect()
    if (hRect.width === 0) return

    const heroW = hRect.width
    const heroScale = Math.max(heroW / 200 / 2, 0.3)
    const heroOffsetX = -heroW * 0.15
    const heroOffsetY = -heroW * 0.20

    const baseX = hRect.left + heroOffsetX
    const docBottom = hRect.bottom + window.scrollY

    const hero = { baseX, docBottom, scale: heroScale, offsetY: heroOffsetY }
    const header = {
      x: hdRect.left,
      y: hdRect.top,
      bottomViewport: hdRect.bottom,
      scale: 48 / 200,
    }

    const triggerScroll = hero.docBottom + hero.offsetY - header.bottomViewport
    const isLarge = window.innerWidth >= 768

    metrics.current = { isLarge, triggerScroll, hero, header }
    setReady(true)

    // Initialize based on current scroll
    const v = window.scrollY
    stopTweens()
    if (toFollowSettleTimer.current !== null) clearTimeout(toFollowSettleTimer.current)

    if (isLarge) {
      // Simple mode: shrink if scrolled at all
      if (v > 0) {
        modeRef.current = 'shrunk'
        setShrunkCSS(1)
        ax.set(header.x); ay.set(header.y); as.set(header.scale)
      } else {
        modeRef.current = 'follow'
        setShrunkCSS(0)
        const { x, y, s } = getFollowTarget(v)
        ax.set(x); ay.set(y); as.set(s)
      }
    } else {
      // Original small-screen logic init
      const below = v >= triggerScroll
      lastBelowRef.current = below
      if (below) {
        modeRef.current = 'shrunk'
        setShrunkCSS(1)
        ax.set(header.x); ay.set(header.y); as.set(header.scale)
      } else {
        modeRef.current = 'follow'
        setShrunkCSS(0)
        const { x, y, s } = getFollowTarget(v)
        ax.set(x); ay.set(y); as.set(s)
      }
    }
  }

  useLayoutEffect(() => {
    const heroImg = document.querySelector('[data-hero-image] img') as HTMLImageElement | null
    const waitForLoad = heroImg && !(heroImg.complete || heroImg.naturalWidth > 0)
    if (waitForLoad) {
      heroImg.addEventListener('load', measure, { once: true })
    } else {
      requestAnimationFrame(measure)
    }

    const roHero = new ResizeObserver(measure)
    const roHead = new ResizeObserver(measure)
    const heroContainer = document.querySelector('[data-hero-image]') as HTMLElement | null
    const headerArea = document.querySelector('[data-header-logo-area]') as HTMLElement | null
    if (heroContainer) roHero.observe(heroContainer)
    if (headerArea) roHead.observe(headerArea)
    window.addEventListener('resize', measure)

    return () => {
      heroImg?.removeEventListener('load', measure)
      roHero.disconnect()
      roHead.disconnect()
      window.removeEventListener('resize', measure)
      stopTweens()
      if (toFollowSettleTimer.current !== null) clearTimeout(toFollowSettleTimer.current)
    }
  }, [])

  // Handle route changes - re-initialize when navigating between pages
  useEffect(() => {
    stopTweens()
    if (toFollowSettleTimer.current !== null) clearTimeout(toFollowSettleTimer.current)
    setReady(false)
    
    // Reset mode and last below state
    modeRef.current = 'follow'
    lastBelowRef.current = false
    
    // Re-measure for the new route
    requestAnimationFrame(measure)
  }, [pathname])

  // Main loop via Framer's scroll pipeline
  useMotionValueEvent(scrollY, 'change', (v) => {
    if (!ready || !metrics.current || !isHomePage) return
    const m = metrics.current
    if (!m || !m.header) return
    const { isLarge, triggerScroll, header } = m

    // --- Large screens: simple toggle (no follow retargeting) ---
    if (isLarge) {
      const shouldShrink = v > 0

      if (shouldShrink && modeRef.current !== 'shrunk' && modeRef.current !== 'toHeader') {
        modeRef.current = 'toHeader'
        setShrunkCSS(1)
        stopTweens()
        axAnim.current = animate(ax, header.x, { duration: 0.6, ease: 'easeInOut' })
        ayAnim.current = animate(ay, header.y, { duration: 0.6, ease: 'easeInOut' })
        asAnim.current = animate(as, header.scale, { duration: 0.6, ease: 'easeInOut' })
        Promise.all([axAnim.current, ayAnim.current, asAnim.current])
          .then(() => { if (modeRef.current === 'toHeader') modeRef.current = 'shrunk' })
          .catch(() => {})
        return
      }

      if (!shouldShrink && (modeRef.current === 'shrunk' || modeRef.current === 'toHeader')) {
        modeRef.current = 'toFollow'
        setShrunkCSS(0)
        stopTweens()
        const tgt = getFollowTarget(v)
        axAnim.current = animate(ax, tgt.x, { duration: 0.6, ease: 'easeInOut' })
        ayAnim.current = animate(ay, tgt.y, { duration: 0.6, ease: 'easeInOut' })
        asAnim.current = animate(as, tgt.s, { duration: 0.6, ease: 'easeInOut' })
        Promise.all([axAnim.current, ayAnim.current, asAnim.current])
          .then(() => { if (modeRef.current === 'toFollow') modeRef.current = 'follow' })
          .catch(() => {})
        return
      }

      // When at top and in 'follow', keep hero bound instant
      if (modeRef.current === 'follow' && v === 0) {
        const { x, y, s } = getFollowTarget(v)
        ax.set(x); ay.set(y); as.set(s)
      }
      return
    }

    // --- Small screens: original complex behavior ---
    const below = v >= (triggerScroll ?? 0)

    // FOLLOW: snap to hero every frame
    if (modeRef.current === 'follow') {
      const { x, y, s } = getFollowTarget(v)
      ax.set(x); ay.set(y); as.set(s)
    }

    // DOWN cross: go to header
    if (modeRef.current === 'follow' && !lastBelowRef.current && below) {
      modeRef.current = 'toHeader'
      lastBelowRef.current = true
      setShrunkCSS(1)
      stopTweens()
      axAnim.current = animate(ax, header.x, { duration: 0.6, ease: 'easeInOut' })
      ayAnim.current = animate(ay, header.y, { duration: 0.6, ease: 'easeInOut' })
      asAnim.current = animate(as, header.scale, { duration: 0.6, ease: 'easeInOut' })
      Promise.all([axAnim.current, ayAnim.current, asAnim.current]).then(() => {
        if (modeRef.current === 'toHeader') modeRef.current = 'shrunk'
      }).catch(() => {})
      return
    }

    // UP cross: tween toward current follow target
    if ((modeRef.current === 'shrunk' || modeRef.current === 'toHeader') && lastBelowRef.current && !below) {
      modeRef.current = 'toFollow'
      lastBelowRef.current = false
      setShrunkCSS(0)
      stopTweens()

      const tgt = getFollowTarget(v)
      axAnim.current = animate(ax, tgt.x, { duration: 0.6, ease: 'easeInOut' })
      ayAnim.current = animate(ay, tgt.y, { duration: 0.6, ease: 'easeInOut' })
      asAnim.current = animate(as, tgt.s, { duration: 0.6, ease: 'easeInOut' })

      // Start/refresh settle timer: after 600ms without retargets, switch to 'follow'
      if (toFollowSettleTimer.current !== null) clearTimeout(toFollowSettleTimer.current)
      toFollowSettleTimer.current = window.setTimeout(() => {
        if (modeRef.current === 'toFollow' && !lastBelowRef.current) {
          modeRef.current = 'follow'
          lastRetargetTsRef.current = 0
          const snap = getFollowTarget(scrollY.get())
          ax.set(snap.x); ay.set(snap.y); as.set(snap.s) // ensure instant re-bind
        }
      }, 600)

      return
    }

    // While 'toFollow', retarget at most every N ms & refresh settle timer
    if (modeRef.current === 'toFollow') {
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
      if (now - lastRetargetTsRef.current >= RETARGET_THROTTLE_MS) {
        lastRetargetTsRef.current = now
        const tgt = getFollowTarget(v)
        stopTweens()
        axAnim.current = animate(ax, tgt.x, { duration: 0.6, ease: 'easeInOut' })
        ayAnim.current = animate(ay, tgt.y, { duration: 0.6, ease: 'easeInOut' })
        asAnim.current = animate(as, tgt.s, { duration: 0.6, ease: 'easeInOut' })
      }
      // refresh settle timer on any scroll change
      if (toFollowSettleTimer.current !== null) clearTimeout(toFollowSettleTimer.current)
      toFollowSettleTimer.current = window.setTimeout(() => {
        if (modeRef.current === 'toFollow' && !lastBelowRef.current) {
          modeRef.current = 'follow'
          lastRetargetTsRef.current = 0
          const snap = getFollowTarget(scrollY.get())
          ax.set(snap.x); ay.set(snap.y); as.set(snap.s)
        }
      }, 600)
    }
  })

  if (!ready) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 pointer-events-none will-change-transform"
      style={{
        x: ax,
        y: ay,
        scale: as,
        transformOrigin: 'top left',
        WebkitTransform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      <Link href="/" className="pointer-events-auto block" style={{ width: 200 }}>
        <motion.div
          style={{ filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.2))' }}
          whileHover={{
            scale: 1.03,
            y: -2,
            rotate: 1,
            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.2))',
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <img
            src={logoUrl}
            alt="M.Collation Logo"
            className="w-full h-auto"
            draggable={false}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}
