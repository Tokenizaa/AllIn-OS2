import { z } from 'zod';

export const machineMaintenanceSchema = z.object({
  id: z.string().uuid(),
  maquina_id: z.string().uuid(),
  tipo: z.string(), // preventiva, preditiva, corretiva
  subtipo: z.string().optional(),
  status: z.string().default('scheduled'), // scheduled, in_progress, completed, cancelled
  data_agendada: z.string().or(z.date()),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  duracao_horas_prevista: z.number().optional(),
  duracao_horas_real: z.number().optional(),
  responsavel_id: z.string().uuid().nullable().optional(),
  equipe: z.string().optional(),
  custo_previsto: z.number().optional(),
  custo_real: z.number().optional(),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  pecas_trocadas: z.array(z.any()).optional(),
  prioridade: z.string().default('normal'), // baixa, normal, alta, urgente
  causa_raiz: z.string().optional(),
  acoes_corretivas: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable().optional(),
});

export const createMachineMaintenanceSchema = z.object({
  maquina_id: z.string().uuid(),
  tipo: z.string(),
  subtipo: z.string().optional(),
  status: z.string().default('scheduled'),
  data_agendada: z.string().or(z.date()),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  duracao_horas_prevista: z.number().optional(),
  duracao_horas_real: z.number().optional(),
  responsavel_id: z.string().uuid().nullable().optional(),
  equipe: z.string().optional(),
  custo_previsto: z.number().optional(),
  custo_real: z.number().optional(),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  pecas_trocadas: z.array(z.any()).optional(),
  prioridade: z.string().default('normal'),
  causa_raiz: z.string().optional(),
  acoes_corretivas: z.string().optional(),
});

export const updateMachineMaintenanceSchema = z.object({
  maquina_id: z.string().uuid().optional(),
  tipo: z.string().optional(),
  subtipo: z.string().optional(),
  status: z.string().optional(),
  data_agendada: z.string().or(z.date()).optional(),
  data_inicio: z.string().or(z.date()).optional(),
  data_fim: z.string().or(z.date()).optional(),
  duracao_horas_prevista: z.number().optional(),
  duracao_horas_real: z.number().optional(),
  responsavel_id: z.string().uuid().nullable().optional(),
  equipe: z.string().optional(),
  custo_previsto: z.number().optional(),
  custo_real: z.number().optional(),
  descricao: z.string().optional(),
  observacoes: z.string().optional(),
  pecas_trocadas: z.array(z.any()).optional(),
  prioridade: z.string().optional(),
  causa_raiz: z.string().optional(),
  acoes_corretivas: z.string().optional(),
});

export type MachineMaintenance = z.infer<typeof machineMaintenanceSchema>;
export type CreateMachineMaintenanceDTO = z.infer<typeof createMachineMaintenanceSchema>;
export type UpdateMachineMaintenanceDTO = z.infer<typeof updateMachineMaintenanceSchema>;
export type MachineMaintenanceResponseDTO = MachineMaintenance;
