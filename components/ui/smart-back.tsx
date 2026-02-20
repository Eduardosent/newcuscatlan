'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface SmartBackProps {
    children: React.ReactNode
    fallback?: string
    className?: string
}

export const SmartBack = ({ 
    children, 
    fallback = '/properties', 
    className = "" 
}: SmartBackProps) => {
    const router = useRouter()

    const handleBack = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back()
        } else {
            router.push(fallback)
        }
    }

    return (
        <div 
            onClick={handleBack}
            className={`inline-flex items-center cursor-pointer w-fit h-fit ${className}`}
            style={{ 
                display: 'inline-flex',
                maxWidth: 'max-content'
            }}
        >
            {children}
        </div>
    )
}

interface BackButtonProps {
    label?: string
    variant?: 'default' | 'ghost'
}

export const BackButton = ({ label = "Volver", variant = 'default' }: BackButtonProps) => {
    return (
        <SmartBack className="group mb-6">
            <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200
                ${variant === 'default' 
                    ? 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 text-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
            `}>
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-bold tracking-tight">{label}</span>
            </div>
        </SmartBack>
    )
}