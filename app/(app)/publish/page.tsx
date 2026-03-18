"use client"

import { PropertyFormComponent } from "@/components/forms/property-form";
import { useCreateProperty } from "@/hooks/queries";
import { PropertyForm } from "@/types/forms/create-property";
import Link from "next/link"; // Importante para la navegación
import { FileSpreadsheet } from "lucide-react"; // Icono de Excel

export default function CreatePropertyPage() {
    const { mutate: createProperty, isPending } = useCreateProperty();

    const handleCreate = (data: PropertyForm) => {
        const apiPayload = {
            ...data,
            category_id: data.category?.id,
            development_level_id: data.development_level?.id,
            country_id: data.country?.id,
            country_state_id: data.country_state?.id,
            location: data.location_coords 
                ? `POINT(${data.location_coords.longitude} ${data.location_coords.latitude})` 
                : null,
        };
        createProperty(apiPayload);
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Publicar Propiedad</h1>
                    <p className="text-slate-500 text-sm">Completa los datos o usa la carga masiva.</p>
                </div>
                
                {/* Botón de Carga Masiva */}
                <Link 
                    href="/publish/bulk" 
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                >
                    <FileSpreadsheet size={18} />
                    Carga con Excel
                </Link>
            </div>

            <hr className="border-slate-200" />

            <PropertyFormComponent onSubmit={handleCreate} isPending={isPending} />
        </div>
    );
}