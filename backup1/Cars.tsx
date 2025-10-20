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
                  <svg width="48" height="46" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.2307 8.08594H30.1538" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" />
                    <path d="M41.2307 31.7669V23.6807" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" />
                    <path d="M35.0769 24.8353H39.2307C40.3353 24.8353 41.2308 23.9399 41.2308 22.8353V17.9043" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" />
                    <path d="M6.15381 24.8359V31.1894" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" />
                    <path d="M12.3077 24.2584H8.15381C7.04924 24.2584 6.15381 25.1538 6.15381 26.2584V28.8791V19.6377" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" />
                    <path d="M12.9231 19.82V29.3685C12.9231 30.4006 13.7086 31.2633 14.7362 31.3597L18.5146 31.7144C18.8823 31.7489 19.2333 31.8845 19.5286 32.1063L21.6203 33.6768C21.9666 33.9369 22.388 34.0775 22.8211 34.0775H33.0769C34.1815 34.0775 35.0769 33.1821 35.0769 32.0775V17.5947C35.0769 16.4902 34.1815 15.5947 33.0769 15.5947H16.8988C16.3272 15.5947 15.7828 15.8394 15.4033 16.2669L13.4275 18.4921C13.1026 18.8581 12.9231 19.3306 12.9231 19.82Z" stroke="#C6C6C6" strokeWidth="3" />
                    <path d="M24 9.81836V14.439" stroke="#C6C6C6" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>{car.engine}</span>
                </div>
                <div className="spec-item">
                  <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22.75 27.625H8.125M30.875 11.375H16.25" stroke="#C6C6C6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z" stroke="#C6C6C6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z" stroke="#C6C6C6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
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
           