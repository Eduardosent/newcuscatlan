'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  Maximize2, 
  Heart, 
  Edit3, 
  Trash2, 
  ExternalLink,
  LogOut // Importamos el icono de salida
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks'; // Importamos tu hook de auth

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Moderna Residencia en San Benito',
    price: 450000,
    size: 250,
    location: 'San Salvador, ES',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    category: 'House'
  },
  {
    id: '2',
    title: 'Apartamento de Lujo Torre El Pedregal',
    price: 320000,
    size: 145,
    location: 'Antiguo Cuscatlán, ES',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
    category: 'Apartment'
  }
];

export default function MyPropertiesPage() {
  const { signOut } = useAuth(); // Extraemos signOut

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            My Properties
          </h1>
          <p className="text-gray-500 font-medium">Manage and monitor your active listings</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botón de Logout Temporal */}
          <button 
            onClick={() => signOut()}
            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 group"
            title="Sign Out"
          >
            <LogOut className="w-6 h-6" />
          </button>

          <Link 
            href="/publicar" 
            className="bg-[#1D4ED8] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Add New Property
          </Link>
        </div>
      </div>

      {/* Barra de Filtros Rápida */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by title or location..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Grid de Propiedades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PROPERTIES.map((prop) => (
          <div key={prop.id} className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative">
            
            <div className="relative h-64 w-full">
              <img 
                src={prop.image} 
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-blue-600 shadow-sm">
                {prop.category}
              </div>
              
              <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 leading-tight line-clamp-1 flex-1">
                  {prop.title}
                </h3>
                <p className="text-blue-600 font-black text-lg ml-4">
                  ${prop.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center text-gray-400 text-sm mb-4 gap-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {prop.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4" /> {prop.size} m²
                </span>
              </div>

              <hr className="border-gray-50 mb-4" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
                  View Public <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <Link 
          href="/publicar"
          className="border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center p-10 hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
          </div>
          <p className="font-bold text-gray-400 group-hover:text-blue-600 uppercase text-xs tracking-widest">
            Add New Property
          </p>
        </Link>
      </div>
    </div>
  );
}