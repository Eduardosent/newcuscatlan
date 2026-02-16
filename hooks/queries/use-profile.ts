import { useQuery } from '@tanstack/react-query';
import { ProfileRepository } from '@/repositories';
import { useAuth } from '../use-auth';

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