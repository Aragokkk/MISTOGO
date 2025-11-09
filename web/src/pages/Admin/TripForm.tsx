import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface TripFormData {
  userId: number;
  vehicleId: number;
  startTime: string;
  endTime: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  distance: number;
  duration: number;
  cost: number;
  status: string;
}

export default function TripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readOnly] = useState(!!id); // Read-only якщо редагування
  
  const [formData, setFormData] = useState<TripFormData>({
    userId: 0,
    vehicleId: 0,
    startTime: new Date().toISOString().slice(0, 16),
    endTime: "",
    startLat: 50.45,
    startLng: 30.52,
    endLat: 0,
    endLng: 0,
    distance: 0,
    duration: 0,
    cost: 0,
    status: "active",
  });

  useEffect(() => {
    if (id) {
      loadTrip();
    }
  }, [id]);

  const loadTrip = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const response = await fetch(`${API_URL}/trips/${id}`);
      
      if (!response.ok) {
        throw new Error('Помилка завантаження');
      }
      
      const data = await response.json();
      setFormData({
        userId: data.userId || data.user_id || 0,
        vehicleId: data.vehicleId || data.vehicle_id || 0,
        startTime: data.startTime || data.start_time || "",
        endTime: data.endTime || data.end_time || "",
        startLat: data.startLat || data.start_lat || 50.45,
        startLng: data.startLng || data.start_lng || 30.52,
        endLat: data.endLat || data.end_lat || 0,
        endLng: data.endLng || data.end_lng || 0,
        distance: data.distance || 0,
        duration: data.duration || 0,
        cost: data.cost || 0,
        status: data.status || "active",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) {
      alert('Поїздки не можна редагувати, тільки переглядати');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const url = `${API_URL}/trips`;
      
      const response = await fetch(url, {
        method: 'POST',
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
      navigate('/admin/trips');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate("/admin/trips")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Назад до списку
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {id ? 'Деталі поїздки' : 'Створити поїздку'}
            </h1>
            {readOnly && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Тільки перегляд
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Користувача
                </label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Транспорту
                </label>
                <input
                  type="number"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Початок поїздки
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  disabled={readOnly}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Кінець поїздки
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Локація старту</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Широта
                  </label>
                  <input
                    type="number"
                    name="startLat"
                    value={formData.startLat}
                    onChange={handleChange}
                    disabled={readOnly}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Довгота
                  </label>
                  <input
                    type="number"
                    name="startLng"
                    value={formData.startLng}
                    onChange={handleChange}
                    disabled={readOnly}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Локація завершення</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Широта
                  </label>
                  <input
                    type="number"
                    name="endLat"
                    value={formData.endLat}
                    onChange={handleChange}
                    disabled={readOnly}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Довгота
                  </label>
                  <input
                    type="number"
                    name="endLng"
                    value={formData.endLng}
                    onChange={handleChange}
                    disabled={readOnly}
                    step="0.000001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Відстань (км)
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  disabled={readOnly}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тривалість (хв)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Вартість (грн)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  disabled={readOnly}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="active">Активна</option>
                  <option value="completed">Завершена</option>
                  <option value="cancelled">Скасована</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {!readOnly && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Збереження...' : 'Зберегти'}
                </button>
              )}
              
              <button
                type="button"
                onClick={() => navigate('/admin/trips')}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {readOnly ? 'Закрити' : 'Скасувати'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}