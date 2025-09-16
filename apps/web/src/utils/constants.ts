export const COMPANY_INFO = {
  name: 'M.Collations',
  tagline: 'Solutions de Machine Distributrices Personnalisées',
  phone: '(418) 575-2157',
  email: 'etienne@mcollations.ca',
  address: {
    street: '275 Avenue Taniata',
    city: 'Saint-Romuald',
    state: 'Québec',
    zip: 'G6W 5M6',
  },
  hours: {
    weekdays: 'Lundi - Vendredi',
    time: '8h00 - 18h00',
  },
  social: {
    facebook: 'https://www.facebook.com/etienne.lacerte',
    twitter: '#',
    instagram: '#',
  },
  get contactInfo() {
    return [
      { icon: 'Phone', title: 'Téléphone', details: this.phone, subtitle: 'Lun-Ven 8h-18h' },
      { icon: 'Mail', title: 'E-mail', details: this.email, subtitle: 'Nous répondons dans les 24 heures' },
      { icon: 'MapPin', title: 'Adresse', details: this.address.street, subtitle: `${this.address.city}, ${this.address.state} ${this.address.zip}` },
      { icon: 'Clock', title: "Heures d'Affaires", details: this.hours.weekdays, subtitle: this.hours.time },
    ]
  },
}

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  PRODUCTS: '/products',
  FAQ: '/faq',
} as const

