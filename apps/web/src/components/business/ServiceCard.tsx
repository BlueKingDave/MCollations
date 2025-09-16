"use client"

import React from 'react'
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card'
import Button from '../ui/Button'

interface Service {
  title: string
  description?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  features?: string[]
}

export default function ServiceCard({ service }: { service: Service }) {
  const IconComponent = service.icon

  return (
    <Card hover className="h-full text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
            {IconComponent && <IconComponent size={32} className="text-inverseText" />}
          </div>
        </div>
        <h3 className="text-xl font-bold text-primaryText">{service.title}</h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-secondaryText">{service.description}</p>
        
        {service.features && (
          <ul className="text-sm text-mutedText mt-4 space-y-1">
            {service.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
