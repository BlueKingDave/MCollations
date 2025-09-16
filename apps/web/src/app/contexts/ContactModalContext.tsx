"use client"

import React, { createContext, useContext, useState } from 'react'

type ModalType = 'general' | 'quote' | 'contact' | 'faq' | string

interface ContactModalContextValue {
  isOpen: boolean
  modalType: ModalType
  openModal: (type?: ModalType) => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextValue | undefined>(undefined)

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>('general')

  const openModal = (type: ModalType = 'general') => {
    setModalType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const value: ContactModalContextValue = {
    isOpen,
    modalType,
    openModal,
    closeModal,
  }

  return (
    <ContactModalContext.Provider value={value}>{children}</ContactModalContext.Provider>
  )
}

export function useContactModal(): ContactModalContextValue {
  const context = useContext(ContactModalContext)
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactModalProvider')
  }
  return context
}
