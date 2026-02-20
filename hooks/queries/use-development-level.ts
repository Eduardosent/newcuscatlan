import { useQuery } from '@tanstack/react-query';
import { DevelopmentLevelRepository } from '@/repositories';

export const useDevelopmentLevels = () => {
  return useQuery({
    queryKey: ['development-levels'],
    queryFn: async () => DevelopmentLevelRepository.getDevelopmentLevels()
  });
};