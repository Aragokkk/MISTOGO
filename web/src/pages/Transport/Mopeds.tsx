import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Mopeds.css';

export default function MopedsPage() {
  
  const navigate = useNavigate();

  const mopeds = [
    {
      id: 1,
      name: 'NIU MQi GT EVO',
      image: '/image/moped/niu-mqi-gt.png',
      power: '3000 Вт',
      range: '130 км',
      price: '800 ₴/день',
      year: '2024 рік'
    },
    {
      id: 2,
      name: 'Super Soco TC Max',
      image: '/image/moped/super-soco-tc.png',
      power: '2000 Вт',
      range: '110 км',
      price: '750 ₴/день',
      year: '2024 рік'
    },
    {
      id: 3,
      name: 'Xiaomi HIMO T1',
      image: '/image/moped/xiaomi-himo-t1.png',
      power: '400 Вт',
      range: '60 км',
      price: '600 ₴/день',
      year: '2023 рік'
    },
    {
      id: 4,
      name: 'NIU NQi Sport',
      image: '/image/moped/niu-nqi-sport.png',
      power: '2400 Вт',
      range: '100 км',
      price: '850 ₴/день',
      year: '2024 рік'
    },
    {
      id: 5,
      name: 'Segway eMoped C80',
      image: '/image/moped/segway-c80.png',
      power: '1200 Вт',
      range: '80 км',
      price: '700 ₴/день',
      year: '2023 рік'
    },
    {
      id: 6,
      name: 'Yadea G5',
      image: '/image/moped/yadea-g5.png',
      power: '1200 Вт',
      range: '70 км',
      price: '650 ₴/день',
      year: '2024 рік'
    }
  ];

  return (
    <div className="mopeds-page">
      {/* Page Header */}
      <div className="page-header-section">
        <button className="back-button" onClick={() => navigate(-1)}>
         <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
           <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="page-main-title">Електромопеди</h1>
      </div>

      {/* Mopeds Grid */}
      <section className="mopeds-catalog-section">
        <div className="mopeds-grid">
          {mopeds.map((moped) => (
            <div key={moped.id} className="moped-card">
              <div className="moped-image">
                <img src={moped.image} alt={moped.name} />
              </div>

              <h3 className="moped-name">{moped.name}</h3>

              <div className="moped-specs">
                <div className="spec-row">
                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                      <path d="M19.5 6.5V19.5M19.5 19.5L26 26M19.5 19.5L13 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="19.5" cy="19.5" r="13" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                    <span className="spec-text">{moped.power}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                      <path d="M32.5 19.5C32.5 26.6797 26.6797 32.5 19.5 32.5C12.3203 32.5 6.5 26.6797 6.5 19.5C6.5 12.3203 12.3203 6.5 19.5 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M26 8.125L19.5 6.5L21.125 13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="spec-text">{moped.range}</span>
                  </div>
                </div>

                <div className="spec-row">
                  <span className="spec-text spec-price">{moped.price}</span>
                  <span className="spec-text spec-year">{moped.year}</span>
                </div>
              </div>

              <button className="moped-select-button">
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