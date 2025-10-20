import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cars.css';

export default function CarsPage() {
  
  const navigate = useNavigate();

  const cars = [
    {
      id: 1,
      name: 'Toyota Prius Hybrid',
      image: '/image/toyota-prius.png',
      engine: '1,8 л',
      transmission: 'е-CVT',
      price: '1 400 ₴/день',
      year: '2026 рік'
    },
    {
      id: 2,
      name: 'Tesla Model 3',
      image: '/image/tesla-model3.png',
      engine: '366 км',
      transmission: 'е-CVT',
      price: '2 000 ₴/день',
      year: '2025 рік'
    },
    {
      id: 3,
      name: 'Toyota Prius Hybrid',
      image: '/image/toyota-prius.png',
      engine: '1,8 л',
      transmission: 'е-CVT',
      price: '1 400 ₴/день',
      year: '2025 рік'
    },
    {
      id: 4,
      name: 'Nissan Leaf',
      image: '/image/nissan-leaf.png',
      engine: '150 к/Вт',
      transmission: 'е-CVT',
      price: '1 300 ₴/день',
      year: '2022 рік'
    },
    {
      id: 5,
      name: 'Chevrolet (GM) Bolt EV',
      image: '/image/chevrolet-bolt.png',
      engine: '150 к/Вт',
      transmission: 'е-CVT',
      price: '1 620 ₴/день',
      year: '2023 рік'
    },
    {
      id: 6,
      name: 'Volkswagen ID.3',
      image: '/image/volkswagen-id3.png',
      engine: '150 к/Вт',
      transmission: 'е-CVT',
      price: '1 700 ₴/день',
      year: '2024 рік'
    }
  ];

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
        <h1 className="page-main-title">Автомобілі</h1>
      </div>

      {/* Cars Grid */}
      <section className="cars-catalog-section">
        <div className="cars-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-image">
                <img src={car.image} alt={car.name} />
              </div>

              <h3 className="car-name">{car.name}</h3>

              <div className="car-specs">
                <div className="spec-row">
                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 26" fill="none">
                      <path d="M13.2308 2H26.1539" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <path d="M8.9231 12.3433V20.1559C8.9231 21.1977 9.72279 22.065 10.7611 22.1493L14.5729 22.459C14.9037 22.4859 15.2226 22.5947 15.5009 22.7756L17.6568 24.1769C17.9812 24.3878 18.3598 24.5 18.7467 24.5H29.0769C30.1815 24.5 31.0769 23.6046 31.0769 22.5V10.5C31.0769 9.39543 30.1815 8.5 29.0769 8.5H12.8137C12.292 8.5 11.791 8.70382 11.4175 9.068L9.5269 10.9113C9.14082 11.2877 8.9231 11.8041 8.9231 12.3433Z" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                    <span className="spec-text">{car.engine}</span>
                  </div>

                  <div className="spec-item">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
                      <path d="M22.75 27.625H8.125M30.875 11.375H16.25" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z" stroke="currentColor" strokeWidth="3"/>
                      <path d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z" stroke="currentColor" strokeWidth="3"/>
                    </svg>
                    <span className="spec-text">{car.transmission}</span>
                  </div>
                </div>

                <div className="spec-row">
                  <span className="spec-text spec-price">{car.price}</span>
                  <span className="spec-text spec-year">{car.year}</span>
                </div>
              </div>

              <button className="car-select-button">
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