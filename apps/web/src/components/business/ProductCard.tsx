"use client"

import React from 'react'
import Card, { CardHeader, CardContent } from '../ui/Card'

interface Product {
  image?: string
  name: string
  price: number | string
  description?: string
  category?: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card hover className="h-full">
      <div className="aspect-w-1 aspect-h-1">
        <img 
          src={product.image || '/api/placeholder/200/200'} 
          alt={product.name}
          className="w-full h-32 object-cover"
        />
      </div>
      
      <CardHeader>
        <h3 className="text-lg font-semibold text-primaryText">{product.name}</h3>
        <p className="text-secondaryText font-bold">${product.price}</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-secondaryText text-sm">{product.description}</p>
        <div className="flex items-center mt-2">
          <span className="text-xs bg-features px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
