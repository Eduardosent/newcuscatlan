'use client'

import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, MapPin, Globe, Layers, Tag, DollarSign, Maximize, Phone, Mail, Loader2 } from 'lucide-react';

// Importaciones corregidas según tu estructura de carpetas
import { Input, ImageUploader, Select, Textarea } from '@/components/forms';

// Schema y Hooks de Queries
import { propertySchema, type CreatePropertyForm } from '@/types/forms/create-property';
import { 
    useCategories, 
    useCountries, 
    useCountryStates, 
    useCreateProperty, 
    useDevelopmentLevels 
} from '@/hooks/queries';

export default function CreatePropertyPage() {
    // 1. Inicialización del Formulario
    const form = useForm<CreatePropertyForm>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            size: 0,
            category: null,
            development_level: null,
            country: null,
            country_state: null,
            images: [],
            phone: '',
            email: ''
        }
    });

    const { handleSubmit, control, watch, setValue, formState: { errors } } = form;
    
    const { mutate: createProperty, isPending: pendingCreation } = useCreateProperty();
    // 2. Consumo de Hooks de Datos (Queries)
    const { data: categories = [] } = useCategories();
    const { data: countries = [] } = useCountries();
    const { data: states = [] } = useCountryStates();
    const { data: developmentLevels = [] } = useDevelopmentLevels();

    // 3. Lógica de Filtrado de Estados
    const selectedCountry = watch('country');
    
    const filteredStates = useMemo(() => {
        if (!selectedCountry) return [];
        // Filtramos sobre 'states' (la data del hook) usando el id del objeto seleccionado
        return states.filter(s => s.country_id === selectedCountry.id);
    }, [selectedCountry, states]);

    // 4. Envío y Parsing para la API
    const onSubmit = (data: CreatePropertyForm) => {
        // Transformamos los objetos del formulario a IDs planos para el backend
        const apiPayload = {
            ...data,
            category_id: data.category?.id,
            development_level_id: data.development_level?.id,
            country_id: data.country?.id,
            country_state_id: data.country_state?.id,
            // Las imágenes se suelen manejar por separado en un FormData si van a storage
        };
        
        console.log("Payload listo para la API:", apiPayload);
        createProperty(apiPayload)

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-8 space-y-12">
            
            {/* Sección 1: Información Principal */}
            <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-gray-800 border-b pb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8">
                        <Input 
                            label="Property Title" 
                            {...form.register('title')} 
                            placeholder="Ej. Luxury Villa at the Coast" 
                            error={errors.title?.message} 
                        />
                    </div>
                    <div className="md:col-span-4">
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    label="Category" 
                                    placeholder="Select Category" 
                                    icon={<Tag size={12}/>}
                                    options={categories} 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    error={errors.category?.message}
                                    renderItem={(opt) => <span className="text-sm">{opt.name}</span>}
                                />
                            )}
                        />
                    </div>
                    <div className="md:col-span-12">
                        <Textarea 
                            label="Description" 
                            {...form.register('description')} 
                            rows={4} 
                            placeholder="Describe the property details..." 
                            error={errors.description?.message} 
                        />
                    </div>
                </div>
            </section>

            {/* Sección 2: Especificaciones */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                    label="Price ($)" 
                    type="number" 
                    {...form.register('price')} 
                    icon={<DollarSign size={14}/>} 
                    error={errors.price?.message} 
                />
                <Input 
                    label="Size (m²)" 
                    type="number" 
                    {...form.register('size')} 
                    icon={<Maximize size={14}/>} 
                    error={errors.size?.message} 
                />
                <Controller
                    name="development_level"
                    control={control}
                    render={({ field }) => (
                        <Select 
                            label="Development Level" 
                            placeholder="Select Development Level" 
                            icon={<Layers size={12}/>}
                            options={developmentLevels} 
                            value={field.value} 
                            onChange={field.onChange}
                            error={errors.development_level?.message}
                            renderItem={(opt) => <span className="text-sm">{opt.name}</span>}
                        />
                    )}
                />
            </section>

            {/* Sección 3: Ubicación (Lógica de filtrado aplicada) */}
            <section className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6 border border-gray-100">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Location Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select 
                                label="Country" 
                                placeholder="Select Country" 
                                icon={<Globe size={12}/>}
                                options={countries} 
                                value={field.value} 
                                onChange={(val) => {
                                    field.onChange(val);
                                    setValue('country_state', null); // Reset del estado al cambiar de país
                                }}
                                error={errors.country?.message}
                                renderItem={(opt) => <span className="text-sm font-bold">{opt.name}</span>}
                            />
                        )}
                    />
                    <Controller
                        name="country_state"
                        control={control}
                        render={({ field }) => (
                            <Select 
                                label="State / Province" 
                                placeholder="Select State" 
                                icon={<MapPin size={12}/>}
                                options={filteredStates} 
                                value={field.value} 
                                onChange={field.onChange}
                                placeholder={selectedCountry ? "Select state" : "Select country first"}
                                error={errors.country_state?.message}
                                renderItem={(opt) => <span className="text-sm">{opt.name}</span>}
                            />
                        )}
                    />
                </div>
            </section>

            {/* Sección 4: Media */}
            <ImageUploader 
                label="Property Gallery" 
                name="images" 
                form={form} 
            />

            {/* Sección 5: Contacto */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Contact Phone" 
                    {...form.register('phone')} 
                    icon={<Phone size={14}/>} 
                    placeholder="+1 234 567 890" 
                    error={errors.phone?.message} 
                />
                <Input 
                    label="Contact Email" 
                    {...form.register('email')} 
                    icon={<Mail size={14}/>} 
                    placeholder="owner@example.com" 
                    error={errors.email?.message} 
                />
            </section>

            {/* Botón de Publicación */}
            <div className="flex justify-end pt-8">
                <button 
                    type="submit"
                    disabled={pendingCreation}
                    className="flex items-center gap-3 bg-[#1D4ED8] hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {pendingCreation ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Publish Property
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}