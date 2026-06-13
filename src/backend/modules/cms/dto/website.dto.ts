/**
 * Website DTOs
 * 
 * DTOs para operações com website/CMS.
 */

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name: string;
  published_at?: Date;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface CreatePageDTO {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
}

export interface UpdatePageDTO {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published' | 'archived';
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
}

export interface PageResponseDTO {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name: string;
  published_at?: Date;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Menu {
  id: string;
  name: string;
  slug: string;
  items: MenuItem[];
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MenuItem {
  id: string;
  label: string;
  url?: string;
  page_id?: string;
  parent_id?: string;
  order: number;
  active: boolean;
}

export interface CreateMenuDTO {
  name: string;
  slug: string;
  items?: MenuItem[];
  active?: boolean;
}

export interface UpdateMenuDTO {
  name?: string;
  slug?: string;
  items?: MenuItem[];
  active?: boolean;
}

export interface WebsiteSettings {
  id: string;
  site_name: string;
  site_tagline?: string;
  site_logo?: string;
  site_favicon?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo?: {
    default_meta_title?: string;
    default_meta_description?: string;
    default_meta_keywords?: string;
  };
  analytics?: {
    google_analytics_id?: string;
    facebook_pixel_id?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface UpdateWebsiteSettingsDTO {
  site_name?: string;
  site_tagline?: string;
  site_logo?: string;
  site_favicon?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo?: {
    default_meta_title?: string;
    default_meta_description?: string;
    default_meta_keywords?: string;
  };
  analytics?: {
    google_analytics_id?: string;
    facebook_pixel_id?: string;
  };
}
