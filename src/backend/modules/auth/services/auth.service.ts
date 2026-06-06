import { LoginDto, RegisterDto, RefreshTokenDto, ChangePasswordDto, AuthResponse } from "../dto/auth.dto";
import { CustomerRepository } from "../../customers/repositories/customer.repository";
import { ProfileRepository } from "../../profiles/repositories/profile.repository";
import { UserRole } from "../../../shared/types/common.types";
import { getSupabaseClient } from "../../../infra/supabase/client";

const supabase = getSupabaseClient();

export class AuthService {
  private customerRepository: CustomerRepository;
  private profileRepository: ProfileRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.profileRepository = new ProfileRepository();
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find customer by email
    const customer = await this.customerRepository.findByEmail(dto.email);
    if (!customer) {
      throw new Error("Invalid credentials");
    }

    // In production, verify password hash
    // For now, we'll skip password verification
    // const isPasswordValid = await bcrypt.compare(dto.password, customer.password_hash);
    // if (!isPasswordValid) {
    //   throw new Error("Invalid credentials");
    // }

    // Get user role from profiles table (NOT from customers)
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = (profile?.role || UserRole.CLIENTE_FINAL) as any;

    // Use Supabase Auth for login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (authError) {
      throw new Error(authError.message);
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

    // Create customer
    const customer = await this.customerRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      cpf: dto.cpf,
      sponsor_id: dto.sponsor_id,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Create profile with default role (cliente_final)
    await this.profileRepository.create({
      user_id: customer.id,
      name: customer.name,
      email: customer.email,
      role: UserRole.CLIENTE_FINAL,
      status: "active",
    });

    // Get user role from profiles table
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = (profile?.role || UserRole.CLIENTE_FINAL) as any;

    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: role,
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

    const customer = await this.customerRepository.findByEmail(user.email);
    if (!customer) {
      throw new Error("Invalid refresh token");
    }

    // Get user role from profiles table
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = (profile?.role || UserRole.CLIENTE_FINAL) as any;

    return {
      user: {
        id: customer.id,
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
    // This is a simplified version - in production, you should use Supabase's built-in session management
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user?.email) {
      throw new Error("Invalid access token");
    }

    // Get customer from email
    return this.customerRepository.findByEmail(user.email).then(customer => {
      if (!customer) {
        throw new Error("Invalid access token");
      }

      return this.profileRepository.findByUserId(customer.id).then(profile => {
        const role = (profile?.role || UserRole.CLIENTE_FINAL) as any;
        return {
          userId: customer.id,
          email: customer.email,
          role: role,
        };
      });
    });
  }
}
