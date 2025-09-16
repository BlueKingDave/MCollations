"use client"

import Hero from '@/components/ui/Hero'
import Section, { SectionHeader } from '@/components/ui/Section'
import ValueCard from '@/components/business/ValueCard'
import TeamMemberCard from '@/components/business/TeamMemberCard'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "John Smith",
      role: "PDG et Fondateur",
      bio: "Plus de 20 ans d'expérience dans l'industrie des distributeurs automatiques.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Lisa Wong",
      role: "Directrice des Opérations",
      bio: "Experte en logistique et excellence du service client.",
      image: "/api/placeholder/300/300"
    },
    {
      name: "David Rodriguez",
      role: "Directeur Technique",
      bio: "Dirige notre équipe de maintenance et de support technique.",
      image: "/api/placeholder/300/300"
    }
  ]

  const values = [
    {
      title: "Qualité d'Abord",
      description: "Nous nous associons uniquement avec des fabricants de distributeurs automatiques de premier plan et des marques de collations premium."
    },
    {
      title: "Focus Client",
      description: "Votre satisfaction est notre priorité. Nous fournissons un service et un support personnalisés."
    },
    {
      title: "Innovation",
      description: "Nous adoptons les nouvelles technologies pour fournir les meilleures solutions de distribution disponibles."
    },
    {
      title: "Fiabilité",
      description: "Comptez sur nous pour un service cohérent, une maintenance ponctuelle et un support fiable."
    }
  ]

  return (
    <>
      <Hero
        title="À Propos de M.Collation"
        subtitle="Votre partenaire de confiance en services de distributeurs automatiques premium depuis 2010."
      />

      <Section background="surface-primary">
        <SectionHeader
          title="Notre Histoire"
          subtitle="Construite sur une base de service de qualité et de satisfaction client."
        />

        <div className="max-w-4xl mx-auto text-lg text-secondaryText space-y-6">
          <p>
            Fondée en 2010, M.Collation a commencé avec une mission simple : fournir aux entreprises
            des services de distributeurs automatiques de haute qualité qui améliorent la satisfaction
            au travail et génèrent des flux de revenus supplémentaires.
          </p>
          <p>
            Au fil des années, nous avons évolué d'une petite opération locale à un partenaire de
            confiance servant des centaines d'entreprises dans la région. Notre succès repose sur
            notre engagement envers des produits de qualité, un service fiable et la satisfaction client.
          </p>
          <p>
            Aujourd'hui, nous continuons d'innover et d'étendre nos services, incorporant les dernières
            technologies et tendances pour fournir à nos clients les meilleures solutions de distribution possibles.
          </p>
        </div>
      </Section>

      <Section background="surface-primary">
        <SectionHeader
          title="Nos Valeurs"
          subtitle="Les principes qui guident tout ce que nous faisons."
        />

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} />
          ))}
        </div>
      </Section>

      <Section background="surface-primary">
        <SectionHeader
          title="Rencontrez Notre Équipe"
          subtitle="Les professionnels dévoués derrière le succès de M.Collation."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </Section>
    </>
  )
}