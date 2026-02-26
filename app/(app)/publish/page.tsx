"use client"

import { PropertyFormComponent } from "@/components/forms/property-form";
import { useCreateProperty } from "@/hooks/queries";
import { PropertyForm } from "@/types/forms/create-property";

export default function CreatePropertyPage() {
    const { mutate: createProperty, isPending } = useCreateProperty();

    const handleCreate = (data: PropertyForm) => {
        const apiPayload = {
            ...data,
            category_id: data.category?.id,
            development_level_id: data.development_level?.id,
            country_id: data.country?.id,
            country_state_id: data.country_state?.id,
        };
        createProperty(apiPayload);
    };

    return <PropertyFormComponent onSubmit={handleCreate} isPending={isPending} />;
}