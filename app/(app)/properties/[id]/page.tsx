import { supabaseServer } from "@/config/supabase-server";
import { notFound } from "next/navigation";
import { PropertyGallery, ContactActions, CopyLinkButton }from "@/components/app/properties/id";
import { APP_URL } from "@/config";
import { BackButton } from "@/components/ui";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: property, error } = await supabaseServer
    .from("properties")
    .select(`
      *,
      categories(name),
      development_levels(name),
      countries(name),
      country_states(name)
    `)
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(`Hola, me interesa esta propiedad: ${property.title} ${APP_URL}`);
  const cleanPhone = property.phone?.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

  return (
    <main className="max-w-7xl mx-auto px-4">
      <BackButton/>
      <div className="mb-6 flex flex-row items-start justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-500 text-lg">
          {property.country_states?.name}, {property.countries?.name}
        </p>
        </div>
      <CopyLinkButton id={id} />
      </div>

      <section className="mb-10">
        <PropertyGallery media={property.image_urls} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-6 border-b pb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 min-w-[140px]">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Precio</p>
              <p className="text-2xl font-black text-blue-900">${Number(property.price).toLocaleString()}</p>
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
            
            {/* Llamada al componente de cliente con las acciones interactivas */}
            <ContactActions 
              phone={property.phone} 
              email={property.email} 
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
    </main>
  );
}