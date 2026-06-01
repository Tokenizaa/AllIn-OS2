export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  logo?: string;
  banner?: string;
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
    address: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    customDomain?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  date: string;
}

export const storeInfoData: StoreInfo = {
  id: "store-placeholder",
  name: "Loja",
  slug: "store",
  description: "Loja pública carregada em runtime.",
  category: "Geral",
  city: "Brasil",
  rating: 0,
  reviewCount: 0,
  contact: {
    whatsapp: "",
    instagram: "",
    email: "",
    address: "",
  },
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

export const reviewsData: Review[] = [];
