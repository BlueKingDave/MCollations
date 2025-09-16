"use client"

import Hero from '@/components/ui/Hero'
import Section, { SectionHeader } from '@/components/ui/Section'
import ProductCard from '@/components/business/ProductCard'
import Button from '@/components/ui/Button'
import { useState } from 'react'
import { useContactModal } from '../contexts/ContactModalContext'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { openModal } = useContactModal()

  const categories = [
    { id: 'all', name: 'Tous les Produits' },
    { id: 'snacks', name: 'Collations' },
    { id: 'beverages', name: 'Boissons' },
    { id: 'healthy', name: 'Options Santé' },
    { id: 'hot-drinks', name: 'Boissons Chaudes' }
  ]

  const products = [
    {
      name: "Chips Classiques",
      price: "1.50",
      category: "snacks",
      description: "Variété populaire de chips de pommes de terre croustillantes",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Boisson Énergisante",
      price: "2.75",
      category: "beverages",
      description: "Boostez votre énergie avec des boissons énergisantes premium",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Mélange de Noix",
      price: "2.25",
      category: "healthy",
      description: "Mélange nutritif de noix, fruits et graines",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Café Premium",
      price: "1.75",
      category: "hot-drinks",
      description: "Café fraîchement infusé, diverses saveurs disponibles",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Barre Granola",
      price: "1.25",
      category: "healthy",
      description: "Barres granola saines avec des ingrédients authentiques",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Variété de Sodas",
      price: "1.50",
      category: "beverages",
      description: "Sodas classiques et boissons gazeuses",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Biscuits",
      price: "1.75",
      category: "snacks",
      description: "Biscuits fraîchement cuits en diverses saveurs",
      image: "/api/placeholder/200/200"
    },
    {
      name: "Chocolat Chaud",
      price: "1.50",
      category: "hot-drinks",
      description: "Mélange de chocolat chaud riche et crémeux",
      image: "/api/placeholder/200/200"
    }
  ]

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory)

  return (
    <>
      <Hero
        title="Nos Produits"
        subtitle="Une large sélection de collations, boissons et friandises pour satisfaire toutes les envies."
      />

      <Section background="surface-primary">
        <SectionHeader
          title="Catégories de Produits"
          subtitle="Parcourez notre vaste sélection organisée par catégorie."
        />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-secondary text-inverseText'
                  : 'bg-surface-primary text-secondaryText hover:bg-neutral-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </Section>

      <Section background="surface-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Sélection de Produits Personnalisée"
            subtitle="Nous pouvons personnaliser notre offre de produits selon vos préférences et exigences alimentaires."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-primary p-6 rounded-lg">
              <h4 className="font-bold text-primaryText mb-3">Options Santé</h4>
              <p className="text-secondaryText">Collations biologiques, boissons sans sucre et alternatives nutritives.</p>
            </div>
            <div className="bg-surface-primary p-6 rounded-lg">
              <h4 className="font-bold text-primaryText mb-3">Favoris Locaux</h4>
              <p className="text-secondaryText">Marques régionales et spécialités locales que vos employés adoreront.</p>
            </div>
            <div className="bg-surface-primary p-6 rounded-lg">
              <h4 className="font-bold text-primaryText mb-3">Rotation Saisonnière</h4>
              <p className="text-secondaryText">Mises à jour régulières des produits pour garder la sélection fraîche et excitante.</p>
            </div>
          </div>

          <div className="mt-8">
            <Button
              size="lg"
              openContactModal={openModal}
              modalType="quote"
            >
              Demander une Sélection Personnalisée
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}