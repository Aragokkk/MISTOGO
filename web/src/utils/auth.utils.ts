// src/utils/auth.utils.ts
import { UserDto } from '../services/authService';

export const getUser = (): UserDto | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserDto;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getUser();
  const isAuth = user !== null && user.id > 0;
  
  console.log('🔍 Перевірка авторизації:', { 
    hasUser: !!user,
    userId: user?.id,
    isAuthenticated: isAuth
  });
  
  return isAuth;
};

export const getUserId = (): number | null => {
  const user = getUser();
  return user?.id || null;
};

export const hasPaymentCard = (): boolean => {
  const hasCard = localStorage.getItem('hasPaymentCard') === 'true';
  console.log('💳 Перевірка картки:', hasCard);
  return hasCard;
};

export const getPendingVehicleId = (): number | null => {
  const vehicleId = localStorage.getItem('pendingVehicleId');
  return vehicleId ? Number(vehicleId) : null;
};

export const clearPendingVehicle = (): void => {
  console.log('🧹 Очищення pendingVehicleId');
  localStorage.removeItem('pendingVehicleId');
};

export const setPendingVehicle = (vehicleId: number): void => {
  console.log('📌 Збереження pendingVehicleId:', vehicleId);
  localStorage.setItem('pendingVehicleId', String(vehicleId));
};

export const setPaymentCardFlag = (hasCard: boolean): void => {
  console.log('💳 Встановлення hasPaymentCard:', hasCard);
  localStorage.setItem('hasPaymentCard', String(hasCard));
};

// Для дебагу - виведе всі дані авторизації
export const debugAuthState = (): void => {
  const user = getUser();
  console.log('🔍 Стан авторизації:', {
    isAuthenticated: isAuthenticated(),
    user: user,
    userId: user?.id,
    hasPaymentCard: hasPaymentCard(),
    pendingVehicleId: getPendingVehicleId(),
    localStorage: {
      user: localStorage.getItem('user'),
      hasPaymentCard: localStorage.getItem('hasPaymentCard'),
      pendingVehicleId: localStorage.getItem('pendingVehicleId')
    }
  });
};
