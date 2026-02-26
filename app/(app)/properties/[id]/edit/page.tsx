'use client'

import { useParams, useRouter } from "next/navigation";
import { PropertyFormComponent } from "@/components/forms/property-form";
import { useProperty, useUpdateProperty } from "@/hooks/queries";
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { PropertyForm } from "@/types/forms/create-property"; // Tu tipo de Zod

export default function EditPropertyPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    
    const { data: property, isLoading, isError } = useProperty(id);
    const { mutate: updateProperty, isPending: isUpdating } = useUpdateProperty(id);

    // MAPPER: Transformamos la data de la API al formato que Zod entiende
    const formatInitialData = (data: any): PropertyForm => {
        return {
            title: data.title || '',
            description: data.description || '',
            price: data.price || 0,
            size: data.size || 0,
            category: data.category || null,
            development_level: data.development_level || null,
            country: data.country || null,
            country_state: data.country_state 
    ? { ...data.country_state, country_id: data.country_id || data.country?.id } 
    : null,
            // Importante: image_urls (DB) -> images (Zod)
            images: data.image_urls || [],
            phone: data.phone || '',
            email: data.email || ''
        };
    };

    if (isLoading) return (
        <div className="flex h-[70vh] items-center justify-center italic text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Loading listing...
        </div>
    );

    if (isError || !property) return (
        <div className="h-[70vh] flex flex-col items-center justify-center">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <h2 className="font-black uppercase tracking-tighter text-xl">Property not found</h2>
        </div>
    );

    return (
        <main className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-8 mb-10">
                <button onClick={() => router.back()} className="mb-4 text-gray-400 hover:text-black flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft size={14}/> Back
                </button>
                <h1 className="text-5xl font-black uppercase tracking-tighter">Edit Property</h1>
            </div>

            <PropertyFormComponent 
                // Pasamos la data ya mapeada para que el resolver de Zod no chille
                initialData={formatInitialData(property)} 
                onSubmit={(data) => updateProperty(data)} 
                isPending={isUpdating}
                buttonText="Save Changes" 
            />
        </main>
    );
}