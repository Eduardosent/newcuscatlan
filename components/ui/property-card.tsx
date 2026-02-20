import { MapPin, Maximize2 } from 'lucide-react';
import { Property } from '@/types/api';
import { R2_URL } from '@/config';
import Link from 'next/link';

export function PropertyCard({ prop }: { prop: Property }) {
  // Tomamos la primera imagen del array
  const mainImage = `${R2_URL}${prop.image_urls[0]}`;

  return (
    <Link href={`/properties/${prop.id}`}>
    <div className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* Imagen e Indicador de Categoría */}
      <div className="relative h-64 w-full">
        <img 
          src={mainImage} 
          alt={prop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-600 shadow-sm">
          {prop.category?.name}
        </div>
      </div>

      <div className="p-6">
        {/* Título y Precio */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 flex-1">
            {prop.title}
          </h3>
          <p className="text-blue-600 font-black text-lg ml-4">
            ${prop.price.toLocaleString()}
          </p>
        </div>

        {/* Descripción corta (truncada) */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {prop.description}
        </p>

        {/* Ubicación y Tamaño */}
        <div className="flex items-center text-gray-400 text-sm gap-4">
          <span className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-4 h-4 text-blue-400" /> 
            {prop.country_state?.name}, {prop.country?.name}
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <Maximize2 className="w-4 h-4 text-blue-400" /> {prop.size} m²
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
}