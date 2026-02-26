import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PropertyRepository } from '@/repositories';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/types/api';
import { PropertyForm } from '@/types/forms/create-property';

export function useProperties(filters: PropertyFilters) {
    return useQuery({
        queryKey: ['properties',filters],
        queryFn: async () => await PropertyRepository.getProperties(filters)
    })
}

export function useProperty(id: string) {
    return useQuery({
        queryKey: ['property', id], // Llave única y limpia
        queryFn: () => PropertyRepository.getPropertyById(id),
        enabled: !!id, // No ejecuta si no hay ID
    });
}

export const useCreateProperty = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: any) => PropertyRepository.createProperty(request),
    onSuccess: () => {
      toast.success('Property Created', {
        description: 'Your property has been created',
      });
      // Invalidate queries to refresh any proposal lists
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      router.push('/properties');
    }, 
    onError: (error: any) => {
        console.log(error)
      toast.error('Submission Failed', {
        description: error.message
      });
    },
  });
};

export const useUpdateProperty = (id: string) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PropertyForm) => PropertyRepository.updateProperty(id, data),
        onSuccess: () => {
            toast.success('Property Updated', {
                description: 'The changes have been saved successfully.',
            });
            // Invalidamos la lista y el detalle específico
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['property', id] });
            router.push('/properties');
        },
        onError: (error: any) => {
            toast.error('Update Failed', { description: error.message });
        },
    });
};

export const useDeleteProperty = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PropertyRepository.deleteProperty(id),
        onSuccess: () => {
            toast.success('Property Deleted', {
                description: 'The property have been deleted successfully.',
            });
            // Invalidamos la lista y el detalle específico
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            router.push('/properties');
        },
        onError: (error: any) => {
            toast.error('Update Failed', { description: error.message });
        },
    });
};