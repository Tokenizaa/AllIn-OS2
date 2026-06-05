import { z } from "zod";
import { CustomerService } from "../services/customer.service";
import { paginationSchema, filterSchema } from "../../../shared/dto/pagination.dto";
import { createCustomerSchema, updateCustomerSchema } from "../dto/customer.dto";

const customerService = new CustomerService();

export const getCustomers = async (data: unknown) => {
  const parsed = paginationSchema.merge(filterSchema).parse(data);
  try {
    const result = await customerService.findAll(parsed);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customers",
    };
  }
};

export const getCustomerById = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const customer = await customerService.findById(parsed.id);
    if (!customer) {
      return {
        success: false,
        error: "Customer not found",
      };
    }
    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer",
    };
  }
};

export const getCustomer360 = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    const customer = await customerService.getCustomer360(parsed.id);
    if (!customer) {
      return {
        success: false,
        error: "Customer not found",
      };
    }
    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer 360",
    };
  }
};

export const createCustomer = async (data: unknown) => {
  const parsed = createCustomerSchema.parse(data);
  try {
    const customer = await customerService.create(parsed);
    return {
      success: true,
      data: customer,
      message: "Customer created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create customer",
    };
  }
};

export const updateCustomer = async (data: unknown) => {
  const parsed = z.object({
    id: z.string().uuid(),
    data: updateCustomerSchema,
  }).parse(data);
  try {
    const customer = await customerService.update(parsed.id, parsed.data);
    return {
      success: true,
      data: customer,
      message: "Customer updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update customer",
    };
  }
};

export const deleteCustomer = async (data: unknown) => {
  const parsed = z.object({ id: z.string().uuid() }).parse(data);
  try {
    await customerService.delete(parsed.id);
    return {
      success: true,
      message: "Customer deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete customer",
    };
  }
};

export const getCustomerStats = async () => {
  try {
    const stats = await customerService.getStats();
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch customer stats",
    };
  }
};

export const getCustomerDownlines = async (data: unknown) => {
  const parsed = z.object({
    sponsorId: z.string().uuid(),
    ...paginationSchema.shape,
  }).parse(data);
  try {
    const result = await customerService.getDownlines(parsed.sponsorId, parsed);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch downlines",
    };
  }
};
