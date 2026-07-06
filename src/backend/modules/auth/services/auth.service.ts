import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto, AuthResponse } from "../dto/auth.dto";
import { CustomerRepository } from "../../customers/repositories/customer.repository";
import { UserRole } from "../../../shared/types/common.types";
import { getSupabaseClient } from "../../../infra/supabase/client";

const supabase = getSupabaseClient();

export class AuthService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  private async getUserRole(authUserId: string): Promise<UserRole> {
    const { data, error } = await supabase
      .schema("identity")
      .from("user_roles")
      .select("role_id")
      .eq("user_id", authUserId)
      .single();

    if (error || !data) {
      return UserRole.CLIENTE_FINAL;
    }

    return data.role_id as UserRole;
  }

  private async assignUserRole(authUserId: string, role: UserRole): Promise<void> {
    const { error } = await supabase
      .schema("identity")
      .from("user_roles")
      .insert({
        user_id: authUserId,
        role_id: role,
        assigned_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to assign role: ${error.message}`);
    }
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Use Supabase Auth for login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("Invalid credentials");
    }

    // Get user role from identity.user_roles
    const role = await this.getUserRole(authData.user.id);

    // Find customer by email
    const customer = await this.customerRepository.findByEmail(dto.email);
    if (!customer) {
      throw new Error("Customer not found");
    }

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: role,
      },
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: 3600,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(dto.email);
    if (existingCustomer) {
      throw new Error("Email already registered");
    }

    // Check if CPF already exists
    if (dto.cpf) {
      const existingByCpf = await this.customerRepository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }

    // Use Supabase Auth for registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // Create customer in crm.customers
    const { data: customer, error: customerError } = await supabase
      .schema("crm")
      .from("customers")
      .insert({
        auth_user_id: authData.user.id,
        nome: dto.name,
        email: dto.email,
        tipo_cliente: UserRole.CLIENTE_FINAL,
        status: "active",
        telefone: dto.phone,
        cpf: dto.cpf,
        patrocinador_id: dto.sponsor_id,
      })
      .select()
      .single();

    if (customerError || !customer) {
      throw new Error("Failed to create customer");
    }

    // Assign default role in identity.user_roles
    await this.assignUserRole(authData.user.id, UserRole.CLIENTE_FINAL);

    return {
      user: {
        id: customer.id,
        name: customer.nome,
        email: customer.email,
        role: UserRole.CLIENTE_FINAL,
      },
      accessToken: authData.session?.access_token || "",
      refreshToken: authData.session?.refresh_token || "",
      expiresIn: 3600,
    };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<AuthResponse> {
    // Use Supabase Auth for refresh token
    const { data: authData, error: authError } = await supabase.auth.refreshSession({
      refresh_token: dto.refreshToken,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    // Get customer from the session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      throw new Error("Invalid refresh token");
    }

    const customer = await this.customerRepository.findById(user.id);
    if (!customer) {
      throw new Error("Invalid refresh token");
    }

    // Get user role from identity.user_roles
    const role = await this.getUserRole(user.id);

    return {
      user: {
        id: customer.auth_user_id,
        name: customer.name,
        email: customer.email,
        role: role,
      },
      accessToken: authData.session?.access_token || "",
      refreshToken: authData.session?.refresh_token || "",
      expiresIn: 3600,
    };
  }

  async changePassword(userId: string, _dto: ChangePasswordDto): Promise<void> {
    void _dto;
    const customer = await this.customerRepository.findById(userId);
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Use Supabase Auth for password change
    const { error: authError } = await supabase.auth.updateUser({
      password: _dto.newPassword,
    });

    if (authError) {
      throw new Error(authError.message);
    }
  }

  async logout(_userId: string): Promise<void> {
    void _userId;
    // Use Supabase Auth for logout
    const { error: authError } = await supabase.auth.signOut();
    if (authError) {
      throw new Error(authError.message);
    }
  }

  async verifyAccessToken(token: string): Promise<{ userId: string; email: string; role: string }> {
    // Use Supabase Auth to verify token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user?.email) {
      throw new Error("Invalid access token");
    }

    // Get customer from user_id
    const customer = await this.customerRepository.findById(user.id);
    if (!customer) {
      throw new Error("Invalid access token");
    }

    // Get user role from identity.user_roles
    const role = await this.getUserRole(user.id);

    return {
      userId: customer.id,
      email: customer.email,
      role: role,
    };
  }
}
