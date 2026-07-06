import { httpClient } from "@/lib/api-client/http-client";

export const getCustomerPayments = async (data: { customerId: string; limit?: number }) => {
  const result = await httpClient.getPaymentById(data.customerId);
  if (!result.success) throw new Error(result.error || "Failed to fetch customer payments");
  return result.data;
};
