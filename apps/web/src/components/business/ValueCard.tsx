"use client"

import React from 'react'
import Card, { CardContent } from '../ui/Card'

interface ValueItem {
  title: string
  description?: string
}

export default function ValueCard({ value }: { value: ValueItem }) {
  return (
    <Card hover background="surface-secondary" className="h-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-primaryText mb-3">{value.title}</h3>
        <p className="text-secondaryText">{value.description}</p>
      </CardContent>
    </Card>
  )
}
