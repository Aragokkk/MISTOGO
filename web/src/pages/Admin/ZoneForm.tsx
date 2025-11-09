import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ZoneFormData {
  name: string;
  code: string;
  description: string;
  centerLat: number;
  centerLng: number;
  radius: number;
  isActive: boolean;
  allowedVehicleTypes: string;
}

export default function ZoneForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ZoneFormData>({
    name: "",
    code: "",
    description: "",
    centerLat: 50.45,
    centerLng: 30.52,
    radius: 500,
    isActive: true,
    allowedVehicleTypes: "car,bike,scooter,moped",
  });

  useEffect(() => {
    if (id) {
      loadZone();
    }
  }, [id]);

  const loadZone = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const response = await fetch(`${API_URL}/zones/${id}`);
      
      if (!response.ok) {
        throw new Error('Помилка завантаження');
      }
      
      const data = await response.json();
      setFormData({
        name: data.name || "",
        code: data.code || "",
        description: data.description || "",
        centerLat: data.centerLat || data.center_lat || 50.45,
        centerLng: data.centerLng || data.center_lng || 30.52,
        radius: data.radius || 500,
        isActive: data.isActive !== undefined ? data.isActive : data.is_active !== undefined ? data.is_active : true,
        allowedVehicleTypes: data.allowedVehicleTypes || data.allowed_vehicle_types || "car,bike,scooter,moped",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const url = id 
        ? `${API_URL}/zones/${id}` 
        : `${API_URL}/zones`;
      
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Помилка збереження');
      }

      alert('Збережено успішно!');
      navigate('/admin/zones');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate("/admin/zones")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Назад до списку
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? 'Редагувати зону' : 'Додати зону'}
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Назва зони *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Центр міста"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Код *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="ZONE001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опис
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Опис зони паркування..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Широта центру
                </label>
                <input
                  type="number"
                  name="centerLat"
                  value={formData.centerLat}
                  onChange={handleChange}
                  step="0.000001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Довгота центру
                </label>
                <input
                  type="number"
                  name="centerLng"
                  value={formData.centerLng}
                  onChange={handleChange}
                  step="0.000001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Радіус (м)
                </label>
                <input
                  type="number"
                  name="radius"
                  value={formData.radius}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дозволені типи транспорту
              </label>
              <input
                type="text"
                name="allowedVehicleTypes"
                value={formData.allowedVehicleTypes}
                onChange={handleChange}
                placeholder="car,bike,scooter,moped"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Розділіть типи комами: car, bike, scooter, moped
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Активна зона
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Збереження...' : 'Зберегти'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/zones')}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}