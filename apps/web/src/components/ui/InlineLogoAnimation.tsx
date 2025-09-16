'use client'

import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValue, animate, useMotionValueEvent } from 'framer-motion'

const logoUrl = '/images/general/LogoSVGai.svg'

type LayoutMetrics = {
  header?: { x: number; y: number; scale: number }
  ghost?: { x: number; y: number; width: number; scale: number }
  ghostSize?: { w: number; h: number }
}

type LayoutParams = {
  topAdjustPx: number
  shapeMarginPx: number
  radiusPct: number
  centerOffsetPx: number
  rightOverhangPx: number
}

const SHRINK_SCROLL_THRESHOLD = 0;

export default function InlineLogoAnimation() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  const [ready, setReady] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mode, setMode] = useState('ghost')

  // Cached geometry
  const metrics = useRef<LayoutMetrics>({})
  
  // Motion values for the animated logo
  const ax = useMotionValue(0)
  const ay = useMotionValue(0) 
  const as = useMotionValue(1)

  // Motion value for ghost logo fade
  const ghostOpacity = useMotionValue(0)
  // Motion values for ghost dimensions to enable responsive collapse
  const ghostW = useMotionValue(200)
  const ghostH = useMotionValue(200)
  // Pixel-based layout controls
  const ghostTop = useMotionValue(0)
  const [ghostMarginRight, setGhostMarginRight] = useState(0)
  const [ghostShapeMargin, setGhostShapeMargin] = useState(10)
  const [shapeCircleStr, setShapeCircleStr] = useState('circle(80px at 50% 80px)')

  // Active animations
  const axAnim = useRef<ReturnType<typeof animate> | null>(null)
  const ayAnim = useRef<ReturnType<typeof animate> | null>(null)
  const asAnim = useRef<ReturnType<typeof animate> | null>(null)
  const ghostAnimControls = useRef<Array<ReturnType<typeof animate>>>([])
  // Shrink-in-progress flag and observers
  const isShrinkingRef = useRef(false)
  const roHeaderRef = useRef<ResizeObserver | null>(null)
  const roGhostRef = useRef<ResizeObserver | null>(null)
  const roTextRef = useRef<ResizeObserver | null>(null)

  const { scrollY } = useScroll()
  
  // Unified layout parameters for ghost float (keep identical across code paths)
  const getLayoutParams = (): LayoutParams => {
    const vw = (typeof window !== 'undefined' ? window.innerWidth : 0) || 0
    const isSmall = vw <= 640
    return {
      // Keep these identical in both measure paths to prevent end-of-animation rewrap
      topAdjustPx: isSmall ? 0 : 60,
      shapeMarginPx: 8,
      radiusPct: 0.5,
      centerOffsetPx: isSmall ? 100 : 100,
      rightOverhangPx: isSmall ? Math.round(-vw * 0.12) : 0,
    }
  }

  // Safari detection + configurable Y nudge (via CSS var --ghost-safari-y-offset)
  const isSafariBrowser = () => {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    const isChromium = /Chrome\//.test(ua) || /CriOS\//.test(ua) || /Edg\//.test(ua)
    return /Safari\//.test(ua) && !isChromium
  }
  const getSafariYOffset = () => {
    if (!isSafariBrowser()) return 0
    try {
      const root = document.documentElement
      const val = window.getComputedStyle(root).getPropertyValue('--ghost-safari-y-offset') || '0px'
      const n = parseFloat(val)
      return Number.isFinite(n) ? n : 0
    } catch {
      return 0
    }
  }
  const ghostActive = ready

  // No separate overlay top; float + shape-outside handles wrap

  const stopAnimations = () => {
    axAnim.current?.stop?.()
    ayAnim.current?.stop?.()
    asAnim.current?.stop?.()
    ghostAnimControls.current.forEach((control) => control.stop())
    axAnim.current = null
    ayAnim.current = null
    asAnim.current = null
    ghostAnimControls.current = []
  }

  // Snap overlay to the current ghost target when we're at the top and not shrunk
  const snapToGhostIfReady = () => {
    if (mode !== 'ghost' || hasScrolled) return
    const g = metrics.current.ghost
    if (!g) return
    stopAnimations()
    ax.set(g.x); ay.set(g.y); as.set(g.scale)
  }

  // Schedule a stabilization pass after fonts/layout settle
  const scheduleStabilize = () => {
    // Double RAF to wait for next paint, then re-measure and snap
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        measure()
        snapToGhostIfReady()
      })
    })
    // Fonts ready hook (Safari/Chrome) – re-run when webfonts finish loading
    if (document?.fonts?.ready && typeof document.fonts.ready.then === 'function') {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
          measure()
          snapToGhostIfReady()
        })
      }).catch(() => {})
    }
    // Fallback timer in case above paths miss (e.g., late async layout)
    setTimeout(() => {
      measure()
      snapToGhostIfReady()
    }, 300)
  }

  const setShrunkCSS = (shrunk: boolean) => {
    document.documentElement.style.setProperty('--logo-shrunk', shrunk ? '1' : '0')
  }


  const getScrollOffset = () => {
    if (typeof window === 'undefined') return 0
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
  }

  const snapToHeader = () => {
    const header = metrics.current.header
    if (!header) return
    stopAnimations()
    ax.set(header.x)
    ay.set(header.y)
    as.set(header.scale)
    ghostOpacity.set(0)
    ghostW.set(0)
    ghostH.set(0)
    setShrunkCSS(true)
  }

  const syncStateToScroll = (offset: number) => {
    if (offset <= SHRINK_SCROLL_THRESHOLD) return
    // Ensure we are working with fresh measurements
    measure()
    const header = metrics.current.header
    if (!header) return

    setReady(true)
    setHasScrolled(true)
    setMode('shrunk')
    setShrunkCSS(true)
    snapToHeader()
    isShrinkingRef.current = false
  }

  // (removed unused initializePositions)

  // Measure positions and sizes
  const measure = () => {
    const headerArea = document.querySelector<HTMLElement>('[data-header-logo-area]')
    if (!headerArea) return

    const headerRect = headerArea.getBoundingClientRect()
    const header = { x: headerRect.left, y: headerRect.top, scale: 48 / 200 }
    // Always keep header metrics fresh
    metrics.current.header = header

    // While shrinking, only header updates; also pin animated logo if already shrunk
    if (isShrinkingRef.current) return
    if (mode === 'shrunk') {
      ax.set(header.x); ay.set(header.y); as.set(header.scale)
    }

    // Update ghost/text metrics and CSS vars when available
    const textBlock = document.querySelector<HTMLElement>('[data-hero-text-block]')
    const titleEl = document.querySelector<HTMLElement>('[data-hero-title]')
    const titleTextEl = document.querySelector<HTMLElement>('[data-hero-title-text]')
    const ghostLogo = document.querySelector<HTMLElement>('[data-ghost-logo-el]')
    if (!textBlock || !titleEl || !ghostLogo) return

    const ghostRect = ghostLogo.getBoundingClientRect()
    const blockRect = textBlock.getBoundingClientRect()
    const titleRect = titleEl.getBoundingClientRect()

    const gw = ghostRect.width
    const gh = ghostRect.height
    if (gw > 0 && gh > 0) {
      // Pixel-based layout constants (UNIFIED)
      const { topAdjustPx, shapeMarginPx, radiusPct, centerOffsetPx, rightOverhangPx } = getLayoutParams()

      setGhostShapeMargin(shapeMarginPx)
      setGhostMarginRight(rightOverhangPx)

      const idealTop = Math.round((titleRect.bottom - blockRect.top) - gh / 2)
      let firstLineBottom = (titleRect.top - blockRect.top)
      if (titleTextEl) {
        const r = document.createRange()
        r.selectNodeContents(titleTextEl)
        const rects = r.getClientRects()
        if (rects && rects.length > 0) {
          firstLineBottom = rects[0].bottom - blockRect.top
        } else {
          const csTitle = window.getComputedStyle(titleEl)
          let lh = parseFloat(csTitle.lineHeight)
          if (!lh || Number.isNaN(lh)) {
            const fs = parseFloat(csTitle.fontSize) || 24
            lh = fs * 1.2
          }
          firstLineBottom = (titleRect.top - blockRect.top) + lh
        }
      }

      // Apex-aware clamp to keep line 1 full width regardless of circle radius
      const rPx = radiusPct * Math.min(gw, gh)
      // Circle top apex = centerY - radius; centerY = gh/2 + centerOffsetPx
      const apexOffset = (gh / 2 + centerOffsetPx) - rPx
      const epsilon = 3
      const requiredTop = firstLineBottom + epsilon - apexOffset + shapeMarginPx - Math.min(topAdjustPx, 0)
      let floatTop = Math.max(idealTop, Math.ceil(requiredTop))

      // On very small screens, keep the ghost below the full title to avoid large gaps
      const vw = Math.min(window.innerWidth || 0, blockRect.width)
      if (vw && vw <= 380) {
        const belowTitleTop = Math.ceil((titleRect.bottom - blockRect.top) + shapeMarginPx)
        floatTop = Math.max(floatTop, belowTitleTop)
      }

      // Safari-specific vertical nudge (customizable via CSS var)
      const safariNudge = getSafariYOffset()
      if (safariNudge) floatTop += safariNudge

      // Update pixel-based layout on the floating element
      const ghostTopPx = floatTop + topAdjustPx
      ghostTop.set(ghostTopPx)

      // Compute a pixel-based circle for Safari and set as an inline CSS var
      const centerYPx = Math.round(gh / 2 + centerOffsetPx)
      const shapeCircle = `circle(${Math.round(rPx)}px at 50% ${centerYPx}px)`
      setShapeCircleStr(shapeCircle)

      ghostW.set(gw)
      ghostH.set(gh)

      // Compute target ghost coordinates based on container bounds and margins
      const csGhost = window.getComputedStyle(ghostLogo)
      const mLeft = parseFloat(csGhost.marginLeft) || 0
      const mRight = rightOverhangPx
      const targetX = blockRect.right - mRight - gw - mLeft
      const targetY = blockRect.top + ghostTopPx
      const ghost = { x: targetX, y: targetY, width: gw, scale: gw / 200 }
      metrics.current.ghost = ghost
      metrics.current.header = header
      metrics.current.ghostSize = { w: gw, h: gh }

      if (!ready && !hasScrolled) {
        stopAnimations()
        ax.set(ghost.x)
        ay.set(ghost.y)
        as.set(ghost.scale)
        ghostOpacity.set(1)
        setShrunkCSS(false)
        setReady(true)
        return
      }
    }
  }

  useLayoutEffect(() => {
    measure()
    scheduleStabilize()

    const roHeader = new ResizeObserver(measure)
    const roGhost = new ResizeObserver(measure)
    const roText = new ResizeObserver(measure)
    roHeaderRef.current = roHeader
    roGhostRef.current = roGhost
    roTextRef.current = roText
    
    const headerArea = document.querySelector('[data-header-logo-area]')
    const ghostLogo = document.querySelector('[data-ghost-logo-el]')
    const textBlock = document.querySelector('[data-hero-text-block]')
    
    if (headerArea) roHeader.observe(headerArea)
    if (ghostLogo) roGhost.observe(ghostLogo)
    if (textBlock) roText.observe(textBlock)
    
    window.addEventListener('resize', measure)
    // Re-stabilize when the page/tab becomes visible again (mobile Safari quirks)
    const onVisibility = () => { if (document.visibilityState === 'visible') scheduleStabilize() }
    window.addEventListener('pageshow', scheduleStabilize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      roHeader.disconnect()
      roGhost.disconnect()
      roText.disconnect()
      roHeaderRef.current = null
      roGhostRef.current = null
      roTextRef.current = null
      window.removeEventListener('resize', measure)
      window.removeEventListener('pageshow', scheduleStabilize)
      document.removeEventListener('visibilitychange', onVisibility)
      // Do not stop animations here to avoid cancelling first-scroll animation
    }
  }, [isHomePage])

  // Handle route changes
  useEffect(() => {
    stopAnimations()
    setHasScrolled(false)
    setMode('ghost')
    setReady(false)
    setShrunkCSS(false)
    // Pixel-based layout – no per-instance CSS vars to reset

    requestAnimationFrame(() => measure())
    // Stabilize for the new route (fonts/layout may differ)
    scheduleStabilize()
  }, [pathname])

  // Bi-directional animation on scroll
  useMotionValueEvent(scrollY, 'change', (v) => {
    if (!ready) return
    const shouldShrink = v > 0

    // To header
    if (shouldShrink && mode !== 'shrunk' && mode !== 'toHeader') {
      setHasScrolled(true)
      setMode('toHeader')
      stopAnimations()
      setShrunkCSS(true)
      isShrinkingRef.current = true
      roGhostRef.current?.disconnect?.()
      roTextRef.current?.disconnect?.()

      requestAnimationFrame(() => {
        measure()
        const targets = metrics.current.header
        if (!targets || typeof targets.x !== 'number' || typeof targets.y !== 'number') return

        const fade = animate(ghostOpacity, 0, { duration: 0, ease: 'easeInOut' })
        const collapseW = animate(ghostW, 0, { duration: 0.6, ease: 'easeInOut' })
        const collapseH = animate(ghostH, 0, { duration: 0.6, ease: 'easeInOut' })
        ghostAnimControls.current = [fade, collapseW, collapseH]

        axAnim.current = animate(ax, targets.x, { duration: 0.6, ease: 'easeInOut' })
        ayAnim.current = animate(ay, targets.y, { duration: 0.6, ease: 'easeInOut' })
        asAnim.current = animate(as, targets.scale, { duration: 0.6, ease: 'easeInOut' })

        const animationPromises = [
          axAnim.current?.finished ?? Promise.resolve(),
          ayAnim.current?.finished ?? Promise.resolve(),
          asAnim.current?.finished ?? Promise.resolve(),
          ...ghostAnimControls.current.map((control) => control.finished),
        ]

        Promise.all(animationPromises)
          .then(() => {
            setMode('shrunk')
            const headerArea = document.querySelector('[data-header-logo-area]')
            const ghostLogo = document.querySelector('[data-ghost-logo-el]')
            const textBlock = document.querySelector('[data-hero-text-block]')
            if (roHeaderRef.current && headerArea) roHeaderRef.current.observe(headerArea)
            if (roGhostRef.current && ghostLogo) roGhostRef.current.observe(ghostLogo)
            if (roTextRef.current && textBlock) roTextRef.current.observe(textBlock)
            isShrinkingRef.current = false
          })
          .catch(() => {
            const headerArea = document.querySelector('[data-header-logo-area]')
            const ghostLogo = document.querySelector('[data-ghost-logo-el]')
            const textBlock = document.querySelector('[data-hero-text-block]')
            if (roHeaderRef.current && headerArea) roHeaderRef.current.observe(headerArea)
            if (roGhostRef.current && ghostLogo) roGhostRef.current.observe(ghostLogo)
            if (roTextRef.current && textBlock) roTextRef.current.observe(textBlock)
            isShrinkingRef.current = false
          })
      })
      return
    }

    // Back to ghost
    if (!shouldShrink && (mode === 'shrunk' || mode === 'toHeader')) {
      setMode('toGhost')
      stopAnimations()
      setShrunkCSS(false)
      isShrinkingRef.current = true
      roGhostRef.current?.disconnect?.()
      roTextRef.current?.disconnect?.()

      // Prime ghost pixel layout using last known size
      const textBlock = document.querySelector('[data-hero-text-block]')
      const titleEl = document.querySelector('[data-hero-title]')
      const titleTextEl = document.querySelector('[data-hero-title-text]')
      if (textBlock && titleEl) {
        const blockRect = textBlock.getBoundingClientRect()
        const titleRect = titleEl.getBoundingClientRect()
        const gw = metrics.current.ghostSize?.w ?? 200
        const gh = metrics.current.ghostSize?.h ?? 200
        const { topAdjustPx, shapeMarginPx, radiusPct, centerOffsetPx, rightOverhangPx } = getLayoutParams()

        setGhostShapeMargin(shapeMarginPx)
        setGhostMarginRight(rightOverhangPx)

        const idealTop = Math.max(0, (titleRect.bottom - blockRect.top) - gh / 2)

        let firstLineBottom = (titleRect.top - blockRect.top)
        if (titleTextEl) {
          const r = document.createRange()
          r.selectNodeContents(titleTextEl)
          const rects = r.getClientRects()
          if (rects && rects.length > 0) {
            firstLineBottom = rects[0].bottom - blockRect.top
          } else {
            const csTitle = window.getComputedStyle(titleEl)
            let lh = parseFloat(csTitle.lineHeight)
            if (!lh || Number.isNaN(lh)) {
              const fs = parseFloat(csTitle.fontSize) || 24
              lh = fs * 1.2
            }
            firstLineBottom = (titleRect.top - blockRect.top) + lh
          }
        }

        const rPx = radiusPct * Math.min(gw, gh)
        const apexOffset = (gh / 2 + centerOffsetPx) - rPx
        const epsilon = 3
        const requiredTop = firstLineBottom + epsilon - apexOffset + shapeMarginPx - Math.min(topAdjustPx, 0)
        let floatTop = Math.max(idealTop, Math.ceil(requiredTop))

        // On very small screens, keep the ghost below the full title to avoid large gaps
        const vw = Math.min(window.innerWidth || 0, blockRect.width)
        if (vw && vw <= 380) {
          const belowTitleTop = Math.ceil((titleRect.bottom - blockRect.top) + shapeMarginPx)
          floatTop = Math.max(floatTop, belowTitleTop)
        }

        // Safari-specific vertical nudge (customizable via CSS var)
        const safariNudge = getSafariYOffset()
        if (safariNudge) floatTop += safariNudge

        // Update pixel-based layout on the floating element
        const ghostTopPx = floatTop + topAdjustPx
        ghostTop.set(ghostTopPx)

        // Compute and set a pixel-based circle
        const centerYPx = Math.round(gh / 2 + centerOffsetPx)
        const shapeCircle = `circle(${Math.round(rPx)}px at 50% ${centerYPx}px)`
        setShapeCircleStr(shapeCircle)

        // Update ghost target coordinates using container bounds and margins
        const ghostLogoEl = document.querySelector('[data-ghost-logo-el]')
        const csGhost = ghostLogoEl ? window.getComputedStyle(ghostLogoEl) : null
        const mLeft = csGhost ? (parseFloat(csGhost.marginLeft) || 0) : 0
        const mRight = rightOverhangPx
        const targetX = blockRect.right - mRight - gw - mLeft
        const targetY = blockRect.top + ghostTopPx
        const ghost = { x: targetX, y: targetY, width: gw, scale: gw / 200 }
        metrics.current.ghost = ghost
        metrics.current.ghostSize = { w: gw, h: gh }
      }

      const ghostTarget = metrics.current.ghost
      const gx = ghostTarget?.x ?? 0
      const gy = ghostTarget?.y ?? 0
      const gs = ghostTarget?.scale ?? 1

      ghostOpacity.set(0)
      ghostW.set(0)
      ghostH.set(0)
      const fadeIn = animate(ghostOpacity, 0, { duration: 0, delay: 0.6, ease: 'easeInOut' })
      const expandW = animate(ghostW, metrics.current.ghostSize?.w ?? 200, { delay: 0, duration: 0.6, ease: 'easeInOut' })
      const expandH = animate(ghostH, metrics.current.ghostSize?.h ?? 200, { delay: 0, duration: 0.6, ease: 'easeInOut' })
      ghostAnimControls.current = [fadeIn, expandW, expandH]

      axAnim.current = animate(ax, gx, { delay: 0, duration: 0.6, ease: 'easeInOut' })
      ayAnim.current = animate(ay, gy, { delay: 0, duration: 0.6, ease: 'easeInOut' })
      asAnim.current = animate(as, gs, { delay: 0, duration: 0.6, ease: 'easeInOut' })

      const animationPromises = [
        axAnim.current?.finished ?? Promise.resolve(),
        ayAnim.current?.finished ?? Promise.resolve(),
        asAnim.current?.finished ?? Promise.resolve(),
        ...ghostAnimControls.current.map((control) => control.finished),
      ]

      Promise.all(animationPromises)
        .then(() => {
          setMode('ghost')
          const headerArea = document.querySelector('[data-header-logo-area]')
          const ghostLogo = document.querySelector('[data-ghost-logo-el]')
          const textBlock = document.querySelector('[data-hero-text-block]')
          if (roHeaderRef.current && headerArea) roHeaderRef.current.observe(headerArea)
          if (roGhostRef.current && ghostLogo) roGhostRef.current.observe(ghostLogo)
          if (roTextRef.current && textBlock) roTextRef.current.observe(textBlock)
          isShrinkingRef.current = false
        })
        .catch(() => {
          const headerArea = document.querySelector('[data-header-logo-area]')
          const ghostLogo = document.querySelector('[data-ghost-logo-el]')
          const textBlock = document.querySelector('[data-hero-text-block]')
          if (roHeaderRef.current && headerArea) roHeaderRef.current.observe(headerArea)
          if (roGhostRef.current && ghostLogo) roGhostRef.current.observe(ghostLogo)
          if (roTextRef.current && textBlock) roTextRef.current.observe(textBlock)
          isShrinkingRef.current = false
        })
      return
    }
  })

  // Render when included on any page

  return (
    <>
      {/* Ghost Logo - float + shape-outside for text wrap (direct sibling before heading) */}
      <motion.div
        data-ghost-logo-el
        className="float-right"
        style={{
          opacity: ghostOpacity,
          pointerEvents: ghostActive ? 'auto' : 'none',
          position: ghostActive ? 'static' : 'absolute',
          left: ghostActive ? 'auto' : '-99999px',
          top: ghostActive ? 'auto' : '-99999px',
          float: ghostActive ? 'right' : 'none',
          width: ghostW,
          height: ghostH,
          marginTop: ghostActive ? ghostTop : 0,
          marginRight: ghostActive ? ghostMarginRight : 0,
          // Computed pixel circle set in measure()
          shapeOutside: ghostActive ? shapeCircleStr : 'none',
          WebkitShapeOutside: ghostActive ? shapeCircleStr : 'none',
          shapeMargin: ghostActive ? ghostShapeMargin : 0,
          WebkitShapeMargin: ghostActive ? ghostShapeMargin : 0
        }}
        aria-hidden="true"
      >
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
            alt=""
            className="w-full h-auto opacity-100"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* Animated Logo - visible while shrunk or transitioning */}
      {ready && mode !== 'ghost' && (
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
          <div style={{ width: 200 }}>
            <motion.div
              style={{ 
                filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.2))',
                // Enable hover on the overlay logo without making the whole overlay interactive
                pointerEvents: 'auto'
              }}
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
          </div>
        </motion.div>
      )}
    </>
  )
}
