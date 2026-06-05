import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { loginSchema, registerSchema, refreshTokenSchema, changePasswordSchema } from "../dto/auth.dto";

const authService = new AuthService();

export const login = async (data: unknown) => {
  const parsed = loginSchema.parse(data);
  try {
    const result = await authService.login(parsed);
    return {
      success: true,
      data: result,
      message: "Login successful",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
};

export const register = async (data: unknown) => {
  const parsed = registerSchema.parse(data);
  try {
    const result = await authService.register(parsed);
    return {
      success: true,
      data: result,
      message: "Registration successful",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
};

export const refreshToken = async (data: unknown) => {
  const parsed = refreshTokenSchema.parse(data);
  try {
    const result = await authService.refreshToken(parsed);
    return {
      success: true,
      data: result,
      message: "Token refreshed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Token refresh failed",
    };
  }
};

export const changePassword = async (data: unknown) => {
  const parsed = z.object({
    userId: z.string().uuid(),
    data: changePasswordSchema,
  }).parse(data);
  try {
    await authService.changePassword(parsed.userId, parsed.data);
    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Password change failed",
    };
  }
};

export const logout = async (data: unknown) => {
  const parsed = z.object({ userId: z.string().uuid() }).parse(data);
  try {
    await authService.logout(parsed.userId);
    return {
      success: true,
      message: "Logout successful",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
};
