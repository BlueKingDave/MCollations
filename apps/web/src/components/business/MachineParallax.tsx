"use client"

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ASSET_PATHS, generateAltText } from "../../utils/assets";
// @ts-expect-error Animated UI helpers may be JS or not yet ported
import { HoverScale, StaggeredList, ScrollReveal, FadeIn } from "../ui/Animated";

/* -------------------------------------------------------------------------- */
/*                                DATA SOURCE                                 */
/* -------------------------------------------------------------------------- */

const MACHINE_DATA = [
  {
    id: "combo-5",
    name: "Combo 5 Machine",
    type: "Premium Combination",
    image: ASSET_PATHS.machines.comboMax,
    alt: generateAltText("machine", "Combo 5 Vending Machine"),
    info: {
      title: "Premium Combo 5",
      subtitle: "Ultimate Vending Experience",
      description:
        "The most advanced vending solution with 5 different product categories in one sleek machine.",
      features: [
        "50+ product selections",
        "Smart payment system",
        "Energy-efficient cooling",
        "Real-time inventory tracking",
      ],
      highlight: "Perfect for high-traffic areas",
    },
  },
  {
    id: "combo-3",
    name: "Combo 3 Machine",
    type: "Standard Combination",
    image: ASSET_PATHS.machines.snackMaster,
    alt: generateAltText("machine", "Combo 3 Vending Machine"),
    info: {
      title: "Versatile Combo 3",
      subtitle: "Balanced Performance",
      description:
        "The perfect balance of variety and efficiency with 3 carefully curated product categories.",
      features: [
        "30+ product selections",
        "Dual temperature zones",
        "Cashless payment ready",
        "Compact footprint design",
      ],
      highlight: "Ideal for medium-sized offices",
    },
  },
  {
    id: "essential",
    name: "Essential Machine",
    type: "Budget-Friendly",
    image: ASSET_PATHS.machines.beveragePlus,
    alt: generateAltText("machine", "Budget Essential Vending Machine"),
    info: {
      title: "Essential Solution",
      subtitle: "Smart & Economical",
      description:
        "Cost-effective vending solution that delivers quality, reliability, and excellent ROI.",
      features: [
        "15+ essential selections",
        "Simple operation",
        "Low maintenance costs",
        "Quick return on investment",
      ],
      highlight: "Great for small businesses",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function MachineParallax() {
  /* ---------------------------------- Refs --------------------------------- */
  const containerRef  = useRef<HTMLElement | null>(null);
  const sectionRefs   = useRef<HTMLElement[]>([] as unknown as HTMLElement[]);
  const scrollDirRef  = useRef("down");       // "up" | "down"

  /* --------------------------------- State --------------------------------- */
  const [imgIndex, setImgIndex] = useState(0);  // controls images
  const [txtIndex, setTxtIndex] = useState(0);  // controls text blocks
  const [visible,  setVisible]  = useState(false); // progress-bar helper

  /* --------------------------- Helpers / Callbacks ------------------------- */
  const setSectionRef = useCallback((node: HTMLElement | null, idx: number) => {
    if (!node) return;
    node.dataset.idx = String(idx);                // index accessible in observer
    sectionRefs.current[idx] = node;
  }, []);

  const scrollToSection = useCallback((idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  /* --------------------------- Scroll direction tap ------------------------ */
  useEffect(() => {
    let prevY = window.scrollY;
    const onScroll = () => {
      const currY = window.scrollY;
      scrollDirRef.current = currY < prevY ? "up" : "down";
      prevY = currY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------------- Intersection Observers Setup --------------------- */
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl || !sectionRefs.current.length) return;

    /* Progress-bar visibility */
    const containerObs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    containerObs.observe(containerEl);

    /* Sections observer */
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx   = Number((entry.target as HTMLElement).dataset.idx);
          const ratio = entry.intersectionRatio;
          const dir   = scrollDirRef.current;

          /* Images: unchanged – fade-in when ≥ 0.5 */
          if (ratio >= 0.5) setImgIndex(idx);

          /* Text logic
             DOWN  : fade-in when ≥ 0.30 (unchanged)
             UP    : fade-in when ≥ 0.21 (≈30 % earlier)
             Fade-out for both directions stays at < 0.10          */
          if (ratio >= (dir === "up" ? 0.21 : 0.30)) {
            setTxtIndex(idx);
          } else if (ratio < 0.10 && txtIndex === idx) {
            setTxtIndex(-1);               // no active text for a short gap
          }
        });
      },
      { threshold: [0, 0.10, 0.21, 0.30, 0.50, 1] }
    );

    sectionRefs.current.forEach((sec) => sectionObs.observe(sec));

    return () => {
      containerObs.disconnect();
      sectionObs.disconnect();
    };
  }, [txtIndex]);

  /* ------------------------- Memoized utility values ----------------------- */
  const progressBarHidden = useMemo(() => !visible, [visible]);

  /* -------------------------------------------------------------------------- */
  /*                                  RENDER                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <section
      ref={containerRef}
      aria-label="Vending machines showcase"
      className="relative bg-surface-primary overflow-visible before:absolute before:inset-0 before:-top-32 before:-bottom-32 before:bg-gradient-to-br before:from-surface-primary before:to-surface-secondary before:-z-10"
    >
      {/* Layout */}
      <div className="flex flex-col min-h-screen lg:flex-row">

        {/* ───────────────────── Left Column – Text Content ───────────────────── */}
        <div className="flex-1 lg:w-1/2">
          {MACHINE_DATA.map((machine, idx) => (
            <article
              key={machine.id}
              ref={(node) => setSectionRef(node, idx)}
              className={`min-h-screen flex items-center justify-center px-6 py-20 lg:px-12 transition-all duration-700 ease-out ${
                idx === txtIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="max-w-2xl space-y-8 lg:max-w-xl">
                {/* Badge */}
                <FadeIn delay="200ms">
                  <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-4 py-2 backdrop-blur-sm">
                    <span className="text-sm font-medium uppercase tracking-wide text-accent">
                      {machine.type}
                    </span>
                  </span>
                </FadeIn>

                {/* Headings */}
                <header className="space-y-3">
                  <h2 className="font-display text-4xl font-bold leading-tight text-primaryText md:text-5xl lg:text-6xl">
                    {machine.info.title}
                  </h2>
                  <p className="text-xl font-medium text-primary md:text-2xl">
                    {machine.info.subtitle}
                  </p>
                </header>

                {/* Description */}
                <p className="text-lg leading-relaxed text-secondaryText md:text-xl">
                  {machine.info.description}
                </p>

                {/* Features */}
                <StaggeredList
                  className="grid gap-4 md:grid-cols-2"
                  staggerDelay={150}
                  animation="fade-in"
                  role="list"
                >
                  {machine.info.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed text-secondaryText">{feature}</span>
                    </li>
                  ))}
                </StaggeredList>

                {/* Highlight */}
                <footer className="pt-4">
                  <FadeIn delay="400ms">
                    <span className="inline-flex items-center rounded-xl border border-primary/20 bg-primary/10 px-6 py-3 backdrop-blur-sm">
                      <span className="text-lg font-semibold text-primary">
                        {machine.info.highlight}
                      </span>
                    </span>
                  </FadeIn>
                </footer>
              </div>
            </article>
          ))}
        </div>

        {/* ───────────────────── Right Column – Sticky Images ─────────────────── */}
        <div className="relative lg:flex-1 lg:w-1/2">
          <div className="flex h-[400px] items-center justify-center p-6 lg:sticky lg:top-0 lg:h-screen lg:p-12">
            <div className="relative h-full max-h-[600px] w-full max-w-lg">
              {MACHINE_DATA.map((machine, idx) => (
                <figure
                  key={machine.id}
                  aria-hidden={idx !== imgIndex}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                    idx === imgIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <HoverScale scale="hover:scale-105" className="relative">
                    {/* Subtle glow */}
                    <div className="absolute inset-0 scale-110 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-3xl transition-transform duration-500" />
                    {/* Image */}
                    <img
                      src={machine.image}
                      alt={machine.alt}
                      className="relative max-h-[350px] w-full object-contain drop-shadow-2xl transition-all duration-500 hover:drop-shadow-3xl lg:max-h-[500px]"
                    />
                  </HoverScale>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────── Progress Indicator ───────────────────────── */}
      <aside
        aria-label="Section progress"
        className={`fixed left-4 top-1/2 z-30 -translate-y-1/2 transition-all duration-500 lg:left-8 ${
          progressBarHidden ? "-translate-x-4 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <ScrollReveal threshold={0.3}>
          <div className="flex flex-col items-center space-y-4">
            <span className="h-16 w-px bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />

            {MACHINE_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(idx)}
                aria-label={`Scroll to ${MACHINE_DATA[idx].name}`}
                className="relative"
              >
                <span
                  className={`block h-3 w-3 cursor-pointer rounded-full border-2 transition-all duration-500 ${
                    idx === imgIndex
                      ? "scale-110 border-primary bg-primary shadow-lg shadow-primary/30"
                      : "border-neutral-300 bg-background hover:border-primary/50 hover:scale-110"
                  }`}
                />
                {idx === imgIndex && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40" />
                )}
              </button>
            ))}

            <span className="h-16 w-px bg-gradient-to-b from-neutral-300 via-transparent to-transparent" />
          </div>
        </ScrollReveal>
      </aside>
    </section>
  );
}
