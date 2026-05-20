'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PropertyCard, Search, SearchContainer } from '@/components/ui';
import { useCategories, useProperties } from '@/hooks/queries';
import { Property, PropertyFilters } from '@/types/api';

const INITIAL_FILTERS: PropertyFilters = {
  page: 0,
  title: '',
  category_id: null,
  minPrice: 0,
  maxPrice: 0,
  minSize: 0,
  maxSize: 0,
};

export default function PropertiesHeader() {
  const t = useTranslations('Landing.Hero');
  const { data: categories } = useCategories();

  // Estados de filtros
  const [tempFilters, setTempFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [activeFilters, setActiveFilters] = useState<PropertyFilters>(INITIAL_FILTERS);

  const { data, isLoading } = useProperties(activeFilters);

  // --- Lógica de Paginación ---
  const handlePageChange = (newPage: number) => {
    const filtersWithNewPage = { ...activeFilters, page: newPage };
    setTempFilters(filtersWithNewPage);
    setActiveFilters(filtersWithNewPage);
    
    // Scroll suave hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-4 mb-8">
      <SearchContainer 
        placeholder="¿Qué propiedad buscas?"
        searchTerm={tempFilters.title}
        onSearchChange={(val) => setTempFilters({...tempFilters, title: val, page: 0})} // Reset a pág 0 al escribir
        onExecuteSearch={() => setActiveFilters({...tempFilters, page: 0})}
        onClear={() => {
          setTempFilters(INITIAL_FILTERS);
          setActiveFilters(INITIAL_FILTERS);
        }}
        showFiltersButton={true}
        filtersContent={
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
              <select 
                value={tempFilters.category_id || ''}
                onChange={(e) => setTempFilters({ ...tempFilters, category_id: Number(e.target.value), page: 0 })}
                className="w-full p-3 bg-gray-50 rounded-xl text-sm outline-none"
              >
                <option value="">Todas</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {/* ... (resto de tus inputs de precio y tamaño igual) ... */}
          </>
        }
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
          <p className="mt-4 text-gray-400 font-bold uppercase text-xs tracking-widest">Cargando propiedades...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {data?.data?.map((property: Property) => (
              <PropertyCard key={property.id} prop={property} />
            ))}
            
            {data?.data?.length === 0 && (
              <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-100 rounded-[24px]">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No se encontraron propiedades</p>
              </div>
            )}
          </div>

          {/* --- COMPONENTE DE PAGINACIÓN REFINADO --- */}
{data && data.totalPages > 1 && (
  <div className="flex justify-center items-center mt-12 pb-10">
    <nav className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
      {/* Botón Anterior */}
      <button
        onClick={() => handlePageChange(data.currentPage - 1)}
        disabled={data.currentPage === 0}
        className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary-blue disabled:opacity-20 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Números de Página */}
      <div className="flex items-center px-1">
        {[...Array(data.totalPages)].map((_, i) => {
          // Lógica básica para no mostrar 50 botones si hay muchas páginas
          if (
            i === 0 || 
            i === data.totalPages - 1 || 
            (i >= data.currentPage - 1 && i <= data.currentPage + 1)
          ) {
            return (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-bold transition-all ${
                  data.currentPage === i 
                  ? 'bg-primary-blue text-white shadow-md shadow-blue-100' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {i + 1}
              </button>
            );
          }
          
          // Puntos suspensivos opcionales
          if (i === 1 || i === data.totalPages - 2) {
            return <span key={i} className="px-1 text-gray-300">...</span>;
          }
          
          return null;
        })}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={() => handlePageChange(data.currentPage + 1)}
        disabled={data.currentPage >= data.totalPages - 1}
        className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-primary-blue disabled:opacity-20 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  </div>
)}
        </>
      )}
    </div>
  );
}