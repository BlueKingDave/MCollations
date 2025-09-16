import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import { COMPANY_INFO, ROUTES } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="bg-secondary text-inverseText">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{COMPANY_INFO.name}</h3>
            <p className="text-inverseText/70">
              {COMPANY_INFO.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <div className="space-y-2">
              <Link href={ROUTES.ABOUT} className="block text-inverseText/70 hover:text-secondaryText transition-colors">À Propos</Link>
              <Link href={ROUTES.SERVICES} className="block text-inverseText/70 hover:text-secondaryText transition-colors">Services</Link>
              <Link href={ROUTES.PRODUCTS} className="block text-inverseText/70 hover:text-secondaryText transition-colors">Produits</Link>
              <Link href={ROUTES.FAQ} className="block text-inverseText/70 hover:text-secondaryText transition-colors">FAQ</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Nous Contacter</h4>
            <div className="space-y-2 text-inverseText/70">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                {COMPANY_INFO.phone}
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                {COMPANY_INFO.email}
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                {COMPANY_INFO.address.street}, {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Nous Suivre</h4>
            <div className="flex space-x-4">
              <a href={COMPANY_INFO.social.facebook} aria-label="Facebook">
                <Facebook size={20} className="text-inverseText/70 hover:text-secondaryText cursor-pointer transition-colors" />
              </a>
{/*               <a href={COMPANY_INFO.social.twitter} aria-label="Twitter">
                <Twitter size={20} className="text-inverseText/70 hover:text-secondaryText cursor-pointer transition-colors" />
              </a>
              <a href={COMPANY_INFO.social.instagram} aria-label="Instagram">
                <Instagram size={20} className="text-inverseText/70 hover:text-secondaryText cursor-pointer transition-colors" />
              </a> */}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-inverseText/70">
          <p>&copy; 2025 {COMPANY_INFO.name}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
