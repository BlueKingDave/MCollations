import React from 'react'
const heroFallback = '/images/machines/Hero.avif'
import InlineLogoAnimation from './InlineLogoAnimation'

type ImgSrc = string | { src: string }
interface HeroImage { src?: ImgSrc; alt?: string }

interface HeroProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  backgroundImage?: string
  heroImage?: HeroImage
  children?: React.ReactNode
  className?: string
  inlineLogoAnimation?: boolean
}

export default function Hero({
  title,
  subtitle,
  backgroundImage,
  heroImage,
  children,
  className = '',
  inlineLogoAnimation = false,
}: HeroProps) {
  return (
    <section 
      data-section="hero"
      className={`relative bg-secondary text-inverseText pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden ${className}`}
      style={backgroundImage ? { 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {heroImage ? (
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 lg:flex-[2] text-center relative" data-hero-text-block>
              {inlineLogoAnimation && <InlineLogoAnimation />}

              <h1
                data-hero-title
                className="text-4xl md:text-6xl font-bold"
                style={{ marginBottom: 'calc(1.5rem + 1em)' }}
              >
                <span data-hero-title-text>{title}</span>
              </h1>
              
              {subtitle && (
                <p
                  data-hero-subtitle
                  className={`text-left text-xl md:text-2xl text-inverseText/80 mb-8${inlineLogoAnimation ? ' pr-8 md:pr-12 clear-right md:clear-none' : ''}`}
                >
                  {subtitle}
                </p>
              )}
              
              {children}
            </div>
            
            <div className="flex-1 lg:flex-[1] flex justify-center relative" data-hero-image>
              <img 
                src={typeof heroImage.src === 'string' ? heroImage.src : (heroImage.src as any)?.src || heroFallback} 
                alt={heroImage.alt || "Vending Machine"}
                className="w-full max-w-md lg:max-w-lg h-auto rounded-lg drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all duration-300"
              />
            </div>
          </div>
        ) : (
          <div className="text-center relative" data-hero-text-block>
            {inlineLogoAnimation && <InlineLogoAnimation />}

            <h1
              data-hero-title
              className="text-4xl md:text-6xl font-bold"
              style={{ marginBottom: 'calc(1.5rem + 1em)' }}
            >
              <span data-hero-title-text>{title}</span>
            </h1>
            
            {subtitle && (
              <p
                data-hero-subtitle
                className={`text-left text-xl md:text-2xl text-inverseText/80 mb-8 max-w-3xl mx-auto${inlineLogoAnimation ? ' pr-8 md:pr-12 clear-right md:clear-none' : ''}`}
              >
                {subtitle}
              </p>
            )}
            
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
