'use client';

import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
    placeholder: string;
    onChange: (value:string)=>void;
}

export const Search = ({ placeholder, onChange }: SearchProps) => {
  return (
    <div className="relative flex-grow w-full min-w-0">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="text" 
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-blue/10 transition-all outline-none"
      />
    </div>
  );
};