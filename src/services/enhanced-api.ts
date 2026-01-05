// Enhanced API Service Layer for Klinik Harmoni
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://app.klinikharmoni.my/api/public';

export interface BookingData {
  branch_id: number;
  doctor_id?: number;
  service_id: number;
  appointment_date: string; // YYYY-MM-DD format
  appointment_time: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  notes?: string;
}

export interface Branch {
  id: number;
  name: string;
  name_ms?: string;
  address: string;
  phone: string;
  operating_hours: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  survey_link?: string;
  is_active: boolean;
  services?: Service[];
  doctors?: Doctor[];
  hours?: OperatingHour[];
}

export interface Doctor {
  id: number;
  name: string;
  name_ms?: string;
  specialization: string;
  specialization_ms?: string;
  qualification?: string;
  qualification_ms?: string;
  experience_years?: number;
  languages?: string[];
  image?: string;
  bio?: string;
  bio_ms?: string;
  is_active: boolean;
  branches?: Branch[];
}

export interface Service {
  id: number;
  name: string;
  name_ms?: string;
  description?: string;
  description_ms?: string;
  price: number;
  min_price: number;
  max_price: number;
  price_range_display: string;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  branches_offering_service?: {
    id: number;
    name: string;
    address: string;
    phone: string;
    price: number;
    operating_hours: string;
  }[];
}

export interface OperatingHour {
  id: number;
  day_of_week: string;
  day_name: string;
  open_time: string;
  close_time: string;
  is_24_hours: boolean;
  is_closed: boolean;
  break_start?: string;
  break_end?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  doctor?: {
    id: number;
    name: string;
    specialization: string;
  };
}

export interface AvailabilityData {
  is_open: boolean;
  time_slots: TimeSlot[];
  operating_hours?: OperatingHour;
  message?: string;
}

export interface Booking {
  id: number;
  branch_id?: number;
  doctor_id?: number;
  service_id?: number;
  appointment_date?: string;
  appointment_time?: string;
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
  notes?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export type ServicePricing = Record<string, unknown>;

export type AvailabilityCheckResult = {
  available?: boolean;
  message?: string;
} & Record<string, unknown>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

class EnhancedApiService {
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
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  // Branch endpoints
  async getBranches(): Promise<ApiResponse<Branch[]>> {
    return this.request<Branch[]>('/branches');
  }

  async getBranch(id: number): Promise<ApiResponse<Branch>> {
    return this.request<Branch>(`/branches/${id}`);
  }

  async getBranchServices(branchId: number): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>(`/branches/${branchId}/services`);
  }

  async getBranchDoctors(branchId: number): Promise<ApiResponse<Doctor[]>> {
    return this.request<Doctor[]>(`/branches/${branchId}/doctors`);
  }

  async getBranchHours(branchId: number): Promise<ApiResponse<OperatingHour[]>> {
    return this.request<OperatingHour[]>(`/branches/${branchId}/hours`);
  }

  async getBranchAvailability(
    branchId: number, 
    date: string, 
    serviceId?: number
  ): Promise<ApiResponse<AvailabilityData>> {
    const params = new URLSearchParams({ date });
    if (serviceId) params.append('service_id', serviceId.toString());
    
    return this.request<AvailabilityData>(`/branches/${branchId}/availability?${params}`);
  }

  // Doctor endpoints
  async getDoctors(): Promise<ApiResponse<Doctor[]>> {
    return this.request<Doctor[]>('/doctors');
  }

  async getDoctor(id: number): Promise<ApiResponse<Doctor>> {
    return this.request<Doctor>(`/doctors/${id}`);
  }

  async getDoctorsByBranch(branchId: number): Promise<ApiResponse<Doctor[]>> {
    return this.request<Doctor[]>(`/doctors/branch/${branchId}`);
  }

  async getDoctorAvailability(
    doctorId: number,
    branchId: number,
    date: string
  ): Promise<ApiResponse<AvailabilityData>> {
    const params = new URLSearchParams({
      branch_id: branchId.toString(),
      date
    });
    
    return this.request<AvailabilityData>(`/doctors/${doctorId}/availability?${params}`);
  }

  async searchDoctors(params: {
    specialization?: string;
    name?: string;
    branch_id?: number;
  }): Promise<ApiResponse<Doctor[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    return this.request<Doctor[]>(`/doctors/search?${searchParams}`);
  }

  // Service endpoints
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>('/services');
  }

  async getService(id: number): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/services/${id}`);
  }

  async getServicesByBranch(branchId: number): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>(`/services/branch/${branchId}`);
  }

  async searchServices(params: {
    category?: string;
    name?: string;
    branch_id?: number;
    price_min?: number;
    price_max?: number;
  }): Promise<ApiResponse<Service[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    return this.request<Service[]>(`/services/search?${searchParams}`);
  }

  async getServiceCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/services/categories');
  }

  async getServicePricing(serviceId: number): Promise<ApiResponse<ServicePricing>> {
    return this.request<ServicePricing>(`/services/${serviceId}/pricing`);
  }

  // Booking endpoints
  async createBooking(bookingData: BookingData): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(params?: {
    branch_id?: number;
    doctor_id?: number;
    service_id?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    patient_email?: string;
    per_page?: number;
  }): Promise<ApiResponse<Booking[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    return this.request<Booking[]>(`/bookings?${searchParams}`);
  }

  async getBooking(id: number): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}`);
  }

  async updateBooking(id: number, data: { status: string; notes?: string }): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: number): Promise<ApiResponse<Booking>> {
    return this.request<Booking>(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }

  async checkAvailability(data: {
    branch_id: number;
    service_id: number;
    appointment_date: string;
    appointment_time: string;
    doctor_id?: number;
  }): Promise<ApiResponse<AvailabilityCheckResult>> {
    return this.request<AvailabilityCheckResult>('/bookings/check-availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Utility methods
  async getAvailability(
    branchId: number,
    serviceId: number,
    date: string,
    doctorId?: number
  ): Promise<TimeSlot[]> {
    try {
      const response = await this.getBranchAvailability(branchId, date, serviceId);
      
      if (response.success && response.data?.time_slots) {
        // Filter by doctor if specified
        if (doctorId) {
          return response.data.time_slots.filter(slot => 
            slot.available && slot.doctor?.id === doctorId
          );
        }
        
        return response.data.time_slots.filter(slot => slot.available);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get availability:', error);
      return [];
    }
  }

  async getNextAvailableDate(branchId: number, serviceId: number): Promise<string | null> {
    try {
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const availability = await this.getBranchAvailability(branchId, dateStr, serviceId);
        
        if (availability.success && availability.data?.is_open) {
          const hasAvailableSlots = availability.data.time_slots.some(slot => slot.available);
          if (hasAvailableSlots) {
            return dateStr;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get next available date:', error);
      return null;
    }
  }
}

export const apiService = new EnhancedApiService();
export default apiService;
