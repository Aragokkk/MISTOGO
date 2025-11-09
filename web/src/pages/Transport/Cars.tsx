import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVehiclesByType } from '../../services/vehicleService';
import type { Vehicle } from '../../types/vehicle.types';
import VehicleModal from '../../components/VehicleModal';
import './Cars.css';

export default function CarsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await getVehiclesByType('car');
      setCars(data);
    } catch (err) {
      setError('Не вдалося завантажити автомобілі');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCarClick = (car: Vehicle) => {
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
  };

  if (loading) {
    return (
      <div className="cars-page">
        <div className="page-header-section">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="page-main-title">{t('cars_page.title')}</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Завантаження автомобілів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cars-page">
        <div className="page-header-section">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="page-main-title">{t('cars_page.title')}</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadCars}>Спробувати знову</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cars-page">
      {/* Page Header */}
      <div className="page-header-section">
        <button className="back-button" onClick={() => navigate(-1)}>
         <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
           <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="page-main-title">{t('cars_page.title')}</h1>
      </div>

      {/* Cars Grid */}
      <section className="cars-catalog-section">
        <div className="cars-grid">
          {cars.map((car) => (
            <div 
              key={car.id} 
              className="car-card"
              onClick={() => handleCarClick(car)}
              style={{ cursor: 'pointer' }}
            >
              <div className="car-image">
                <img 
                  src={car.photoUrl || '/image/Car.png'} 
                  alt={car.displayName || `${car.brand} ${car.model}`} 
                />
              </div>

              <h3 className="car-name">
                {car.displayName || `${car.brand} ${car.model}`}
              </h3>

              <div className="car-specs">
                <div className="spec-row">
                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 26" fill="none">
                      <path d="M13.2308 2H26.1539" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <path d="M8.9231 12.3433V20.1559C8.9231 21.1977 9.72279 22.065 10.7611 22.1493L14.5729 22.459C14.9037 22.4859 15.2226 22.5947 15.5009 22.7756L17.6568 24.1769C17.9812 24.3878 18.3598 24.5 18.7467 24.5H29.0769C30.1815 24.5 31.0769 23.6046 31.0769 22.5V10.5C31.0769 9.39543 30.1815 8.5 29.0769 8.5H12.8137C12.292 8.5 11.791 8.70382 11.4175 9.068L9.5269 10.9113C9.14082 11.2877 8.9231 11.8041 8.9231 12.3433Z" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                    <span className="spec-text">{car.transmission || 'Автомат'}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                      <path d="M22.75 27.625H8.125M30.875 11.375H16.25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z" stroke="currentColor" strokeWidth="3"/>
                      <path d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                    <span className="spec-text">{car.maxSpeed || 180} км/год</span>
                  </div>
                </div>

                <div className="spec-row">
                  <span className="spec-text spec-price">
                    {car.unlockFee ? `${car.unlockFee} ₴` : 'Ціна не вказана'}
                  </span>
                  <span className="spec-text spec-year">{car.year || '2024'}</span>
                </div>
              </div>

              <button 
                className="car-select-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCarClick(car);
                }}
              >
                {t('cars_page.select_button')}
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
                  <path d="M8.20068 23.3703L14.8209 16.7501L8.20068 10.1299M17.469 23.3703L24.0892 16.7501L17.469 10.1299" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="no-cars">
            <p>Автомобілів поки немає</p>
          </div>
        )}
      </section>

      {/* Other Transport Section */}
      <section className="other-transport-section">
        <div className="section-content">
          <h2 className="section-title">{t('cars_page.other_transport_title')}</h2>

          <div className="transport-cards">
            <div className="transport-card" onClick={() => navigate("/transport/cars")}>
              <div className="transport-image">
                <img src="/image/Car.png" alt={t('cars')} />
              </div>
              <h3 className="transport-name">{t('cars')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/cars");
                }}
              >
                {t('cars_page.select_button')} <span>»</span>
              </button>
            </div>

            <div className="transport-card" onClick={() => navigate("/transport/bikes")}>
              <div className="transport-image">
                <img src="/image/Bicycle.png" alt={t('bikes')} />
              </div>
              <h3 className="transport-name">{t('bikes')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/bikes");
                }}
              >
                {t('cars_page.select_button')} <span>»</span>
              </button>
            </div>

            <div className="transport-card" onClick={() => navigate("/transport/scooters")}>
              <div className="transport-image">
                <img src="/image/Electrosamocat.png" alt={t('scooters')} />
              </div>
              <h3 className="transport-name">{t('scooters')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/scooters");
                }}
              >
                {t('cars_page.select_button')} <span>»</span>
              </button>
            </div>

            <div className="transport-card" onClick={() => navigate("/transport/mopeds")}>
              <div className="transport-image">
                <img src="/image/Motobike.png" alt={t('mopeds')} />
              </div>
              <h3 className="transport-name">{t('mopeds')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/mopeds");
                }}
              >
                {t('cars_page.select_button')} <span>»</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedCar && (
        <VehicleModal 
          vehicle={selectedCar} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}