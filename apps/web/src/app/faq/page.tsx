"use client"

import Hero from '@/components/ui/Hero'
import Section, { SectionHeader } from '@/components/ui/Section'
import ContactForm from '@/components/business/ContactForm'
import FAQCard from '@/components/business/FAQCard'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { faqData } from '@/utils/data'
import { COMPANY_INFO } from '@/utils/constants'
import { useContactModal } from '../contexts/ContactModalContext'

export default function FAQPage() {
  const iconMap = { Phone, Mail, MapPin, Clock }
  const { openModal } = useContactModal()

  return (
    <>
      <Hero
        title="Nous avons déjà les réponses!"
        subtitle="Vous avez des questions ? C'est normal, voici les questions que nos clients nous posent le plus souvent. Contactez-nous pour poser votre propre question."
        inlineLogoAnimation={true}
      >
        <div className="flex justify-center">
          <Button
            size="lg"
            openContactModal={openModal}
            modalType="general"
          >
            Contactez-nous
          </Button>
        </div>
      </Hero>

      <Section background="surface-primary">
        <SectionHeader
          title="Réponses rapides aux questions les plus courantes sur nos services."
        />

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((faq) => (
            <FAQCard key={faq.id} faq={faq} />
          ))}
        </div>
      </Section>

      <Section background="surface-primary">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-2">
          {/* LEFT WRAPPER: contents on mobile, block on desktop */}
          <div className="contents lg:block lg:col-start-1">
            {/* Title */}
            <div className="order-1 lg:order-none">
              <h2 className="text-3xl font-bold text-primaryText mb-6 lg:mb-4">
                Vous ne trouvez pas votre réponse&nbsp;?
              </h2>
            </div>

            {/* Text + Cards */}
            <div className="order-3 lg:order-none">
              <p className="text-secondaryText mb-8">
                Contactez-nous dès aujourd'hui pour en savoir plus sur nos services de
                machines distributrices. Nous offrirons une consultation gratuite et
                un devis personnalisé pour votre entreprise.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {COMPANY_INFO.contactInfo
                  .filter((info) => info.icon !== "MapPin")
                  .map((info, index) => {
                    const IconComponent = iconMap[info.icon]
                    return (
                      <Card key={index}>
                        <CardContent className="p-6 text-center">
                          <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                              {IconComponent && (
                                <IconComponent
                                  size={24}
                                  className="text-inverseText"
                                />
                              )}
                            </div>
                          </div>
                          <h4 className="font-bold text-primaryText mb-2">
                            {info.title}
                          </h4>
                          <p className="text-primaryText font-medium">
                            {info.details}
                          </p>
                          <p className="text-secondaryText text-sm">
                            {info.subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* RIGHT: Form (mobile after title, desktop right column) */}
          <div className="order-2 lg:order-none lg:col-start-2">
            <ContactForm modalType="faq" />
          </div>
        </div>
      </Section>

      <Section background="surface-primary">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primaryText mb-4">
            Prêt à Lancer Votre Programme de Collations ?
          </h2>
          <p className="text-lg text-secondaryText mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau d'entreprises satisfaites qui font confiance à M.Collations pour leurs besoins de machines distributrices.
          </p>
          <div className="bg-surface-primary rounded-lg p-8 max-w-2xl mx-auto hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-primaryText mb-4">Consultation Gratuite</h3>
            <p className="text-secondaryText mb-4">
              Obtenez une évaluation personnalisée de vos besoins de service et un devis sur mesure.
            </p>
            <p className="text-secondaryText font-bold text-lg">Appelez le {COMPANY_INFO.phone} Aujourd'hui !</p>
          </div>
        </div>
      </Section>
    </>
  )
}