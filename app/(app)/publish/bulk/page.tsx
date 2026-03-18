"use client"

import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { 
    FileSpreadsheet, 
    Upload, 
    Info, 
    Loader2, 
    XCircle,
    ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { api } from "@/config"; 
import { BackButton } from "@/components/ui";

// Mapeos obligatorios para evitar errores de tipo Integer en la DB
const CATEGORY_MAP: { [key: string]: number } = {
    "beach": 1,
    "mountain": 2,
    "city": 3,
    "rural": 4,
    "other": 5
};

const DEVELOPMENT_MAP: { [key: string]: number } = {
    "Developed": 1,
    "Undeveloped": 2,
    "Partial": 3
};

const STATE_MAP: { [key: string]: number } = {
    "Ahuachapán": 1, "Cabañas": 2, "Chalatenango": 3, "Cuscatlán": 4, 
    "La Libertad": 5, "La Paz": 6, "La Unión": 7, "Morazán": 8, 
    "San Miguel": 9, "San Salvador": 10, "San Vicente": 11, 
    "Santa Ana": 12, "Sonsonate": 13, "Usulután": 14
};

const PRICING_UNIT_MAP: Record<string, 'total' | 'sq_v' | 'sq_m'> = {
  "Total": "total",
  "Por V2": "sq_v",
  "Por M2": "sq_m",
};

export default function BulkUploadPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [showInstructions, setShowInstructions] = useState(false);

    const cleanNumber = (value: any) => {
        if (value === null || value === undefined || value === "") return null;
        const cleaned = value.toString().replace(/[^0-9.]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                setIsProcessing(true);
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const ws = wb.Sheets[wb.SheetNames[0]];
                
                const dataMatrix = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[];
                // Filtramos filas que tengan al menos un título (columna B / índice 1)
                const rows = dataMatrix.slice(1).filter(row => row[1]);

                if (rows.length === 0) {
                    toast.error("El archivo está vacío o mal formateado");
                    setIsProcessing(false);
                    return;
                }

                setProgress({ current: 0, total: rows.length });

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];

                    // Limpieza y Mapeo de strings a IDs
                    const rawCat = row[6]?.toString().trim();
                    const rawDev = row[7]?.toString().trim();

                    const payload = {
                        title: row[1],                    // B
                        description: row[2],              // C
                        price: cleanNumber(row[3]),       // D
                        size: cleanNumber(row[4]),        // E
                        pricing_unit: PRICING_UNIT_MAP[row[5]?.toString().trim()] || "total",
                        category_id: CATEGORY_MAP[rawCat] || 1, 
                        development_level_id: DEVELOPMENT_MAP[rawDev] || 1,
                        country_id: 1,                    // El Salvador
                        country_state_id: STATE_MAP[row[9]?.toString().trim()] || 1,              // Default
                        phone: `+${row[10]?.toString() || null}`,  // K
                        email: row[11] || null,           // L
                        location: row[12] || null,        // M
                        drive_folder_url: row[13]         // N
                    };

                    try {
                        await api.post("/api/properties/bulk-excel", payload);
                        setProgress(prev => ({ ...prev, current: i + 1 }));
                    } catch (err: any) {
                        const errorMsg = err.response?.data?.error || `Error en fila ${i + 2}`;
                        toast.error(errorMsg);
                    }
                }

                toast.success("Carga masiva finalizada");
            } catch (error) {
                toast.error("Error crítico al procesar el archivo");
            } finally {
                setIsProcessing(false);
                if (e.target) e.target.value = ""; 
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <BackButton />
                <button 
                    onClick={() => setShowInstructions(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full font-medium"
                >
                    <Info size={18} />
                    Mapeo de Datos
                </button>
            </div>

            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-6">
                <FileSpreadsheet size={40} className="mx-auto text-emerald-600" />
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">Carga Masiva</h2>
<p className="text-slate-500 max-w-sm mx-auto">
    Sube tu archivo .xlsx para procesar las propiedades. 
    El tiempo de carga dependerá de la cantidad de imágenes en cada carpeta de Drive.
</p>
                </div>

                <label className="relative inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-500/40">
    <Upload size={20} />
    Seleccionar Excel
    <input 
        type="file" 
        className="hidden" 
        accept=".xlsx" 
        onChange={handleFileUpload} 
        disabled={isProcessing} 
    />
</label>
            </div>

            {showInstructions && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold">Mapeo de Columnas</h3>
                            <button onClick={() => setShowInstructions(false)} className="text-slate-400"><XCircle size={24} /></button>
                        </div>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p className="font-bold text-slate-800">Valores aceptados en Categoría (Columna F):</p>
                            <code className="block bg-slate-50 p-2 rounded">Beach, City, Mountain, Country, Residential</code>
                            <p className="font-bold text-slate-800">Valores aceptados en Desarrollo (Columna G):</p>
                            <code className="block bg-slate-50 p-2 rounded">Developed, In Progress, Raw Land, Under Construction</code>
                        </div>
                        <button onClick={() => setShowInstructions(false)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-semibold">Entendido</button>
                    </div>
                </div>
            )}

            {isProcessing && (
                <div className="fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-[200]">
                    <Loader2 size={80} className="text-emerald-500 animate-spin" strokeWidth={1.5} />
                    <h2 className="text-2xl font-bold text-slate-800 mt-4">{Math.round((progress.current / progress.total) * 100)}%</h2>
                    <p className="text-slate-500 font-medium">Subiendo {progress.current} de {progress.total}</p>
                    <div className="w-72 h-3 bg-slate-100 rounded-full mt-4 overflow-hidden border">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
                    </div>
                </div>
            )}
        </div>
    );
}