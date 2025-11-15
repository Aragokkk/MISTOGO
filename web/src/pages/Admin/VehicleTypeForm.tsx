/* === ВСЕ ПОЛЯ ТЕПЕР З ЧОРНИМ ТЕКСТОМ === */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface VehicleTypeFormData {
  code: string;
  name: string;
  iconUrl: string;
  requiresLicense: boolean;
  minAge: number;
  maxSpeedKmh: number;
  isActive: boolean;
}

export default function VehicleTypeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<VehicleTypeFormData>({
    code: "",
    name: "",
    iconUrl: "/icons/default.svg",
    requiresLicense: false,
    minAge: 16,
    maxSpeedKmh: 25,
    isActive: true,
  });

  useEffect(() => {
    if (id) loadVehicleType();
  }, [id]);

  const loadVehicleType = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://mistogo.online/api";
      const response = await fetch(`${API_URL}/vehicle_types/${id}`);

      if (!response.ok) throw new Error("Помилка завантаження");

      const data = await response.json();

      setFormData({
        code: data.code || "",
        name: data.name || "",
        iconUrl: data.iconUrl || data.icon_url || "/icons/default.svg",
        requiresLicense: data.requiresLicense ?? data.requires_license ?? false,
        minAge: data.minAge || data.min_age || 16,
        maxSpeedKmh: data.maxSpeedKmh || data.max_speed_kmh || 25,
        isActive: data.isActive ?? data.is_active ?? true,
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
      const API_URL = import.meta.env.VITE_API_URL || "https://mistogo.online/api";
      const token = localStorage.getItem("auth_token");

      const url = id
        ? `${API_URL}/vehicle_types/${id}`
        : `${API_URL}/vehicle_types`;

      const response = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Помилка збереження");

      alert("Збережено успішно!");
      navigate("/admin/tables/vehicle_types");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">

        <button
          onClick={() => navigate("/admin/tables/vehicle_types")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Назад до списку
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6 text-black">
            {id ? "Редагувати тип транспорту" : "Додати тип транспорту"}
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* GRID START */}
            <div className="grid grid-cols-2 gap-4">

              {/* CODE */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Код (англійською) *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="bike"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             text-black placeholder-black focus:text-black"
                />
              </div>

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Назва *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Велосипед"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             text-black placeholder-black focus:text-black"
                />
              </div>
            </div>

            {/* ICON URL */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                URL іконки
              </label>
              <input
                type="text"
                name="iconUrl"
                value={formData.iconUrl}
                onChange={handleChange}
                placeholder="/icons/bike.svg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           text-black placeholder-black"
              />
            </div>

            {/* AGE + SPEED */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Мінімальний вік
                </label>
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleChange}
                  min="14"
                  max="25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Макс. швидкість (км/год)
                </label>
                <input
                  type="number"
                  name="maxSpeedKmh"
                  value={formData.maxSpeedKmh}
                  onChange={handleChange}
                  min="20"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             text-black"
                />
              </div>
            </div>

            {/* CHECKBOXES */}
            <div className="space-y-2">

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id="requiresLicense"
                  name="requiresLicense"
                  checked={formData.requiresLicense}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="requiresLicense" className="text-sm font-medium text-black">
                  🪪 Потрібне водійське посвідчення
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-black">
                  ✓ Активний (доступний для використання)
                </label>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Збереження..." : "Зберегти"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/tables/vehicle_types")}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-black"
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
