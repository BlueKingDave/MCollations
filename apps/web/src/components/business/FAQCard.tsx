"use client"

import React, { useState } from 'react'
import Card, { CardHeader, CardContent } from '../ui/Card'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function FAQCard({ faq }: { faq: FAQItem }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card hover background="surface-primary" className="transition-all duration-300">
      <CardHeader>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <h4 className="font-bold text-primaryText group-hover:text-secondaryText transition-colors">
            {faq.question}
          </h4>
          <ChevronDown 
            size={20} 
            className={`text-secondaryText transition-transform duration-300 flex-shrink-0 ml-4 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </CardHeader>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <CardContent>
          <p className="text-primaryText leading-relaxed">{faq.answer}</p>
        </CardContent>
      </div>
    </Card>
  )
}
