import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PropertyRepository } from '@/repositories';
// import { Proposal } from '@/types/forms/create-proposal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/types/api';

export function useProperties(filters: PropertyFilters) {
    return useQuery({
        queryKey: ['properties',filters],
        queryFn: async () => await PropertyRepository.getProperties(filters)
    })
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