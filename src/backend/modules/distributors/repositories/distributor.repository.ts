import { BaseRepository } from "../../../infra/database/base.repository";

export interface Distribuidor {
  id: string;
  usuario: string;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  data_nascimento?: string;
  cep?: string;
  cidade?: string;
  bairro?: string;
  endereco?: string;
  complemento?: string;
  numero?: string;
  ativo?: boolean;
  status?: string;
  data_cadastro?: string;
  patrocinador_id?: string;
  allin_id?: number;
  allin_synced_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class DistribuidorRepository extends BaseRepository<Distribuidor> {
  constructor() {
    super("mlm.distribuidores");
  }

  async findByAllinId(allinId: number): Promise<Distribuidor | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("allin_id", allinId)
      .single();

    if (error) throw error;
    return data;
  }

  async findByUsuario(usuario: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("usuario", usuario)
      .single();

    if (error) throw error;
    return data;
  }

  async findByEmail(email: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getClient()
      .from(this.tableName)
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  }
}
