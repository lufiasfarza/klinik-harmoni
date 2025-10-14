// API Service Layer untuk Klinik Harmoni
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export interface BookingData {
  branch_id: number;
  doctor_id?: number;
  service_id: number;
  appointment_date: string; // YYYY-MM-DD format
  appointment_time: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  bio: string;
  branch: string;
  schedule: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  min_price: number;
  max_price: number;
  price_range_display: string;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  branches_offering_service: {
    id: number;
    name: string;
    address: string;
    phone: string;
    price: number;
    operating_hours: string;
  }[];
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

  // Booking API
  async createBooking(bookingData: BookingData): Promise<ApiResponse<{ id: number; booking_id: string }>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(): Promise<ApiResponse<BookingData[]>> {
    return this.request('/bookings');
  }

  // Branch API
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    return this.request('/branches');
  }

  async getBranch(id: string): Promise<ApiResponse<Branch>> {
    return this.request(`/branches/${id}`);
  }

  // Doctor API
  async getDoctors(): Promise<ApiResponse<Doctor[]>> {
    return this.request('/doctors');
  }

  async getDoctor(id: string): Promise<ApiResponse<Doctor>> {
    return this.request(`/doctors/${id}`);
  }

  async getDoctorsByBranch(branchId: string): Promise<ApiResponse<Doctor[]>> {
    return this.request(`/branches/${branchId}/doctors`);
  }

  // Service API
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request('/services');
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    return this.request(`/services/${id}`);
  }

  // Availability API
  async getAvailableSlots(
    branchId: number,
    date: string
  ): Promise<ApiResponse<string[]>> {
    return this.request(`/availability?branch=${branchId}&date=${date}`);
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

  // Newsletter API
  async subscribeNewsletter(email: string): Promise<ApiResponse<{ id: string }>> {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
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
  const phoneRegex = /^[\+]?[0-9\s\-()]{10,15}$/;
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
