import { supabase } from '@/lib/supabase/client';

export interface Location {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface Machine {
  id: string;
  nome: string;
  codigo: string;
  fabricante?: string;
  modelo?: string;
  numero_serie?: string;
  data_aquisicao?: string;
  valor_aquisicao?: number;
  localizacao_id?: string;
  localizacao_detalhe?: string;
  status?: string;
  capacidade_horaria?: number;
  capacidade_teorica?: number;
  capacidade_operacional?: number;
  disponibilidade_percentual?: number;
  data_fim_vida_util?: string;
  deprecacao_anual_percentual?: number;
  horas_operacao_total?: number;
  horas_manutencao_total?: number;
  ultima_manutencao_preventiva?: string;
  proxima_manutencao_preventiva?: string;
  tipo_manutencao?: string;
  frequencia_manutencao_horas?: number;
  criticalidade?: string;
  especificacoes?: any;
  observacoes?: string;
  anexos?: any[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Material {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  razao_social: string;
  cnpj?: string;
  contato?: string;
  created_at: string;
  updated_at: string;
}

export interface Process {
  id: string;
  nome: string;
  descricao?: string;
  tipo_processo?: string;
  sequencia?: number;
  entradas?: any[];
  saidas?: any[];
  maquinas?: any[];
  responsaveis?: any[];
  tempo_padrao_minutos?: number;
  capacidade_unidades_hora?: number;
  perda_prevista_percentual?: number;
  setup_time_minutos?: number;
  lote_minimo?: number;
  lote_maximo?: number;
  tempo_padrao_unidade_segundos?: number;
  eficiencia_padrao?: number;
  status?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface TimingRecord {
  id: string;
  processo_id?: string;
  maquina_id?: string;
  operador_id?: string;
  inicio: string;
  fim?: string;
  duracao_segundos?: number;
  data_hora_inicio?: string;
  data_hora_fim?: string;
  numero_medicao?: number;
  produto_id?: string;
  quantidade_produzida?: number;
  condicoes_ambiente?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface TimingMeasurement {
  id: string;
  timing_record_id: string;
  numero_medicao: number;
  duracao_segundos: number;
  maquina_id?: string;
  processo_id?: string;
  operador_id?: string;
  condicoes_ambiente?: string;
  temperatura_ambiente?: number;
  umidade_percentual?: number;
  observacoes?: string;
  status?: string;
  tags?: any[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Capacity {
  id: string;
  maquina_id: string;
  processo_id?: string;
  setor_id?: string;
  capacidade_teorica?: number;
  capacidade_observada?: number;
  unidade_medida?: string;
  tipo_capacidade?: string;
  periodo?: string;
  data_inicio?: string;
  data_fim?: string;
  capacidade_utilizada?: number;
  capacidade_disponivel?: number;
  eficiencia_percentual?: number;
  turno?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CapacityHistory {
  id: string;
  capacity_id: string;
  data_registro: string;
  periodo: string;
  capacidade_planejada?: number;
  capacidade_realizada?: number;
  capacidade_utilizada?: number;
  capacidade_disponivel?: number;
  eficiencia_percentual?: number;
  maquina_id?: string;
  processo_id?: string;
  setor_id?: string;
  observacoes?: string;
  tags?: any[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Tool {
  id: string;
  descricao: string;
  tipo?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductIndustrial {
  id: string;
  modelo: string;
  descricao?: string;
  categoria?: string;
  subcategoria?: string;
  linha?: string;
  colecao?: string;
  largura_cm?: number;
  comprimento_cm?: number;
  altura_cm?: number;
  densidade_kg_m3?: number;
  composicao?: string;
  tipo_espuma?: string;
  numero_camadas?: number;
  firmeza?: string;
  garantia_meses?: number;
  peso_kg?: number;
  especificacoes?: any;
  observacoes?: string;
  observacoes_tecnicas?: string;
  normas_tecnicas?: string;
  certificacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Component {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface BOM {
  id: string;
  produto_id: string;
  componente_id: string;
  quantidade: number;
  unidade_medida?: string;
  sequencia?: number;
  consumo_por_unidade?: number;
  perdas_previstas_percentual?: number;
  revisao?: string;
  versao?: string;
  vigencia_inicio?: string;
  vigencia_fim?: string;
  status_vigencia?: string;
  custo_unitario?: number;
  custo_total?: number;
  observacoes?: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  created_at: string;
  updated_at: string;
}

export interface MachineMaintenance {
  id: string;
  maquina_id: string;
  tipo: string;
  subtipo?: string;
  status: string;
  data_agendada: string;
  data_inicio?: string;
  data_fim?: string;
  duracao_horas_prevista?: number;
  duracao_horas_real?: number;
  responsavel_id?: string;
  equipe?: string;
  custo_previsto?: number;
  custo_real?: number;
  descricao?: string;
  observacoes?: string;
  pecas_trocadas?: any[];
  prioridade?: string;
  causa_raiz?: string;
  acoes_corretivas?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MachineDocument {
  id: string;
  maquina_id: string;
  tipo: string;
  titulo: string;
  descricao?: string;
  nome_arquivo?: string;
  url_arquivo?: string;
  tamanho_bytes?: bigint;
  tipo_mime?: string;
  versao?: string;
  data_documento?: string;
  categoria?: string;
  confidencialidade?: string;
  idioma?: string;
  tags?: any[];
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface MachinePhoto {
  id: string;
  maquina_id: string;
  titulo?: string;
  descricao?: string;
  url_foto: string;
  url_thumbnail?: string;
  largura?: number;
  altura?: number;
  tamanho_bytes?: bigint;
  tipo_mime?: string;
  categoria?: string;
  ordem?: number;
  data_foto?: string;
  local_foto?: string;
  tags?: any[];
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ProcessStep {
  id: string;
  processo_id: string;
  nome: string;
  descricao?: string;
  sequencia: number;
  entradas?: any[];
  saidas?: any[];
  maquinas?: any[];
  responsaveis?: any[];
  tempo_padrao_minutos?: number;
  tempo_padrao_unidade_segundos?: number;
  capacidade_unidades_hora?: number;
  perda_prevista_percentual?: number;
  status?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ProcessDocument {
  id: string;
  processo_id: string;
  tipo: string;
  titulo: string;
  descricao?: string;
  nome_arquivo?: string;
  url_arquivo?: string;
  tamanho_bytes?: bigint;
  tipo_mime?: string;
  versao?: string;
  data_documento?: string;
  categoria?: string;
  confidencialidade?: string;
  idioma?: string;
  tags?: any[];
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export const industrialService = {
  async getLocations() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getLocationById(id: string) {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createLocation(location: Partial<Location>) {
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateLocation(id: string, location: Partial<Location>) {
    const { data, error } = await supabase
      .from('locations')
      .update(location)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteLocation(id: string) {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getMachines() {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachineById(id: string) {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createMachine(machine: Partial<Machine>) {
    const { data, error } = await supabase
      .from('machines')
      .insert(machine)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateMachine(id: string, machine: Partial<Machine>) {
    const { data, error } = await supabase
      .from('machines')
      .update(machine)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteMachine(id: string) {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getMaterials() {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMaterialById(id: string) {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createMaterial(material: Partial<Material>) {
    const { data, error } = await supabase
      .from('materials')
      .insert(material)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateMaterial(id: string, material: Partial<Material>) {
    const { data, error } = await supabase
      .from('materials')
      .update(material)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteMaterial(id: string) {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getSupplierById(id: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createSupplier(supplier: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateSupplier(id: string, supplier: Partial<Supplier>) {
    const { data, error } = await supabase
      .from('suppliers')
      .update(supplier)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteSupplier(id: string) {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getProcesses() {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getProcessById(id: string) {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createProcess(process: Partial<Process>) {
    const { data, error } = await supabase
      .from('processes')
      .insert(process)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateProcess(id: string, process: Partial<Process>) {
    const { data, error } = await supabase
      .from('processes')
      .update(process)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteProcess(id: string) {
    const { error } = await supabase
      .from('processes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getTimingRecords() {
    const { data, error } = await supabase
      .from('timing_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getTimingRecordById(id: string) {
    const { data, error } = await supabase
      .from('timing_records')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createTimingRecord(timing: Partial<TimingRecord>) {
    const { data, error } = await supabase
      .from('timing_records')
      .insert(timing)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateTimingRecord(id: string, timing: Partial<TimingRecord>) {
    const { data, error } = await supabase
      .from('timing_records')
      .update(timing)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteTimingRecord(id: string) {
    const { error } = await supabase
      .from('timing_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getCapacities() {
    const { data, error } = await supabase
      .from('capacities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getCapacityById(id: string) {
    const { data, error } = await supabase
      .from('capacities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createCapacity(capacity: Partial<Capacity>) {
    const { data, error } = await supabase
      .from('capacities')
      .insert(capacity)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateCapacity(id: string, capacity: Partial<Capacity>) {
    const { data, error } = await supabase
      .from('capacities')
      .update(capacity)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteCapacity(id: string) {
    const { error } = await supabase
      .from('capacities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getTools() {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getToolById(id: string) {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createTool(tool: Partial<Tool>) {
    const { data, error } = await supabase
      .from('tools')
      .insert(tool)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateTool(id: string, tool: Partial<Tool>) {
    const { data, error } = await supabase
      .from('tools')
      .update(tool)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteTool(id: string) {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getProductsIndustrial() {
    const { data, error } = await supabase
      .from('products_industrial')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getProductIndustrialById(id: string) {
    const { data, error } = await supabase
      .from('products_industrial')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createProductIndustrial(product: Partial<ProductIndustrial>) {
    const { data, error } = await supabase
      .from('products_industrial')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateProductIndustrial(id: string, product: Partial<ProductIndustrial>) {
    const { data, error } = await supabase
      .from('products_industrial')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteProductIndustrial(id: string) {
    const { error } = await supabase
      .from('products_industrial')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getComponents() {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getComponentById(id: string) {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createComponent(component: Partial<Component>) {
    const { data, error } = await supabase
      .from('components')
      .insert(component)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateComponent(id: string, component: Partial<Component>) {
    const { data, error } = await supabase
      .from('components')
      .update(component)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteComponent(id: string) {
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getBOMs() {
    const { data, error } = await supabase
      .from('boms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getBOMById(id: string) {
    const { data, error } = await supabase
      .from('boms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createBOM(bom: Partial<BOM>) {
    const { data, error } = await supabase
      .from('boms')
      .insert(bom)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateBOM(id: string, bom: Partial<BOM>) {
    const { data, error } = await supabase
      .from('boms')
      .update(bom)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteBOM(id: string) {
    const { error } = await supabase
      .from('boms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getMachineMaintenances(machineId?: string) {
    let query = supabase
      .from('machine_maintenance')
      .select('*')
      .order('data_agendada', { ascending: true });
    
    if (machineId) {
      query = query.eq('maquina_id', machineId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachineMaintenanceById(id: string) {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createMachineMaintenance(maintenance: Partial<MachineMaintenance>) {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .insert(maintenance)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateMachineMaintenance(id: string, maintenance: Partial<MachineMaintenance>) {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .update(maintenance)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteMachineMaintenance(id: string) {
    const { error } = await supabase
      .from('machine_maintenance')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getMachineMaintenancesByMachineId(machineId: string) {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .select('*')
      .eq('maquina_id', machineId)
      .order('data_agendada', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getUpcomingMaintenances(days: number = 30) {
    const { data, error } = await supabase
      .from('machine_maintenance')
      .select('*')
      .eq('status', 'scheduled')
      .gte('data_agendada', new Date().toISOString())
      .lte('data_agendada', new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString())
      .order('data_agendada', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachineDocuments(machineId?: string) {
    let query = supabase
      .from('machine_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (machineId) {
      query = query.eq('maquina_id', machineId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachineDocumentById(id: string) {
    const { data, error } = await supabase
      .from('machine_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createMachineDocument(document: Partial<MachineDocument>) {
    const { data, error } = await supabase
      .from('machine_documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateMachineDocument(id: string, document: Partial<MachineDocument>) {
    const { data, error } = await supabase
      .from('machine_documents')
      .update(document)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteMachineDocument(id: string) {
    const { error } = await supabase
      .from('machine_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getMachineDocumentsByMachineId(machineId: string) {
    const { data, error } = await supabase
      .from('machine_documents')
      .select('*')
      .eq('maquina_id', machineId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachineDocumentsByType(machineId: string, tipo: string) {
    const { data, error } = await supabase
      .from('machine_documents')
      .select('*')
      .eq('maquina_id', machineId)
      .eq('tipo', tipo)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachinePhotos(machineId?: string) {
    let query = supabase
      .from('machine_photos')
      .select('*')
      .order('ordem', { ascending: true });
    
    if (machineId) {
      query = query.eq('maquina_id', machineId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachinePhotoById(id: string) {
    const { data, error } = await supabase
      .from('machine_photos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createMachinePhoto(photo: Partial<MachinePhoto>) {
    const { data, error } = await supabase
      .from('machine_photos')
      .insert(photo)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateMachinePhoto(id: string, photo: Partial<MachinePhoto>) {
    const { data, error } = await supabase
      .from('machine_photos')
      .update(photo)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteMachinePhoto(id: string) {
    const { error } = await supabase
      .from('machine_photos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getMachinePhotosByMachineId(machineId: string) {
    const { data, error } = await supabase
      .from('machine_photos')
      .select('*')
      .eq('maquina_id', machineId)
      .order('ordem', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getMachinePhotosByCategory(machineId: string, categoria: string) {
    const { data, error } = await supabase
      .from('machine_photos')
      .select('*')
      .eq('maquina_id', machineId)
      .eq('categoria', categoria)
      .order('ordem', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async updateMachinePhotoOrder(id: string, ordem: number) {
    const { data, error } = await supabase
      .from('machine_photos')
      .update({ ordem })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async getProcessSteps(processId?: string) {
    let query = supabase
      .from('process_steps')
      .select('*')
      .order('sequencia', { ascending: true });
    
    if (processId) {
      query = query.eq('processo_id', processId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getProcessStepById(id: string) {
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createProcessStep(step: Partial<ProcessStep>) {
    const { data, error } = await supabase
      .from('process_steps')
      .insert(step)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateProcessStep(id: string, step: Partial<ProcessStep>) {
    const { data, error } = await supabase
      .from('process_steps')
      .update(step)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteProcessStep(id: string) {
    const { error } = await supabase
      .from('process_steps')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getProcessStepsByProcessId(processId: string) {
    const { data, error } = await supabase
      .from('process_steps')
      .select('*')
      .eq('processo_id', processId)
      .order('sequencia', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getProcessDocuments(processId?: string) {
    let query = supabase
      .from('process_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (processId) {
      query = query.eq('processo_id', processId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getProcessDocumentById(id: string) {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createProcessDocument(document: Partial<ProcessDocument>) {
    const { data, error } = await supabase
      .from('process_documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateProcessDocument(id: string, document: Partial<ProcessDocument>) {
    const { data, error } = await supabase
      .from('process_documents')
      .update(document)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteProcessDocument(id: string) {
    const { error } = await supabase
      .from('process_documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getProcessDocumentsByProcessId(processId: string) {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('processo_id', processId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getProcessDocumentsByType(processId: string, tipo: string) {
    const { data, error } = await supabase
      .from('process_documents')
      .select('*')
      .eq('processo_id', processId)
      .eq('tipo', tipo)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getTimingMeasurements(timingRecordId?: string) {
    let query = supabase
      .from('timing_measurements')
      .select('*')
      .order('numero_medicao', { ascending: true });
    
    if (timingRecordId) {
      query = query.eq('timing_record_id', timingRecordId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getTimingMeasurementById(id: string) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createTimingMeasurement(measurement: Partial<TimingMeasurement>) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .insert(measurement)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateTimingMeasurement(id: string, measurement: Partial<TimingMeasurement>) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .update(measurement)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteTimingMeasurement(id: string) {
    const { error } = await supabase
      .from('timing_measurements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getTimingMeasurementsByTimingRecordId(timingRecordId: string) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('timing_record_id', timingRecordId)
      .order('numero_medicao', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getTimingMeasurementsByMachineId(machineId: string) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('maquina_id', machineId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getTimingMeasurementsByProcessId(processId: string) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('*')
      .eq('processo_id', processId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async calculateAverageTiming(timingRecordId: string) {
    const { data, error } = await supabase
      .from('timing_measurements')
      .select('duracao_segundos')
      .eq('timing_record_id', timingRecordId)
      .eq('status', 'valid');
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { success: true, data: { average: 0 } };
    }
    
    const sum = data.reduce((acc, curr) => acc + (curr.duracao_segundos || 0), 0);
    return { success: true, data: { average: sum / data.length } };
  },

  async getCapacityHistory(capacityId?: string) {
    let query = supabase
      .from('capacity_history')
      .select('*')
      .order('data_registro', { ascending: false });
    
    if (capacityId) {
      query = query.eq('capacity_id', capacityId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getCapacityHistoryById(id: string) {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async createCapacityHistory(history: Partial<CapacityHistory>) {
    const { data, error } = await supabase
      .from('capacity_history')
      .insert(history)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async updateCapacityHistory(id: string, history: Partial<CapacityHistory>) {
    const { data, error } = await supabase
      .from('capacity_history')
      .update(history)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  },

  async deleteCapacityHistory(id: string) {
    const { error } = await supabase
      .from('capacity_history')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  async getCapacityHistoryByCapacityId(capacityId: string) {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .eq('capacity_id', capacityId)
      .order('data_registro', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getCapacityHistoryByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .gte('data_registro', startDate)
      .lte('data_registro', endDate)
      .order('data_registro', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async getCapacityHistoryByMachineId(machineId: string) {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('*')
      .eq('maquina_id', machineId)
      .order('data_registro', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  },

  async calculateAverageEfficiency(capacityId: string) {
    const { data, error } = await supabase
      .from('capacity_history')
      .select('eficiencia_percentual')
      .eq('capacity_id', capacityId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return { success: true, data: { average: 0 } };
    }
    
    const sum = data.reduce((acc, curr) => acc + (curr.eficiencia_percentual || 0), 0);
    return { success: true, data: { average: sum / data.length } };
  },
};

export const getLocations = (data: unknown) => industrialService.getLocations();
export const getLocationById = (data: unknown) => industrialService.getLocationById((data as { id: string }).id);
export const createLocation = (data: unknown) => industrialService.createLocation(data as Partial<Location>);
export const updateLocation = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Location>;
  return industrialService.updateLocation(id, rest);
};
export const deleteLocation = (data: unknown) => industrialService.deleteLocation((data as { id: string }).id);

export const getMachines = (data: unknown) => industrialService.getMachines();
export const getMachineById = (data: unknown) => industrialService.getMachineById((data as { id: string }).id);
export const createMachine = (data: unknown) => industrialService.createMachine(data as Partial<Machine>);
export const updateMachine = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Machine>;
  return industrialService.updateMachine(id, rest);
};
export const deleteMachine = (data: unknown) => industrialService.deleteMachine((data as { id: string }).id);

export const getMaterials = (data: unknown) => industrialService.getMaterials();
export const getMaterialById = (data: unknown) => industrialService.getMaterialById((data as { id: string }).id);
export const createMaterial = (data: unknown) => industrialService.createMaterial(data as Partial<Material>);
export const updateMaterial = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Material>;
  return industrialService.updateMaterial(id, rest);
};
export const deleteMaterial = (data: unknown) => industrialService.deleteMaterial((data as { id: string }).id);

export const getSuppliers = (data: unknown) => industrialService.getSuppliers();
export const getSupplierById = (data: unknown) => industrialService.getSupplierById((data as { id: string }).id);
export const createSupplier = (data: unknown) => industrialService.createSupplier(data as Partial<Supplier>);
export const updateSupplier = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Supplier>;
  return industrialService.updateSupplier(id, rest);
};
export const deleteSupplier = (data: unknown) => industrialService.deleteSupplier((data as { id: string }).id);

export const getProcesses = (data: unknown) => industrialService.getProcesses();
export const getProcessById = (data: unknown) => industrialService.getProcessById((data as { id: string }).id);
export const createProcess = (data: unknown) => industrialService.createProcess(data as Partial<Process>);
export const updateProcess = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Process>;
  return industrialService.updateProcess(id, rest);
};
export const deleteProcess = (data: unknown) => industrialService.deleteProcess((data as { id: string }).id);

export const getTimingRecords = (data: unknown) => industrialService.getTimingRecords();
export const getTimingRecordById = (data: unknown) => industrialService.getTimingRecordById((data as { id: string }).id);
export const createTimingRecord = (data: unknown) => industrialService.createTimingRecord(data as Partial<TimingRecord>);
export const updateTimingRecord = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<TimingRecord>;
  return industrialService.updateTimingRecord(id, rest);
};
export const deleteTimingRecord = (data: unknown) => industrialService.deleteTimingRecord((data as { id: string }).id);

export const getCapacities = (data: unknown) => industrialService.getCapacities();
export const getCapacityById = (data: unknown) => industrialService.getCapacityById((data as { id: string }).id);
export const createCapacity = (data: unknown) => industrialService.createCapacity(data as Partial<Capacity>);
export const updateCapacity = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Capacity>;
  return industrialService.updateCapacity(id, rest);
};
export const deleteCapacity = (data: unknown) => industrialService.deleteCapacity((data as { id: string }).id);

export const getTools = (data: unknown) => industrialService.getTools();
export const getToolById = (data: unknown) => industrialService.getToolById((data as { id: string }).id);
export const createTool = (data: unknown) => industrialService.createTool(data as Partial<Tool>);
export const updateTool = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Tool>;
  return industrialService.updateTool(id, rest);
};
export const deleteTool = (data: unknown) => industrialService.deleteTool((data as { id: string }).id);

export const getProductsIndustrial = (data: unknown) => industrialService.getProductsIndustrial();
export const getProductIndustrialById = (data: unknown) => industrialService.getProductIndustrialById((data as { id: string }).id);
export const createProductIndustrial = (data: unknown) => industrialService.createProductIndustrial(data as Partial<ProductIndustrial>);
export const updateProductIndustrial = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<ProductIndustrial>;
  return industrialService.updateProductIndustrial(id, rest);
};
export const deleteProductIndustrial = (data: unknown) => industrialService.deleteProductIndustrial((data as { id: string }).id);

export const getComponents = (data: unknown) => industrialService.getComponents();
export const getComponentById = (data: unknown) => industrialService.getComponentById((data as { id: string }).id);
export const createComponent = (data: unknown) => industrialService.createComponent(data as Partial<Component>);
export const updateComponent = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<Component>;
  return industrialService.updateComponent(id, rest);
};
export const deleteComponent = (data: unknown) => industrialService.deleteComponent((data as { id: string }).id);

export const getBOMs = (data: unknown) => industrialService.getBOMs();
export const getBOMById = (data: unknown) => industrialService.getBOMById((data as { id: string }).id);
export const createBOM = (data: unknown) => industrialService.createBOM(data as Partial<BOM>);
export const updateBOM = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<BOM>;
  return industrialService.updateBOM(id, rest);
};
export const deleteBOM = (data: unknown) => industrialService.deleteBOM((data as { id: string }).id);

export const getMachineMaintenances = (data: unknown) => industrialService.getMachineMaintenances((data as { machineId?: string }).machineId);
export const getMachineMaintenanceById = (data: unknown) => industrialService.getMachineMaintenanceById((data as { id: string }).id);
export const createMachineMaintenance = (data: unknown) => industrialService.createMachineMaintenance(data as Partial<MachineMaintenance>);
export const updateMachineMaintenance = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<MachineMaintenance>;
  return industrialService.updateMachineMaintenance(id, rest);
};
export const deleteMachineMaintenance = (data: unknown) => industrialService.deleteMachineMaintenance((data as { id: string }).id);
export const getMachineMaintenancesByMachineId = (data: unknown) => industrialService.getMachineMaintenancesByMachineId((data as { machineId: string }).machineId);
export const getUpcomingMaintenances = (data: unknown) => industrialService.getUpcomingMaintenances((data as { days?: number }).days);

export const getMachineDocuments = (data: unknown) => industrialService.getMachineDocuments((data as { machineId?: string }).machineId);
export const getMachineDocumentById = (data: unknown) => industrialService.getMachineDocumentById((data as { id: string }).id);
export const createMachineDocument = (data: unknown) => industrialService.createMachineDocument(data as Partial<MachineDocument>);
export const updateMachineDocument = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<MachineDocument>;
  return industrialService.updateMachineDocument(id, rest);
};
export const deleteMachineDocument = (data: unknown) => industrialService.deleteMachineDocument((data as { id: string }).id);
export const getMachineDocumentsByMachineId = (data: unknown) => industrialService.getMachineDocumentsByMachineId((data as { machineId: string }).machineId);
export const getMachineDocumentsByType = (data: unknown) => industrialService.getMachineDocumentsByType((data as { machineId: string; tipo: string }).machineId, (data as { machineId: string; tipo: string }).tipo);

export const getMachinePhotos = (data: unknown) => industrialService.getMachinePhotos((data as { machineId?: string }).machineId);
export const getMachinePhotoById = (data: unknown) => industrialService.getMachinePhotoById((data as { id: string }).id);
export const createMachinePhoto = (data: unknown) => industrialService.createMachinePhoto(data as Partial<MachinePhoto>);
export const updateMachinePhoto = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<MachinePhoto>;
  return industrialService.updateMachinePhoto(id, rest);
};
export const deleteMachinePhoto = (data: unknown) => industrialService.deleteMachinePhoto((data as { id: string }).id);
export const getMachinePhotosByMachineId = (data: unknown) => industrialService.getMachinePhotosByMachineId((data as { machineId: string }).machineId);
export const getMachinePhotosByCategory = (data: unknown) => industrialService.getMachinePhotosByCategory((data as { machineId: string; categoria: string }).machineId, (data as { machineId: string; categoria: string }).categoria);
export const updateMachinePhotoOrder = (data: unknown) => industrialService.updateMachinePhotoOrder((data as { id: string; ordem: number }).id, (data as { id: string; ordem: number }).ordem);

export const getProcessSteps = (data: unknown) => industrialService.getProcessSteps((data as { processId?: string }).processId);
export const getProcessStepById = (data: unknown) => industrialService.getProcessStepById((data as { id: string }).id);
export const createProcessStep = (data: unknown) => industrialService.createProcessStep(data as Partial<ProcessStep>);
export const updateProcessStep = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<ProcessStep>;
  return industrialService.updateProcessStep(id, rest);
};
export const deleteProcessStep = (data: unknown) => industrialService.deleteProcessStep((data as { id: string }).id);
export const getProcessStepsByProcessId = (data: unknown) => industrialService.getProcessStepsByProcessId((data as { processId: string }).processId);

export const getProcessDocuments = (data: unknown) => industrialService.getProcessDocuments((data as { processId?: string }).processId);
export const getProcessDocumentById = (data: unknown) => industrialService.getProcessDocumentById((data as { id: string }).id);
export const createProcessDocument = (data: unknown) => industrialService.createProcessDocument(data as Partial<ProcessDocument>);
export const updateProcessDocument = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<ProcessDocument>;
  return industrialService.updateProcessDocument(id, rest);
};
export const deleteProcessDocument = (data: unknown) => industrialService.deleteProcessDocument((data as { id: string }).id);
export const getProcessDocumentsByProcessId = (data: unknown) => industrialService.getProcessDocumentsByProcessId((data as { processId: string }).processId);
export const getProcessDocumentsByType = (data: unknown) => industrialService.getProcessDocumentsByType((data as { processId: string; tipo: string }).processId, (data as { processId: string; tipo: string }).tipo);

export const getTimingMeasurements = (data: unknown) => industrialService.getTimingMeasurements((data as { timingRecordId?: string }).timingRecordId);
export const getTimingMeasurementById = (data: unknown) => industrialService.getTimingMeasurementById((data as { id: string }).id);
export const createTimingMeasurement = (data: unknown) => industrialService.createTimingMeasurement(data as Partial<TimingMeasurement>);
export const updateTimingMeasurement = (data: unknown) => {
  const { id, ...rest } = data as { id: string } & Partial<TimingMeasurement>;
  return industrialService.updateTimingMeasurement(id, rest);
};
export const deleteTimingMeasurement = (data: unknown) => industrialService.deleteTimingMeasurement((data as { id: string }).id);
export const getTimingMeasurementsByTimingRecordId = (data: unknown) => industrialService.getTimingMeasurementsByTimingRecordId((data as { timingRecordId: string }).timingRecordId);
export const getTimingMeasurementsByMachineId = (data: unknown) => industrialService.getTimingMeasurementsByMachineId((data as { machineId: string }).machineId);
export const getTimingMeasurementsByProcessId = (data: unknown) => industrialService.getTimingMeasurementsByProcessId((data as { processId: string }).processId);
export const calculateAverageTiming = (data: unknown) => industrialService.calculateAverageTiming((data as { timingRecordId: string }).timingRecordId);
