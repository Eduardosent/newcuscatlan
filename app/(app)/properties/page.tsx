'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PropertyCard, Search, SearchContainer } from '@/components/ui';
import { useCategories, useProperties } from '@/hooks/queries';
import { Property, PropertyFilters } from '@/types/api';

const INITIAL_FILTERS: PropertyFilters = {
  title: '',
  category_id: null,
  minPrice: 0,
  maxPrice: 0,
  minSize: 0,
  maxSize: 0,
};

export default function PropertiesHeader() {
  const t = useTranslations('Landing.Hero');
  const [showFilters, setShowFilters] = useState(false);
  const {data: categories} = useCategories();

  // Estados de filtros
  const [tempFilters, setTempFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [activeFilters, setActiveFilters] = useState<PropertyFilters>(INITIAL_FILTERS);

  const { data, isLoading } = useProperties(activeFilters);
  console.log(data)

  // Funciones de acción
  const handleApplyFilters = () => {
    setActiveFilters(tempFilters);
    // Opcional: cerrar el panel al aplicar en móvil
    // setShowFilters(false); 
  };

  const handleClearFilters = () => {
    setTempFilters(INITIAL_FILTERS);
    setActiveFilters(INITIAL_FILTERS);
  };

  return (
    <div className="w-full space-y-4 mb-8">
      <SearchContainer 
      placeholder="¿Qué propiedad buscas?"
      searchTerm={tempFilters.title}
      onSearchChange={(val) => setTempFilters({...tempFilters, title: val})}
      onExecuteSearch={() => setActiveFilters(tempFilters)}
      onClear={() => {
        setTempFilters(INITIAL_FILTERS);
        setActiveFilters(INITIAL_FILTERS);
      }}
      showFiltersButton={true}
      filtersContent={
        <>
          {/* CATEGORÍAS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
            <select 
              value={tempFilters.category_id || ''}
              onChange={(e) => setTempFilters({ ...tempFilters, category_id: Number(e.target.value) })}
              className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
            >
              <option value="">Todas</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* PRECIOS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precio</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min" 
                onChange={(e) => setTempFilters({...tempFilters, minPrice: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 rounded-xl text-sm" 
              />
              <input 
                type="number" 
                placeholder="Max" 
                onChange={(e) => setTempFilters({...tempFilters, maxPrice: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 rounded-xl text-sm" 
              />
            </div>
          </div>
          {/* Tamaño */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Tamaño (m²)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={tempFilters.minSize || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, minSize: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary-blue transition-all" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={tempFilters.maxSize || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, maxSize: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary-blue transition-all" 
                  />
                </div>
              </div>

          {/* Puedes meter más inputs aquí y el contenedor los acomodará en el grid */}
        </>
      }
      />
      {/* --- RENDERIZADO DE PROPIEDADES --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
          <p className="mt-4 text-gray-400 font-bold uppercase text-xs tracking-widest">Cargando propiedades...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {data?.map((property: Property) => (
            <PropertyCard key={property.id} prop={property} />
          ))}
          
          {data?.length === 0 && (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-100 rounded-[24px]">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No se encontraron propiedades</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}