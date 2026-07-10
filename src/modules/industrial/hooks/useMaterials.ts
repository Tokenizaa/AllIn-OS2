import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } from '@/services/industrial';

export function useMaterials() {
  return useQuery({
    queryKey: ['industrial', 'materials'],
    queryFn: () => getMaterials({}),
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: ['industrial', 'materials', id],
    queryFn: () => getMaterialById({ id }),
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'materials'] });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'materials'] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'materials'] });
    },
  });
}
