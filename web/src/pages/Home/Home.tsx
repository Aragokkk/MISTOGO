import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Home.css";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Андрій Мельник",
      avatar: "/image/Ellipse1.png",
      vehicle: "Toyota Prius Hybrid",
      text: "Орендував авто на вихідні у Львові — все швидко, прозоро і без зайвих паперів. Машина була чиста й готова до поїздки. Обов'язково скористаюсь ще раз!",
      rating: 3,
      date: "24.09.2025"
    },
    {
      id: 2,
      name: "Максим Назарко",
      avatar: "/image/Ellipse1.png",
      vehicle: "E-bike Trek Powerfly",
      text: "Орендував самокат, щоб доїхати на роботу. Без черг, оплата карткою — супер. Самокат був зараджений і в гарному стані.",
      rating: 3,
      date: "03.10.2025"
    },
    {
      id: 3,
      name: "Олена Коваль",
      avatar: "/image/Ellipse1.png",
      vehicle: "Xiaomi Electric Pro",
      text: "Дуже зручний сервіс! Самокат працював бездоганно, а підтримка оперативно відповіла на всі питання.",
      rating: 5,
      date: "15.09.2025"
    },
    {
      id: 4,
      name: "Ігор Шевченко",
      avatar: "/image/Ellipse1.png",
      vehicle: "Vespa Elettrica",
      text: "Чудовий досвід оренди мопеда! Все працювало ідеально, а ціна приємно здивувала.",
      rating: 4,
      date: "28.08.2025"
    }
  ];

  const handleNextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 2));
  };

  const getVisibleReviews = () => {
    const startIndex = currentReviewIndex * 2;
    return reviews.slice(startIndex, startIndex + 2);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('hero.title')}
          </h1>
          <p className="hero-description">
            {t('hero.description')}
          </p>
          <button className="hero-button">
            {t('hero.button')}
          </button>
        </div>
        <div className="hero-image">
          <img
            src="/image/car-bike.png"
            alt={t('hero.imageAlt')}
            width="2097"
            height="1180"
          />
        </div>
      </section>

      {/* Transport and About Section */}
      <section className="transport-about-section">
        <h2 className="section-title">{t('hero.footer')}</h2>
        <div className="transport-cards">
          <div className="transport-card">
            <div className="transport-image">
              <img src="/image/Car.png" alt={t('cars')} width="405" height="500" />
            </div>
            <h3 className="transport-name">{t('cars')}</h3>
            <button className="transport-button" onClick={() => navigate('/transport/cars')}>
              {t('hero.button')} <span className="button-arrow">»</span>
            </button>
          </div>

          <div className="transport-card">
            <div className="transport-image">
              <img src="/image/Bicycle.png" alt={t('bikes')} width="343" height="508" />
            </div>
            <h3 className="transport-name">{t('bikes')}</h3>
            <button className="transport-button" onClick={() => navigate('/transport/bikes')}>
              {t('hero.button')} <span className="button-arrow">»</span>
            </button>
          </div>

          <div className="transport-card">
            <div className="transport-image">
              <img src="/image/Electrosamocat.png" alt={t('scooters')} width="329" height="406" />
            </div>
            <h3 className="transport-name">{t('scooters')}</h3>
            <button className="transport-button" onClick={() => navigate('/transport/scooters')}>
              {t('hero.button')} <span className="button-arrow">»</span>
            </button>
          </div>

          <div className="transport-card">
            <div className="transport-image">
              <img src="/image/Motobike.png" alt={t('mopeds')} width="384" height="569" />
            </div>
            <h3 className="transport-name">{t('mopeds')}</h3>
            <button className="transport-button" onClick={() => navigate('/transport/mopeds')}>
              {t('hero.button')} <span className="button-arrow">»</span>
            </button>
          </div>
        </div>

        <div className="about-content-wrapper">
          <h2 className="section-title about-title">{t('about.title')}</h2>
          <div className="about-content">
            <p className="about-text">
              {t('about.text1')}
            </p>
            <p className="about-text">
              {t('about.text2')}
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="advantages-section">
        <h2 className="section-title advantages-title">{t('advantages.title')}</h2>
        <div className="advantages-grid">
          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="54" height="53" viewBox="0 0 54 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.90584 39.7857C2.98752 40.7027 2.47147 41.9465 2.47119 43.2434V48.5547C2.47119 49.2032 2.72913 49.8252 3.18825 50.2838C3.64738 50.7424 4.27009 51 4.9194 51H12.264C12.9133 51 13.536 50.7424 13.9951 50.2838C14.4543 49.8252 14.7122 49.2032 14.7122 48.5547V46.1094C14.7122 45.4608 14.9701 44.8388 15.4293 44.3802C15.8884 43.9217 16.5111 43.664 17.1604 43.664H19.6086C20.2579 43.664 20.8806 43.4064 21.3398 42.9478C21.7989 42.4892 22.0568 41.8672 22.0568 41.2187V38.7734C22.0568 38.1248 22.3148 37.5029 22.7739 37.0443C23.233 36.5857 23.8557 36.3281 24.505 36.3281H24.9261C26.2246 36.3278 27.4698 35.8123 28.3879 34.8951L30.3807 32.9046C33.7833 34.0885 37.4874 34.084 40.8871 32.8918C44.2868 31.6996 47.1808 29.3903 49.0957 26.3417C51.0105 23.293 51.8329 19.6856 51.4282 16.1095C51.0235 12.5334 49.4158 9.20025 46.868 6.65545C44.3202 4.11064 40.9832 2.50479 37.4028 2.10059C33.8225 1.69639 30.2108 2.51778 27.1586 4.43038C24.1064 6.34298 21.7944 9.23356 20.6008 12.6292C19.4071 16.0249 19.4026 19.7247 20.5879 23.1233L3.90584 39.7857Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M37.9703 16.7655C38.6464 16.7655 39.1944 16.2181 39.1944 15.5429C39.1944 14.8676 38.6464 14.3202 37.9703 14.3202C37.2943 14.3202 36.7462 14.8676 36.7462 15.5429C36.7462 16.2181 37.2943 16.7655 37.9703 16.7655Z" fill="black" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item1.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item1.description')}
            </p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.08337 42.9167C4.63545 40.9016 6.71795 38.8844 10.0459 38.425C12.9269 38.4244 15.7004 39.5192 17.8042 41.4875C18.896 42.2523 20.1583 42.7383 21.4811 42.9029C22.8039 43.0675 24.1469 42.9059 25.3928 42.432C26.6387 41.9582 27.7497 41.1866 28.6288 40.1845C29.5079 39.1825 30.1284 37.9805 30.436 36.6835C31.7606 36.9197 33.1251 36.777 34.3722 36.272C35.6194 35.767 36.6986 34.9201 37.4858 33.8288C38.2729 32.7375 38.7359 31.4461 38.8215 30.1033C38.9071 28.7605 38.6119 27.4208 37.9697 26.2383C39.1401 25.8602 40.1931 25.1864 41.0268 24.2821C41.8605 23.3778 42.4466 22.2736 42.7285 21.0764C43.0105 19.8791 42.9786 18.6294 42.636 17.4481C42.2934 16.2668 41.6517 15.194 40.7729 14.3334C41.4365 13.6698 41.9629 12.882 42.322 12.015C42.6812 11.148 42.866 10.2187 42.866 9.28025C42.866 8.3418 42.6812 7.41253 42.322 6.54552C41.9629 5.6785 41.4365 4.89071 40.7729 4.22712C40.1094 3.56354 39.3216 3.03715 38.4546 2.67802C37.5875 2.31889 36.6583 2.13405 35.7198 2.13405C33.8245 2.13405 32.0069 2.88695 30.6667 4.22712C29.8061 3.3484 28.7332 2.7067 27.5519 2.3641C26.3706 2.02151 25.1209 1.98962 23.9237 2.27152C22.7265 2.55343 21.6223 3.13958 20.718 3.97326C19.8137 4.80695 19.1399 5.85993 18.7617 7.03033C17.5793 6.38819 16.2396 6.09294 14.8968 6.17856C13.554 6.26418 12.2626 6.72719 11.1713 7.5143C10.08 8.30142 9.23312 9.38066 8.72809 10.6278C8.22306 11.875 8.08042 13.2394 8.31657 14.5641C7.03085 14.8772 5.84048 15.4981 4.8479 16.3732C3.85533 17.2484 3.09029 18.3517 2.61863 19.588C2.14697 20.8244 1.98283 22.1569 2.14032 23.4708C2.29782 24.7847 2.77224 26.0406 3.52274 27.1305C5.14382 29.4825 7.00174 32.1204 6.57503 34.9542C6.01562 38.3087 4.15362 40.3279 2.08337 42.9167ZM2.08337 42.9167L32.7084 12.2917" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item2.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item2.description')}
            </p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.16675 39.8125V9.18754C8.16675 7.83383 8.70451 6.53557 9.66172 5.57835C10.6189 4.62113 11.9172 4.08337 13.2709 4.08337H38.7917C39.3332 4.08337 39.8525 4.29848 40.2354 4.68136C40.6183 5.06425 40.8334 5.58356 40.8334 6.12504V42.875C40.8334 43.4165 40.6183 43.9358 40.2354 44.3187C39.8525 44.7016 39.3332 44.9167 38.7917 44.9167H13.2709C11.9172 44.9167 10.6189 44.3789 9.66172 43.4217C8.70451 42.4645 8.16675 41.1662 8.16675 39.8125ZM8.16675 39.8125C8.16675 38.4588 8.70451 37.1606 9.66172 36.2033C10.6189 35.2461 11.9172 34.7084 13.2709 34.7084H40.8334M16.3334 22.4584H32.6667M16.3334 14.2917H28.5834" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item3.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item3.description')}
            </p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.6111 13.9456H4.38889C3.06954 13.9456 2 15.0151 2 16.3344V21.112C2 22.4314 3.06954 23.5009 4.38889 23.5009H42.6111C43.9305 23.5009 45 22.4314 45 21.112V16.3344C45 15.0151 43.9305 13.9456 42.6111 13.9456Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.5001 13.9452V45M23.5001 13.9452C22.6359 10.3844 21.1481 7.34023 19.2305 5.20963C17.3129 3.07903 15.0546 1.96089 12.7501 2.00104C11.1661 2.00104 9.64706 2.63024 8.52706 3.75023C7.40705 4.87021 6.77783 6.38923 6.77783 7.97312C6.77783 9.55702 7.40705 11.076 8.52706 12.196C9.64706 13.316 11.1661 13.9452 12.7501 13.9452M23.5001 13.9452C24.3642 10.3844 25.852 7.34023 27.7696 5.20963C29.6872 3.07903 31.9455 1.96089 34.2501 2.00104C35.834 2.00104 37.353 2.63024 38.4731 3.75023C39.5931 4.87021 40.2223 6.38923 40.2223 7.97312C40.2223 9.55702 39.5931 11.076 38.4731 12.196C37.353 13.316 35.834 13.9452 34.2501 13.9452M40.2223 23.5005V40.2223C40.2223 41.4895 39.7189 42.7047 38.8229 43.6007C37.9269 44.4966 36.7116 45 35.4445 45H11.5556C10.2885 45 9.07322 44.4966 8.17721 43.6007C7.2812 42.7047 6.77783 41.4895 6.77783 40.2223V23.5005" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item4.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item4.description')}
            </p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.5417 4.08337C31.4151 4.08337 36.0888 6.01931 39.5348 9.46529C42.9808 12.9113 44.9167 17.585 44.9167 22.4584M26.5417 12.25C29.2491 12.25 31.8457 13.3256 33.7601 15.24C35.6745 17.1544 36.75 19.751 36.75 22.4584M28.2404 33.8264C28.662 34.02 29.1371 34.0643 29.5872 33.9518C30.0374 33.8394 30.4358 33.5769 30.7169 33.2077L31.4417 32.2584C31.8221 31.7512 32.3153 31.3396 32.8823 31.0561C33.4492 30.7726 34.0745 30.625 34.7084 30.625H40.8334C41.9163 30.625 42.9549 31.0552 43.7207 31.821C44.4865 32.5868 44.9167 33.6254 44.9167 34.7084V40.8334C44.9167 41.9163 44.4865 42.9549 43.7207 43.7207C42.9549 44.4865 41.9163 44.9167 40.8334 44.9167C31.0867 44.9167 21.7392 41.0448 14.8472 34.1529C7.95524 27.2609 4.08337 17.9134 4.08337 8.16671C4.08337 7.08374 4.51358 6.04513 5.27935 5.27935C6.04513 4.51358 7.08374 4.08337 8.16671 4.08337H14.2917C15.3747 4.08337 16.4133 4.51358 17.1791 5.27935C17.9448 6.04513 18.375 7.08374 18.375 8.16671V14.2917C18.375 14.9256 18.2274 15.5508 17.944 16.1178C17.6605 16.6848 17.2488 17.178 16.7417 17.5584L15.7862 18.275C15.4114 18.5612 15.1472 18.9683 15.0385 19.4272C14.9299 19.8861 14.9834 20.3685 15.19 20.7924C17.9803 26.4598 22.5695 31.0432 28.2404 33.8264Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item5.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item5.description')}
            </p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.5104 20.4167C45.4428 24.9927 44.7783 29.75 42.6277 33.8954C40.477 38.0407 36.9703 41.3235 32.6922 43.1962C28.4142 45.069 23.6234 45.4185 19.1188 44.1865C14.6142 42.9546 10.6681 40.2156 7.93858 36.4263C5.20905 32.637 3.86106 28.0265 4.11942 23.3636C4.37777 18.7008 6.22686 14.2674 9.35831 10.8028C12.4898 7.3383 16.7143 5.052 21.3274 4.32522C25.9405 3.59843 30.6634 4.47509 34.7084 6.809" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.375 22.4584L24.5 28.5834L44.9167 8.16675" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item6.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item6.description')}
            </p>
          </div>

          <div className="advantage-card">
            <div className="advantage-icon">
              <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.8332 10.2084H8.16658C5.91142 10.2084 4.08325 12.0365 4.08325 14.2917V34.7084C4.08325 36.9635 5.91142 38.7917 8.16658 38.7917H40.8332C43.0884 38.7917 44.9166 36.9635 44.9166 34.7084V14.2917C44.9166 12.0365 43.0884 10.2084 40.8332 10.2084Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.08325 20.4167H44.9166" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="advantage-title">{t('advantages.item7.title')}</h3>
            <p className="advantage-description">
              {t('advantages.item7.description')}
            </p>
          </div>
        </div>

        <div className="promo-banner">
          <div className="promo-image">
            <img src="/image/bikes-promo.jpg" alt="Велосипедисти" width="870" height="246" />
          </div>
          <div className="promo-content">
            <h3 className="promo-title">
              {t('promo.title')}
            </h3>
            <p className="promo-subtitle">{t('promo.subtitle')}</p>
            <button className="promo-button">
              {t('hero.button')}
              <svg className="button-arrow" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.20068 23.3703L14.8209 16.7501L8.20068 10.1299M17.469 23.3703L24.0892 16.7501L17.469 10.1299" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="reviews-title">{t('reviews.title')}</h2>
        <p className="reviews-subtitle">
          {t('reviews.subtitle')}
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
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>
                      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.1468 2.78115C11.0449 0.0172191 14.9551 0.0172195 15.8532 2.78115L16.8167 5.74671C17.2184 6.98278 18.3702 7.81966 19.6699 7.81966H22.7881C25.6943 7.81966 26.9026 11.5385 24.5514 13.2467L22.0288 15.0795C20.9773 15.8435 20.5373 17.1976 20.939 18.4336L21.9025 21.3992C22.8006 24.1631 19.6372 26.4615 17.286 24.7533L14.7634 22.9205C13.7119 22.1565 12.2881 22.1565 11.2366 22.9205L8.71399 24.7533C6.36285 26.4615 3.19941 24.1631 4.09746 21.3992L5.06103 18.4336C5.46266 17.1976 5.02268 15.8435 3.97122 15.0795L1.44856 13.2467C-0.902577 11.5385 0.305749 7.81966 3.21192 7.81966H6.33009C7.62977 7.81966 8.78164 6.98278 9.18326 5.74671L10.1468 2.78115Z" />
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
          <button className="add-review-button">
            {t('reviews.addReview')}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="navigation-arrow" onClick={handleNextReview}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

     
    </div>
  );
}

export default Home;