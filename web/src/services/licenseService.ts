export interface LicenseStatusDto {
  status: 'none' | 'pending' | 'verified' | 'rejected';
  documentUrl?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectReason?: string;
}

export interface LicenseSubmitResponse {
  success: boolean;
  message: string;
  data?: LicenseStatusDto;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5012';
// Базовий URL без /api для статичних файлів
const BASE_URL = API_URL.replace(/\/api$/, '');

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

// Отримати ID користувача з localStorage (як в authService)
function getUserId(): number | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.id || null;
  } catch {
    return null;
  }
}

export const licenseService = {
  /**
   * Отримати статус водійського посвідчення
   */
  async getStatus(): Promise<LicenseStatusDto> {
    const userId = getUserId();
    if (!userId) {
      throw new Error('Користувач не авторизований');
    }

    const response = await request<ApiResponse<LicenseStatusDto>>(
      `${API_URL}/license/status?userId=${userId}`,
      {
        method: 'GET'
      }
    );
    return response.data || { status: 'none' };
  },

  /**
   * Завантажити водійське посвідчення
   */
  async submit(file: File): Promise<LicenseSubmitResponse> {
    const userId = getUserId();
    if (!userId) {
      throw new Error('Користувач не авторизований');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    const res = await fetch(`${API_URL}/license/submit`, {
      method: 'POST',
      body: formData
    });

    const data = await safeParse<LicenseSubmitResponse>(res);
    
    if (!res.ok) {
      throw new Error(data.message || 'Помилка при завантаженні документа');
    }
    
    return data;
  },

  /**
   * Скасувати відправлення (видалити документ)
   */
  async cancel(): Promise<ApiResponse<null>> {
    const userId = getUserId();
    if (!userId) {
      throw new Error('Користувач не авторизований');
    }

    return request<ApiResponse<null>>(
      `${API_URL}/license/cancel?userId=${userId}`,
      {
        method: 'DELETE'
      }
    );
  },

  /**
   * Отримати URL документа для перегляду
   */
  getDocumentUrl(documentUrl: string): string {
    if (documentUrl.startsWith('http')) {
      return documentUrl;
    }
    // Для статичних файлів використовуємо BASE_URL (без /api)
    return `${BASE_URL}${documentUrl}`;
  }
};