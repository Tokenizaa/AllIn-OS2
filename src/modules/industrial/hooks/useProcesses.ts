import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProcesses, getProcessById, createProcess, updateProcess, deleteProcess } from '@/services/industrial';

export function useProcesses() {
  return useQuery({
    queryKey: ['industrial', 'processes'],
    queryFn: () => getProcesses({}),
  });
}

export function useProcess(id: string) {
  return useQuery({
    queryKey: ['industrial', 'processes', id],
    queryFn: () => getProcessById({ id }),
    enabled: !!id,
  });
}

export function useCreateProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'processes'] });
    },
  });
}

export function useUpdateProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'processes'] });
    },
  });
}

export function useDeleteProcess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'processes'] });
    },
  });
}
