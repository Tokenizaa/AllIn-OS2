import { BaseRepository } from "../../../infra/database/base.repository";
import { Profile, CreateProfileDto, UpdateProfileDto } from "../dto/profile.dto";

export class ProfileRepository extends BaseRepository<Profile> {
  constructor() {
    super("crm.customers");
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  async findByRole(role: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<Profile[]> {
    // NOTE: This filters by tipo_cliente in crm.customers for commercial classification
    // For actual role-based filtering, use identity.user_roles
    let query = this.getClient()
      .schema("crm")
      .from("customers")
      .select("*")
      .eq("tipo_cliente", role);

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

  async create(dto: CreateProfileDto): Promise<Profile> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .insert({
        nome: dto.name,
        email: dto.email,
        tipo_cliente: dto.role, // Commercial classification in crm.customers
        status: dto.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const { data, error } = await this.getClient()
      .schema("crm")
      .from("customers")
      .update({
        nome: dto.name,
        email: dto.email,
        tipo_cliente: dto.role, // Commercial classification in crm.customers
        status: dto.status,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
