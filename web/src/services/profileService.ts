export interface UploadPhotoResponse {
  success: boolean;
  message: string;
  photoUrl?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5012';
// Базовий URL без /api для статичних файлів
const BASE_URL = API_URL.replace(/\/api$/, '');

export const profileService = {
  async uploadPhoto(userId: number, file: File): Promise<UploadPhotoResponse> {
    console.log('📤 Uploading photo for user:', userId);
    
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('file', file);

    const response = await fetch(`${API_URL}/profile/upload-photo`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Upload failed:', data);
      throw new Error(data.message || 'Помилка завантаження фото');
    }
    
    console.log('✅ Photo uploaded successfully:', data);
    return data;
  },

  async deletePhoto(userId: number): Promise<{ success: boolean; message: string }> {
    console.log('🗑️ Deleting photo for user:', userId);
    
    const response = await fetch(`${API_URL}/profile/delete-photo/${userId}`, {
      method: 'DELETE'
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Delete failed:', data);
      throw new Error(data.message || 'Помилка видалення фото');
    }
    
    console.log('✅ Photo deleted successfully');
    return data;
  },

  getPhotoUrl(photoUrl?: string): string {
    if (!photoUrl) {
      console.log('⚠️ No photo URL provided');
      return '';
    }
    
    // Якщо URL вже повний (починається з http), повертаємо як є
    if (photoUrl.startsWith('http')) {
      console.log('🔗 Full URL:', photoUrl);
      return photoUrl;
    }
    
    // Для статичних файлів використовуємо BASE_URL (без /api)
    const fullUrl = `${BASE_URL}${photoUrl}`;
    console.log('🔗 Generated URL:', fullUrl);
    return fullUrl;
  }
};