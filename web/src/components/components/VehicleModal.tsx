import React, { useState } from 'react';
import type { Vehicle } from '../types/vehicle.types';
import { parsePhotos, formatFeatures } from '../types/vehicle.types';
import './VehicleModal.css';

interface VehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Отримати масив фото
  const getImages = (): string[] => {
    const photosArray = parsePhotos(vehicle.photos);
    if (photosArray.length > 0) return photosArray;
    if (vehicle.photoUrl) return [vehicle.photoUrl];
    return ['https://via.placeholder.com/800x400?text=No+Image'];
  };

  // Функція для визначення класу кольору батареї
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
    setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  const handleReserve = () => {
    alert('Транспорт заброньовано!');
    onClose();
  };

  // Закрити при кліку на backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Закрити при натисканні Escape
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
          {/* Стрілка назад */}
          <button className="back-arrow" onClick={onClose} aria-label="Закрити">
            <svg width="19" height="34" viewBox="0 0 19 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5833 31.1667L2 16.5833L16.5833 2" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Заголовок */}
          <div className="header">
            <h1>{vehicle.displayName || `${vehicle.brand} ${vehicle.model}`}</h1>
          </div>

          <div className="content">
            {/* Ліва секція */}
            <div className="left-section">
              {/* Контейнер з фото */}
              <div className="image-container">
                <div className="car-year">{vehicle.year}</div>
                
                {/* Стрілка вліво */}
                {images.length > 1 && (
                  <button 
                    className="arrow-left" 
                    onClick={handlePreviousImage}
                    aria-label="Попереднє фото"
                  >
                    <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M25.2974 29.1887C24.7813 29.1887 24.2863 29.3937 23.9214 29.7587C23.5565 30.1236 23.3514 30.6186 23.3514 31.1347L23.3514 36.8538C23.4374 37.2945 23.3684 37.7513 23.156 38.1469C22.9436 38.5425 22.6009 38.8525 22.1861 39.0243C21.7712 39.1961 21.3098 39.2191 20.8799 39.0895C20.45 38.9599 20.0781 38.6857 19.8274 38.3132L6.52492 25.0108C6.30681 24.7927 6.13379 24.5338 6.01575 24.2488C5.89771 23.9638 5.83695 23.6584 5.83695 23.3499C5.83695 23.0415 5.89771 22.736 6.01575 22.4511C6.13379 22.1661 6.30681 21.9072 6.52492 21.6891L19.8274 8.38859C20.0781 8.01613 20.45 7.74186 20.8799 7.61226C21.3098 7.48266 21.7712 7.50572 22.1861 7.67752C22.6009 7.84932 22.9436 8.15929 23.156 8.55488C23.3684 8.95047 23.4374 9.40735 23.3514 9.84804L23.3514 15.5671C23.3514 16.0832 23.5565 16.5782 23.9214 16.9431C24.2863 17.3081 24.7813 17.5131 25.2974 17.5131L36.973 17.5131C37.4891 17.5131 37.9841 17.7181 38.349 18.083C38.7139 18.448 38.9189 18.9429 38.9189 19.459L38.9189 27.2428C38.9189 27.7589 38.7139 28.2538 38.349 28.6188C37.9841 28.9837 37.4891 29.1887 36.973 29.1887L25.2974 29.1887Z" stroke="#1F1F1F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M25.2974 29.1887C24.7813 29.1887 24.2863 29.3937 23.9214 29.7587C23.5565 30.1236 23.3514 30.6186 23.3514 31.1347L23.3514 36.8538C23.4374 37.2945 23.3684 37.7513 23.156 38.1469C22.9436 38.5425 22.6009 38.8525 22.1861 39.0243C21.7712 39.1961 21.3098 39.2191 20.8799 39.0895C20.45 38.9599 20.0781 38.6857 19.8274 38.3132L6.52492 25.0108C6.30681 24.7927 6.13379 24.5338 6.01575 24.2488C5.89771 23.9638 5.83695 23.6584 5.83695 23.3499C5.83695 23.0415 5.89771 22.736 6.01575 22.4511C6.13379 22.1661 6.30681 21.9072 6.52492 21.6891L19.8274 8.38859C20.0781 8.01613 20.45 7.74186 20.8799 7.61226C21.3098 7.48266 21.7712 7.50572 22.1861 7.67752C22.6009 7.84932 22.9436 8.15929 23.156 8.55488C23.3684 8.95047 23.4374 9.40735 23.3514 9.84804L23.3514 15.5671C23.3514 16.0832 23.5565 16.5782 23.9214 16.9431C24.2863 17.3081 24.7813 17.5131 25.2974 17.5131L36.973 17.5131C37.4891 17.5131 37.9841 17.7181 38.349 18.083C38.7139 18.448 38.9189 18.9429 38.9189 19.459L38.9189 27.2428C38.9189 27.7589 38.7139 28.2538 38.349 28.6188C37.9841 28.9837 37.4891 29.1887 36.973 29.1887L25.2974 29.1887Z" stroke="#AFD06E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}

                {/* Фото транспорту */}
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${vehicle.displayName} ${vehicle.year}`}
                  className="detail-car-image"
                />

                {/* Стрілка вправо */}
                {images.length > 1 && (
                  <button 
                    className="arrow-right" 
                    onClick={handleNextImage}
                    aria-label="Наступне фото"
                  >
                    <svg width="39" height="37" viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.1216 12.4836C16.6377 12.4836 17.1326 12.2786 17.4975 11.9137C17.8625 11.5488 18.0675 11.0538 18.0675 10.5377V4.8186C17.9815 4.3779 18.0506 3.92103 18.263 3.52544C18.4754 3.12985 18.818 2.81988 19.2329 2.64808C19.6477 2.47628 20.1092 2.45322 20.5391 2.58282C20.969 2.71242 21.3408 2.98669 21.5916 3.35914L34.894 16.6616C35.1121 16.8797 35.2852 17.1386 35.4032 17.4236C35.5212 17.7085 35.582 18.014 35.582 18.3224C35.582 18.6309 35.5212 18.9363 35.4032 19.2213C35.2852 19.5063 35.1121 19.7652 34.894 19.9833L21.5916 33.2838C21.3408 33.6562 20.969 33.9305 20.5391 34.0601C20.1092 34.1897 19.6477 34.1666 19.2329 33.9948C18.818 33.823 18.4754 33.5131 18.263 33.1175C18.0506 32.7219 17.9815 32.265 18.0675 31.8243V26.1052C18.0675 25.5891 17.8625 25.0942 17.4975 24.7292C17.1326 24.3643 16.6377 24.1593 16.1216 24.1593H4.44594C3.92984 24.1593 3.43489 23.9543 3.06995 23.5893C2.70502 23.2244 2.5 22.7294 2.5 22.2133V14.4296C2.5 13.9135 2.70502 13.4185 3.06995 13.0536C3.43489 12.6887 3.92984 12.4836 4.44594 12.4836H16.1216Z" stroke="#1F1F1F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.1216 12.4836C16.6377 12.4836 17.1326 12.2786 17.4975 11.9137C17.8625 11.5488 18.0675 11.0538 18.0675 10.5377V4.8186C17.9815 4.3779 18.0506 3.92103 18.263 3.52544C18.4754 3.12985 18.818 2.81988 19.2329 2.64808C19.6477 2.47628 20.1092 2.45322 20.5391 2.58282C20.969 2.71242 21.3408 2.98669 21.5916 3.35914L34.894 16.6616C35.1121 16.8797 35.2852 17.1386 35.4032 17.4236C35.5212 17.7085 35.582 18.014 35.582 18.3224C35.582 18.6309 35.5212 18.9363 35.4032 19.2213C35.2852 19.5063 35.1121 19.7652 34.894 19.9833L21.5916 33.2838C21.3408 33.6562 20.969 33.9305 20.5391 34.0601C20.1092 34.1897 19.6477 34.1666 19.2329 33.9948C18.818 33.823 18.4754 33.5131 18.263 33.1175C18.0506 32.7219 17.9815 32.265 18.0675 31.8243V26.1052C18.0675 25.5891 17.8625 25.0942 17.4975 24.7292C17.1326 24.3643 16.6377 24.1593 16.1216 24.1593H4.44594C3.92984 24.1593 3.43489 23.9543 3.06995 23.5893C2.70502 23.2244 2.5 22.7294 2.5 22.2133V14.4296C2.5 13.9135 2.70502 13.4185 3.06995 13.0536C3.43489 12.6887 3.92984 12.4836 4.44594 12.4836H16.1216Z" stroke="#AFD06E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}

                {/* Індикатори слайдів */}
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

            {/* Права секція */}
            <div className="right-section">
              {/* Сітка характеристик */}
              <div className="features-grid">
                <div className="feature-item silver">
                  <span>{vehicle.transmission || 'Автомат'}</span>
                </div>
                <div className={`feature-item ${vehicle.hasCamera ? 'silver' : 'disabled'}`}>
                  <span> {vehicle.hasCamera ? 'Камера' : 'Без камери'}</span>
                </div>
                
                <div className={`feature-item ${getBatteryChargeClass(vehicle.batteryPct ?? undefined)}`}>
                  <span>{vehicle.batteryPct || 0}% Залишок заряду</span>
                </div>
                <div className={`feature-item ${vehicle.hasAirConditioning ? 'silver' : 'disabled'}`}>
                  <span> {vehicle.hasAirConditioning ? 'З кондиціонером' : 'Без кондиціонера'}</span>
                </div>
                
                <div className="feature-item green">
                  <span> {vehicle.unlockFee} ₴ + {vehicle.perMinute} ₴/хв</span>
                </div>
                <div className="feature-item silver">
                  <span> Салон: {vehicle.seatMaterial || vehicle.color}</span>
                </div>
                
                <div className="register-wrapper">
                  <div className="feature-item green" onClick={handleReserve} style={{ cursor: 'pointer' }}>
                    <span>Забронювати</span>
                  </div>
                  <div className="link-text">
                    Зареєструватись, а потім орендувати
                  </div>
                </div>
                <div className="feature-item silver">
                  <span>🔌 {features.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Нижні інформаційні картки на всю ширину */}
          <div className="info-cards">
            <div className="info-card">
              <h3>Динаміка і витрата</h3>
              <p>{vehicle.descriptionDynamics || `${vehicle.brand} ${vehicle.model} з максимальною потужністю забезпечує чудову динаміку. Економічний та надійний транспорт для міста.`}</p>
            </div>
            <div className="info-card">
              <h3>Двигун</h3>
              <p>{vehicle.descriptionEngine || `Електродвигун ${vehicle.brand} ${vehicle.model}. Безшумна робота та висока ефективність. Батарея з високою ємністю.`}</p>
            </div>
            <div className="info-card">
              <h3>Коробка передач і привід</h3>
              <p>{vehicle.descriptionTransmission || `Автоматична трансмісія з плавним переключенням. Адаптивна система рекуперації енергії під час гальмування.`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;