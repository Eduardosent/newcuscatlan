import React, { useEffect, useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { R2_URL } from '@/config'; // Tu URL base de R2

interface ImageUploaderProps {
    label: string;
    name: string;
    form: UseFormReturn<any>;
}

export const ImageUploader = ({ label, name, form }: ImageUploaderProps) => {
    const { setValue, watch, formState: { errors } } = form;
    
    // Ahora images puede ser un array mixto de Files (nuevos) y Strings (existentes)
    const images: (File | string)[] = watch(name) || [];
    const error = errors[name]?.message as string | undefined;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const updated = [...images, ...newFiles];
            setValue(name, updated, { shouldValidate: true });
        }
    };

    const removeFile = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        setValue(name, updated, { shouldValidate: true });
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                {label}
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((item, i) => {
                    const isFile = item instanceof File;
                    // Si es File, creamos un blob local. Si es string, concatenamos con R2_URL
                    const previewUrl = isFile 
                        ? URL.createObjectURL(item) 
                        : `${R2_URL}${item}`;

                    return (
                        <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-gray-100 group shadow-sm bg-gray-50">
                            <img 
                                src={previewUrl} 
                                alt="preview" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                // Importante: Revocar la URL si es un blob para no saturar la memoria
                                onLoad={() => { if (isFile) URL.revokeObjectURL(previewUrl); }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button" 
                                    onClick={() => removeFile(i)} 
                                    className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            
                            {/* Badge opcional para diferenciar nuevas de viejas */}
                            {isFile && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-[8px] text-white px-2 py-1 rounded-full font-bold uppercase tracking-widest">
                                    New
                                </div>
                            )}
                        </div>
                    );
                })}

                <label className={`
                    aspect-square rounded-[2rem] border-2 border-dashed transition-all cursor-pointer 
                    flex flex-col items-center justify-center gap-3 group
                    ${error ? "border-red-500 bg-red-50/10" : "border-gray-200 hover:border-[#1D4ED8] hover:bg-blue-50/30"}
                `}>
                    <div className={`p-3 rounded-full transition-all ${error ? "bg-red-50" : "bg-gray-50 group-hover:bg-blue-100"}`}>
                        <ImageIcon className={`size-6 ${error ? "text-red-500" : "text-gray-400 group-hover:text-[#1D4ED8]"}`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${error ? "text-red-500" : "text-gray-400 group-hover:text-[#1D4ED8]"}`}>
                        Add Photo
                    </span>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                    />
                </label>
            </div>

            {error && (
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-2 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
};