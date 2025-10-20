import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

type Review = {
  id: number;
  name: string;
  avatar: string;
  vehicle: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // "dd.mm.yyyy"
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);

  const reviews = useMemo<Review[]>(
    () => [
      {
        id: 1,
        name: "Андрій Мельник",
        avatar: "/image/Ellipse1.png",
        vehicle: "Toyota Prius Hybrid",
        text:
          "Орендував авто на вихідні у Львові — все швидко, прозоро і без зайвих паперів. Машина була чиста й готова до поїздки. Обов'язково скористаюсь ще раз!",
        rating: 3,
        date: "24.09.2025",
      },
      {
        id: 2,
        name: "Максим Назарко",
        avatar: "/image/Ellipse1.png",
        vehicle: "E-bike Trek Powerfly",
        text:
          "Орендував самокат, щоб доїхати на роботу. Без черг, оплата карткою — супер. Самокат був заряджений і в гарному стані.",
        rating: 3,
        date: "03.10.2025",
      },
      {
        id: 3,
        name: "Олена Коваль",
        avatar: "/image/Ellipse1.png",
        vehicle: "Xiaomi Electric Pro",
        text:
          "Дуже зручний сервіс! Самокат працював бездоганно, а підтримка оперативно відповіла на всі питання.",
        rating: 5,
        date: "15.09.2025",
      },
      {
        id: 4,
        name: "Ігор Шевченко",
        avatar: "/image/Ellipse1.png",
        vehicle: "Vespa Elettrica",
        text:
          "Чудовий досвід оренди мопеда! Все працювало ідеально, а ціна приємно здивувала.",
        rating: 4,
        date: "28.08.2025",
      },
    ],
    []
  );

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 2));
  };

  const getVisibleReviews = () => {
    const startIndex = currentReviewIndex * 2;
    return reviews.slice(startIndex, startIndex + 2);
  };

  return (
    <div className="home-page">
      {/* ===== Hero Section (wrapper зі scale, як у тебе) ===== */}
      <div className="hero-wrapper">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Відкрий місто по-новому
              <br />
              з еко-транспортом
            </h1>
            <p className="hero-description">
              Авто, велосипеди, самокати і скутери — твій транспорт
              <br />
              під будь-які завдання, тут і зараз.
            </p>

            {/* якщо потрібна кнопка поверх картинки — додай клас hero-button--overlay */}
            <button
              className="hero-button"
              onClick={() => navigate("/transport")}
            >
              Обрати транспорт
            </button>
          </div>

          <div className="hero-image">
            <img
              src="/image/car-and-bicycle-1.png"
              alt="Car and bicycle"
              className="car-and-bicycle"
            />
          </div>
        </section>
      </div>

      {/* ===== Transport Section ===== */}
      <section className="transport-section">
        <div className="section-content">
          <h2 className="section-title">Обери свій транспорт</h2>

          <div className="transport-cards">
            <div className="transport-card">
              <div className="transport-image">
                <img src="/image/Car.png" alt="Автомобіль" />
              </div>
              <h3 className="transport-name">Автомобіль</h3>
              <button
                className="transport-button"
                onClick={() => navigate("/transport/cars")}
              >
                Обрати <span className="button-arrow">»</span>
              </button>
            </div>

            <div className="transport-card">
              <div className="transport-image">
                <img src="/image/Bicycle.png" alt="Велосипед" />
              </div>
              <h3 className="transport-name">Велосипед</h3>
              <button
                className="transport-button"
                onClick={() => navigate("/transport/bikes")}
              >
                Обрати <span className="button-arrow">»</span>
              </button>
            </div>

            <div className="transport-card">
              <div className="transport-image">
                <img src="/image/Electrosamocat.png" alt="Самокат" />
              </div>
              <h3 className="transport-name">Самокат</h3>
              <button
                className="transport-button"
                onClick={() => navigate("/transport/scooters")}
              >
                Обрати <span className="button-arrow">»</span>
              </button>
            </div>

            <div className="transport-card">
              <div className="transport-image">
                <img src="/image/Motobike.png" alt="Мотоцикл" />
              </div>
              <h3 className="transport-name">Мотоцикл</h3>
              <button
                className="transport-button"
                onClick={() => navigate("/transport/mopeds")}
              >
                Обрати <span className="button-arrow">»</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="about-section">
        <div className="section-content">
          <h2 className="section-title about-title">Про нас</h2>

          <div className="about-content">
            <p className="about-text">
              Ми надаємо найдивні послуги оренди екологічного транспорту у
              вашому місті. У нас доступні гібридні авто, велосипеди та
              електросамокати для коротких і довгострокових поїздок. Оренда
              проста й швидка — достатньо пройти спрощену перевірку документів.
            </p>

            <p className="about-text">
              Наша місія — зробити пересування комфортним і доступним, зменшуючи
              шкідливі викиди. Обираючи наш транспорт, ви отримуєте свободу руху
              та допомагаєте зробити місто чистішим. Разом ми створюємо місто,
              яке є сучасним, мобільним і дружнім до природи.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Advantages Section ===== */}
      <section className="advantages-section">
        <div className="section-content">
          <h2 className="section-title advantages-title">Наші переваги</h2>

          <div className="advantages-grid">
            {/* Швидкий старт */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="54"
                  height="53"
                  viewBox="0 0 54 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M3.90584 39.7857C2.98752 40.7027 2.47147 41.9465 2.47119 43.2434V48.5547C2.47119 49.2032 2.72913 49.8252 3.18825 50.2838C3.64738 50.7424 4.27009 51 4.9194 51H12.264C12.9133 51 13.536 50.7424 13.9951 50.2838C14.4543 49.8252 14.7122 49.2032 14.7122 48.5547V46.1094C14.7122 45.4608 14.9701 44.8388 15.4293 44.3802C15.8884 43.9217 16.5111 43.664 17.1604 43.664H19.6086C20.2579 43.664 20.8806 43.4064 21.3398 42.9478C21.7989 42.4892 22.0568 41.8672 22.0568 41.2187V38.7734C22.0568 38.1248 22.3148 37.5029 22.7739 37.0443C23.233 36.5857 23.8557 36.3281 24.505 36.3281H24.9261C26.2246 36.3278 27.4698 35.8123 28.3879 34.8951L30.3807 32.9046C33.7833 34.0885 37.4874 34.084 40.8871 32.8918C44.2868 31.6996 47.1808 29.3903 49.0957 26.3417C51.0105 23.293 51.8329 19.6856 51.4282 16.1095C51.0235 12.5334 49.4158 9.20025 46.868 6.65545C44.3202 4.11064 40.9832 2.50479 37.4028 2.10059C33.8225 1.69639 30.2108 2.51778 27.1586 4.43038C24.1064 6.34298 21.7944 9.23356 20.6008 12.6292C19.4071 16.0249 19.4026 19.7247 20.5879 23.1233L3.90584 39.7857Z"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M37.9703 16.7655C38.6464 16.7655 39.1944 16.2181 39.1944 15.5429C39.1944 14.8676 38.6464 14.3202 37.9703 14.3202C37.2943 14.3202 36.7462 14.8676 36.7462 15.5429C36.7462 16.2181 37.2943 16.7655 37.9703 16.7655Z"
                    fill="black"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">Швидкий старт</h3>
              <p className="advantage-description">
                Спрощена перевірка документів — без зайвих формальностей.
              </p>
            </div>

            {/* Екологічність */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M2.08337 42.9167C4.63545 40.9016 6.71795 38.8844 10.0459 38.425C12.9269 38.4244 15.7004 39.5192 17.8042 41.4875C18.896 42.2523 20.1583 42.7383 21.4811 42.9029C22.8039 43.0675 24.1469 42.9059 25.3928 42.432C26.6387 41.9582 27.7497 41.1866 28.6288 40.1845C29.5079 39.1825 30.1284 37.9805 30.436 36.6835C31.7606 36.9197 33.1251 36.777 34.3722 36.272C35.6194 35.767 36.6986 34.9201 37.4858 33.8288C38.2729 32.7375 38.7359 31.4461 38.8215 30.1033C38.9071 28.7605 38.6119 27.4208 37.9697 26.2383C39.1401 25.8602 40.1931 25.1864 41.0268 24.2821C41.8605 23.3778 42.4466 22.2736 42.7285 21.0764C43.0105 19.8791 42.9786 18.6294 42.636 17.4481C42.2934 16.2668 41.6517 15.194 40.7729 14.3334C41.4365 13.6698 41.9629 12.882 42.322 12.015C42.6812 11.148 42.866 10.2187 42.866 9.28025C42.866 8.3418 42.6812 7.41253 42.322 6.54552C41.9629 5.6785 41.4365 4.89071 40.7729 4.22712C40.1094 3.56354 39.3216 3.03715 38.4546 2.67802C37.5875 2.31889 36.6583 2.13405 35.7198 2.13405C33.8245 2.13405 32.0069 2.88695 30.6667 4.22712C29.8061 3.3484 28.7332 2.7067 27.5519 2.3641C26.3706 2.02151 25.1209 1.98962 23.9237 2.27152C22.7265 2.55343 21.6223 3.13958 20.718 3.97326C19.8137 4.80695 19.1399 5.85993 18.7617 7.03033C17.5793 6.38819 16.2396 6.09294 14.8968 6.17856C13.554 6.26418 12.2626 6.72719 11.1713 7.5143C10.08 8.30142 9.23312 9.38066 8.72809 10.6278C8.22306 11.875 8.08042 13.2394 8.31657 14.5641C7.03085 14.8772 5.84048 15.4981 4.8479 16.3732C3.85533 17.2484 3.09029 18.3517 2.61863 19.588C2.14697 20.8244 1.98283 22.1569 2.14032 23.4708C2.29782 24.7847 2.77224 26.0406 3.52274 27.1305C5.14382 29.4825 7.00174 32.1204 6.57503 34.9542C6.01562 38.3087 4.15362 40.3279 2.08337 42.9167ZM2.08337 42.9167L32.7084 12.2917"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">Екологічність</h3>
              <p className="advantage-description">
                Менше викидів — чистіше місто.
              </p>
            </div>

            {/* Прозорі умови */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="49"
                  height="49"
                  viewBox="0 0 49 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M8.16675 39.8125V9.18754C8.16675 7.83383 8.70451 6.53557 9.66172 5.57835C10.6189 4.62113 11.9172 4.08337 13.2709 4.08337H38.7917C39.3332 4.08337 39.8525 4.29848 40.2354 4.68136C40.6183 5.06425 40.8334 5.58356 40.8334 6.12504V42.875C40.8334 43.4165 40.6183 43.9358 40.2354 44.3187C39.8525 44.7016 39.3332 44.9167 38.7917 44.9167H13.2709C11.9172 44.9167 10.6189 44.3789 9.66172 43.4217C8.70451 42.4645 8.16675 41.1662 8.16675 39.8125ZM8.16675 39.8125C8.16675 38.4588 8.70451 37.1606 9.66172 36.2033C10.6189 35.2461 11.9172 34.7084 13.2709 34.7084H40.8334M16.3334 22.4584H32.6667M16.3334 14.2917H28.5834"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">Прозорі умови</h3>
              <p className="advantage-description">
                Жодних прихованих платежів чи несподіванок.
              </p>
            </div>

            {/* Бонуси та лояльність */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="47"
                  height="47"
                  viewBox="0 0 47 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M42.6111 13.9456H4.38889C3.06954 13.9456 2 15.0151 2 16.3344V21.112C2 22.4314 3.06954 23.5009 4.38889 23.5009H42.6111C43.9305 23.5009 45 22.4314 45 21.112V16.3344C45 15.0151 43.9305 13.9456 42.6111 13.9456Z"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23.5001 13.9452V45M23.5001 13.9452C22.6359 10.3844 21.1481 7.34023 19.2305 5.20963C17.3129 3.07903 15.0546 1.96089 12.7501 2.00104C11.1661 2.00104 9.64706 2.63024 8.52706 3.75023C7.40705 4.87021 6.77783 6.38923 6.77783 7.97312C6.77783 9.55702 7.40705 11.076 8.52706 12.196C9.64706 13.316 11.1661 13.9452 12.7501 13.9452M23.5001 13.9452C24.3642 10.3844 25.852 7.34023 27.7696 5.20963C29.6872 3.07903 31.9455 1.96089 34.2501 2.00104C35.834 2.00104 37.353 2.63024 38.4731 3.75023C39.5931 4.87021 40.2223 6.38923 40.2223 7.97312C40.2223 9.55702 39.5931 11.076 38.4731 12.196C37.353 13.316 35.834 13.9452 34.2501 13.9452M40.2223 23.5005V40.2223C40.2223 41.4895 39.7189 42.7047 38.8229 43.6007C37.9269 44.4966 36.7116 45 35.4445 45H11.5556C10.2885 45 9.07322 44.4966 8.17721 43.6007C7.2812 42.7047 6.77783 41.4895 6.77783 40.2223V23.5005"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">Бонуси та лояльність</h3>
              <p className="advantage-description">
                Приємні принципи постійним клієнтам.
              </p>
            </div>

            {/* 24/7 підтримка */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="49"
                  height="49"
                  viewBox="0 0 49 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M26.5417 4.08337C31.4151 4.08337 36.0888 6.01931 39.5348 9.46529C42.9808 12.9113 44.9167 17.585 44.9167 22.4584M26.5417 12.25C29.2491 12.25 31.8457 13.3256 33.7601 15.24C35.6745 17.1544 36.75 19.751 36.75 22.4584M28.2404 33.8264C28.662 34.02 29.1371 34.0643 29.5872 33.9518C30.0374 33.8394 30.4358 33.5769 30.7169 33.2077L31.4417 32.2584C31.8221 31.7512 32.3153 31.3396 32.8823 31.0561C33.4492 30.7726 34.0745 30.625 34.7084 30.625H40.8334C41.9163 30.625 42.9549 31.0552 43.7207 31.821C44.4865 32.5868 44.9167 33.6254 44.9167 34.7084V40.8334C44.9167 41.9163 44.4865 42.9549 43.7207 43.7207C42.9549 44.4865 41.9163 44.9167 40.8334 44.9167C31.0867 44.9167 21.7392 41.0448 14.8472 34.1529C7.95524 27.2609 4.08337 17.9134 4.08337 8.16671C4.08337 7.08374 4.51358 6.04513 5.27935 5.27935C6.04513 4.51358 7.08374 4.08337 8.16671 4.08337H14.2917C15.3747 4.08337 16.4133 4.51358 17.1791 5.27935C17.9448 6.04513 18.375 7.08374 18.375 8.16671V14.2917C18.375 14.9256 18.2274 15.5508 17.944 16.1178C17.6605 16.6848 17.2488 17.178 16.7417 17.5584L15.7862 18.275C15.4114 18.5612 15.1472 18.9683 15.0385 19.4272C14.9299 19.8861 14.9834 20.3685 15.19 20.7924C17.9803 26.4598 22.5695 31.0432 28.2404 33.8264Z"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">24/7 підтримка</h3>
              <p className="advantage-description">
                Ми завжди на зв'язку, коли це потрібно.
              </p>
            </div>

            {/* Миттєве бронювання */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="49"
                  height="49"
                  viewBox="0 0 49 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M44.5104 20.4167C45.4428 24.9927 44.7783 29.75 42.6277 33.8954C40.477 38.0407 36.9703 41.3235 32.6922 43.1962C28.4142 45.069 23.6234 45.4185 19.1188 44.1865C14.6142 42.9546 10.6681 40.2156 7.93858 36.4263C5.20905 32.637 3.86106 28.0265 4.11942 23.3636C4.37777 18.7008 6.22686 14.2674 9.35831 10.8028C12.4898 7.3383 16.7143 5.052 21.3274 4.32522C25.9405 3.59843 30.6634 4.47509 34.7084 6.809"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.375 22.4584L24.5 28.5834L44.9167 8.16675"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">Миттєве бронювання</h3>
              <p className="advantage-description">
                Усього 2-3 кліки онлайн, без дзвінків і очікувань.
              </p>
            </div>

            {/* Гнучкі оплати */}
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg
                  width="49"
                  height="49"
                  viewBox="0 0 49 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M40.8332 10.2084H8.16658C5.91142 10.2084 4.08325 12.0365 4.08325 14.2917V34.7084C4.08325 36.9635 5.91142 38.7917 8.16658 38.7917H40.8332C43.0884 38.7917 44.9166 36.9635 44.9166 34.7084V14.2917C44.9166 12.0365 43.0884 10.2084 40.8332 10.2084Z"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.08325 20.4167H44.9166"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="advantage-title">Гнучкі оплати</h3>
              <p className="advantage-description">
                Картки, Apple Pay, Google Pay, криптовалюти.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Promo Banner ===== */}
      <section className="promo-section">
        <div className="promo-banner">
          <div className="promo-image">
            <img src="/image/bikes-promo.jpg" alt="Велосипедисти" />
          </div>
          <div className="promo-content">
            <h3 className="promo-title">
              Спробуй еко-транспорт уже сьогодні —<br />
              отримай знижку 10% на перше<br />
              бронювання!
            </h3>
            <p className="promo-subtitle">Швидко, зручно і вигідно.</p>
            <button
              className="promo-button"
              onClick={() => navigate("/transport")}
              aria-label="Обрати транспорт"
            >
              Обрати
              <svg
                className="button-arrow"
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M8.20068 23.3703L14.8209 16.7501L8.20068 10.1299M17.469 23.3703L24.0892 16.7501L17.469 10.1299"
                  stroke="#4B4B4B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== Popular Choices ===== */}
      <section className="popular-section">
        <div className="section-content">
          <h2 className="section-title popular-title">
            Популярний вибір наших клієнтів
          </h2>

          <div className="popular-cards">
            {/* Card 1 */}
            <div className="popular-card">
              <div className="card-badge">
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M17.875 11.375L13 19.5H19.5L14.625 27.625M24.141 9.75H26C26.862 9.75 27.6886 10.0924 28.2981 10.7019C28.9076 11.3114 29.25 12.138 29.25 13V26C29.25 26.862 28.9076 27.6886 28.2981 28.2981C27.6886 28.9076 26.862 29.25 26 29.25H21.2306M35.75 22.75V16.25M8.3525 29.25H6.5C5.63805 29.25 4.8114 28.9076 4.2019 28.2981C3.59241 27.6886 3.25 26.862 3.25 26V13C3.25 12.138 3.59241 11.3114 4.2019 10.7019C4.8114 10.0924 5.63805 9.75 6.5 9.75H11.271"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Економія пального, ідеально для міста</span>
              </div>

              <div className="card-image">
                <img src="/image/toyota-prius.png" alt="Toyota Prius Hybrid" />
              </div>

              <h3 className="card-name">Toyota Prius Hybrid</h3>

              <div className="card-specs">
                <div className="spec-item">
                  <svg
                    width="39"
                    height="26"
                    viewBox="0 0 39 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M13.2308 2H26.1539" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                    <path d="M37.2307 22.5V15.5" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                    <path
                      d="M31.0769 16.5H35.2307C36.3353 16.5 37.2308 15.6046 37.2308 14.5V10.5"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path d="M2.15387 16.5V22" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                    <path
                      d="M8.30772 16H4.15387C3.0493 16 2.15387 16.8954 2.15387 18V20V12"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.9231 12.3433V20.1559C8.9231 21.1977 9.72279 22.065 10.7611 22.1493L14.5729 22.459C14.9037 22.4859 15.2226 22.5947 15.5009 22.7756L17.6568 24.1769C17.9812 24.3878 18.3598 24.5 18.7467 24.5H29.0769C30.1815 24.5 31.0769 23.6046 31.0769 22.5V10.5C31.0769 9.39543 30.1815 8.5 29.0769 8.5H12.8137C12.292 8.5 11.791 8.70382 11.4175 9.068L9.5269 10.9113C9.14082 11.2877 8.9231 11.8041 8.9231 12.3433Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                    />
                    <path d="M20 3.5V7.5" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>1,8 л</span>
                </div>

                <div className="spec-item">
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M22.75 27.625H8.125M30.875 11.375H16.25"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>е-CVT</span>
                </div>
              </div>

              <div className="card-footer">
                <span className="card-price">1 400 ₴/день</span>
                <button
                  className="card-button-white"
                  onClick={() => navigate("/transport/cars")}
                >
                  Обрати
                </button>
              </div>

              <button
                className="card-button-green"
                onClick={() => navigate("/transport/cars")}
              >
                Інші варіанти
              </button>
            </div>

            {/* Card 2 */}
            <div className="popular-card">
              <div className="card-badge">
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M4.20225 28.2976C3.59271 28.907 3.25018 29.7335 3.25 30.5954V34.1249C3.25 34.5559 3.4212 34.9692 3.72595 35.2739C4.0307 35.5787 4.44402 35.7499 4.875 35.7499H9.75C10.181 35.7499 10.5943 35.5787 10.899 35.2739C11.2038 34.9692 11.375 34.5559 11.375 34.1249V32.4999C11.375 32.0689 11.5462 31.6556 11.851 31.3508C12.1557 31.0461 12.569 30.8749 13 30.8749H14.625C15.056 30.8749 15.4693 30.7037 15.774 30.3989C16.0788 30.0942 16.25 29.6809 16.25 29.2499V27.6249C16.25 27.1939 16.4212 26.7806 16.726 26.4758C17.0307 26.1711 17.444 25.9999 17.875 25.9999H18.1545C19.0164 25.9997 19.8429 25.6572 20.4523 25.0476L21.775 23.7249C24.0335 24.5116 26.4921 24.5086 28.7487 23.7164C31.0052 22.9241 32.9261 21.3895 34.1971 19.3636C35.4681 17.3377 36.0139 14.9404 35.7453 12.564C35.4767 10.1875 34.4096 7.97255 32.7184 6.28145C31.0273 4.59034 28.8124 3.52319 26.4359 3.25459C24.0595 2.98599 21.6622 3.53182 19.6363 4.80281C17.6104 6.0738 16.0758 7.99469 15.2835 10.2512C14.4913 12.5078 14.4883 14.9664 15.275 17.2249L4.20225 28.2976Z"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M26.8125 13C27.2612 13 27.625 12.6362 27.625 12.1875C27.625 11.7388 27.2612 11.375 26 11.375C25.3638 11.375 25 11.7388 25 12.1875C25 12.6362 25.3638 13 26.8125 13Z"
                    fill="#4B4B4B"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Економія пального, ідеально для міста</span>
              </div>

              <div className="card-image">
                <img src="/image/ebike-trek.png" alt="E-bike Trek Powerfly" />
              </div>

              <h3 className="card-name">E-bike Trek Powerfly</h3>

              <div className="card-specs">
                <div className="spec-item">
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M17.875 11.375L13 19.5H19.5L14.625 27.625M24.141 9.75H26C26.862 9.75 27.6886 10.0924 28.2981 10.7019C28.9076 11.3114 29.25 12.138 29.25 13V26C29.25 26.862 28.9076 27.6886 28.2981 28.2981C27.6886 28.9076 26.862 29.25 26 29.25H21.2306M35.75 22.75V16.25M8.3525 29.25H6.5C5.63805 29.25 4.8114 28.9076 4.2019 28.2981C3.59241 27.6886 3.25 26.862 3.25 26V13C3.25 12.138 3.59241 11.3114 4.2019 10.7019C4.8114 10.0924 5.63805 9.75 6.5 9.75H11.271"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>до 100 км</span>
                </div>

                <div className="spec-item">
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M22.75 27.625H8.125M30.875 11.375H16.25"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>9 SPD</span>
                </div>
              </div>

              <div className="card-footer">
                <span className="card-price">390 ₴/день</span>
                <button
                  className="card-button-white"
                  onClick={() => navigate("/transport/bikes")}
                >
                  Обрати
                </button>
              </div>

              <button
                className="card-button-green"
                onClick={() => navigate("/transport/bikes")}
              >
                Інші варіанти
              </button>
            </div>

            {/* Card 3 */}
            <div className="popular-card">
              <div className="card-badge">
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M17.875 11.375L13 19.5H19.5L14.625 27.625M24.141 9.75H26C26.862 9.75 27.6886 10.0924 28.2981 10.7019C28.9076 11.3114 29.25 12.138 29.25 13V26C29.25 26.862 28.9076 27.6886 28.2981 28.2981C27.6886 28.9076 26.862 29.25 26 29.25H21.2306M35.75 22.75В16.25M8.3525 29.25H6.5C5.63805 29.25 4.8114 28.9076 4.2019 28.2981C3.59241 27.6886 3.25 26.862 3.25 26V13C3.25 12.138 3.59241 11.3114 4.2019 10.7019C4.8114 10.0924 5.63805 9.75 6.5 9.75H11.271"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Економія пального, ідеально для міста</span>
              </div>

              <div className="card-image">
                <img src="/image/xiaomi-scooter.png" alt="Xiaomi Electric Pro" />
              </div>

              <h3 className="card-name">Xiaomi Electric Pro</h3>

              <div className="card-specs">
                <div className="spec-item">
                  <svg
                    width="37"
                    height="23"
                    viewBox="0 0 37 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M16.875 3.375L12 11.5H18.5L13.625 19.625M23.141 1.75H25C25.862 1.75 26.6886 2.09241 27.2981 2.7019C27.9076 3.3114 28.25 4.13805 28.25 5V18C28.25 18.862 27.9076 19.6886 27.2981 20.2981C26.6886 20.9076 25.862 21.25 25 21.25H20.2306M34.75 14.75V8.25M7.3525 21.25H5.5C4.63805 21.25 3.8114 20.9076 3.2019 20.2981C2.59241 19.6886 2.25 18.862 2.25 18V5C2.25 4.13805 2.59241 3.3114 3.2019 2.7019C3.8114 2.09241 4.63805 1.75 5.5 1.75H10.271"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>30 км</span>
                </div>

                <div className="spec-item">
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M22.75 27.625H8.125M30.875 11.375H16.25"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>е-CVT</span>
                </div>
              </div>

              <div className="card-footer">
                <span className="card-price">480 ₴/день</span>
                <button
                  className="card-button-white"
                  onClick={() => navigate("/transport/scooters")}
                >
                  Обрати
                </button>
              </div>

              <button
                className="card-button-green"
                onClick={() => navigate("/transport/scooters")}
              >
                Інші варіанти
              </button>
            </div>

            {/* Card 4 */}
            <div className="popular-card">
              <div className="card-badge">
                <svg
                  width="35"
                  height="33"
                  viewBox="0 0 35 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M14.7643 11.1498C15.2479 11.1498 15.7117 10.9619 16.0537 10.6274C16.3957 10.293 16.5878 9.83936 16.5878 9.36637V4.12494C16.5072 3.72105 16.5719 3.30234 16.7709 2.93979C16.97 2.57724 17.2911 2.29316 17.6798 2.13571C18.0685 1.97826 18.501 1.95713 18.9038 2.0759C19.3066 2.19467 19.6551 2.44604 19.8901 2.78738L32.3553 14.9788C32.5597 15.1786 32.7218 15.4159 32.8325 15.6771C32.9431 15.9383 33 16.2182 33 16.5009C33 16.7836 32.9431 17.0635 32.8325 17.3247C32.7218 17.5858 32.5597 17.8231 32.3553 18.023L19.8901 30.2126C19.6551 30.554 19.3066 30.8053 18.9038 30.9241C18.501 31.0429 18.0685 31.0217 17.6798 30.8643C17.2911 30.7068 16.97 30.4228 16.7709 30.0602C16.5719 29.6977 16.5072 29.2789 16.5878 28.8751V23.6336C16.5878 23.1606 16.3957 22.707 16.0537 22.3726C15.7117 22.0381 15.2479 21.8502 14.7643 21.8502H11.1174C10.6337 21.8502 10.1699 21.6623 9.82797 21.3279C9.486 20.9934 9.29388 20.5398 9.29388 20.0668V12.9332C9.29388 12.4602 9.486 12.0066 9.82797 11.6721C10.1699 11.3377 10.6337 11.1498 11.1174 11.1498H14.7643ZM2 11.1498V21.8502V11.1498Z" />
                  <path
                    d="M2 11.1498V21.8502M14.7643 11.1498C15.2479 11.1498 15.7117 10.9619 16.0537 10.6274C16.3957 10.293 16.5878 9.83936 16.5878 9.36637V4.12494C16.5072 3.72105 16.5719 3.30234 16.7709 2.93979C16.97 2.57724 17.2911 2.29316 17.6798 2.13571C18.0685 1.97826 18.501 1.95713 18.9038 2.0759C19.3066 2.19467 19.6551 2.44604 19.8901 2.78738L32.3553 14.9788C32.5597 15.1786 32.7218 15.4159 32.8325 15.6771C32.9431 15.9383 33 16.2182 33 16.5009C33 16.7836 32.9431 17.0635 32.8325 17.3247C32.7218 17.5858 32.5597 17.8231 32.3553 18.023L21.524 32.9622C21.2732 33.3347 20.9013 33.609 20.4715 33.7386C20.0416 33.8682 19.5801 33.8451 19.1652 33.6733C18.7504 33.5015 18.4077 33.1915 18.1953 32.7959C17.9829 32.4004 17.9139 31.9435 17.9999 31.5028V25.7837C17.9999 25.2676 17.7949 24.7726 17.4299 24.4077C17.065 24.0428 16.57 23.8377 16.0539 23.8377H4.37831C3.86222 23.8377 3.36726 23.6327 3.00233 23.2678C2.63739 22.9029 2.43237 22.4079 2.43237 21.8918V14.108C2.43237 13.592 2.63739 13.097 3.00233 12.7321C3.36726 12.3671 3.86222 12.1621 4.37831 12.1621H16.0539Z"
                    stroke="#4B4B4B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Економія пального, ідеально для міста</span>
              </div>

              <div className="card-image">
                <img src="/image/vespa-elettrica.png" alt="Vespa Elettrica" />
              </div>

              <h3 className="card-name">Vespa Elettrica</h3>

              <div className="card-specs">
                <div className="spec-item">
                  <svg
                    width="39"
                    height="26"
                    viewBox="0 0 39 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path d="M13.2308 2H26.1539" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                    <path d="M37.2307 22.5V15.5" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                    <path
                      d="M31.0769 16.5H35.2307C36.3353 16.5 37.2308 15.6046 37.2308 14.5V10.5"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path d="M2.15387 16.5В22" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                    <path
                      d="M8.30772 16H4.15387C3.0493 16 2.15387 16.8954 2.15387 18V20V12"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.9231 12.3433V20.1559C8.9231 21.1977 9.72279 22.065 10.7611 22.1493L14.5729 22.459C14.9037 22.4859 15.2226 22.5947 15.5009 22.7756L17.6568 24.1769C17.9812 24.3878 18.3598 24.5 18.7467 24.5H29.0769C30.1815 24.5 31.0769 23.6046 31.0769 22.5V10.5C31.0769 9.39543 30.1815 8.5 29.0769 8.5H12.8137C12.292 8.5 11.791 8.70382 11.4175 9.068L9.5269 10.9113C9.14082 11.2877 8.9231 11.8041 8.9231 12.3433Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                    />
                    <path d="M20 3.5V7.5" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>50 см³</span>
                </div>

                <div className="spec-item">
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M22.75 27.625H8.125M30.875 11.375H16.25"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M27.625 32.5C30.3174 32.5 32.5 30.3174 32.5 27.625C32.5 24.9326 30.3174 22.75 27.625 22.75C24.9326 22.75 22.75 24.9326 22.75 27.625C22.75 30.3174 24.9326 32.5 27.625 32.5Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.375 16.25C14.0674 16.25 16.25 14.0674 16.25 11.375C16.25 8.68261 14.0674 6.5 11.375 6.5C8.68261 6.5 6.5 8.68261 6.5 11.375C6.5 14.0674 8.68261 16.25 11.375 16.25Z"
                      stroke="#4B4B4B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Автомат</span>
                </div>
              </div>

              <div className="card-footer">
                <span className="card-price">640 ₴/день</span>
                <button
                  className="card-button-white"
                  onClick={() => navigate("/transport/mopeds")}
                >
                  Обрати
                </button>
              </div>

              <button
                className="card-button-green"
                onClick={() => navigate("/transport/mopeds")}
              >
                Інші варіанти
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Reviews ===== */}
      <section className="reviews-section">
        <div className="section-content">
          <h2 className="reviews-title">Враження клієнтів</h2>
          <p className="reviews-subtitle">
            Ми дбаємо про зручність і надійність сервісу. Ось що кажуть ті, хто
            вже скористався орендою:
          </p>

          <div className="reviews-container">
            {getVisibleReviews().map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      <img src={review.avatar} alt={review.name} />
                    </div>
                    <span className="reviewer-name">{review.name}</span>
                  </div>
                  <div className="review-vehicle">
                    <span>{review.vehicle}</span>
                  </div>
                </div>

                <p className="review-text">{review.text}</p>

                <div className="review-footer">
                  <div className="review-rating">
                    {Array.from<unknown>({ length: 5 }).map((_, i) => (
                      <span key={i} className={`star ${i < review.rating ? "filled" : "empty"}`}>
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M10.1468 2.78115C11.0449 0.0172191 14.9551 0.0172195 15.8532 2.78115L16.8167 5.74671C17.2184 6.98278 18.3702 7.81966 19.6699 7.81966H22.7881C25.6943 7.81966 26.9026 11.5385 24.5514 13.2467L22.0288 15.0795C20.9773 15.8435 20.5373 17.1976 20.939 18.4336L21.9025 21.3992C22.8006 24.1631 19.6372 26.4615 17.286 24.7533L14.7634 22.9205C13.7119 22.1565 12.2881 22.1565 11.2366 22.9205L8.71399 24.7533C6.36285 26.4615 3.19941 24.1631 4.09746 21.3992L5.06103 18.4336C5.46266 17.1976 5.02268 15.8435 3.97122 15.0795L1.44856 13.2467C-0.902577 11.5385 0.305749 7.81966 3.21192 7.81966H6.33009C7.62977 7.81966 8.78164 6.98278 9.18326 5.74671L10.1468 2.78115Z"
                            fill={i < review.rating ? "#F9E31B" : "#CACACA"}
                          />
                        </svg>
                      </span>
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="reviews-actions">
            <button className="add-review-button" type="button">
              Додати відгук
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M8.00006 11.9999H8.01006M12.0001 11.9999H12.0101M16.0001 11.9999H16.0101M2.99206 16.3419C3.1391 16.7129 3.17183 17.1193 3.08606 17.5089L2.02106 20.7989C1.98674 20.9658 1.99561 21.1386 2.04683 21.3011C2.09805 21.4635 2.18992 21.6102 2.31372 21.7272C2.43753 21.8442 2.58917 21.9276 2.75426 21.9696C2.91935 22.0115 3.09242 22.0106 3.25706 21.9669L6.67006 20.9689C7.03777 20.896 7.41859 20.9279 7.76906 21.0609C9.90444 22.0582 12.3234 22.2691 14.5992 21.6567C16.875 21.0442 18.8613 19.6476 20.2078 17.7133C21.5542 15.779 22.1742 13.4313 21.9584 11.0845C21.7425 8.73763 20.7048 6.54241 19.0281 4.88613C17.3515 3.22986 15.1438 2.21898 12.7944 2.03183C10.4451 1.84469 8.10519 2.49332 6.1875 3.86328C4.26981 5.23323 2.89759 7.23648 2.31295 9.51958C1.72831 11.8027 1.96883 14.2189 2.99206 16.3419Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="navigation-arrow" onClick={handleNextReview} type="button" aria-label="Наступні відгуки">
              <svg
                width="38"
                height="36"
                viewBox="0 0 38 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M16.0539 12.1621C16.57 12.1621 17.065 11.9571 17.4299 11.5922C17.7949 11.2272 17.9999 10.7323 17.9999 10.2162V4.49706C17.9139 4.05637 17.9829 3.5995 18.1953 3.20391C18.4077 2.80831 18.7504 2.49834 19.1652 2.32654C19.5801 2.15474 20.0416 2.13169 20.4715 2.26129C20.9013 2.39088 21.2732 2.66516 21.524 3.03761L34.8264 16.34C35.0445 16.5581 35.2175 16.8171 35.3356 17.102C35.4536 17.387 35.5144 17.6924 35.5144 18.0009C35.5144 18.3093 35.4536 18.6148 35.3356 18.8998C35.2175 19.1847 35.0445 19.4437 34.8264 19.6618L21.524 32.9622C21.2732 33.3347 20.9013 33.609 20.4715 33.7386C20.0416 33.8682 19.5801 33.8451 19.1652 33.6733C18.7504 33.5015 18.4077 33.1915 18.1953 32.7959C17.9829 32.4004 17.9139 31.9435 17.9999 31.5028V25.7837C17.9999 25.2676 17.7949 24.7726 17.4299 24.4077C17.065 24.0428 16.57 23.8377 16.0539 23.8377H4.37831C3.86222 23.8377 3.36726 23.6327 3.00233 23.2678C2.63739 22.9029 2.43237 22.4079 2.43237 21.8918V14.108C2.43237 13.592 2.63739 13.097 3.00233 12.7321C3.36726 12.3671 3.86222 12.1621 4.37831 12.1621H16.0539Z"
                  stroke="#AFD06E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
