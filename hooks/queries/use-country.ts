import { useQuery } from '@tanstack/react-query';
import { CountryRepository } from '@/repositories';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => CountryRepository.getCountries()
  });
};