// Blog.tsx - Простий варіант тільки з CSS адаптацією
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './Blog.module.css';

interface BlogPost {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
}

function Blog() {
  const navigate = useNavigate();

  const handleNavigateToTransport = () => {
    navigate('/transport');
  };

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      image: "/image/Blog2.png",
      title: 'MistoGo допомагає до лиці! "Чиста місто"',
      description: 'Ми горді, що турбота про довкілля починається з здійснення кроків. Тому наша команда: діз, "окмо" "Чиста місто" до дзівниця творити кращу Львова!',
      date: '19.11.2025'
    },
    {
      id: 2,
      image: "/image/Blog3.png",
      title: 'Нові авто у нашому парку!',
      description: 'До нашого автопарку додалось сучасні моделі з автопілотним обладнанням. Тролісі, який від рочного електротранспорту для поїздок місрісто підлодалися інновації та дбаті у майбатній.',
      date: '22.10.2025'
    },
    {
      id: 3,
      image: "/image/Blog4.png",
      title: 'Просто. Вигідно. Для тебе.',
      description: 'З кожною поїздкою завдяки MistoGo буваєш не столько швидше наступник спіль, більше поїздок — більше переваг!',
      date: '15.10.2025'
    },
    {
      id: 4,
      image:"/image/Blog5.png",
      title: 'Зменши на День Землі — 20% на все! сервіси!',
      description: 'Приурочено до святкування Дня Землі дарує у MistoGo 22 квітня, даруємо знижку 20% на оренду всіх видів електротранспорту.',
      date: '22.09.2025'
    }
  ];

  return (
    <div className={styles.mistogoBlogContainer}>
      <div className={styles.mistogoBlogHeroSection}>
        <div className={styles.mistogoBlogHeroImageWrapper}>
          <img 
            src="/image/Blog1.png" 
            alt="Cycling" 
            className={styles.mistogoBlogHeroImage}
          />
          <div className={styles.mistogoBlogHeroOverlay}>
            <BackButton />
            <h1 className={styles.mistogoBlogTitle}>Блог</h1>
          </div>
        </div>

        <div className={styles.mistogoBlogHeroContent}>
          <div className={styles.mistogoBlogHeroTextContainer}>
            <div>
              <h2>Приєднуйтесь до екологічно відповідальної мобільності разом з нами!</h2>
              <p>
                Ми прагнемо зробити ваше пересування максимально зручним та екологічним. 
                Обираючи електротранспорт для поїздок у місті, ви робите свідомий внесок у 
                майбутнє нашої планети. Це не лише про зручність та економію коштів у вартості 
                пального, але й обираєте чисте повітря, тиші в місті, економічність — для наших 
                міських, та інші, допомагаєте зменшити небезпеки та шкідливими до довкілля та 
                впливу нашої мобільності на прибудутні покоління.
              </p>
            </div>
            <button className={styles.mistogoBlogHeroButton} onClick={handleNavigateToTransport}>
              Обрати транспорт
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 15.0987L7.45833 8.43208L1 1.76541M10.0417 15.0987L16.5 8.43208L10.0417 1.76541" stroke="#1D3A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <h2 className={styles.mistogoBlogSectionTitle}>Еко-новини та соціальні ініціативи</h2>

      <div className={styles.mistogoBlogGrid}>
        {blogPosts.map((post) => (
          <div key={post.id} className={styles.mistogoBlogCard}>
            <img 
              src={post.image} 
              alt={post.title} 
              className={styles.mistogoBlogCardImage}
            />
            <div className={styles.mistogoBlogCardContent}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <div className={styles.mistogoBlogCardDate}>{post.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;