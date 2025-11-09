/**
 * Vehicle Service - API взаємодія з backend
 * Endpoints: GET /api/vehicles, GET /api/vehicles/:id, POST /api/vehicles/:id/reserve
 */

import type { Vehicle, VehicleFilters } from '../types/vehicle.types';

// ===================== НОРМАЛІЗАЦІЯ BASE URL =====================
// Беремо з .env або дефолт на локалку без /api — ми додамо самі.
const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5000';

// Прибираємо слеші в кінці
const BASE_CLEAN = RAW_BASE.replace(/\/+$/, '');

// Гарантовано додаємо рівно один "/api" (без дублювання), регістр нечутливий
const API_BASE = /\/api$/i.test(BASE_CLEAN) ? BASE_CLEAN : `${BASE_CLEAN}/api`;

// Хелпер для складання query
function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

// ===================== СЕРВІСНІ ВИКЛИКИ =====================

/**
 * Отримати список всіх транспортів
 * @param filters - фільтри (type, status, minBattery, lat, lng, radiusKm)
 */
export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  try {
    console.log('🔗 RAW_BASE:', RAW_BASE);
    console.log('🔗 Нормалізований API_BASE:', API_BASE);
    console.log('🔗 VITE_API_URL:', import.meta.env.VITE_API_URL);

    const params: Record<string, any> = {};
    if (filters?.type) params.type = filters.type;
    if (filters?.status) params.status = filters.status;
    if (filters?.minBattery) params.minBattery = filters.minBattery;
    if (filters?.lat) params.lat = filters.lat;
    if (filters?.lng) params.lng = filters.lng;
    if (filters?.radiusKm) params.radius = Math.round(filters.radiusKm * 1000); // бек очікує метри (якщо так налаштовано)

    const url = `${API_BASE}/vehicles${buildQuery(params)}`;
    console.log('🌐 Повний URL (GET list):', url);

    const res = await fetch(url);
    console.log('✅ Response status:', res.status);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data: Vehicle[] = await res.json();
    console.log('📦 Отримано транспортів:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error fetching vehicles:', error);
    throw error;
  }
}

/**
 * Отримати деталі одного транспорту за ID
 * @param id - ID транспорту
 */
export async function getVehicleById(id: number): Promise<Vehicle> {
  try {
    const url = `${API_BASE}/vehicles/${id}`;
    console.log('🌐 Fetching vehicle:', url);

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Vehicle not found');
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Vehicle = await res.json();
    console.log('✅ Vehicle loaded:', data);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching vehicle ${id}:`, error);
    throw error;
  }
}

/**
 * Отримати транспорт за кодом (CAR001, BIKE005, тощо)
 * @param code - Унікальний код транспорту
 */
export async function getVehicleByCode(code: string): Promise<Vehicle> {
  try {
    const url = `${API_BASE}/vehicles/code/${encodeURIComponent(code)}`;
    console.log('🌐 Fetching by code:', url);

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Vehicle not found');
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: Vehicle = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching vehicle with code ${code}:`, error);
    throw error;
  }
}

/**
 * Забронювати транспорт
 * @param id - ID транспорту
 */
export async function reserveVehicle(id: number): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${API_BASE}/vehicles/${id}/reserve`;
    console.log('🌐 Reserving:', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      let errMsg = '';
      try {
        const e = await res.json();
        errMsg = e?.message;
      } catch {/* ignore */}
      throw new Error(errMsg || `Failed to reserve vehicle (status ${res.status})`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error reserving vehicle ${id}:`, error);
    throw error;
  }
}

/**
 * Отримати транспорти за типом
 * @param type - 'car', 'bike', 'scooter', 'moped'
 */
export async function getVehiclesByType(type: string): Promise<Vehicle[]> {
  return getVehicles({ type });
}

/**
 * Отримати доступні транспорти (status = available, isActive = true)
 */
export async function getAvailableVehicles(): Promise<Vehicle[]> {
  return getVehicles({ status: 'available' });
}

/**
 * Отримати транспорти поблизу (в радіусі)
 * @param lat - Широта
 * @param lng - Довгота
 * @param radiusKm - Радіус в км
 */
export async function getVehiclesNearby(
  lat: number,
  lng: number,
  radiusKm: number = 5
): Promise<Vehicle[]> {
  return getVehicles({ lat, lng, radiusKm });
}

// Export default об'єкт з усіма методами
export default {
  getVehicles,
  getVehicleById,
  getVehicleByCode,
  reserveVehicle,
  getVehiclesByType,
  getAvailableVehicles,
  getVehiclesNearby,
};