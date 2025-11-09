import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehicle } from '../types/vehicle.types';
import { parsePhotos, formatFeatures } from '../types/vehicle.types';
import './VehicleModal.css';

// 🔄 ДОДАНО
import { isAuthenticated, hasPaymentCard, setPendingVehicle } from '../utils/auth.utils';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImages = (): string[] => {
    const photosArray = parsePhotos(vehicle.photos);
    if (photosArray.length > 0) return photosArray;
    if (vehicle.photoUrl) return [vehicle.photoUrl];
    return ['https://via.placeholder.com/800x400?text=No+Image'];
  };

  const getBatteryChargeClass = (charge?: number): string => {
    if (!charge) return 'charge-medium';
    if (charge >= 70) return 'charge-full';
    if (charge >= 55) return 'charge-good';
    if (charge >= 35) return 'charge-medium';
    if (charge >= 15) return 'charge-low';
    return 'charge-critical';
  };

  const handlePreviousImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // 🔄 ОНОВЛЕНО handleReserve
  const handleReserve = () => {
    console.log('🚗 Спроба забронювати транспорт:', vehicle.id);

    // 1️⃣ Завжди зберігаємо pendingVehicleId ПЕРШИМ
    setPendingVehicle(vehicle.id);
    console.log('✅ pendingVehicleId збережено:', vehicle.id);

    // 2️⃣ Перевірка авторизації
    if (!isAuthenticated()) {
      console.log('❌ Користувач не авторизований - редірект на login');
      alert('Для бронювання транспорту потрібно увійти в систему');
      onClose();
      navigate('/auth/login');
      return;
    }

    // 3️⃣ Перевірка чи є збережена картка
    if (!hasPaymentCard()) {
      console.log('💳 Картка не прив\'язана - редірект на payment/terms');
      onClose();
      navigate('/payment/terms');
      return;
    }

    // 4️⃣ Якщо все ОК - бронюємо транспорт
    console.log('✅ Транспорт заброньовано:', vehicle.id);
    alert(`Транспорт ${vehicle.displayName || vehicle.brand} успішно заброньовано!`);
    onClose();
    navigate('/transport');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const images = getImages();
  const features = formatFeatures(vehicle);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="car-detail-card">
          <button className="back-arrow" onClick={onClose} aria-label="Закрити">
            <svg width="19" height="34" viewBox="0 0 19 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5833 31.1667L2 16.5833L16.5833 2" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="header">
            <h1>{vehicle.displayName || `${vehicle.brand} ${vehicle.model}`}</h1>
          </div>

          <div className="content">
            <div className="left-section">
              <div className="image-container">
                <div className="car-year">{vehicle.year}</div>

                {images.length > 1 && (
                  <button className="arrow-left" onClick={handlePreviousImage} aria-label="Попереднє фото">‹</button>
                )}

                <img
                  src={images[currentImageIndex]}
                  alt={`${vehicle.displayName} ${vehicle.year}`}
                  className="detail-car-image"
                />

                {images.length > 1 && (
                  <button className="arrow-right" onClick={handleNextImage} aria-label="Наступне фото">›</button>
                )}

                {images.length > 1 && (
                  <div className="image-indicators">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Перейти до фото ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="right-section">
              <div className="features-grid">
                <div className="feature-item silver">
                  <span>{vehicle.transmission || 'Автомат'}</span>
                </div>
                <div className={`feature-item ${vehicle.hasCamera ? 'silver' : 'disabled'}`}>
                  <span>{vehicle.hasCamera ? 'Камера' : 'Без камери'}</span>
                </div>

                <div className={`feature-item ${getBatteryChargeClass(vehicle.batteryPct ?? undefined)}`}>
                  <span>{vehicle.batteryPct || 0}% Залишок заряду</span>
                </div>
                <div className={`feature-item ${vehicle.hasAirConditioning ? 'silver' : 'disabled'}`}>
                  <span>{vehicle.hasAirConditioning ? 'З кондиціонером' : 'Без кондиціонера'}</span>
                </div>

                <div className="feature-item green">
                  <span>{vehicle.unlockFee} ₴ + {vehicle.perMinute} ₴/хв</span>
                </div>
                <div className="feature-item silver">
                  <span>Салон: {vehicle.seatMaterial || vehicle.color}</span>
                </div>

                <div className="register-wrapper">
                  <div
                    className="feature-item green"
                    onClick={handleReserve}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Забронювати</span>
                  </div>
                  <div className="link-text">Зареєструватись, а потім орендувати</div>
                </div>
                <div className="feature-item silver">
                  <span>🔌 {features.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3>Динаміка і витрата</h3>
              <p>{vehicle.descriptionDynamics || `${vehicle.brand} ${vehicle.model} забезпечує чудову динаміку.`}</p>
            </div>
            <div className="info-card">
              <h3>Двигун</h3>
              <p>{vehicle.descriptionEngine || `Електродвигун ${vehicle.brand} ${vehicle.model}. Безшумна робота та ефективність.`}</p>
            </div>
            <div className="info-card">
              <h3>Коробка передач і привід</h3>
              <p>{vehicle.descriptionTransmission || `Автоматична трансмісія з адаптивною системою рекуперації.`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
