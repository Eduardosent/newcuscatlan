import { useQuery } from '@tanstack/react-query';
import { CategoryRepository } from '@/repositories';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => CategoryRepository.getCategories()
  });
};