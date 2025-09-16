"use client"

import React from 'react'
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card'
import Button from '../ui/Button'

interface Machine {
  image?: string
  name: string
  type?: string
  capacity?: number | string
  dimensions?: string
  power?: string
  description?: string
}

export default function VendingMachine({ machine }: { machine: Machine }) {
  return (
    <Card hover className="h-full">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={machine.image || '/api/placeholder/400/300'} 
          alt={machine.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <CardHeader>
        <h3 className="text-xl font-bold text-primaryText">{machine.name}</h3>
        <p className="text-secondaryText">{machine.type}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 text-sm text-secondaryText">
          <div>Capacity: {machine.capacity} items</div>
          <div>Dimensions: {machine.dimensions}</div>
          <div>Power: {machine.power}</div>
        </div>
        <p className="text-primaryText mt-4">{machine.description}</p>
      </CardContent>
      
      <CardFooter>
        <Button variant="primary" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
