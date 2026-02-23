'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchContainerProps {
  placeholder: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExecuteSearch: () => void;
  onClear?: () => void;
  // Slots para inyectar cualquier filtro
  filtersContent?: React.ReactNode; 
  showFiltersButton?: boolean;
}

export const SearchContainer = ({
  placeholder,
  searchTerm,
  onSearchChange,
  onExecuteSearch,
  onClear,
  filtersContent,
  showFiltersButton = false
}: SearchContainerProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* --- BARRA PRINCIPAL --- */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 min-w-0">
        
        {/* Input de búsqueda genérico */}
        <div className="relative flex-grow w-full min-w-0">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-blue/10 transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto shrink-0">
          {/* Botón de Filtros opcional */}
          {showFiltersButton && filtersContent && (
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
          )}
          
          {/* Botón de acción principal */}
          <button
            onClick={onExecuteSearch}
            className="flex-grow lg:flex-grow-0 px-8 py-2.5 bg-primary-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100/50"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* --- PANEL DESPLEGABLE DE FILTROS --- */}
      {showFiltersButton && filtersContent && (
        <div className={`grid transition-all duration-300 ease-in-out ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
          <div className="overflow-hidden">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-100/40 mt-2">
              
              {/* Aquí se inyectan los inputs que quieras */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtersContent}
              </div>

              {/* Acciones del panel de filtros */}
              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-4">
                {onClear && (
                  <button 
                    onClick={onClear}
                    className="text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                  >
                    Limpiar
                  </button>
                )}
                <button 
                  onClick={() => {
                    onExecuteSearch();
                    // setShowFilters(false); // Opcional
                  }}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};