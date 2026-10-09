import type {
  DisciplineMeta,
  PortfolioItem,
} from '../data/portfolio';
import type { HomeData } from '../data/home';
import type { ReelItem } from '../data/reels';
import type { JournalPost } from '../data/journal';
import type { AboutData } from '../data/about';
import type { ServicesPageData } from '../data/services';
import type { SiteMetadata } from '../data/site';
import type { ContactData } from '../data/contact';

export type {
  DisciplineId,
  DisciplineMeta,
  PortfolioItem,
} from '../data/portfolio';
export type { HomeData, SelectedWorkItem } from '../data/home';
export type { ReelItem, ReelCategory } from '../data/reels';
export type { JournalPost, JournalCategory } from '../data/journal';
export type { AboutData } from '../data/about';
export type { ServicesPageData, ServiceGroup, ServiceItem } from '../data/services';
export type { SiteMetadata, NavItem, SocialLink } from '../data/site';
export type { ContactData } from '../data/contact';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  date?: string;
  location?: string;
  message: string;
}

export interface ContactFormResponse {
  ok: boolean;
  id: number | string;
}

const RAW_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Strip any trailing slashes from base URL
const BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal JSON fetch helper with Django trailing-slash normalization and error encapsulation.
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Preserve query string while ensuring the path has a trailing slash for Django
  const [pathname, search] = cleanEndpoint.split('?');
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const normalizedUrl = search ? `${normalizedPath}?${search}` : normalizedPath;

  const url = `${BASE_URL}${normalizedUrl}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error
        ? error.message
        : 'Network connection failed. Please ensure the backend server is running.',
      0
    );
  }
}

/**
 * Portfolio API services
 */
export const portfolioApi = {
  async getDisciplines(): Promise<DisciplineMeta[]> {
    return request<DisciplineMeta[]>('/disciplines');
  },

  async getItems(params?: {
    discipline?: string;
    category?: string;
    featured?: boolean;
  }): Promise<PortfolioItem[]> {
    const query = new URLSearchParams();
    if (params?.discipline && params.discipline !== 'all') {
      query.set('discipline', params.discipline);
    }
    if (params?.category && params.category !== 'all') {
      query.set('category', params.category);
    }
    if (params?.featured !== undefined) {
      query.set('featured', String(params.featured));
    }

    const queryString = query.toString();
    const endpoint = queryString ? `/portfolio?${queryString}` : '/portfolio';
    return request<PortfolioItem[]>(endpoint);
  },

  async getItemBySlug(slug: string): Promise<PortfolioItem> {
    return request<PortfolioItem>(`/portfolio/${slug}`);
  },

  async getHome(): Promise<HomeData> {
    return request<HomeData>('/home');
  },
};

/**
 * Reels API services
 */
export const reelsApi = {
  async getItems(category?: string): Promise<ReelItem[]> {
    const query = new URLSearchParams();
    if (category && category !== 'all') {
      query.set('category', category);
    }
    const queryString = query.toString();
    const endpoint = queryString ? `/reels?${queryString}` : '/reels';
    return request<ReelItem[]>(endpoint);
  },

  async getItemBySlug(slug: string): Promise<ReelItem> {
    return request<ReelItem>(`/reels/${slug}`);
  },
};

/**
 * Journal API services
 */
export const journalApi = {
  async getItems(category?: string): Promise<JournalPost[]> {
    const query = new URLSearchParams();
    if (category && category !== 'all') {
      query.set('category', category);
    }
    const queryString = query.toString();
    const endpoint = queryString ? `/journal?${queryString}` : '/journal';
    return request<JournalPost[]>(endpoint);
  },

  async getItemBySlug(slug: string): Promise<JournalPost> {
    return request<JournalPost>(`/journal/${slug}`);
  },
};

/**
 * About page API services
 */
export const aboutApi = {
  async getAbout(): Promise<AboutData> {
    return request<AboutData>('/about');
  },
};

/**
 * Services page API services
 */
export const servicesApi = {
  async getServices(): Promise<ServicesPageData> {
    return request<ServicesPageData>('/services');
  },
};

/**
 * Site Chrome / Settings API services
 */
export const siteApi = {
  async getSite(): Promise<SiteMetadata & Partial<ContactData>> {
    return request<SiteMetadata & Partial<ContactData>>('/site');
  },
};

/**
 * Contact Inquiry submission services
 */
export const contactApi = {
  async submit(data: ContactFormData): Promise<ContactFormResponse> {
    return request<ContactFormResponse>('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};
