// API Service Layer untuk Klinik Harmoni
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://app.klinikharmoni.my/api/public';
const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_URL || 'https://app.klinikharmoni.my/storage';

// Helper function to get full storage URL for images
export const getStorageUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined;
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise prepend storage base URL
  return `${STORAGE_BASE_URL}/${path}`;
};

export interface BookingData {
  branch_id: number;
  service_id?: number;
  doctor_id?: number;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  patient_name: string;
  patient_ic: string;
  contact_phone: string;
  contact_email?: string;
  symptoms_description?: string;
  preferred_language?: 'ms' | 'en';
}

export interface Branch {
  id: number;
  name: string;
  slug: string;
  address: string;
  contact_phone: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  short_description?: string | null;
  featured_image?: string | null;
  gallery_images?: string[];
  latitude?: number;
  longitude?: number;
  google_maps_url?: string;
  waze_url?: string;
  operating_hours?: Record<string, { is_open: boolean; open: string; close: string } | string> | null;
  today_hours?: string | null;
  is_currently_open?: boolean;
  accepts_online_booking: boolean;
}

export interface Doctor {
  id: number;
  name: string;
  title: string;
  specialization: string;
  profile_image?: string;
  bio?: string;
  qualifications?: string[];
  languages?: string[];
  branch?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  category?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  tags?: string[] | null;
  icon?: string | null;
  featured_image?: string | null;
  gallery_images?: string[];
  show_price?: boolean;
  price_range?: string | null;
  price_from?: number | null;
  price_to?: number | null;
  price_unit?: string | null;
  is_featured: boolean;
  branches?: {
    id: number;
    name: string;
    slug: string;
    address: string;
    accepts_online_booking: boolean;
  }[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string | null;
}

export interface Promo {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  code?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  image?: string;
  image_mobile?: string;
  button_text?: string;
  button_url?: string;
  button_style: string;
  text_color: string;
  overlay_color: string;
  overlay_opacity: number;
  position: string;
  starts_at?: string;
  ends_at?: string;
}

export interface Testimonial {
  id: number;
  patient_name: string;
  patient_title?: string;
  patient_image?: string;
  message: string;
  rating: number;
  is_verified: boolean;
  service?: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  page_type: string;
  content?: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  image_mobile?: string;
  button_text?: string;
  button_url?: string;
  button_style: string;
  text_color: string;
  overlay_color: string;
  overlay_opacity: number;
  position: string;
}

export interface ClinicTrustMetric {
  label: string;
  value: string;
  suffix?: string | null;
}

export interface ClinicTrust {
  metrics?: ClinicTrustMetric[];
  badges?: string[];
  partners?: string[];
}

export interface ClinicContact {
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
}

export interface ClinicSocial {
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
}

export interface ClinicInfo {
  name: string;
  tagline?: string | null;
  logo?: string | null;
  favicon?: string | null;
  contact?: ClinicContact;
  operating_hours?: Record<string, string> | null;
  social?: ClinicSocial;
  about?: {
    mission?: string | null;
    vision?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
  };
  trust?: ClinicTrust;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('API Request:', url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          errors: data.errors,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Banners API
  async getBanners(): Promise<ApiResponse<Banner[]>> {
    return this.request('/banners');
  }

  // Promos API
  async getPromos(): Promise<ApiResponse<Promo[]>> {
    return this.request('/promos');
  }

  async getFeaturedPromos(): Promise<ApiResponse<Promo[]>> {
    return this.request('/promos/featured');
  }

  async getPromoByCode(code: string): Promise<ApiResponse<Promo>> {
    return this.request(`/promos/${code}`);
  }

  // Testimonials API
  async getTestimonials(params?: { featured?: boolean; limit?: number }): Promise<ApiResponse<Testimonial[]>> {
    const queryParams = new URLSearchParams();
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/testimonials${query}`);
  }

  async getFeaturedTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    return this.request('/testimonials/featured');
  }

  // Pages API
  async getPages(): Promise<ApiResponse<Page[]>> {
    return this.request('/pages');
  }

  async getPage(slug: string): Promise<ApiResponse<Page>> {
    return this.request(`/pages/${slug}`);
  }

  async getPageByType(type: string): Promise<ApiResponse<Page>> {
    return this.request(`/pages/type/${type}`);
  }

  // Clinic Info API
  async getClinicInfo(): Promise<ApiResponse<ClinicInfo>> {
    return this.request('/clinic-info');
  }

  // Booking API
  async createBooking(bookingData: BookingData): Promise<ApiResponse<{
    booking_reference: string;
    branch: { name: string; address: string; contact_phone: string | null };
    appointment: { date: string; time: string; service?: string | null; doctor?: string | null };
    patient: { name: string };
  }>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookingByReference(reference: string): Promise<ApiResponse<{
    booking_reference: string;
    status: string;
    branch: { name: string; address: string; contact_phone: string | null; google_maps_url?: string | null; waze_url?: string | null };
    appointment: { date: string; time: string; service?: string | null; doctor?: string | null };
    patient: { name: string };
    is_confirmed: boolean;
    is_cancelled: boolean;
    cancelled_at?: string | null;
    cancellation_reason?: string | null;
  }>> {
    return this.request(`/bookings/${reference}`);
  }

  async cancelBooking(reference: string): Promise<ApiResponse<void>> {
    return this.request(`/bookings/${reference}/cancel`, {
      method: 'POST',
    });
  }

  // Branch API
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    return this.request('/branches');
  }

  async getBranch(slug: string): Promise<ApiResponse<Branch>> {
    return this.request(`/branches/${slug}`);
  }

  async getBranchDoctors(slug: string): Promise<ApiResponse<Doctor[]>> {
    return this.request(`/branches/${slug}/doctors`);
  }

  async getBranchSlots(slug: string, date: string, doctorId?: number): Promise<ApiResponse<TimeSlot[]>> {
    const params = new URLSearchParams({ date });
    if (doctorId) params.append('doctor_id', doctorId.toString());
    return this.request(`/branches/${slug}/slots?${params}`);
  }

  async getBranchAvailableDates(
    slug: string,
    days?: number
  ): Promise<ApiResponse<Array<{ date: string; day_of_week: string; open: string; close: string }>>> {
    const params = new URLSearchParams();
    if (days) params.append('days', days.toString());
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/branches/${slug}/available-dates${query}`);
  }

  // Doctor API
  async getDoctors(params?: { branch_id?: number }): Promise<ApiResponse<Doctor[]>> {
    const queryParams = new URLSearchParams();
    if (params?.branch_id) queryParams.append('branch_id', params.branch_id.toString());
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/doctors${query}`);
  }

  async getDoctor(id: number): Promise<ApiResponse<Doctor>> {
    return this.request(`/doctors/${id}`);
  }

  // Service API
  async getServices(params?: { category?: string; branch_id?: number }): Promise<ApiResponse<Service[]>> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.branch_id) queryParams.append('branch_id', params.branch_id.toString());
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/services${query}`);
  }

  async getFeaturedServices(): Promise<ApiResponse<Service[]>> {
    return this.request('/services/featured');
  }

  async getServiceCategories(): Promise<ApiResponse<string[]>> {
    return this.request('/services/categories');
  }

  async getService(slug: string): Promise<ApiResponse<Service>> {
    return this.request(`/services/${slug}`);
  }

  // Contact API
  async sendContactMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<{ id: string }>> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Utility functions
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
  return phoneRegex.test(phone);
};

// Error handling utilities
export const handleApiError = (error: ApiResponse<unknown>): string => {
  if (error.errors) {
    const firstError = Object.values(error.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }
  return error.message || 'An unexpected error occurred';
};
