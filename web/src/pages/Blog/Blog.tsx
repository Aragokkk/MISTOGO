// Blog.tsx - Простий варіант тільки з CSS адаптацією
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const handleNavigateToTransport = () => {
    navigate('/transport');
  };

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      image: "/image/Blog2.png",
      title: t('blog_content.posts.post1.title'),
      description: t('blog_content.posts.post1.description'),
      date: t('blog_content.posts.post1.date')
    },
    {
      id: 2,
      image: "/image/Blog3.png",
      title: t('blog_content.posts.post2.title'),
      description: t('blog_content.posts.post2.description'),
      date: t('blog_content.posts.post2.date')
    },
    {
      id: 3,
      image: "/image/Blog4.png",
      title: t('blog_content.posts.post3.title'),
      description: t('blog_content.posts.post3.description'),
      date: t('blog_content.posts.post3.date')
    },
    {
      id: 4,
      image:"/image/Blog5.png",
      title: t('blog_content.posts.post4.title'),
      description: t('blog_content.posts.post4.description'),
      date: t('blog_content.posts.post4.date')
    }
  ];

  return (
    <div className={styles.mistogoBlogContainer}>
      <div className={styles.mistogoBlogHeroSection}>
        <div className={styles.mistogoBlogHeroImageWrapper}>
          <img 
            src="/image/Blog1.png" 
            alt={t('blog_content.hero.imageAlt')}
            className={styles.mistogoBlogHeroImage}
          />
          <div className={styles.mistogoBlogHeroOverlay}>
            <BackButton />
            <h1 className={styles.mistogoBlogTitle}>{t('blog_content.title')}</h1>
          </div>
        </div>

        <div className={styles.mistogoBlogHeroContent}>
          <div className={styles.mistogoBlogHeroTextContainer}>
            <div>
              <h2>{t('blog_content.hero.subtitle')}</h2>
              <p>{t('blog_content.hero.text')}</p>
            </div>
            <button className={styles.mistogoBlogHeroButton} onClick={handleNavigateToTransport}>
              {t('hero.button')}
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 15.0987L7.45833 8.43208L1 1.76541M10.0417 15.0987L16.5 8.43208L10.0417 1.76541" stroke="#1D3A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <h2 className={styles.mistogoBlogSectionTitle}>{t('blog_content.sectionTitle')}</h2>

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