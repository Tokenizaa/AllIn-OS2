import { useAuth } from "@/modules/auth";

export function useMyProfile() {
  const { user } = useAuth();
  return { data: user, isLoading: false, error: null };
}
