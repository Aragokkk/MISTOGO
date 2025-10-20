import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Scooters.css';

export default function ScootersPage() {
  
  const navigate = useNavigate();

  const scooters = [
    {
      id: 1,
      name: 'Xiaomi Mi Electric Scooter Pro 2',
      image: '/image/scooter/xiaomi-pro-2.png',
      power: '300 Вт',
      range: '45 км',
      price: '350 ₴/день',
      year: '2024 рік'
    },
    {
      id: 2,
      name: 'Kugoo S3 Pro',
      image: '/image/scooter/kugoo-s3.png',
      power: '350 Вт',
      range: '30 км',
      price: '320 ₴/день',
      year: '2024 рік'
    },
    {
      id: 3,
      name: 'Ninebot Max G30',
      image: '/image/scooter/ninebot-max.png',
      power: '350 Вт',
      range: '65 км',
      price: '400 ₴/день',
      year: '2023 рік'
    },
    {
      id: 4,
      name: 'Kugoo M4 Pro',
      image: '/image/scooter/kugoo-m4.png',
      power: '500 Вт',
      range: '55 км',
      price: '450 ₴/день',
      year: '2024 рік'
    },
    {
      id: 5,
      name: 'Xiaomi Mi Scooter 3',
      image: '/image/scooter/xiaomi-3.png',
      power: '300 Вт',
      range: '30 км',
      price: '300 ₴/день',
      year: '2023 рік'
    },
    {
      id: 6,
      name: 'Ninebot ES2',
      image: '/image/scooter/ninebot-es2.png',
      power: '300 Вт',
      range: '25 км',
      price: '280 ₴/день',
      year: '2024 рік'
    }
  ];

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
        <h1 className="page-main-title">Електросамокати</h1>
      </div>

      {/* Scooters Grid */}
      <section className="scooters-catalog-section">
        <div className="scooters-grid">
          {scooters.map((scooter) => (
            <div key={scooter.id} className="scooter-card">
              <div className="scooter-image">
                <img src={scooter.image} alt={scooter.name} />
              </div>

              <h3 className="scooter-name">{scooter.name}</h3>

              <div className="scooter-specs">
                <div className="spec-row">
                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                      <path d="M19.5 6.5V19.5M19.5 19.5L26 26M19.5 19.5L13 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="19.5" cy="19.5" r="13" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                    <span className="spec-text">{scooter.power}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                      <path d="M32.5 19.5C32.5 26.6797 26.6797 32.5 19.5 32.5C12.3203 32.5 6.5 26.6797 6.5 19.5C6.5 12.3203 12.3203 6.5 19.5 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M26 8.125L19.5 6.5L21.125 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="spec-text">{scooter.range}</span>
                  </div>
                </div>

                <div className="spec-row">
                  <span className="spec-text spec-price">{scooter.price}</span>
                  <span className="spec-text spec-year">{scooter.year}</span>
                </div>
              </div>

              <button className="scooter-select-button">
                Обрати
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none">
                  <path d="M8.20068 23.3703L14.8209 16.7501L8.20068 10.1299M17.469 23.3703L24.0892 16.7501L17.469 10.1299" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

     {/* Other Transport Section */}
<section className="other-transport-section">
  <div className="section-content">
    <h2 className="section-title">Обрати інші транспорти</h2>

    <div className="transport-cards">
      <div className="transport-card" onClick={() => navigate("/transport/cars")}>
        <div className="transport-image">
          <img src="/image/Car.png" alt="Автомобіль" />
        </div>
        <h3 className="transport-name">Автомобіль</h3>
        <button 
          className="transport-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/transport/cars");
          }}
        >
          Обрати <span>»</span>
        </button>
      </div>

      <div className="transport-card" onClick={() => navigate("/transport/bikes")}>
        <div className="transport-image">
          <img src="/image/Bicycle.png" alt="Велосипед" />
        </div>
        <h3 className="transport-name">Велосипед</h3>
        <button 
          className="transport-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/transport/bikes");
          }}
        >
          Обрати <span>»</span>
        </button>
      </div>

      <div className="transport-card" onClick={() => navigate("/transport/scooters")}>
        <div className="transport-image">
          <img src="/image/Electrosamocat.png" alt="Самокат" />
        </div>
        <h3 className="transport-name">Самокат</h3>
        <button 
          className="transport-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/transport/scooters");
          }}
        >
          Обрати <span>»</span>
        </button>
      </div>

      <div className="transport-card" onClick={() => navigate("/transport/mopeds")}>
        <div className="transport-image">
          <img src="/image/Motobike.png" alt="Мотоцикл" />
        </div>
        <h3 className="transport-name">Мотоцикл</h3>
        <button 
          className="transport-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/transport/mopeds");
          }}
        >
          Обрати <span>»</span>
        </button>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}