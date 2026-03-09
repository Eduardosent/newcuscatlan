import React, { useMemo } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { REFERENCE_POINTS } from '@/constants';

interface ReferencePoint {
    name: string;
    latitude: number;
    longitude: number;
    category?: string;
}

export function getDistanceInMeters(point1: any, point2: any): number {
    if(!point1 || !point2) return 0;
    const lat1 = parseFloat(point1.latitude);
    const lon1 = parseFloat(point1.longitude);
    const lat2 = parseFloat(point2.latitude);
    const lon2 = parseFloat(point2.longitude);

    if ([lat1, lon1, lat2, lon2].some(val => isNaN(val))) return 0;

    const R = 6371e3; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export const PropertyReferencePoints = ({ location }: { location: any }) => {
    const pointsWithDistance = useMemo(() => {
        if (!location) return [];
        return (REFERENCE_POINTS as ReferencePoint[]).map(point => ({
            ...point,
            distance: getDistanceInMeters(location, point)
        })).sort((a, b) => a.distance - b.distance);
    }, [location]);

    if (pointsWithDistance.length === 0) return null;

    return (
        <section className="w-full mt-6 animate-in fade-in duration-700">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg shadow-md shadow-blue-100">
                    <Navigation className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Análisis de Ubicación
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Distancias calculadas desde la propiedad</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {pointsWithDistance.map((point) => {
                    const isKm = point.distance > 1000;
                    const style = point.distance <= 1000 
                        ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
                        : "text-blue-600 bg-blue-50 border-blue-100";

                    return (
                        <div 
                            key={point.name}
                            className="flex items-center justify-between p-2 pl-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="text-[13px] font-bold text-slate-700 truncate">
                                    {point.name}
                                </span>
                            </div>

                            <div className={`flex items-baseline gap-0.5 px-2.5 py-1 rounded-lg border ${style} flex-shrink-0 ml-2`}>
                                <span className="text-[13px] font-black tabular-nums">
                                    {isKm ? (point.distance / 1000).toFixed(1) : Math.round(point.distance)}
                                </span>
                                <span className="text-[9px] font-bold uppercase opacity-80">
                                    {isKm ? 'km' : 'm'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};