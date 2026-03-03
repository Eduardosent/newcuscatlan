// app/(app)/properties/[id]/page.tsx
import { Metadata } from 'next';
import { PropertyDetailClient } from '@/components/app/properties/id/property-detail-client';
import { PropertyRepository } from "@/repositories"; // Importación de tu repositorio real
import { APP_URL } from "@/config";

interface Props {
  params: Promise<{ id: string }>;
}

// 1. FUNCIÓN PARA METADATOS (Lado del Servidor - SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    // USAMOS TU REPOSITORIO DIRECTAMENTE
    const property = await PropertyRepository.getPropertyById(id);

    if (!property) {
      return { title: "Propiedad no encontrada | NewCuscatlan.com" };
    }

    const title = `${property.title} | NewCuscatlan.com`;
    const description = property.description?.substring(0, 160) || "Encuentra tu próximo hogar";
    const image = property.image_urls?.[0] || "/nc-logo.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${APP_URL}/properties/${id}`,
        type: "website",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Error cargando metadata:", error);
    return { title: "NewCuscatlan.com" };
  }
}

// 2. COMPONENTE DE PÁGINA (Server Component)
export default async function Page({ params }: Props) {
  // Simplemente pasamos los params al cliente. 
  // Allá tu hook useProperty(id) se encargará de la UI y el cache.
  return <PropertyDetailClient params={params} />;
}