"use client"

import React from 'react'
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card'
import { Star } from 'lucide-react'

interface Testimonial {
  rating: number
  content: string
  avatar?: string
  alt?: string
  name: string
  company?: string
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card hover background="surface-secondary" className="h-full">
      <CardHeader>
        <div className="flex">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={16} className="text-warning fill-current" />
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <blockquote className="text-primaryText italic">
          "{testimonial.content}"
        </blockquote>
      </CardContent>
      
      <CardFooter>
        <div className="flex items-center">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.alt || testimonial.name}
            width="40"
            height="40"
            loading="lazy"
            className="mr-3 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-primaryText">{testimonial.name}</div>
            <div className="text-sm text-secondaryText">{testimonial.company}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
