'use client';

import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SelectProps {
    label: string;
    options: any[];         // Recibe tus arrays de Category, Country, etc.
    value?: any;            // Aquí llegará el objeto completo desde el Form
    onChange: (value: any) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    renderTrigger?: (selected: any) => React.ReactNode;
    renderItem: (option: any, isSelected: boolean) => React.ReactNode;
    error?: string;
    isHighlighted?: boolean;
    onSearch?: (query: string) => void;
    isSearching?: boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(({ 
    label, options, value, onChange, placeholder, icon, renderTrigger, renderItem, error, isHighlighted,
    onSearch, isSearching 
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [localSearch, setLocalSearch] = useState("");

    React.useImperativeHandle(ref, () => containerRef.current!);

    // Comparamos por ID ya que value ahora es un OBJETO completo
    const selectedOption = options?.find(opt => opt.id === value?.id);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`flex flex-col gap-1.5 w-full relative ${isOpen ? 'z-[100]' : 'z-10'}`} ref={containerRef}>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                {icon && <span className="text-[#1D4ED8]">{icon}</span>}
                {label}
            </label>
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-5 py-3 rounded-2xl text-base flex items-center justify-between border-2 transition-all duration-300 outline-none
                    bg-white
                    ${error 
                        ? "border-red-500 text-red-900 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]" 
                        : (isOpen || isHighlighted
                            ? "border-[#1D4ED8] bg-blue-50/30 text-[#1D4ED8] font-bold shadow-[0_0_0_4px_rgba(29,78,216,0.1)]" 
                            : "border-gray-100 text-gray-800 hover:border-gray-200")
                    }
                `}
            >
                <div className="flex-1 min-w-0 text-left">
                    {renderTrigger ? renderTrigger(selectedOption) : (
                        <span className={`truncate ${selectedOption ? "font-bold text-gray-900" : "text-gray-300"}`}>
                            {selectedOption ? (selectedOption.name || selectedOption.label) : placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown className={`size-5 shrink-0 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1D4ED8]' : 'text-gray-400'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full z-[200] animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl overflow-hidden w-full">
                        
                        {onSearch && (
                            <div className="p-3 border-b border-gray-50">
                                <input 
                                    autoFocus
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Buscar..."
                                    value={localSearch}
                                    onChange={(e) => {
                                        setLocalSearch(e.target.value);
                                        onSearch(e.target.value);
                                    }}
                                />
                            </div>
                        )}

                        <div className="max-h-[250px] overflow-y-auto overflow-x-hidden">
                            {isSearching ? (
                                <div className="p-8 text-center text-[10px] font-bold text-[#1D4ED8] uppercase tracking-widest animate-pulse">
                                    Cargando datos...
                                </div>
                            ) : options?.length > 0 ? (
                                options.map((option) => {
                                    // Comparamos IDs para marcar selección
                                    const isSelected = value?.id === option.id;
                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => { 
                                                onChange(option); // <--- PASAMOS EL OBJETO COMPLETO
                                                setIsOpen(false); 
                                                setLocalSearch("");
                                            }}
                                            className={`
                                                px-5 py-3.5 cursor-pointer flex items-center justify-between transition-colors
                                                ${isSelected ? "bg-blue-50/50 text-[#1D4ED8] font-bold" : "text-gray-700 hover:bg-gray-50"}
                                            `}
                                        >
                                            <div className="flex-1 min-w-0">
                                                {renderItem(option, isSelected)}
                                            </div>
                                            {isSelected && <div className="size-2 rounded-full bg-[#1D4ED8] shrink-0 ml-3" />}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Sin resultados
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-2 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Select.displayName = "Select";