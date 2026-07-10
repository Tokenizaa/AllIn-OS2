import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLocations, getLocationById, createLocation, updateLocation, deleteLocation } from '@/services/industrial';

export function useLocations() {
  return useQuery({
    queryKey: ['industrial', 'locations'],
    queryFn: () => getLocations({}),
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ['industrial', 'locations', id],
    queryFn: () => getLocationById({ id }),
    enabled: !!id,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'locations'] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'locations'] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'locations'] });
    },
  });
}
