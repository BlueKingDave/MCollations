import Link from 'next/link'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <Section background="surface-primary" className="min-h-screen flex items-center">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-secondaryText mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-primaryText mb-4">
            Page Non Trouvée
          </h2>
          <p className="text-lg text-secondaryText mb-8">
            Désolé, la page que vous recherchez n'existe pas. Elle a peut-être été déplacée,
            supprimée, ou vous avez entré une URL incorrecte.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home size={20} />
              Retour à l'Accueil
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour
          </Button>
        </div>

        <div className="mt-12 p-6 bg-features rounded-lg">
          <h3 className="text-xl font-bold text-primaryText mb-3">Besoin d'Aide?</h3>
          <p className="text-secondaryText mb-4">
            Si vous cherchez quelque chose de spécifique, essayez ces pages populaires:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="text-secondaryText hover:underline">Nos Services</Link>
            <Link href="/products" className="text-secondaryText hover:underline">Produits</Link>
            <Link href="/about" className="text-secondaryText hover:underline">À Propos</Link>
            <Link href="/faq" className="text-secondaryText hover:underline">FAQ</Link>
          </div>
        </div>
      </div>
    </Section>
  )
}