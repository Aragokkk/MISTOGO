import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVehiclesByType } from '../../services/vehicleService';
import type { Vehicle } from '../../types/vehicle.types';
import VehicleModal from '../../components/VehicleModal';
import './Scooters.css';

export default function ScootersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scooters, setScooters] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScooter, setSelectedScooter] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadScooters();
  }, []);

  const loadScooters = async () => {
    try {
      setLoading(true);
      const data = await getVehiclesByType('scooter');
      setScooters(data);
    } catch (err) {
      setError('Не вдалося завантажити самокати');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScooterClick = (scooter: Vehicle) => {
    setSelectedScooter(scooter);
  };

  const handleCloseModal = () => {
    setSelectedScooter(null);
  };

  if (loading) {
    return (
      <div className="scooters-page">
        <div className="page-header-section">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="page-main-title">{t('scooters_page.title')}</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Завантаження самокатів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scooters-page">
        <div className="page-header-section">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="page-main-title">{t('scooters_page.title')}</h1>
        </div>
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadScooters}>Спробувати знову</button>
        </div>
      </div>
    );
  }

  return (
    <div className="scooters-page">
      {/* Page Header */}
      <div className="page-header-section">
        <button className="back-button" onClick={() => navigate(-1)}>
         <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
           <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="page-main-title">{t('scooters_page.title')}</h1>
      </div>

      {/* Scooters Grid */}
      <section className="scooters-catalog-section">
        <div className="scooters-grid">
          {scooters.map((scooter) => (
            <div 
              key={scooter.id} 
              className="scooter-card"
              onClick={() => handleScooterClick(scooter)}
              style={{ cursor: 'pointer' }}
            >
              <div className="scooter-image">
                <img 
                  src={scooter.photoUrl || '/image/Electrosamocat.png'} 
                  alt={scooter.displayName || `${scooter.brand} ${scooter.model}`} 
                />
              </div>

              <h3 className="scooter-name">
                {scooter.displayName || `${scooter.brand} ${scooter.model}`}
              </h3>

              <div className="scooter-specs">
                <div className="spec-row">
                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.875 11.375L13 19.5H19.5L14.625 27.625M24.141 9.75H26C26.862 9.75 27.6886 10.0924 28.2981 10.7019C28.9076 11.3114 29.25 12.138 29.25 13V26C29.25 26.862 28.9076 27.6886 28.2981 28.2981C27.6886 28.9076 26.862 29.25 26 29.25H21.2306M35.75 22.75V16.25M8.3525 29.25H6.5C5.63805 29.25 4.8114 28.9076 4.2019 28.2981C3.59241 27.6886 3.25 26.862 3.25 26V13C3.25 12.138 3.59241 11.3114 4.2019 10.7019C4.8114 10.0924 5.63805 9.75 6.5 9.75H11.271" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="spec-text">{scooter.batteryPct || 0}%</span>
                  </div>

                  <div className="spec-item">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_989_4364)">
                        <path d="M30 19.7495C29.9985 17.2651 29.1557 14.8341 27.5733 12.7495C27 11.999 25.239 12.7505 26 14.0933C27.1928 15.8041 27.8226 17.7583 27.8227 19.7495C27.8227 21.2104 30 21 30 19.7495Z" fill="#C6C6C6" />
                        <path d="M28 9.16373C29 7.99996 27.5 6.99973 26.5859 7.74973L18.019 16.3166C17.4093 15.9493 16.7118 15.7534 16 15.7497C15.2089 15.7497 14.4355 15.9843 13.7777 16.4239C13.1199 16.8634 12.6072 17.4881 12.3045 18.219C12.0017 18.9499 11.9225 19.7542 12.0769 20.5301C12.2312 21.306 12.6122 22.0187 13.1716 22.5782C13.731 23.1376 14.4437 23.5185 15.2196 23.6729C15.9956 23.8272 16.7998 23.748 17.5307 23.4452C18.2616 23.1425 18.8864 22.6298 19.3259 21.972C19.7654 21.3142 20 20.5409 20 19.7497C19.9963 19.0379 19.8004 18.3404 19.4331 17.7306L28 9.16373ZM16 21.7497C15.6044 21.7497 15.2178 21.6324 14.8889 21.4127C14.56 21.1929 14.3036 20.8805 14.1522 20.5151C14.0009 20.1496 13.9613 19.7475 14.0384 19.3595C14.1156 18.9716 14.3061 18.6152 14.5858 18.3355C14.8655 18.0558 15.2219 17.8653 15.6098 17.7882C15.9978 17.711 16.3999 17.7506 16.7654 17.902C17.1308 18.0533 17.4432 18.3097 17.6629 18.6386C17.8827 18.9675 18 19.3542 18 19.7497C17.9994 20.28 17.7885 20.7883 17.4135 21.1633C17.0386 21.5382 16.5302 21.7491 16 21.7497Z" fill="#C6C6C6" />
                        <path d="M15.651 8.60716C17.739 8.60809 19.7882 9.14517 21.5826 10.1619C23 11 24 9.5 23 8.8121C20.9396 7.55044 18.5603 6.84092 16.1123 6.75817C13.6643 6.67542 11.2381 7.22251 9.089 8.34188C6.93989 9.46125 5.1473 11.1115 3.8998 13.1191C2.65231 15.1266 1.99604 17.4173 2.00002 19.75C2 21.5 4 21.5 3.95016 19.75C3.95369 16.7958 5.18759 13.9635 7.38116 11.8745C9.57473 9.78559 12.5488 8.61053 15.651 8.60716Z" fill="#C6C6C6" />
                      </g>
                      <defs>
                        <clipPath id="clip0_989_4364">
                          <rect width="32" height="32" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="spec-text">{scooter.maxSpeed || 25} км/год</span>
                  </div>
                </div>

                <div className="spec-row">
                  <span className="spec-text spec-price">
                    {scooter.unlockFee ? `${scooter.unlockFee} ₴` : 'Ціна не вказана'}
                  </span>
                  <span className="spec-text spec-year">{scooter.year || '2024'}</span>
                </div>
              </div>

              <button 
                className="scooter-select-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleScooterClick(scooter);
                }}
              >
                {t('scooters_page.select_button')}
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
                  <path d="M8.20068 23.3703L14.8209 16.7501L8.20068 10.1299M17.469 23.3703L24.0892 16.7501L17.469 10.1299" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {scooters.length === 0 && (
          <div className="no-scooters">
            <p>Самокатів поки немає</p>
          </div>
        )}
      </section>

      {/* Other Transport Section */}
      <section className="other-transport-section">
        <div className="section-content">
          <h2 className="section-title">{t('scooters_page.other_transport_title')}</h2>

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
                {t('scooters_page.select_button')} <span>»</span>
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
                {t('scooters_page.select_button')} <span>»</span>
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
                {t('scooters_page.select_button')} <span>»</span>
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
                {t('scooters_page.select_button')} <span>»</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedScooter && (
        <VehicleModal 
          vehicle={selectedScooter} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}