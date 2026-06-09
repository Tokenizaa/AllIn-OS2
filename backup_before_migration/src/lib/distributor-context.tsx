/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
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

export async function resolveDistributor(slug: string | undefined): Promise<DistributorInfo> {
  const activeSlug = (slug || "").toLowerCase().trim();
  const reservedSlugs = new Set(["_", "_app", "login", "cadastro", "recuperar-senha", "redefinir-senha", "office", "loja"]);
  if (!activeSlug || reservedSlugs.has(activeSlug) || activeSlug.startsWith("_app")) {
    return emptyDistributor();
  }

  const distributorData = await SupabaseService.fetchDistributorBySlug(activeSlug);
  if (distributorData) {
    const themeData = await SupabaseService.fetchDistributorTheme(distributorData.user_id);
    return {
      slug: activeSlug,
      name: distributorData.usuario || distributorData.id_comprador || "Distribuidor",
      rank: distributorData.qualification || "",
      avatar: "",
      theme: {
        color: themeData?.color || "",
        gradient: themeData?.gradient || "",
        badgeBg: themeData?.badge_bg || "",
        btnBg: themeData?.btn_bg || "",
        accentText: themeData?.accent_text || "",
        slogan: themeData?.slogan || "",
        bio: themeData?.bio || "",
        quote: themeData?.quote || "",
        videoUrl: themeData?.video_url || undefined,
      },
      isFallback: false,
    };
  }

  const defaultThemeData = await SupabaseService.fetchDistributorTheme();
  return {
    slug: activeSlug,
    name: "Distribuidor",
    rank: "",
    avatar: "",
    theme: {
      color: defaultThemeData?.color || "",
      gradient: defaultThemeData?.gradient || "",
      badgeBg: defaultThemeData?.badge_bg || "",
      btnBg: defaultThemeData?.btn_bg || "",
      accentText: defaultThemeData?.accent_text || "",
      slogan: defaultThemeData?.slogan || "",
      bio: defaultThemeData?.bio || "",
      quote: defaultThemeData?.quote || "",
      videoUrl: defaultThemeData?.video_url || undefined,
    },
    isFallback: true,
  };
}

interface DistributorContextProps {
  currentDistributor: DistributorInfo;
  setDistributorBySlug: (slug: string) => void;
  loading: boolean;
}

const DistributorContext = createContext<DistributorContextProps | undefined>(undefined);

export const DistributorProvider: React.FC<{ children: React.ReactNode; initialSlug?: string }> = ({
  children,
  initialSlug,
}) => {
  const [slug, setSlug] = useState(() => initialSlug || "");
  const [currentDistributor, setCurrentDistributor] = useState<DistributorInfo>(() => emptyDistributor(initialSlug || ""));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        if (currentPath === "/" || currentPath === "") {
          setCurrentDistributor(emptyDistributor(slug));
          return;
        }
        setCurrentDistributor(await resolveDistributor(slug));
      } catch (error) {
        console.error("[DistributorContext] Error resolving distributor:", error);
        setCurrentDistributor(emptyDistributor(slug));
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <DistributorContext.Provider value={{ currentDistributor, setDistributorBySlug: setSlug, loading }}>
      {children}
    </DistributorContext.Provider>
  );
};

export const useDistributor = () => {
  const context = useContext(DistributorContext);
  if (!context) {
    throw new Error("DistributorProvider not found");
  }
  return context;
};
