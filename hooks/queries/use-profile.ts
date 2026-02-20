import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileRepository } from '@/repositories';
import { useAuth } from '../use-auth';

export function useProfiles() {
    return useQuery({
        queryKey: ['profiles'],
        queryFn: async () => await ProfileRepository.getProfiles()
    })
}

export function useProfile() {
    const { user } = useAuth()
    return useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            return await ProfileRepository.getProfile(user?.id as string)
        },
        enabled: !!user?.id,
    })
}

export function useUpdateProfileRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await ProfileRepository.updateProfileRole(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
    onError: (error) => {
      console.error('Error al actualizar el rol:', error);
    }
  });
}