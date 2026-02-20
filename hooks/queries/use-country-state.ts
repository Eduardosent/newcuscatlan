import { useQuery } from '@tanstack/react-query';
import { CountryStateRepository } from '@/repositories';

export const useCountryStates = () => {
  return useQuery({
    queryKey: ['country-states'],
    queryFn: async () => CountryStateRepository.getCountryStates()
  });
};