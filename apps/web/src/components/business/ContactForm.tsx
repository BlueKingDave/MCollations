"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import Button from '../ui/Button'
import { useContactModal } from '../../app/contexts/ContactModalContext'

type ModalType = 'general' | 'quote' | 'contact' | 'faq' | string

interface FormValues {
  name: string
  email: string
  company?: string
  phone?: string
  businessType?: 'arena' | 'ecole' | 'entreprise' | 'autre' | 'general'
  employeesCount?: number
  establishmentDetails?: string
  message: string
}

export default function ContactForm({ modalType: propModalType }: { modalType?: ModalType }) {
  const { modalType: contextModalType, closeModal } = useContactModal()
  const modalType = propModalType || contextModalType
  const [submitStatus, setSubmitStatus] = useState<null | 'sending' | 'success' | 'error'>(null) // null, 'sending', 'success', 'error'
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({ shouldUnregister: true }) // 👈 champs cachés non soumis

  const businessType = watch('businessType', 'general') // default: Entreprise

  const formContent = {
    general: {
      title: 'Contactez-nous',
      subtitle: 'Envoyez-nous un message et nous vous répondrons rapidement.',
      submitText: 'Envoyer le message'
    },
    quote: {
      title: 'Demander un devis',
      subtitle: 'Obtenez une soumission personnalisée pour vos besoins.',
      submitText: 'Demander un devis'
    },
    contact: {
      title: 'Obtenir une soumission',
      subtitle: 'Parlons de votre projet de distributeurs automatiques.',
      submitText: 'Obtenir une soumission'
    },
    faq: {
      title: 'Posez votre question',
      subtitle: 'Vous ne trouvez pas la réponse que vous cherchez ? Posez-nous directement votre question.',
      submitText: 'Envoyer le message'
    }
  }

  const currentContent = (formContent as Record<string, typeof formContent.general>)[modalType as string] || formContent.general

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('sending')
    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        company: data.company,
        phone: data.phone,
        business_type: data.businessType, // ← ton select (Entreprise/École/Aréna/Autre)
        employees_count: data.employeesCount, // ← conditionnel (Entreprise)
        establishment_details: data.establishmentDetails, // ← conditionnel (Autre)
        message: data.message,
        form_type: modalType,
        to_email: 'etienne@mcollations.ca'
      }

      await emailjs.send(
        'service_0noxpfi',
        'template_f7j3tr5',
        templateParams,
        '-Z-pnB8iWBhO0ixw9'
      )

      setSubmitStatus('success')
      reset()
      setTimeout(() => { closeModal(); setSubmitStatus(null) }, 2000)
      
    } catch (error) {
      console.error('Email send failed:', error)
      setSubmitStatus('error')
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primaryText mb-2">Message envoyé !</h3>
        <p className="text-secondaryText">Nous vous contacterons dans les 24 heures.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primaryText mb-2">{currentContent.title}</h2>
        <p className="text-secondaryText">{currentContent.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primaryText mb-1">Nom complet *</label>
          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'Le nom est requis',
              minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Votre nom complet"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Courriel */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primaryText mb-1">Adresse courriel *</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: "L'adresse courriel est requise",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Adresse courriel invalide' }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="votre@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Établissement */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-primaryText mb-1">Établissement</label>
          <input
            type="text"
            id="company"
            {...register('company')}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nom de votre établissement"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primaryText mb-1">Téléphone</label>
          <input
            type="tel"
            id="phone"
            {...register('phone', {
              pattern: { value: /^[\+]?[1-9][\d]{0,15}$/, message: 'Numéro de téléphone invalide' }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(418) 555-1234"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        {/* Type d'établissement */}
        <div>
          <label htmlFor="businessType" className="block text-sm font-medium text-primaryText mb-1">Type d’établissement</label>
          <select
            id="businessType"
            {...register('businessType')}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            defaultValue="general"
          >
            
            
            <option value="arena">Aréna</option>
            <option value="ecole">École</option>
            <option value="entreprise">Entreprise</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* 🔽 Champs conditionnels */}
        {businessType === 'entreprise' && (
          <div>
            <label htmlFor="employeesCount" className="block text-sm font-medium text-primaryText mb-1">
              Nombre d’employés *
            </label>
            <input
              type="number"
              id="employeesCount"
              min={1}
              {...register('employeesCount', {
                required: 'Indiquez le nombre d’employés',
                valueAsNumber: true,
                min: { value: 1, message: 'Doit être ≥ 1' }
              })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex. 75"
            />
            {errors.employeesCount && <p className="mt-1 text-sm text-red-600">{errors.employeesCount.message}</p>}
          </div>
        )}

        {businessType === 'autre' && (
          <div>
            <label htmlFor="establishmentDetails" className="block text-sm font-medium text-primaryText mb-1">
              Spécification de l’établissement *
            </label>
            <input
              type="text"
              id="establishmentDetails"
              {...register('establishmentDetails', {
                required: 'Précisez le type (ex. centre communautaire, clinique, résidence, etc.)',
                minLength: { value: 3, message: 'Trop court' }
              })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex. centre communautaire, clinique, résidence, etc."
            />
            {errors.establishmentDetails && <p className="mt-1 text-sm text-red-600">{errors.establishmentDetails.message}</p>}
          </div>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-primaryText mb-1">Message *</label>
          <textarea
            id="message"
            rows={4}
            {...register('message', {
              required: 'Le message est requis',
              minLength: { value: 10, message: 'Le message doit contenir au moins 10 caractères' }
            })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Décrivez-nous vos besoins..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitStatus === 'sending'}
            disabled={submitStatus === 'sending'}
            className="flex-1"
          >
            {submitStatus === 'sending' ? 'Envoi...' : currentContent.submitText}
          </Button>
        </div>

        {submitStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              Erreur lors de l’envoi. Veuillez réessayer ou nous contacter directement.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
