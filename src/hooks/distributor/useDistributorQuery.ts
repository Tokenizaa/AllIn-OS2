import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import { SupabaseService } from "@/modules/auth/services/supabase.service";

export interface DistributorTheme {
  color: string;
  gradient: string;
  badgeBg: string;
  btnBg: string;
  accentText: string;
  slogan: string;
  bio: string;
  quote: string;
  videoUrl?: string;
}

export interface DistributorInfo {
  slug: string;
  name: string;
  rank: string;
  avatar: string;
  theme: DistributorTheme;
  isFallback: boolean;
}

const EMPTY_THEME: DistributorTheme = {
  color: "",
  gradient: "",
  badgeBg: "",
  btnBg: "",
  accentText: "",
  slogan: "",
  bio: "",
  quote: "",
};

function emptyDistributor(slug = ""): DistributorInfo {
  return {
    slug,
    name: "Distribuidor",
    rank: "",
    avatar: "",
    theme: EMPTY_THEME,
    isFallback: true,
  };
}

// Sprint 3: Exportar para uso em loaders
export async function resolveDistributor(slug: string | undefined): Promise<DistributorInfo> {
  const activeSlug = (slug || "").toLowerCase().trim();
  const reservedSlugs = new Set(["_", "admin", "login", "cadastro", "recuperar-senha", "redefinir-senha", "office", "loja"]);
  if (!activeSlug || reservedSlugs.has(activeSlug) || activeSlug.startsWith("admin")) {
    return emptyDistributor();
  }

  const distributorData = await SupabaseService.fetchDistributorBySlug(activeSlug);
  if (distributorData) {
    // Theme functionality is deprecated - distributor_themes table does not exist
    // Using fallback theme
    return {
      slug: activeSlug,
      name: distributorData.nome || distributorData.usuario || "Distribuidor",
      rank: "",
      avatar: "",
      theme: EMPTY_THEME,
      isFallback: false,
    };
  }

  return {
    slug: activeSlug,
    name: "Distribuidor",
    rank: "",
    avatar: "",
    theme: EMPTY_THEME,
    isFallback: true,
  };
}

// Sprint 2: Migrar DistributorProvider para TanStack Query
export function useDistributorQuery(slug: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.distributor, slug] as const,
    queryFn: () => resolveDistributor(slug),
    enabled: !!slug && slug !== "",
  });
}

// Hook para quando não há slug (página inicial)
export function useDistributorDefault() {
  return {
    data: emptyDistributor(),
    isLoading: false,
    error: null,
  };
}
