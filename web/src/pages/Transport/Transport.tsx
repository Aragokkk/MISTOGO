import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Transport.css';

export default function TransportPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="transport-main-page">
      {/* Page Header */}
      <div className="page-header-section">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="page-main-title">{t('transport_page.title', 'Оберіть транспорт')}</h1>
      </div>

      {/* Transport Cards Section */}
      <section className="transport-selection-section">
        <div className="section-content">
          <h2 className="section-subtitle">{t('transport_page.subtitle', 'Категорії транспорту')}</h2>

          <div className="transport-cards">
            <div className="transport-card" onClick={() => navigate("/transport/cars")}>
              <div className="transport-image">
                <img src="/image/Car.png" alt={t('cars', 'Автомобілі')} />
              </div>
              <h3 className="transport-name">{t('cars', 'Автомобілі')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/cars");
                }}
              >
                {t('transport_page.select_button', 'Обрати')} <span>»</span>
              </button>
            </div>

            <div className="transport-card" onClick={() => navigate("/transport/bikes")}>
              <div className="transport-image">
                <img src="/image/Bicycle.png" alt={t('bikes', 'Велосипеди')} />
              </div>
              <h3 className="transport-name">{t('bikes', 'Велосипеди')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/bikes");
                }}
              >
                {t('transport_page.select_button', 'Обрати')} <span>»</span>
              </button>
            </div>

            <div className="transport-card" onClick={() => navigate("/transport/scooters")}>
              <div className="transport-image">
                <img src="/image/Electrosamocat.png" alt={t('scooters', 'Самокати')} />
              </div>
              <h3 className="transport-name">{t('scooters', 'Самокати')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/scooters");
                }}
              >
                {t('transport_page.select_button', 'Обрати')} <span>»</span>
              </button>
            </div>

            <div className="transport-card" onClick={() => navigate("/transport/mopeds")}>
              <div className="transport-image">
                <img src="/image/Motobike.png" alt={t('mopeds', 'Мопеди')} />
              </div>
              <h3 className="transport-name">{t('mopeds', 'Мопеди')}</h3>
              <button 
                className="transport-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/transport/mopeds");
                }}
              >
                {t('transport_page.select_button', 'Обрати')} <span>»</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}