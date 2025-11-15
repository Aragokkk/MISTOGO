import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import styles from "./PostDetail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "https://mistogo.online/api";

// ---- Тип для поста ----
interface BlogPost {
  id: number;
  title: string;
  body: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  imageUrl?: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Завантаження поста ---
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/blog_posts/${id}`);
        if (!res.ok) throw new Error("Не вдалося знайти пост");
        const data = await res.json();

        setPost({
          id: data.id,
          title: data.title,
          body: data.body,
          excerpt: data.excerpt,
          category: data.category,
          tags: Array.isArray(data.tags)
            ? data.tags
            : typeof data.tags === "string"
            ? JSON.parse(data.tags || "[]")
            : [],
          createdAt: data.createdAt,
          imageUrl:
            data.imageUrl ||
            data.image_url ||
            "/image/Blog2.png", // fallback
        });
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити пост");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // --- Стан завантаження ---
  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        ⏳ Завантаження статті...
      </div>
    );

  // --- Помилка ---
  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ {error}
        <div className="mt-4">
          <button
            onClick={() => navigate("/blog")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Повернутись до блогу
          </button>
        </div>
      </div>
    );

  // --- Якщо пост не знайдено ---
  if (!post)
    return (
      <div className="text-center mt-10 text-gray-500">
        Пост не знайдено 😕
      </div>
    );

  // --- Рендер контенту ---
  return (
    <div className={styles.postDetailContainer}>
      <div className={styles.postDetailHero}>
        <BackButton />
        <h1 className={styles.postTitle}>{post.title}</h1>

        <div className={styles.postMeta}>
          {post.createdAt && (
            <span className={styles.postDate}>
              {new Date(post.createdAt).toLocaleDateString("uk-UA")}
            </span>
          )}
          {post.category && (
            <span className={styles.postCategory}>{post.category}</span>
          )}
        </div>
      </div>

      {post.imageUrl && (
        <div className={styles.postImageWrapper}>
          <img
            src={post.imageUrl}
            alt={post.title || "Зображення"}
            className={styles.postImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/image/Blog2.png";
            }}
          />
        </div>
      )}

      <div className={styles.postContent}>
        {post.excerpt && (
          <p className={styles.postExcerpt}>
            <strong>{post.excerpt}</strong>
          </p>
        )}

        <div
          className={styles.postBody}
          dangerouslySetInnerHTML={{ __html: post.body || "" }}
        />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className={styles.postTags}>
          {post.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
