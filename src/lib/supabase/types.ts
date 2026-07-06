/**
 * Supabase Type Definitions
 * 
 * Centralized type definitions for Supabase-related operations
 * Note: Database types should be generated using Supabase CLI: supabase gen types typescript
 */

// ============================================================================
// Database Types
// ============================================================================

// TODO: Generate database types using: supabase gen types typescript src/types/database.ts
// For now, we'll use basic types. Replace with generated types when available.

export interface Database {
  identity: {
    Tables: {
      roles: any;
      user_roles: any;
      permissions: any;
      role_permissions: any;
    };
  };
  crm: {
    Tables: {
      customers: any;
      customer_distributor: any;
    };
  };
  mlm: {
    Tables: {
      distribuidores: any;
      planos: any;
      planos_distribuidores: any;
      comissoes: any;
      bonus_regras: any;
      rede_linear_nos: any;
    };
  };
  commerce: {
    Tables: {
      produtos: any;
      pedidos: any;
      pedidos_itens: any;
      pedidos_pagamentos: any;
    };
  };
  finance: {
    Tables: {
      solicitacoes_saque: any;
      carteiras: any;
      transacoes: any;
    };
  };
  logistics: {
    Tables: {
      envios: any;
      rastreamentos: any;
    };
  };
  industrial: {
    Tables: {
      producao: any;
      estoque: any;
    };
  };
  system: {
    Tables: {
      configuracoes: any;
      auditoria: any;
    };
  };
}

export type Db = Database;

// ============================================================================
// Common Table Types (Basic - should be replaced with generated types)
// ============================================================================

export type Profile = any;
export type ProfileInsert = any;
export type ProfileUpdate = any;

export type Customer = any;
export type CustomerInsert = any;
export type CustomerUpdate = any;

export type Product = any;
export type ProductInsert = any;
export type ProductUpdate = any;

export type Cart = any;
export type CartInsert = any;
export type CartUpdate = any;

export type Order = any;
export type OrderInsert = any;
export type OrderUpdate = any;

export type Plan = any;
export type PlanInsert = any;
export type PlanUpdate = any;

export type Withdrawal = any;
export type WithdrawalInsert = any;
export type WithdrawalUpdate = any;

export type Lead = any;
export type LeadInsert = any;
export type LeadUpdate = any;

export type AdminUser = any;
export type AdminUserInsert = any;
export type AdminUserUpdate = any;

export type DistributorTheme = any;
export type DistributorThemeInsert = any;
export type DistributorThemeUpdate = any;

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

// ============================================================================
// Query Result Types
// ============================================================================

export interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}

export interface QueryResultList<T> {
  data: T[];
  error: Error | null;
}

// ============================================================================
// Error Types
// ============================================================================

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string,
    public hint?: string
  ) {
    super(message);
    this.name = "SupabaseError";
  }
}

export class AuthError extends SupabaseError {
  constructor(message: string, code?: string, details?: string) {
    super(message, code, details);
    this.name = "AuthError";
  }
}

export class DatabaseError extends SupabaseError {
  constructor(message: string, code?: string, details?: string, hint?: string) {
    super(message, code, details, hint);
    this.name = "DatabaseError";
  }
}
