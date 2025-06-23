
const API_BASE_URL = 'http://localhost/hospital-api'; // Change this to your XAMPP path

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  phone_number?: string;
  avatar?: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_phone_number?: string;
  doctor_id: string;
  doctor_name: string;
  date: string;
  time: string;
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medication: string;
  dosage: string;
  frequency: string;
  date: string;
  notes?: string;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
    }
  }

  // Authentication
  async login(email: string, password: string, role: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  }

  async register(name: string, email: string, password: string, role: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.makeRequest('/auth/logout.php', {
      method: 'POST'
    });
  }

  // Users
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.makeRequest<User>('/users/current.php');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.makeRequest<User>(`/users/${id}.php`);
  }

  async getDoctors(): Promise<ApiResponse<User[]>> {
    return this.makeRequest<User[]>('/users/doctors.php');
  }

  // Appointments
  async getAppointments(userId: string, userRole: string): Promise<ApiResponse<Appointment[]>> {
    return this.makeRequest<Appointment[]>(`/appointments/list.php?user_id=${userId}&role=${userRole}`);
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<ApiResponse<Appointment>> {
    return this.makeRequest<Appointment>('/appointments/create.php', {
      method: 'POST',
      body: JSON.stringify(appointment)
    });
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.makeRequest<Appointment>(`/appointments/update.php`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates })
    });
  }

  async deleteAppointment(id: string): Promise<ApiResponse> {
    return this.makeRequest(`/appointments/delete.php`, {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  }

  async getAvailableTimes(doctorId: string, date: string): Promise<ApiResponse<string[]>> {
    return this.makeRequest<string[]>(`/appointments/available-times.php?doctor_id=${doctorId}&date=${date}`);
  }

  // Prescriptions
  async getPrescriptions(patientId: string): Promise<ApiResponse<Prescription[]>> {
    return this.makeRequest<Prescription[]>(`/prescriptions/list.php?patient_id=${patientId}`);
  }

  async createPrescription(prescription: Omit<Prescription, 'id'>): Promise<ApiResponse<Prescription>> {
    return this.makeRequest<Prescription>('/prescriptions/create.php', {
      method: 'POST',
      body: JSON.stringify(prescription)
    });
  }
}

export const apiService = new ApiService();
export type { User, Appointment, Prescription, ApiResponse };
