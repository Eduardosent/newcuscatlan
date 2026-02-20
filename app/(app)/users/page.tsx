'use client';

import React, { useState } from 'react';
import { User, Mail, ShieldCheck, ArrowLeftRight, Loader2 } from 'lucide-react';
import { Search } from '@/components/ui';
import { useProfiles, useUpdateProfileRole } from '@/hooks/queries';

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: profiles} = useProfiles()
  const { mutate: toggleRole, isPending } = useUpdateProfileRole();

  // Simulación de datos (Sustituir por fetch real de Supabase)
//   const [profiles, setProfiles] = useState<Profile[]>([
//     { uid: '1', role: 'admin', full_name: 'Admin Sistema', avatar_url: null, email: 'admin@newcuscatlan.com' },
//     { uid: '2', role: 'client', full_name: 'Juan Pérez', avatar_url: null, email: 'juan.perez@email.com' },
//     { uid: '3', role: 'publisher', full_name: 'Inmobiliaria Cuscatlán', avatar_url: null, email: 'ventas@propiedades.com' },
//   ]);

  const handleToggleRole = (uid: string, currentRole: 'client' | 'publisher') => {
    const newRole = currentRole === 'client' ? 'publisher' : 'client';
    
    // Actualización optimista en el estado
    // setProfiles(prev => prev.map(p => 
    //   p.uid === uid ? { ...p, role: newRole } : p
    // ));

    // Aquí llamarías a tu cliente de Supabase:
    // await supabase.from('profiles').update({ role: newRole }).eq('uid', uid);
  };

//   const filtered = profiles.filter(p => 
//     p.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

  return (
    <div className="w-full space-y-6">
      {/* --- HEADER & SEARCH --- */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Gestión de Usuarios</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cambiar roles entre clientes y publishers</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <Search 
            placeholder="Buscar por email o nombre..." 
            onChange={(val) => setSearchTerm(val)} 
          />
          <button className="px-8 py-2.5 bg-primary-blue text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100/50">
            Buscar
          </button>
        </div>
      </div>

      {/* --- TABLA DE USUARIOS --- */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Usuario</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Rol</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {profiles?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar/Foto */}
                      <div className="w-12 h-12 rounded-2xl bg-primary-blue/5 border border-primary-blue/10 flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="text-primary-blue" size={20} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                          {user.full_name || 'Sin nombre'}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={12} className="opacity-50" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'publisher' ? 'bg-blue-100 text-primary-blue' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <ShieldCheck size={12} />
                      {user.role}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    {user.role !== 'admin' && (
                      <button 
  onClick={() => toggleRole(user.id)}
  disabled={isPending}
  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-blue transition-all disabled:opacity-50"
>
  {isPending ? (
    <Loader2 className="animate-spin" size={14} />
  ) : (
    <ArrowLeftRight size={14} />
  )}
  Cambiar Rol
</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}