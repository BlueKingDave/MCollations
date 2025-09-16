import { ASSET_PATHS, generateAltText } from './assets'

export const vendingMachines = [
  {
    id: 1,
    name: 'SnackMaster Pro',
    type: 'Distributeur de Collations',
    capacity: '40 sélections',
    dimensions: '72"H x 35"L x 35"P',
    power: '115V',
    description: "Parfait pour les bureaux et salles de pause avec une grande variété d'options de collations.",
    image: ASSET_PATHS.machines.snackMaster,
    alt: generateAltText('machine', 'SnackMaster Pro'),
  },
  {
    id: 2,
    name: 'BeveragePlus',
    type: 'Distributeur de Boissons',
    capacity: '8 sélections',
    dimensions: '72"H x 27"L x 35"P',
    power: '115V',
    description: 'Distributeur de boissons réfrigéré avec affichage frontal en verre.',
    image: ASSET_PATHS.machines.beveragePlus,
    alt: generateAltText('machine', 'BeveragePlus'),
  },
  {
    id: 3,
    name: 'ComboMax',
    type: 'Distributeur Combiné',
    capacity: '30 sélections',
    dimensions: '72"H x 38"L x 35"P',
    power: '115V',
    description: 'Le meilleur des deux mondes - collations et boissons dans une seule machine.',
    image: ASSET_PATHS.machines.comboMax,
    alt: generateAltText('machine', 'ComboMax'),
  },
]

export const products = [
  { id: 1, name: 'Chips Classiques', price: '1.50', category: 'collations', description: 'Variété populaire de chips de pomme de terre croustillantes', image: ASSET_PATHS.products.chips, alt: generateAltText('product', 'Classic Chips') },
  { id: 2, name: 'Boisson Énergisante', price: '2.75', category: 'boissons', description: 'Boostez votre énergie', image: ASSET_PATHS.products.energyDrink, alt: generateAltText('product', 'Energy Drink') },
]

export const testimonials = [
  { id: 1, name: 'Sarah Johnson', company: 'TechCorp Inc.', content: "M.Collation a transformé notre salle de pause.", rating: 5, avatar: ASSET_PATHS.avatars.sarah, alt: generateAltText('avatar', 'Sarah Johnson') },
]

export const reasons = [
  { id: 1, title: 'Simplicité', problème: "Votre focus ne devrait pas être la gestion d'un service alimentaire.", solution: 'Avec M.Collations, offrez des collations sans tracas.', icon: 'Simple', features: ["Économie de temps", 'Adapté à vos besoins', 'Service clé en main'] },
  { id: 3, title: 'Satisfaction', problème: 'Vos visiteurs et employés méritent mieux.', solution: "Machines toujours approvisionnées et fonctionnelles.", icon: 'Satisfaction', features: ['Produits frais', 'Machines bien remplies', 'Paiements flexibles'] },
  { id: 2, title: 'Énergie 24/7', problème: "Besoin d'énergie à toute heure!", solution: "Offrez l'énergie nécessaire.", icon: 'Lightning', features: ['Efficacité de nuit', 'Performance sportive', 'Performance scolaire'] },
]

export const solutions = [
  {
    id: 1,
    title: 'Partage de Revenus',
    description: 'Vous apportez la clientèle - nous apportons les collations - nous partageons les profits.',
    contrainte: 'Pour les emplacements à fort achalandage ou plus de 150 employés',
    buttonText: 'En Savoir Plus',
    buttonAction: 'learn',
    animationType: 'accordion',
    detailedContent: {
      subtitle: 'Partenariat Qui Paie',
      features: [
        "Aucun investissement requis de votre part",
        'Nous gérons tous les stocks et la maintenance',
        'Modèle de partage de revenus compétitif',
        'Sélection de produits personnalisée',
      ],
      benefits: 'Parfait pour les emplacements à fort achalandage.',
      cta: 'Me Qualifier',
    },
  },
  {
    id: 2,
    title: 'Service de Machine Distributrice',
    description: 'Un service géré qui maintient votre équipe et vos clients heureux, sans tracas',
    contrainte: 'Pour les emplacements à achalandage modéré ou 50-150 employés',
    buttonText: 'En Savoir Plus',
    buttonAction: 'learn',
    animationType: 'modal',
    detailedContent: {
      subtitle: 'Solution Clés en Main Complète',
      features: [
        'Un service pour des machines bien approvisionnées et fonctionnelles',
        'Sélection de produits personnalisée',
        'Support technique 24/7',
        'Conditions contractuelles flexibles',
      ],
      benefits: 'Idéal pour les bureaux et entreprises.',
      cta: 'Demander une soumission',
    },
  },
  {
    id: 3,
    title: "Location ou Vente d'une Machine",
    description: "Obtenez votre propre distributeur automatique et commencez à gagner.",
    contrainte: 'Pour emplacements à faible achalandage, éloignés ou entrepreneurs',
    buttonText: 'En Savoir Plus',
    buttonAction: 'learn',
    animationType: 'slideout',
    detailedContent: {
      subtitle: 'Contrôle Total, À faible coût',
      features: [
        "Options d'achat ou de location disponibles",
        'Formation et support de configuration inclus',
        'Assistance technique continue',
        'Vous achetez, vous gérez, vous gagnez',
      ],
      benefits: 'Pour les petites entreprises prêtes à gérer leur propre opération.',
      cta: 'Explorer les Options',
    },
  },
]

export const companyLogos = [
  { id: 1, name: 'Garda World', logo: ASSET_PATHS.logos.gardaworld, alt: generateAltText('logo', 'Garda World'), bgColor: 'bg-red-600', url: 'https://www.garda.com/en-ca' },
  { id: 2, name: 'Marcelle Mallet', logo: ASSET_PATHS.logos.marcellemallet, alt: generateAltText('logo', 'Marcelle Mallet'), bgColor: 'bg-white', url: 'https://www.emm.qc.ca/fr' },
  { id: 3, name: 'Complexe 2 Glaces Honco', logo: ASSET_PATHS.logos.complexe2glaces, alt: generateAltText('logo', 'Complexe 2 Glaces Honco'), bgColor: 'bg-white', url: 'https://complexe2glaces.com/' },
  { id: 4, name: 'Collège de Lévis', logo: ASSET_PATHS.logos.collegedelevis, alt: generateAltText('logo', 'Collège de Lévis'), bgColor: 'bg-white', url: 'https://www.collegedelevis.qc.ca/' },
  { id: 6, name: 'OPENLANE', logo: ASSET_PATHS.logos.openlane, alt: generateAltText('logo', 'OPENLANE'), bgColor: 'bg-white', url: 'https://www.openlane.ca/en/' },
  { id: 7, name: 'Martin & Levesque', logo: ASSET_PATHS.logos.mluniforme, alt: generateAltText('logo', 'Martin & Levesque Uniforme'), bgColor: 'bg-white', url: 'https://mluniforme.com/en/' },
]

export const faqData = [
  { id: 1, question: 'Offrez-vous des produits santé ou sur mesure ?', answer: "Notre sélection est conçue sur mesure avec vous, en tenant compte de vos besoins et de nos données." },
  { id: 2, question: "Est-ce qu'il y a des problèmes avec vos machines ?", answer: "Très rarement, nos machines haut de gamme sont connectées, ce qui nous permet de suivre en temps réel." },
  { id: 3, question: 'Comment assurez-vous la fraîcheur de vos produits ?', answer: 'Rotation rigoureuse des stocks et machines réfrigérées ravitaillées régulièrement.' },
]
