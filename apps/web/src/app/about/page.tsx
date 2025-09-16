"use client"

import Hero from '@/components/ui/Hero'
import Section, { SectionHeader } from '@/components/ui/Section'
import ValueCard from '@/components/business/ValueCard'
import TeamMemberCard from '@/components/business/TeamMemberCard'
import CompanyLogoCard from '@/components/business/CompanyLogoCard'
import ResponsiveCardGrid from '@/components/ui/ResponsiveCardGrid'
import { companyLogos } from '@/utils/data'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Étienne Lacerte",
      role: "PDG et Fondateur",
      bio: "Passionné par l'entrepreneuriat et le service client, coach au collège de Lévis depuis 2015, étienne fut chargé de plusieurs projet dans son parcours académique et professionnel. M.Collations est le fruit de sa connexion entre le monde du sport et celui des affaires.",
      image: "/images/teamMembers/etienne.png"
    },
    {
      name: "Billy Lemay",
      role: "Directrice des Opérations",
      bio: "Ami d'Étienne depuis toujours, Billy aide à gérer et conceptualiser les opérations quotidiennes de M.Collation, assurant que chaque client reçoit un service exceptionnel.",
      image: "/images/teamMembers/billy.png"
    },
    {
      name: "Louise Lacerte",
      role: "Supportrice Inconditionnelle",
      bio: "Derrière chaque entrepreneur se trouve un parent dévoué. Louise, la mère d'Étienne, a toujours cru en lui et l'a soutenu à chaque étape de son parcours.",
      image: "/images/teamMembers/louise.png"
    },
    {
      name: "David Roy-Blouin",
      role: "Consultant et Developpeur Web",
      bio: "Aussi ami d'Étienne depuis toujours, avec sa passion pour le monde des affaires et du web David soutien Étienne avec la présence en ligne de M.Collation et son bon développement.",
      image: "/images/teamMembers/david.png"
    }
  ]

  const values = [
    {
      title: "Jeunesse assumée",
      description: "Notre force, c'est notre énergie et notre flexibilité. Nous innovons dans un secteur qui avait besoin de modernité et de transparence, en plaçant les besoins des clients au cœur de nos solutions."
    },
    {
      title: "Engagement",
      description: "Chez M. Collations, l'implication directe du propriétaire fait toute la différence. Animé par le désir de bien faire, Étienne s'investit personnellement dans chaque projet pour comprendre vos besoins, offrir un service authentique et bâtir des liens durables."
    },
    {
      title: "Professionnalisme",
      description: "Avec nos inventaires en ligne et nos systèmes intelligents, nous anticipons vos besoins. Nos données nous permettent de sélectionner les collations les plus adaptées selon votre emplacement et d'offrir une expérience simple et fiable."
    },

  ]

  return (
    <>
      <Hero
        title="À Propos de M.Collation"
        subtitle="Votre partenaire de confiance en services de machines distributrices à Québec et Lévis."
        inlineLogoAnimation={true}
      />

      <Section background="surface-primary">
        <SectionHeader
          title="Notre Histoire"
          subtitle="Construite avec des amis, pour servirs nos clients comme des amis."
        />

        <div className="max-w-4xl mx-auto text-lg text-secondaryText space-y-6">
          <p>
           Fondée en juillet 2024, M.Collations doit son succès à l'aide d'amis, de la famille et des nombreux contacts qu'Étienne s'est fait par son intérêt pas étaignable envers les gens qu'il cotoie.
          </p>
          <p>
            Le premier client de M.Collations était le directeur avec qui étienne a coaché durant 12 ans. Il lui a fait confiance et la qualité du service offert à donné la place à 7 emplacement à haut volume en moins d'un an.
          </p>
          <p>
            Aujourd'hui, nous continuons d'innover et d'étendre nos services, incorporant les dernières
            technologies et tendances pour fournir à nos clients les meilleures solutions de machines distributrices possibles.
          </p>
        </div>
      </Section>

      <Section background="surface-primary">
        <SectionHeader
          title="Nos Valeurs"
          subtitle="Les principes qui guident tout ce que nous faisons."
        />

        <ResponsiveCardGrid
          items={values}
          renderCard={(value, index) => <ValueCard key={index} value={value} />}
          getItemTitle={(value) => value.title}
          mobileNavigation={true}
        />
      </Section>

      <Section background="surface-primary" className="pt-8">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-primaryText">Les plus grandes organisations d'ici nous font confiance</h3>
        </div>
        <CompanyLogoCard companies={companyLogos} />
      </Section>

      <Section background="surface-primary">
        <SectionHeader
          title="Rencontrez Notre Équipe"
          subtitle="Les professionnels dévoués derrière le succès de M.Collation."
        />

        <ResponsiveCardGrid
          items={teamMembers}
          renderCard={(member, index) => <TeamMemberCard key={index} member={member} />}
          getItemTitle={(member) => member.name}
          mobileNavigation={true}
        />
      </Section>
    </>
  )
}
