import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMachines, getMachineById, createMachine, updateMachine, deleteMachine } from '@/services/industrial';

export function useMachines() {
  return useQuery({
    queryKey: ['industrial', 'machines'],
    queryFn: () => getMachines({}),
  });
}

export function useMachine(id: string) {
  return useQuery({
    queryKey: ['industrial', 'machines', id],
    queryFn: () => getMachineById({ id }),
    enabled: !!id,
  });
}

export function useCreateMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'machines'] });
    },
  });
}

export function useUpdateMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'machines'] });
    },
  });
}

export function useDeleteMachine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industrial', 'machines'] });
    },
  });
}
