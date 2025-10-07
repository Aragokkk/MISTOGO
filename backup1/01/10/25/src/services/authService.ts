export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string; // лише для фронту (не відправляємо)
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
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserDto;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function safeParse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try { return text ? JSON.parse(text) as T : ({} as T); }
  catch { return { message: text } as unknown as T; }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await safeParse<T>(res);
  if (!res.ok) throw new Error((data as any)?.message || 'Сталася помилка запиту');
  return data;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  },
  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  saveUser(user: UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
  },
  getUser(): UserDto | null {
    const s = localStorage.getItem('user');
    return s ? JSON.parse(s) as UserDto : null;
  },
  logout(): void {
    this.removeToken();
    localStorage.removeItem('user');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const { email, password, fullName, phone } = data; // не шлемо confirmPassword
    return request<AuthResponse>(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password, fullName, phone })
    });
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    return request<AuthResponse>(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    return request<{ message: string }>(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email })
    });
  }
};
