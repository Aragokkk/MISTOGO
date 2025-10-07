export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  balance?: number;
  role: string;
  phoneVerified?: boolean;
  licenseVerified?: boolean;
}

// Відповідь від Register
export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: number;
  email: string;
}

// Відповідь від Login
export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserDto;
}

// Відповідь від Forgot Password
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  testCode?: string; // тільки для тестування
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function safeParse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) as T : ({} as T);
  } catch {
    return { message: text } as unknown as T;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await safeParse<T>(res);
  if (!res.ok) {
    throw new Error((data as any)?.message || 'Сталася помилка запиту');
  }
  return data;
}

export const authService = {
  // LocalStorage для збереження користувача
  saveUser(user: UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser(): UserDto | null {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) as UserDto : null;
  },
  
  logout(): void {
    localStorage.removeItem('user');
  },

  // API методи
  async register(data: RegisterData): Promise<RegisterResponse> {
    const { email, password, fullName, phone } = data;
    const response = await request<RegisterResponse>(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, phone })
    });
    return response;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await request<LoginResponse>(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Зберігаємо користувача після успішного входу
    if (response.success && response.user) {
      this.saveUser(response.user);
    }
    
    return response;
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return request<ForgotPasswordResponse>(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  }
};