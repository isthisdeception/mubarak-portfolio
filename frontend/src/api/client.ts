import type {
  DisciplineMeta,
  PortfolioItem,
} from '../data/portfolio';
import type { HomeData } from '../data/home';

export type {
  DisciplineId,
  DisciplineMeta,
  PortfolioItem,
} from '../data/portfolio';
export type { HomeData } from '../data/home';



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
  // Ensure trailing slash for Django REST Framework
  const normalizedPath = cleanEndpoint.endsWith('/')
    ? cleanEndpoint
    : `${cleanEndpoint}/`;

  const url = `${BASE_URL}${normalizedPath}`;

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
  /**
   * Fetch all active disciplines and their subcategories
   */
  async getDisciplines(): Promise<DisciplineMeta[]> {
    return request<DisciplineMeta[]>('/disciplines');
  },

  /**
   * Fetch portfolio items with optional server-side filtering
   */
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

  /**
   * Fetch a single portfolio item by unique slug
   */
  async getItemBySlug(slug: string): Promise<PortfolioItem> {
    return request<PortfolioItem>(`/portfolio/${slug}`);
  },

  /**
   * Fetch home page payload including selected works
   */
  async getHome(): Promise<HomeData> {
    return request<HomeData>('/home');
  },
};
