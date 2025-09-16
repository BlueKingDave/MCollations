"use client"

import React from 'react'
import Card, { CardContent } from '../ui/Card'

interface TeamMember {
  image: string
  name: string
  role?: string
  bio?: string
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card hover background="surface-secondary" className="h-full text-center">
      <CardContent className="p-6">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-xl font-bold text-primaryText mb-2">{member.name}</h3>
        <p className="text-secondaryText font-semibold mb-3">{member.role}</p>
        <p className="text-secondaryText">{member.bio}</p>
      </CardContent>
    </Card>
  )
}
