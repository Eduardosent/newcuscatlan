'use client';

import React, { useState, useEffect } from "react";
import { Compass, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

interface LocationValue {
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    label: string;
    value?: LocationValue | null;
    onChange: (value: LocationValue | null) => void;
    error?: string;
    placeholder?: string;
}

export const LocationPicker = React.forwardRef<HTMLDivElement, LocationPickerProps>(({ 
    label, value, onChange, error, placeholder = "Pegar coordenadas o enlace de Maps..." 
}, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [isValid, setIsValid] = useState(false);

    // Sincronizar si vienen datos iniciales (edición)
    useEffect(() => {
        if (value?.latitude && value?.longitude && !inputValue) {
            setInputValue(`${value.latitude}, ${value.longitude}`);
            setIsValid(true);
        }
    }, [value]);

    const extractCoords = (input: string) => {
        const coordRegex = /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/;
        const urlRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = input.match(coordRegex) || input.match(urlRegex);
        
        if (match) {
            return {
                latitude: parseFloat(match[1]),
                longitude: parseFloat(match[2])
            };
        }
        return null;
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputValue(text);

        if (!text) {
            setIsValid(false);
            onChange(null);
            return;
        }

        const coords = extractCoords(text);
        if (coords) {
            setIsValid(true);
            onChange(coords);
            // Limpiamos el input visual para mostrar las coordenadas limpias
            setInputValue(`${coords.latitude}, ${coords.longitude}`);
        } else {
            setIsValid(false);
            // No reseteamos el form aquí para permitir que el usuario termine de escribir
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full" ref={ref}>
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                <Compass size={12} className="text-[#1D4ED8]" />
                {label}
            </label>

            <div className="relative group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleTextChange}
                    placeholder={placeholder}
                    className={`
                        w-full px-5 py-3 rounded-2xl text-base outline-none transition-all duration-300 border-2 bg-white
                        placeholder:text-gray-300 pr-12
                        ${error 
                            ? "border-red-500 text-red-900" 
                            : isValid 
                                ? "border-green-500 bg-green-50/20 text-green-900 font-bold" 
                                : "border-gray-100 text-gray-800 focus:border-[#1D4ED8] focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]"
                        }
                    `}
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isValid ? (
                        <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in" />
                    ) : inputValue && !isValid ? (
                        <AlertCircle size={18} className="text-amber-500 animate-pulse" />
                    ) : (
                        <MapPin size={18} className="text-gray-300 group-focus-within:text-[#1D4ED8] transition-colors" />
                    )}
                </div>
            </div>

            {/* Feedback de Coordenadas Detectadas */}
            {isValid && (
                <div className="flex items-center gap-2 ml-2 mt-1">
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter bg-green-100 px-2 py-0.5 rounded-md">
                        Ubicación Lista para SQL
                    </span>
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

LocationPicker.displayName = 'LocationPicker';