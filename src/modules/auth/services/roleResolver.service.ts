import { supabase } from "@/lib/supabase/client";
import { UserRole } from "@/shared/types/roles";

/**
 * RoleResolver Service
 * 
 * Centralized service for resolving user roles from the database.
 * Uses only identity.user_roles and identity.roles tables.
 * No hardcoded logic, no email-based decisions.
 */
export class RoleResolver {
  /**
   * Fetch user role from crm.user_roles_view + crm.roles_view
   * Uses views in crm schema since identity schema is not exposed via API
   * 
   * @param userId - The user's auth_user_id from auth.users
   * @returns The user's role or null if not found
   */
  static async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      console.log("[RoleResolver] Fetching role for userId:", userId);

      // Get role_id from crm.user_roles_view (view over identity.user_roles)
      const { data: userRole, error: roleError } = await supabase
        .schema("crm")
        .from("user_roles_view")
        .select("role_id, role_name")
        .eq("user_id", userId)
        .single();

      if (roleError) {
        if (roleError.code === "PGRST116") {
          console.log("[RoleResolver] No role assignment found for user:", userId);
          return null;
        }
        console.error("[RoleResolver] Error fetching user role:", roleError);
        return null;
      }

      if (!userRole?.role_id) {
        console.log("[RoleResolver] No role_id found for user:", userId);
        return null;
      }

      // The view already includes role_name, so we can use it directly
      const roleName = userRole.role_name;
      
      if (!roleName) {
        console.log("[RoleResolver] No role name found for role_id:", userRole.role_id);
        return null;
      }

      // Validate that the role name is a valid UserRole enum value
      if (!Object.values(UserRole).includes(roleName as UserRole)) {
        console.error("[RoleResolver] Invalid role name:", roleName);
        return null;
      }

      console.log("[RoleResolver] Role resolved:", roleName);
      return roleName as UserRole;
    } catch (error) {
      console.error("[RoleResolver] Error in getUserRole:", error);
      return null;
    }
  }

  /**
   * Check if user has a specific role
   * 
   * @param userId - The user's auth_user_id
   * @param role - The role to check
   * @returns true if user has the role, false otherwise
   */
  static async hasRole(userId: string, role: UserRole): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === role;
  }

  /**
   * Check if user has any of the specified roles
   * 
   * @param userId - The user's auth_user_id
   * @param roles - Array of roles to check
   * @returns true if user has any of the roles, false otherwise
   */
  static async hasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return roles.includes(userRole as UserRole);
  }

  /**
   * Assign a role to a user using crm views
   * 
   * @param userId - The user's auth_user_id
   * @param role - The role to assign
   * @returns true if successful, false otherwise
   */
  static async assignRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      // Get role_id from crm.roles_view (view over identity.roles)
      const { data: roleData, error: roleError } = await supabase
        .schema("crm")
        .from("roles_view")
        .select("id")
        .eq("name", role)
        .single();

      if (roleError || !roleData) {
        console.error("[RoleResolver] Error fetching role_id:", roleError);
        return false;
      }

      // Check if user already has a role assignment
      const { data: existingAssignment } = await supabase
        .schema("crm")
        .from("user_roles_view")
        .select("id")
        .eq("user_id", userId)
        .single();

      // We need to update the actual identity.user_roles table directly
      // Since views are read-only, we'll use a direct query to identity schema
      // This requires admin privileges, so we'll return false for now
      // In production, this should be done via a backend API endpoint
      console.warn("[RoleResolver] assignRole requires backend API - not implemented for client-side");
      return false;
    } catch (error) {
      console.error("[RoleResolver] Error in assignRole:", error);
      return false;
    }
  }

  /**
   * Remove role assignment from user
   * Requires backend API since identity schema is not exposed
   * 
   * @param userId - The user's auth_user_id
   * @returns true if successful, false otherwise
   */
  static async removeRole(userId: string): Promise<boolean> {
    try {
      // This requires direct access to identity.user_roles table
      // Since identity schema is not exposed via API, this requires backend endpoint
      console.warn("[RoleResolver] removeRole requires backend API - not implemented for client-side");
      return false;
    } catch (error) {
      console.error("[RoleResolver] Error in removeRole:", error);
      return false;
    }
  }
}
