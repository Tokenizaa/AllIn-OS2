import process from "node:process";
import { c as createServerRpc } from "./createServerRpc-CISKjDF_.mjs";
import { a as createServerFn } from "./server-BaJh_Ojk.mjs";
import jwt from "jsonwebtoken";
import { C as CustomerRepository } from "./customer.repository-CaT-CUpr.mjs";
import { B as BaseRepository } from "./base.repository-C1yp6j9c.mjs";
import { U as UserRole } from "./roles-DEW722fr.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
const loginSchema = objectType({
  email: stringType().email(),
  password: stringType().min(6)
});
const registerSchema = objectType({
  name: stringType().min(1),
  email: stringType().email(),
  password: stringType().min(6),
  phone: stringType().optional(),
  cpf: stringType().optional(),
  sponsor_id: stringType().uuid().optional()
});
const refreshTokenSchema = objectType({
  refreshToken: stringType()
});
const changePasswordSchema = objectType({
  currentPassword: stringType(),
  newPassword: stringType().min(6)
});
objectType({
  user: objectType({
    id: stringType().uuid(),
    name: stringType(),
    email: stringType(),
    role: enumType(["admin", "operator", "distributor"])
  }),
  accessToken: stringType(),
  refreshToken: stringType(),
  expiresIn: numberType()
});
class ProfileRepository extends BaseRepository {
  constructor() {
    super("profiles");
  }
  async findByUserId(userId) {
    const { data, error } = await this.getClient().from(this.tableName).select("*").eq("user_id", userId).single();
    if (error) throw error;
    return data;
  }
  async findByRole(role, options) {
    let query = this.getClient().from(this.tableName).select("*").eq("role", role);
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
  async create(dto) {
    const { data, error } = await this.getClient().from(this.tableName).insert({
      ...dto,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).select().single();
    if (error) throw error;
    return data;
  }
  async update(userId, dto) {
    const { data, error } = await this.getClient().from(this.tableName).update({
      ...dto,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("user_id", userId).select().single();
    if (error) throw error;
    return data;
  }
}
const jwtSign = jwt.sign;
const jwtVerify = jwt.verify;
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_please_change_in_production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_please_change_in_production";
const JWT_EXPIRES_IN = "1h";
const JWT_REFRESH_EXPIRES_IN = "7d";
if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn(
    "⚠️ WARNING: Missing JWT_SECRET or JWT_REFRESH_SECRET in environment. Using fallback secrets for development/testing mode."
  );
}
class AuthService {
  constructor() {
    this.customerRepository = new CustomerRepository();
    this.profileRepository = new ProfileRepository();
  }
  async login(dto) {
    const customer = await this.customerRepository.findByEmail(dto.email);
    if (!customer) {
      throw new Error("Invalid credentials");
    }
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = profile?.role || UserRole.CLIENTE_FINAL;
    const accessToken = this.generateAccessToken(customer.id, customer.email, role);
    const refreshToken2 = this.generateRefreshToken(customer.id);
    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role
        // Role from profiles table
      },
      accessToken,
      refreshToken: refreshToken2,
      expiresIn: 3600
      // 1 hour in seconds
    };
  }
  async register(dto) {
    const existingCustomer = await this.customerRepository.findByEmail(dto.email);
    if (existingCustomer) {
      throw new Error("Email already registered");
    }
    if (dto.cpf) {
      const existingByCpf = await this.customerRepository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }
    const customer = await this.customerRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      cpf: dto.cpf,
      sponsor_id: dto.sponsor_id,
      status: "pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    await this.profileRepository.create({
      user_id: customer.id,
      name: customer.name,
      email: customer.email,
      role: UserRole.CLIENTE_FINAL,
      status: "active"
    });
    const profile = await this.profileRepository.findByUserId(customer.id);
    const role = profile?.role || UserRole.CLIENTE_FINAL;
    const accessToken = this.generateAccessToken(customer.id, customer.email, role);
    const refreshToken2 = this.generateRefreshToken(customer.id);
    return {
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role
        // Role from profiles table
      },
      accessToken,
      refreshToken: refreshToken2,
      expiresIn: 3600
    };
  }
  async refreshToken(dto) {
    try {
      const decoded = jwtVerify(dto.refreshToken, JWT_REFRESH_SECRET);
      const customer = await this.customerRepository.findById(decoded.userId);
      if (!customer) {
        throw new Error("Invalid refresh token");
      }
      const profile = await this.profileRepository.findByUserId(customer.id);
      const role = profile?.role || UserRole.CLIENTE_FINAL;
      const accessToken = this.generateAccessToken(customer.id, customer.email, role);
      const refreshToken2 = this.generateRefreshToken(customer.id);
      return {
        user: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role
          // Role from profiles table
        },
        accessToken,
        refreshToken: refreshToken2,
        expiresIn: 3600
      };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }
  async changePassword(userId, _dto) {
    const customer = await this.customerRepository.findById(userId);
    if (!customer) {
      throw new Error("Customer not found");
    }
  }
  async logout(_userId) {
  }
  generateAccessToken(userId, email, role) {
    return jwtSign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
  generateRefreshToken(userId) {
    return jwtSign(
      { userId },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }
  verifyAccessToken(token) {
    try {
      const decoded = jwtVerify(token, JWT_SECRET);
      return decoded;
    } catch {
      throw new Error("Invalid access token");
    }
  }
}
const authService = new AuthService();
const login_createServerFn_handler = createServerRpc({
  id: "3ae50d5fbd08d913b97060ea2710fb029482e149b7cab82f071e48073ccbb562",
  name: "login",
  filename: "src/backend/modules/auth/api/auth.api.ts"
}, (opts) => login.__executeServer(opts));
const login = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return loginSchema.parse(data);
}).handler(login_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await authService.login(data);
    return {
      success: true,
      data: result,
      message: "Login successful"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed"
    };
  }
});
const register_createServerFn_handler = createServerRpc({
  id: "6c63cc5c13b2c548a69e164175665da51ce4783fc9021072a562c3aba4883ed5",
  name: "register",
  filename: "src/backend/modules/auth/api/auth.api.ts"
}, (opts) => register.__executeServer(opts));
const register = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return registerSchema.parse(data);
}).handler(register_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await authService.register(data);
    return {
      success: true,
      data: result,
      message: "Registration successful"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed"
    };
  }
});
const refreshToken_createServerFn_handler = createServerRpc({
  id: "dcc80f70e3d7e464ecd805064dfdce1472f9bf5d765c53219b18eb76311ea8ab",
  name: "refreshToken",
  filename: "src/backend/modules/auth/api/auth.api.ts"
}, (opts) => refreshToken.__executeServer(opts));
const refreshToken = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return refreshTokenSchema.parse(data);
}).handler(refreshToken_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await authService.refreshToken(data);
    return {
      success: true,
      data: result,
      message: "Token refreshed successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Token refresh failed"
    };
  }
});
const changePassword_createServerFn_handler = createServerRpc({
  id: "e7e7987feccb168669aedb50329071d4933cf12f2b9d0d057e2c0409bb68b74d",
  name: "changePassword",
  filename: "src/backend/modules/auth/api/auth.api.ts"
}, (opts) => changePassword.__executeServer(opts));
const changePassword = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    userId: stringType().uuid(),
    data: changePasswordSchema
  }).parse(data);
}).handler(changePassword_createServerFn_handler, async ({
  data
}) => {
  try {
    await authService.changePassword(data.userId, data.data);
    return {
      success: true,
      message: "Password changed successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Password change failed"
    };
  }
});
const logout_createServerFn_handler = createServerRpc({
  id: "410d71c1bfbc2d32a207b3ea521b6e05c8f99f563c3beed3f25618b4808f93a9",
  name: "logout",
  filename: "src/backend/modules/auth/api/auth.api.ts"
}, (opts) => logout.__executeServer(opts));
const logout = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    userId: stringType().uuid()
  }).parse(data);
}).handler(logout_createServerFn_handler, async ({
  data
}) => {
  try {
    await authService.logout(data.userId);
    return {
      success: true,
      message: "Logout successful"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed"
    };
  }
});
export {
  changePassword_createServerFn_handler,
  login_createServerFn_handler,
  logout_createServerFn_handler,
  refreshToken_createServerFn_handler,
  register_createServerFn_handler
};
