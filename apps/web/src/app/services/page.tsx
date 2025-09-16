"use client"

import Hero from '@/components/ui/Hero'
import Section, { SectionHeader } from '@/components/ui/Section'
import ServiceCard from '@/components/business/ServiceCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Truck, Settings, BarChart3, Coffee, Sandwich, Clock, MapPin } from 'lucide-react'
import { useContactModal } from '../contexts/ContactModalContext'

export default function ServicesPage() {
  const { openModal } = useContactModal()

  const mainServices = [
    {
      title: "Installation de Machines",
      description: "Installation professionnelle et configuration de machines distributrices avec consultation d'emplacement optimal.",
      icon: Truck,
      features: [
        "Consultation gratuite sur site",
        "Installation professionnelle",
        "Optimisation d'emplacement",
        "Formation sur l'équipement"
      ]
    },
    {
      title: "Maintenance et Support",
      description: "Services de maintenance complets et support 24/7 pour assurer le fonctionnement parfait de vos machines.",
      icon: Settings,
      features: [
        "Visites de maintenance régulières",
        "Support technique 24/7",
        "Remplacement de pièces",
        "Réparations d'urgence"
      ]
    },
    {
      title: "Analyses et Rapports",
      description: "Analyses détaillées des performances de vente, niveaux d'inventaire et préférences clients.",
      icon: BarChart3,
      features: [
        "Données de vente en temps réel",
        "Suivi d'inventaire",
        "Rapports de performance",
        "Analyses personnalisées"
      ]
    }
  ]

  const additionalServices = [
    {
      title: "Approvisionnement de Produits",
      description: "Nous gérons tout l'approvisionnement de produits et la gestion d'inventaire.",
      icon: Coffee
    },
    {
      title: "Planification de Menu Personnalisée",
      description: "Sélection de produits sur mesure basée sur les préférences de votre milieu de travail.",
      icon: Sandwich
    },
    {
      title: "Horaires Flexibles",
      description: "Maintenance et réapprovisionnement selon votre horaire.",
      icon: Clock
    },
    {
      title: "Support Multi-Emplacements",
      description: "Service coordonné à travers plusieurs emplacements d'entreprise.",
      icon: MapPin
    }
  ]

  return (
    <>
      <Hero
        title="Nos Services"
        subtitle="Solutions complètes de machines distributrices conçues pour répondre aux besoins de votre entreprise."
        inlineLogoAnimation={true}
      />

      <Section background="surface-primary">
        <SectionHeader
          title="Services Principaux"
          subtitle="Tout ce dont vous avez besoin pour un programme de distribution réussi."
        />

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainServices.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        <div className="bg-features rounded-lg p-8">
          <h3 className="text-2xl font-bold text-primaryText mb-4 text-center">
            Package de Service Complet
          </h3>
          <p className="text-secondaryText text-center mb-6">
            Notre approche de service complet signifie que vous n'avez à vous soucier de rien.
            Nous gérons l'installation, l'approvisionnement, la maintenance et le support client.
          </p>
          <div className="text-center">
            <Button
              openContactModal={openModal}
              modalType="quote"
            >
              Obtenir une Soumission
            </Button>
          </div>
        </div>
      </Section>

      <Section background="features">
        <SectionHeader
          title="Services Supplémentaires"
          subtitle="Services additionnels pour améliorer votre expérience de distribution."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalServices.map((service, index) => (
            <Card key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <service.icon size={24} className="text-inverseText" />
                </div>
              </div>
              <h4 className="font-bold text-primaryText mb-2">{service.title}</h4>
              <p className="text-secondaryText text-sm">{service.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="surface-primary">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Processus de Service"
            subtitle="Comment nous rendons la distribution simple pour votre entreprise."
          />

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Consultation", desc: "Nous évaluons vos besoins et recommandons la meilleure solution." },
              { step: "2", title: "Installation", desc: "Configuration professionnelle et formation des employés." },
              { step: "3", title: "Approvisionnement", desc: "Réapprovisionnement régulier avec des produits populaires." },
              { step: "4", title: "Support", desc: "Maintenance continue et support client." }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-bold text-primaryText mb-2">{item.title}</h4>
                <p className="text-secondaryText text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
