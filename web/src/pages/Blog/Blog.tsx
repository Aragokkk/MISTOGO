import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../../components/BackButton";
import styles from "./Blog.module.css";

interface BlogPost {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
  source?: "static" | "api";
}

interface ApiPost {
  id: number;
  title: string;
  excerpt?: string;
  body?: string;
  status: string;
  createdAt?: string;
  image?: string;
   imageUrl?: string;   // ← ДОДАТИ
  image_url?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://mistogo.online/api";

function Blog() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Статичні пости (як і раніше) ---
  const staticPosts: BlogPost[] = [
    {
      id: 1,
      image: "/image/Blog2.png",
      title: t("blog_content.posts.post1.title"),
      description: t("blog_content.posts.post1.description"),
      date: t("blog_content.posts.post1.date"),
      source: "static",
    },
    {
      id: 2,
      image: "/image/Blog3.png",
      title: t("blog_content.posts.post2.title"),
      description: t("blog_content.posts.post2.description"),
      date: t("blog_content.posts.post2.date"),
      source: "static",
    },
    {
      id: 3,
      image: "/image/Blog4.png",
      title: t("blog_content.posts.post3.title"),
      description: t("blog_content.posts.post3.description"),
      date: t("blog_content.posts.post3.date"),
      source: "static",
    },
    {
      id: 4,
      image: "/image/Blog5.png",
      title: t("blog_content.posts.post4.title"),
      description: t("blog_content.posts.post4.description"),
      date: t("blog_content.posts.post4.date"),
      source: "static",
    },
  ];

  // --- Завантаження постів з API ---
  useEffect(() => {
    fetch(`${API_URL}/blog_posts`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Не вдалося завантажити пости");
        const data: ApiPost[] = await res.json();

        const apiPosts: BlogPost[] = data
          .filter((p) => p.status === "published")
          .map((p) => ({
            id: p.id,
            image: p.imageUrl || p.image_url || "/image/Blog2.png",
            title: p.title,
            description: p.excerpt || (p.body ? p.body.slice(0, 150) + "..." : ""),
            date: p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("uk-UA")
              : "",
            source: "api",
          }));

        // Об'єднуємо статичні + з бази
        setPosts([...staticPosts, ...apiPosts]);
      })
      .catch(() => setPosts(staticPosts)) // Якщо API не працює — тільки статичні
      .finally(() => setLoading(false));
  }, [t]); // оновлення при зміні мови

  const handlePostClick = (post: BlogPost) => {
    if (post.source === "api") navigate(`/blog/${post.id}`);
  };

  if (loading) return <p className="text-center mt-10">⏳ Завантаження...</p>;

  return (
    <div className={styles.mistogoBlogContainer}>
      <div className={styles.mistogoBlogHeroSection}>
        <div className={styles.mistogoBlogHeroImageWrapper}>
          <img
            src="/image/Blog1.png"
            alt={t("blog_content.hero.imageAlt")}
            className={styles.mistogoBlogHeroImage}
          />
          <div className={styles.mistogoBlogHeroOverlay}>
            <BackButton />
            <h1 className={styles.mistogoBlogTitle}>{t("blog_content.title")}</h1>
          </div>
        </div>

        <div className={styles.mistogoBlogHeroContent}>
          <div className={styles.mistogoBlogHeroTextContainer}>
            <div>
              <h2>{t("blog_content.hero.subtitle")}</h2>
              <p>{t("blog_content.hero.text")}</p>
            </div>
            <button
              className={styles.mistogoBlogHeroButton}
              onClick={() => navigate("/transport")}
            >
              {t("hero.button")}
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 15.0987L7.45833 8.43208L1 1.76541M10.0417 15.0987L16.5 8.43208L10.0417 1.76541"
                  stroke="#1D3A17"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <h2 className={styles.mistogoBlogSectionTitle}>
        {t("blog_content.sectionTitle")}
      </h2>

      <div className={styles.mistogoBlogGrid}>
        {posts.map((post) => (
          <div
            key={`${post.source}-${post.id}`}
            className={styles.mistogoBlogCard}
            onClick={() => handlePostClick(post)}
            style={{ cursor: post.source === "api" ? "pointer" : "default" }}
          >
            <img
              src={post.image}
              alt={post.title}
              className={styles.mistogoBlogCardImage}
            />
            <div className={styles.mistogoBlogCardContent}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <div className={styles.mistogoBlogCardDate}>{post.date}</div>
              {post.source === "api" && (
                <span className="text-xs text-gray-500 italic">з бази</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
