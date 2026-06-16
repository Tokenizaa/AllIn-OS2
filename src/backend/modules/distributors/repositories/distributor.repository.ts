import { BaseRepository } from "../../../infra/database/base.repository";

export interface Distribuidor {
  id?: string;
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
  perna_esquerda_id?: string;
  perna_direita_id?: string;
  allin_id?: number;
  allin_synced_at?: string;
  created_at?: string;
  updated_at?: string;
}

export class DistribuidorRepository extends BaseRepository<Distribuidor> {
  constructor() {
    super("distribuidores", "mlm");
  }

  async findByAllinId(allinId: number): Promise<Distribuidor | null> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("allin_id", allinId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByUsuario(usuario: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("usuario", usuario)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByEmail(email: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getQuery()
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
