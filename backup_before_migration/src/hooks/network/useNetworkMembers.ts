import { useNetwork } from "./useNetwork";

export function useNetworkMembers(limit = 500) {
  return useNetwork(limit);
}
