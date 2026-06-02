import { c as createServerRpc } from "./createServerRpc-DVlpEVy8.js";
import { a as createServerFn } from "./server-DdVc0fX6.js";
import { z } from "zod";
import { C as CustomerRepository } from "./customer.repository-CaT-CUpr.js";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.js";
import { c as createCustomerSchema, u as updateCustomerSchema } from "./customer.dto-DyDOhQHZ.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "./base.repository-C1yp6j9c.js";
import "@supabase/supabase-js";
import "node:process";
class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }
  async findAll(params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    const filters = {};
    if (params.status) {
      filters.status = params.status;
    }
    const [data, total] = await Promise.all([
      this.repository.findAll({ filters, limit, offset }),
      this.repository.count(filters)
    ]);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async findById(id) {
    return this.repository.findById(id);
  }
  async getCustomer360(id) {
    return this.repository.getCustomer360(id);
  }
  async create(dto) {
    const existingByEmail = await this.repository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new Error("Email already registered");
    }
    if (dto.cpf) {
      const existingByCpf = await this.repository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }
    return this.repository.create({
      ...dto,
      status: "pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async update(id, dto) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Customer not found");
    }
    if (dto.email && dto.email !== existing.email) {
      const existingByEmail = await this.repository.findByEmail(dto.email);
      if (existingByEmail) {
        throw new Error("Email already registered");
      }
    }
    if (dto.cpf && dto.cpf !== existing.cpf) {
      const existingByCpf = await this.repository.findByCpf(dto.cpf);
      if (existingByCpf) {
        throw new Error("CPF already registered");
      }
    }
    return this.repository.update(id, {
      ...dto,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async delete(id) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Customer not found");
    }
    await this.repository.delete(id);
  }
  async getDownlines(sponsorId, params) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.repository.findBySponsorId(sponsorId, { limit, offset }),
      this.repository.count({ sponsor_id: sponsorId })
    ]);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  async getStats() {
    const [total, active, inactive, pending, suspended] = await Promise.all([
      this.repository.count(),
      this.repository.countByStatus("active"),
      this.repository.countByStatus("inactive"),
      this.repository.countByStatus("pending"),
      this.repository.countByStatus("suspended")
    ]);
    return { total, active, inactive, pending, suspended };
  }
}
const customerService = new CustomerService();
const getCustomers_createServerFn_handler = createServerRpc({
  id: "02ed2db877d1329c3f89f2d0123785a24e1de4a932eef4ba90471d8774175029",
  name: "getCustomers",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => getCustomers.__executeServer(opts));
const getCustomers = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).parse(data);
}).handler(getCustomers_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await customerService.findAll(data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customers"
    };
  }
});
const getCustomerById_createServerFn_handler = createServerRpc({
  id: "4eceb507747e1c868792089856e9bcbd4a17e74e7791b8fd58e650dbf8ca8105",
  name: "getCustomerById",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => getCustomerById.__executeServer(opts));
const getCustomerById = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(getCustomerById_createServerFn_handler, async ({
  data
}) => {
  try {
    const customer = await customerService.findById(data.id);
    if (!customer) {
      return {
        success: false,
        error: "Customer not found"
      };
    }
    return {
      success: true,
      data: customer
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer"
    };
  }
});
const getCustomer360_createServerFn_handler = createServerRpc({
  id: "d1761d2b4501607114d7c50a1280e22c3da01d6d6268171d611051940eebb70e",
  name: "getCustomer360",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => getCustomer360.__executeServer(opts));
const getCustomer360 = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(getCustomer360_createServerFn_handler, async ({
  data
}) => {
  try {
    const customer = await customerService.getCustomer360(data.id);
    if (!customer) {
      return {
        success: false,
        error: "Customer not found"
      };
    }
    return {
      success: true,
      data: customer
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer 360"
    };
  }
});
const createCustomer_createServerFn_handler = createServerRpc({
  id: "9ce74d56ab10e90f28f2e429e94c51bf32876c96e72f9fb625dbf596d2132039",
  name: "createCustomer",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => createCustomer.__executeServer(opts));
const createCustomer = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createCustomerSchema.parse(data);
}).handler(createCustomer_createServerFn_handler, async ({
  data
}) => {
  try {
    const customer = await customerService.create(data);
    return {
      success: true,
      data: customer,
      message: "Customer created successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create customer"
    };
  }
});
const updateCustomer_createServerFn_handler = createServerRpc({
  id: "58e1a547d3e3f2d3313faf4b5e6e7b161ce3f1a4d095949927aa1c67cb3ca850",
  name: "updateCustomer",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => updateCustomer.__executeServer(opts));
const updateCustomer = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid(),
    data: updateCustomerSchema
  }).parse(data);
}).handler(updateCustomer_createServerFn_handler, async ({
  data
}) => {
  try {
    const customer = await customerService.update(data.id, data.data);
    return {
      success: true,
      data: customer,
      message: "Customer updated successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update customer"
    };
  }
});
const deleteCustomer_createServerFn_handler = createServerRpc({
  id: "f9cd1413aa36a15a5a64ba3ab7c0ba3a39d48448a5e85091c1fcca39231134d8",
  name: "deleteCustomer",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => deleteCustomer.__executeServer(opts));
const deleteCustomer = createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return z.object({
    id: z.string().uuid()
  }).parse(data);
}).handler(deleteCustomer_createServerFn_handler, async ({
  data
}) => {
  try {
    await customerService.delete(data.id);
    return {
      success: true,
      message: "Customer deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete customer"
    };
  }
});
const getCustomerStats_createServerFn_handler = createServerRpc({
  id: "2638aa65bcb56a71bb06629bdf7ca0f265523e4c4d344109a004b09cd1305a21",
  name: "getCustomerStats",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => getCustomerStats.__executeServer(opts));
const getCustomerStats = createServerFn({
  method: "GET"
}).handler(getCustomerStats_createServerFn_handler, async () => {
  try {
    const stats = await customerService.getStats();
    return {
      success: true,
      data: stats
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer stats"
    };
  }
});
const getCustomerDownlines_createServerFn_handler = createServerRpc({
  id: "c71e207075728f54c0952e19a61639519ef727356c74f211fa9240f8da0beb17",
  name: "getCustomerDownlines",
  filename: "src/backend/modules/customers/api/customers.api.ts"
}, (opts) => getCustomerDownlines.__executeServer(opts));
const getCustomerDownlines = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return z.object({
    sponsorId: z.string().uuid(),
    ...paginationSchema.shape
  }).parse(data);
}).handler(getCustomerDownlines_createServerFn_handler, async ({
  data
}) => {
  try {
    const result = await customerService.getDownlines(data.sponsorId, data);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch downlines"
    };
  }
});
export {
  createCustomer_createServerFn_handler,
  deleteCustomer_createServerFn_handler,
  getCustomer360_createServerFn_handler,
  getCustomerById_createServerFn_handler,
  getCustomerDownlines_createServerFn_handler,
  getCustomerStats_createServerFn_handler,
  getCustomers_createServerFn_handler,
  updateCustomer_createServerFn_handler
};
