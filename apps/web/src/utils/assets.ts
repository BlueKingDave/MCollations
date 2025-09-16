// Asset registry for Next.js public assets
export const ASSET_PATHS = {
  hero: {
    main: '/images/machines/Hero.avif',
  },
  machines: {
    snackMaster: '/images/machines/snackMaster.png',
    beveragePlus: '/images/machines/machine3.avif',
    comboMax: '/images/machines/comboMax.jpg',
  },
  products: {
    chips: '/api/placeholder/200/200',
    energyDrink: '/api/placeholder/200/200',
    trailMix: '/api/placeholder/200/200',
    coffee: '/api/placeholder/200/200',
    granola: '/api/placeholder/200/200',
    soda: '/api/placeholder/200/200',
  },
  avatars: {
    sarah: '/api/placeholder/40/40',
    mike: '/api/placeholder/40/40',
    lisa: '/api/placeholder/40/40',
    david: '/api/placeholder/40/40',
  },
  team: {
    john: '/api/placeholder/300/300',
    lisaWong: '/api/placeholder/300/300',
    davidRodriguez: '/api/placeholder/300/300',
  },
  logos: {
    gardaworld: '/logos/gardaworld.png',
    marcellemallet: '/logos/marcellemallet.svg',
    complexe2glaces: '/logos/complexe2glaceshonco.png',
    collegedelevis: '/logos/collegelevis.svg',
    alexcoulombe: '/logos/alexcoulombe.jpg',
    openlane: '/logos/openlane.png',
    mluniforme: '/logos/martinlevesquelogo.png',
  },
}

export const FALLBACK_IMAGES = {
  hero: '/assets/images/fallbacks/hero-fallback.jpg',
  product: '/assets/images/fallbacks/product-fallback.jpg',
  avatar: '/assets/images/fallbacks/avatar-fallback.jpg',
  logo: '/assets/images/fallbacks/logo-fallback.jpg',
  machine: '/assets/images/fallbacks/machine-fallback.jpg',
}

export const IMAGE_CONFIG = {
  quality: 85,
  formats: ['webp', 'jpg'],
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    hero: { width: 1920, height: 1080 },
  },
}

export function getOptimizedImageUrl(imagePath: string, size: keyof typeof IMAGE_CONFIG.sizes = 'medium', format: 'webp' | 'jpg' = 'webp') {
  if (imagePath.includes('/api/placeholder/')) return imagePath
  return imagePath
}

export function generateAltText(type: string, name = '') {
  const altTexts: Record<string, string> = {
    hero: `${name || 'M.Collation'} - Premium vending machine services`,
    product: `${name} - Available in our vending machines`,
    avatar: `${name} - Customer testimonial`,
    team: `${name} - M.Collation team member`,
    logo: `${name} - Trusted partner logo`,
    machine: `${name} - Professional vending machine`,
  }
  return altTexts[type] || `${name} image`
}
