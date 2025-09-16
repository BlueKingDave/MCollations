"use client"

import React from 'react'
import Card, { CardHeader, CardContent } from '../ui/Card'
import { Truck, Settings, BarChart3 } from 'lucide-react'

type ReasonIconName = string

interface Reason {
  icon: ReasonIconName
  title: string
  problème?: string
  solution?: string
  features?: string[]
}

export default function ReasonCard({ reason }: { reason: Reason }) {
  const iconMap = { Truck, Settings, BarChart3 }
  const IconComponent = iconMap[reason.icon as keyof typeof iconMap]

  return (
    <Card hover className="h-full bg-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            reason.icon === "Lightning" ? "bg-orange-100" :
            reason.icon === "Simple" ? "bg-green-100" :
            reason.icon === "Satisfaction" ? "bg-yellow-100" :
            "bg-primary/25"
          }`}>
            {reason.icon === "Lightning" ? (
              <span className="text-3xl">⚡</span>
            ) : reason.icon === "Simple" ? (
              <span className="text-3xl">🎯</span>
            ) : reason.icon === "Satisfaction" ? (
              <span className="text-3xl">😋</span>
            ) : (
              IconComponent && <IconComponent size={32} className="text-inverseText" />
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-primaryText">{reason.title}</h3>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Problem Section */}
        {reason.problème && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">Votre besoin</h4>
                <p className="text-sm text-red-700">{reason.problème}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Solution Section */}
        {reason.solution && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h4 className="text-sm font-semibold text-green-800 mb-1">Solution</h4>
                <p className="text-sm text-green-700">{reason.solution}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Features */}
        {reason.features && (
          <div className="pt-2">
            <ul className="text-sm text-mutedText space-y-1">
              {reason.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 flex-shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
