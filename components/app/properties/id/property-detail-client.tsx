"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PropertyGallery, ContactActions, CopyLinkButton, PropertyAdminActions, MortgageCalculator, PropertyReferencePoints } from "@/components/app/properties/id";
import { APP_URL } from "@/config";
import { BackButton } from "@/components/ui";
import { useProfile, useProperty } from "@/hooks/queries";
import { useAuth } from "@/hooks";
import { parseEWKB } from "@/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export function verifyDistance(point1: any, point2: any): number {
  if(!point1 || !point2) {
    console.error("Error: Uno de los puntos es nulo o indefinido", {point1, point2});
    return 0;
  }
    // 1. Forzamos conversión a Float por si vienen como strings
    const lat1 = parseFloat(point1.latitude);
    const lon1 = parseFloat(point1.longitude);
    const lat2 = parseFloat(point2.latitude);
    const lon2 = parseFloat(point2.longitude);

    // 2. Verificación de seguridad inmediata
    if ([lat1, lon1, lat2, lon2].some(val => isNaN(val))) {
        console.error("Error: Uno de los valores no es un número válido", {lat1, lon1, lat2, lon2});
        return 0;
    }

    const R = 6371e3; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log(`Cálculo exitoso: ${distance.toFixed(2)} metros`);
    return distance;
}

// PRUEBA DE FUEGO (Copia esto también para ver el log)
const myLocation = { longitude: -89.0556, latitude: 13.4444 };
const target = { latitude: 13.4409, longitude: -89.0556 }; // Un punto de ejemplo

// verifyDistance(myLocation, target);

export function PropertyDetailClient({ params }: Props) {
  const { id } = use(params);
  const { data: property, isLoading } = useProperty(id);
  const { user } = useAuth()
  const { data: profile } = useProfile(); 
  const propertyLocation = property?.location !=null ? parseEWKB (property.location) : null;
  console.log("Coordenadas parseadas:", propertyLocation);
  verifyDistance(myLocation, target);

  // --- SKELETON: MISMO DISEÑO, DIFERENTE CONTENIDO ---
  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="mb-6 flex flex-row items-start justify-between">
          <div className="space-y-3">
            <div className="h-9 w-64 bg-gray-200 rounded-md" />
            <div className="h-6 w-48 bg-gray-200 rounded-md" />
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
        </div>
        <div className="mb-10 h-[400px] w-full bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-6 border-b pb-6">
              <div className="h-20 w-[140px] bg-gray-100 rounded-xl" />
              <div className="h-20 w-[140px] bg-gray-100 rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-2/3 bg-gray-100 rounded" />
            </div>
          </div>
          <aside className="lg:col-span-1">
            <div className="h-64 w-full bg-gray-50 rounded-3xl border border-gray-100" />
          </aside>
        </div>
      </main>
    );
  }

  if (!property) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(`Hola, me interesa esta propiedad: ${property.title} ${APP_URL}/properties/${id}`);
  const cleanPhone = property.phone?.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <main className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center">
        <BackButton />
{profile?.role === "admin" || (profile?.role === "publisher" && user?.id === property.user_id) ? (
  <PropertyAdminActions id={id} title={property.title} />
) : null}
      </div>
      <div className="mb-6 flex flex-row items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-500 text-lg">
            {property.country_state?.name}, {property.country?.name}
          </p>
        </div>
        <CopyLinkButton id={id} />
      </div>

      <section className="mb-10">
        <PropertyGallery media={property.image_urls} />
      </section>
            <PropertyReferencePoints location={propertyLocation} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-6 border-b pb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 min-w-[140px]">
      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
        {property.pricing_unit === "sq_v" 
          ? "Precio por V²" 
          : property.pricing_unit === "sq_m" 
            ? "Precio por M²" 
            : "Precio Total"}
      </p>
      <p className="text-2xl font-black text-blue-900">
        ${Number(property.price).toLocaleString()}
        {property.pricing_unit === "sq_v" && <span className="text-sm font-bold ml-1">/ v²</span>}
        {property.pricing_unit === "sq_m" && <span className="text-sm font-bold ml-1">/ m²</span>}
      </p>
    </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 min-w-[140px]">
              <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Tamaño</p>
              <p className="text-2xl font-black text-green-900">{property.size} m²</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-pretty">Descripción de la propiedad</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {property.description}
            </p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 p-8 border border-gray-200 rounded-3xl shadow-xl bg-white">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 tracking-tight">¿Te interesa la propiedad?</h3>
            
            <ContactActions 
              phone={property.phone ?? undefined} 
              email={property.email ?? undefined} 
              whatsappUrl={whatsappUrl} 
            />

            <div className="mt-8 pt-2 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-medium">
                Publicado el {new Date(property.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </aside>
      </div>
      <MortgageCalculator initialPrice={Number(property.price)} />
    </main>
  );
}