import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Cars.css";

interface CarData {
  id: number;
  name: string;
  image: string;
  engine: string;
  engineIcon: string;
  seats: number;
  range: string;
  rangeIcon: string;
  price: string;
  year: string;
}

function Cars() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const carsData: CarData[] = [
    {
      id: 1,
      name: "Toyota Prius Hybrid",
      image: "/image/toyota-prius.png",
      engine: "1.8 л",
      engineIcon: "⚙️",
      seats: 5,
      range: "е-CVT",
      rangeIcon: "🔋",
      price: "1 400",
      year: "2024"
    },
    {
      id: 2,
      name: "Tesla Model 3",
      image: "/image/tesla-model3.png",
      engine: "386 к.с",
      engineIcon: "⚙️",
      seats: 5,
      range: "е-CVT",
      rangeIcon: "🔋",
      price: "2 000",
      year: "2025"
    },
    {
      id: 3,
      name: "Toyota Prius Hybrid",
      image: "/image/toyota-prius2.png",
      engine: "1.8 л",
      engineIcon: "⚙️",
      seats: 5,
      range: "е-CVT",
      rangeIcon: "🔋",
      price: "1 400",
      year: "2025"
    },
    {
      id: 4,
      name: "Nissan Leaf",
      image: "/image/nissan-leaf.png",
      engine: "110 к.с",
      engineIcon: "⚙️",
      seats: 5,
      range: "е-CVT",
      rangeIcon: "🔋",
      price: "1 200",
      year: "2022"
    },
    {
      id: 5,
      name: "Chevrolet (GM) Bolt EV",
      image: "/image/chevrolet-bolt.png",
      engine: "164 к.с",
      engineIcon: "⚙️",
      seats: 5,
      range: "е-CVT",
      rangeIcon: "🔋",
      price: "1 600",
      year: "2023"
    },
    {
      id: 6,
      name: "Volkswagen ID.3",
      image: "/image/volkswagen-id3.png",
      engine: "150 к.с",
      engineIcon: "⚙️",
      seats: 5,
      range: "е-CVT",
      rangeIcon: "🔋",
      price: "1 700",
      year: "2025"
    }
  ];

  const otherTransport = [
    {
      id: 1,
      name: "Автомобілі",
      image: "/image/Car.png",
      route: "/transport/cars"
    },
    {
      id: 2,
      name: "Велосипеди",
      image: "/image/Bicycle.png",
      route: "/transport/bikes"
    },
    {
      id: 3,
      name: "Самокати",
      image: "/image/Electrosamocat.png",
      route: "/transport/scooters"
    },
    {
      id: 4,
      name: "Мотоцикли",
      image: "/image/Motobike.png",
      route: "/transport/mopeds"
    }
  ];

  return (
    <div className="cars-page">
      {/* Cars Grid */}
      <section className="cars-section">
        <div className="cars-header">
          <button className="back-button-inline" onClick={() => navigate(-1)}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="cars-title">Автомобілі</h1>
        </div>
        <div className="cars-grid">
          {carsData.map((car) => (
            <div key={car.id} className="car-card">
              <div className="car-image">
                <img src={car.image} alt={car.name} />
              </div>
              <h3 className="car-name">{car.name}</h3>
              <div className="car-specs">
                <div className="spec-item">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8V16L20 20M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{car.engine}</span>
                </div>
                <div className="spec-item">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16H24M8 16L14 10M8 16L14 22" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{car.range}</span>
                </div>
              </div>
              <div className="car-footer">
                <div className="car-price-info">
                  <span className="price-amount">{car.price} ₴/день</span>
                  <span className="price-year">{car.year} рік</span>
                </div>
              </div>
              <button className="car-button">
                Обрати
                <span className="button-arrows">»</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Other Transport Section */}
      <section className="other-transport-section">
        <h2 className="section-title">Обрати інші транспорти</h2>
        <div className="transport-grid">
          {otherTransport.map((transport) => (
            <div key={transport.id} className="transport-card" onClick={() => navigate(transport.route)}>
              <div className="transport-image">
                <img src={transport.image} alt={transport.name} />
              </div>
              <h3 className="transport-name">{transport.name}</h3>
              <button className="transport-button">
                Обрати
                <span className="button-arrows">»</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Cars;
           