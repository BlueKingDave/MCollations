"use client"

import Hero from '@/components/ui/Hero'
import Section, { SectionHeader } from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Divider from '@/components/ui/Divider'
import Card, { CardContent } from '@/components/ui/Card'
import ReasonCard from '@/components/business/ReasonCard'
import SolutionCard from '@/components/business/SolutionCard'
import CompanyLogoCard from '@/components/business/CompanyLogoCard'
// import MachineParallax from '../components/business/MachineParallax'
import { reasons, solutions, companyLogos, faqData } from '@/utils/data'
import { ASSET_PATHS, generateAltText } from '@/utils/assets'
import { useContactModal } from './contexts/ContactModalContext'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from "lucide-react"


// 👇 Aliases sémantiques
const ValueProposition = Section
const Services = Section
const HowItWorks = Section
const FAQ = Section
const AboutUs = Section
const SocialProof = Section
const CallToAction = Section

export default function HomePage() {
  const { openModal } = useContactModal()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // --- Sticky mini-nav + carousel sync (MOBILE) ---
  const [activeReasonIndex, setActiveReasonIndex] = useState<number>(1) // start centered
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services')
    if (servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' })
  }

  // track active slide while swiping
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const el = scrollContainerRef.current
    const cardWidth = el.clientWidth * 0.9 // matches w-[90vw]
    const idx = Math.round(el.scrollLeft / cardWidth)
    if (idx !== activeReasonIndex) setActiveReasonIndex(idx)
  }

  // jump to a specific slide (chip click)
  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return
    const el = scrollContainerRef.current
    const cardWidth = el.clientWidth * 0.9
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    setActiveReasonIndex(index)
  }

  // center on the middle card initially
  useEffect(() => {
    if (scrollContainerRef.current) scrollToCard(1)
  }, [])

  return (
    <>
      <Hero 
        title="Vos collations, toujours à portée de main"
        subtitle="Service de machines distributrices clé en main avec collations fraîches pour entreprises, écoles et arénas à Québec et Lévis"
        heroImage={{
          src: ASSET_PATHS.hero.main,
          alt: generateAltText('hero', 'Proprietaire de M. Collations a cote d\'un distributeur automatique moderne')
        }}
        inlineLogoAnimation={true}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            openContactModal={openModal}
            modalType="quote"
          >
            Obtenir Une Soumission
          </Button>
          <Button variant="secondary" size="lg" onClick={scrollToServices}>Découvrir nos services</Button>
        </div>
      </Hero>

      <Divider />

      <ValueProposition background="surface-primary">
        <SectionHeader 
          title="Pourquoi choisir M. Collations ?"
          subtitle="Nos machines distributrices à Québec et Lévis offrent collations et breuvages à toute heure. Une valeur ajoutée à votre établissement, sans gestion ni main-d’œuvre de votre part."
        />

        {/* Desktop: normal grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <ReasonCard key={index} reason={reason} />
          ))}
        </div>

        {/* Mobile: sticky mini-nav + horizontal snap carousel */}
        <div className="md:hidden">
          {/* Sticky MINI NAV (chips) */}
          <div className="sticky top-16 z-30 mx-1">
            <nav className="bg-white border-1 border-neutral-100 rounded-md shadow-sm overflow-hidden">
              <ul className="flex justify-center gap-2 py-2 px-4">
              {reasons.map((r, i) => {
                const isActive = i === activeReasonIndex
                return (
                  <li key={`chip-${i}`}>
                    <button
                      type="button"
                      onClick={() => scrollToCard(i)}
                      aria-current={isActive ? 'true' : 'false'}
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm transition border
                        ${isActive
                          ? r.icon === "Lightning" ? 'border-orange-300 bg-orange-100 text-orange-800' :
                            r.icon === "Simple" ? 'border-green-300 bg-green-100 text-green-800' :
                            r.icon === "Satisfaction" ? 'border-yellow-300 bg-yellow-100 text-yellow-800' :
                            'border-emerald-500 bg-emerald-500/10 text-emerald-800'
                          : 'border-neutral-200 bg-white text-neutral-700'
                        }`}
                    >
                      {r?.title === "Énergie 24/7" ? "Énergie" : r?.title ?? `Pilier ${i + 1}`}
                    </button>
                  </li>
                )
              })}
              </ul>
            </nav>
          </div>

          {/* Horizontal CAROUSEL */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="mt-4 flex overflow-x-auto snap-x snap-mandatory space-x-4 px-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            aria-label="Parcourir les piliers"
          >
            {reasons.map((reason, index) => (
              <div key={index} className="flex-none snap-center w-[90vw]" aria-roledescription="slide">
                <ReasonCard reason={reason} />
              </div>
            ))}
          </div>
        </div>
      </ValueProposition>

      <Divider />

      <Services id="services" background="surface-primary">
        <SectionHeader 
          title="Nos Offres de Services"
          subtitle="Toutes nos solutions sont basées sur un modèle gagnant-gagnant, conçu pour maximiser vos profits tout en minimisant vos responsabilités dans les limites de nos modèles de rentabilité."
        />
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} solution={solution} />
          ))}
        </div>
      </Services>

      <Divider />

      <HowItWorks background="surface-primary">
        <SectionHeader 
          title="Comment ça fonctionne"
          subtitle="De la consultation à l’installation en seulement 3 étapes simples."
        />
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-inverseText">1</span>
            </div>
            <h3 className="text-xl font-bold text-primaryText mb-4">Remplir le Formulaire</h3>
            <p className="text-secondaryText">
              Parlez-nous de votre emplacement, de l’achalandage et de vos préférences. Nous voulons cerner vos besoins et votre réalité.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-inverseText">2</span>
            </div>
            <h3 className="text-xl font-bold text-primaryText mb-4">Personnalisation du Service</h3>
            <p className="text-secondaryText">
              Nous vous contactons pour discuter des options de produits et des modalités de service pour trouver une formule gagnante-gagnante.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-inverseText">3</span>
            </div>
            <h3 className="text-xl font-bold text-primaryText mb-4">Installation en 3 semaines</h3>
            <p className="text-secondaryText">
              Installation professionnelle, approvisionnement initial et configuration complétés en 3 semaines. Votre machine sera remplie et connectée dès le jour 1.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="secondary"
            size="lg"
            className="shadow-lg"
            openContactModal={openModal}
            modalType="quote"
          >
            Remplir le Formulaire
          </Button>
        </div>
      </HowItWorks>

      <Divider />

      <FAQ background="secondary">
        <SectionHeader
          title="Questions fréquentes"
          subtitle="Des réponses claires aux questions les plus fréquentes de nos clients."
          className="text-inverseText"
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {faqData.slice(0, 3).map((faq, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border border-white/20 backdrop-blur-sm cursor-pointer group"
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-secondary-light opacity-0 group-hover:opacity-80 transition-opacity duration-200" />

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-inverseText">{faq.question}</h4>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <svg
                      className="w-5 h-5 text-inverseText"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: "easeInOut" },
                      opacity: { duration: 0.2, ease: "easeInOut" }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="relative z-10 px-6 pb-6">
                      <p className="text-inverseText/80">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq">
            <Button variant="secondary">Plus de questions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </FAQ>

      <Divider />

      <AboutUs background="surface-primary">
        <SectionHeader 
          title="À propos de M. Collations"
          subtitle="Un service énergique, fiable et amical de machines distributrices à Québec et Lévis."
        />
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 lg:pr-4 text-center lg:text-left">
            <p className="text-lg text-secondaryText leading-relaxed">
              Fondée en juillet 2024, M. Collations vise à moderniser le marché des machines distributrices à Québec et Lévis avec des solutions flexibles, des machines modernes et un service à la fois fiable, humain et énergique.
            </p>
            <p className="text-secondaryText leading-relaxed">
              En moins d'un an, nous sommes devenus le partenaire de confiance d'Arénas, d'écoles et d'entreprises de toutes tailles dans la région. Petit à gros volume, nous avons la solution adaptée à vos besoins.
            </p>
            
{/*             <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-2">15+</div>
                <div className="text-sm text-secondaryText">années d’expérience</div>
              </div>
              <div className="text-center p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-2">500+</div>
                <div className="text-sm text-secondaryText">clients satisfaits</div>
              </div>
            </div> */}
          </div>
          
          <div className="space-y-4">
            <Card background="surface-primary">
              <CardContent className="pt-4 px-6 pb-4">
                <h4 className="font-bold text-primaryText mb-2">Jeunesse assumée</h4>
                <p className="text-secondaryText text-sm">Notre force, c'est notre énergie et notre flexibilité. Nous innovons dans un secteur qui avait besoin de modernité et de transparence, en plaçant les besoins des clients au cœur de nos solutions.</p>
              </CardContent>
            </Card>
            <Card background="surface-primary">
              <CardContent className="pt-4 px-6 pb-4">
                <h4 className="font-bold text-primaryText mb-2">Engagement</h4>
                <p className="text-secondaryText text-sm">Chez M. Collations, l'implication directe du propriétaire fait toute la différence. Animé par le désir de bien faire, Étienne s'investit personnellement dans chaque projet pour comprendre vos besoins, offrir un service authentique et bâtir des liens durables. </p>
              </CardContent>
            </Card>
            <Card background="surface-primary">
              <CardContent className="pt-4 px-6 pb-4">
                <h4 className="font-bold text-primaryText mb-2">Professionnalisme</h4>
                <p className="text-secondaryText text-sm">Avec nos inventaires en ligne et nos systèmes intelligents, nous anticipons vos besoins. Nos données nous permettent de sélectionner les collations les plus adaptées selon votre emplacement et d'offrir une expérience simple et fiable.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AboutUs>

      <SocialProof background="surface-primary">
{/*         <SectionHeader 
          title="Ce que disent nos clients"
          subtitle="Des entreprises locales, des écoles et des arénas nous font confiance — et leur nombre grandit chaque mois !"
        />
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <Divider /> */}

        <div className="py-12 bg-surface-primary">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-primaryText">Les plus grandes organisations d'ici nous font confiance</h3>
          </div>
          <CompanyLogoCard companies={companyLogos} />
        </div>
      </SocialProof>

      <Divider />

      <CallToAction background="surface-primary">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primaryText mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-secondaryText mb-8 max-w-2xl mx-auto">
            Contactez M. Collations dès aujourd'hui pour une consultation gratuite et découvrez comment améliorer votre milieu de travail.
          </p>
          <Button 
            size="lg"
            openContactModal={openModal}
            modalType="general"
          >
            <div className="flex flex-col leading-tight">
              <span>Obtenir une soumission</span>
              <span className="font-bold uppercase">GRATUITE</span>
            </div>
          </Button>
        </div>
      </CallToAction>
    </>
  )
}

{/*       <AboutUs background="surface-primary">
        <SectionHeader 
          title="À propos de M. Collations"
          subtitle="Votre partenaire de confiance en distributeurs automatiques haut de gamme depuis 2010."
        />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-secondaryText">
              Fondée en septembre , M. Collations poursuit une mission simple : offrir aux entreprises des distributeurs automatiques de qualité qui augmentent la satisfaction des employés et créent une nouvelle source de revenus.
            </p>
            <p className="text-secondaryText">
              De petite entreprise locale à partenaire de confiance pour des centaines d’organisations de la région, notre succès repose sur la qualité des produits, la fiabilité du service et une expérience client irréprochable.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-2">15+</div>
                <div className="text-sm text-secondaryText">années d’expérience</div>
              </div>
              <div className="text-center p-4 bg-surface-secondary rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-2">500+</div>
                <div className="text-sm text-secondaryText">clients satisfaits</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-surface-secondary rounded-lg p-6">
              <h4 className="font-bold text-primaryText mb-2">La qualité d’abord</h4>
              <p className="text-secondaryText text-sm">Nous collaborons avec des fabricants reconnus et des marques de collations prisées.</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-6">
              <h4 className="font-bold text-primaryText mb-2">Approche centrée sur le client</h4>
              <p className="text-secondaryText text-sm">Votre satisfaction est au cœur de nos priorités : service personnalisé et suivi attentif.</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-6">
              <h4 className="font-bold text-primaryText mb-2">Innovation</h4>
              <p className="text-secondaryText text-sm">Nous adoptons les technologies les plus récentes pour vous offrir des solutions performantes et durables.</p>
            </div>
          </div>
        </div>
      </AboutUs>

      <Divider />

      <SocialProof background="surface-primary">
        <SectionHeader 
          title="Ce que disent nos clients"
          subtitle="Des entreprises locales, des écoles et des arénas nous font confiance — et leur nombre grandit chaque mois !"
        />
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>

        <Divider />

        <div className="py-12 bg-surface-primary">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-primaryText">Les plus grandes organisations nous font confiance</h3>
          </div>
          <CompanyLogoCard companies={companyLogos} />
        </div>
      </SocialProof>
 */}
