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
      .schema("mlm")
      .from("distribuidores")
      .select("*")
      .eq("allin_id", allinId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findByUsuario(usuario: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("distribuidores")
      .select("*")
      .eq("usuario", usuario)
      .single();

    if (error) throw error;
    return data;
  }

  async findByEmail(email: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("distribuidores")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(options?: {
    filters?: Record<string, any>;
    orderBy?: string;
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }): Promise<Distribuidor[]> {
    let query = this.getClient()
      .schema("mlm")
      .from("distribuidores")
      .select("*");

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.order === "asc" });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async create(data: Partial<Distribuidor>): Promise<Distribuidor> {
    const { data: result, error } = await this.getClient()
      .schema("mlm")
      .from("distribuidores")
      .insert(data as any)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<Distribuidor>): Promise<Distribuidor> {
    const { data: result, error } = await this.getClient()
      .schema("mlm")
      .from("distribuidores")
      .update(data as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async findById(id: string): Promise<Distribuidor | null> {
    const { data, error } = await this.getClient()
      .schema("mlm")
      .from("distribuidores")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
}
