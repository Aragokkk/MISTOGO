/**
 * Vehicle Types - TypeScript інтерфейси для транспорту
 */

export interface Vehicle {
  id: number;
  typeId: number;
  code: string;
  displayName?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  registrationNumber?: string;
  
  qrCode?: string;
  photoUrl?: string;
  photos?: string; // JSON string: ["url1", "url2"]
  
  unlockFee?: number;
  perMinute?: number;
  perKm?: number;
  
  // Технічні характеристики
  transmission?: string;
  seatMaterial?: string;
  
  // Електроніка та комфорт
  hasUsb: boolean;
  hasBluetooth: boolean;
  hasCamera: boolean;
  hasAirConditioning: boolean;
  hasHeatedSeats: boolean;
  hasGps: boolean;
  hasParkingSensors: boolean;
  
  // Описи
  descriptionDynamics?: string;
  descriptionEngine?: string;
  descriptionTransmission?: string;
  
  status: string;
  lat?: number;
  lng?: number;
  
  batteryPct?: number;
  fuelPct?: number;
  maxSpeed?: number;  // ← НОВИЙ РЯДОК
  
  totalTrips: number;
  totalKm: number;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  type?: VehicleType;
}

export interface VehicleType {
  id: number;
  code: string;
  name?: string;
  iconUrl?: string;
  requiresLicense: boolean;
  minAge?: number;
  maxSpeedKmh?: number;
  isActive: boolean;
  createdAt: string;
}

export interface VehicleFilters {
  type?: string;
  status?: string;
  minBattery?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

/**
 * Парсинг JSON photos у масив URL
 */
export function parsePhotos(photos?: string): string[] {
  if (!photos) return [];
  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Форматування features у масив для відображення
 */
export function formatFeatures(vehicle: Vehicle): string[] {
  const features: string[] = [];
  if (vehicle.hasUsb) features.push('USB');
  if (vehicle.hasBluetooth) features.push('Bluetooth');
  if (vehicle.hasGps) features.push('GPS');
  if (vehicle.hasCamera) features.push('Камера');
  if (vehicle.hasAirConditioning) features.push('Кондиціонер');
  if (vehicle.hasHeatedSeats) features.push('Підігрів сидінь');
  if (vehicle.hasParkingSensors) features.push('Парктронік');
  return features;
}

/**
 * Отримання кольору для батареї
 */
export function getBatteryColor(batteryPct?: number): string {
  if (!batteryPct) return 'gray';
  if (batteryPct >= 70) return 'green';
  if (batteryPct >= 50) return 'yellow';
  if (batteryPct >= 20) return 'orange';
  return 'red';
}