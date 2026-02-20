'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PropertyCard, Search } from '@/components/ui';
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
      
      {/* --- SEARCH BAR --- */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 min-w-0">
        
        <Search 
          placeholder='' 
          onChange={(title) => setTempFilters({ ...tempFilters, title })}
        />

        <div className="flex gap-2 w-full lg:w-auto shrink-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-bold whitespace-nowrap ${
              showFilters ? 'bg-primary-blue text-white border-primary-blue' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtros</span>
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          <button
            onClick={handleApplyFilters}
            className="flex-grow lg:flex-grow-0 px-8 py-2.5 bg-primary-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100/50"
          >
            {t('searchButton')}
          </button>
        </div>
      </div>

      {/* --- PANEL DE FILTROS --- */}
      <div className={`
        grid transition-all duration-300 ease-in-out
        ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}
      `}>
        <div className="overflow-hidden">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Categoría */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoría</label>
                <select 
                  value={tempFilters.category_id || ''}
                  onChange={(e) => setTempFilters({ ...tempFilters, category_id: e.target.value ? Number(e.target.value) : null })}
                  className="w-full p-3 bg-gray-50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary-blue transition-all appearance-none"
                >
                  {
                    categories?.map((c)=>(
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Precio ($)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={tempFilters.minPrice || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, minPrice: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary-blue transition-all" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={tempFilters.maxPrice || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: Number(e.target.value) })}
                    className="w-full p-3 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-primary-blue transition-all" 
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
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-4">
              <button 
                onClick={handleClearFilters}
                className="text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Limpiar
              </button>
              <button 
                onClick={handleApplyFilters}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>

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