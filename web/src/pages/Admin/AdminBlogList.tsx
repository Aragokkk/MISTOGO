import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  status: string;
  createdAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "https://mistogo.online/api";

export default function AdminBlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- Завантаження постів ---
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/blog_posts`);
      if (!res.ok) throw new Error("Не вдалося завантажити пости");
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Видалення поста ---
  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цей пост?")) return;
    try {
      const res = await fetch(`${API_URL}/blog_posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Не вдалося видалити пост");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Помилка при видаленні");
    }
  };

  // --- ✅ Зміна статусу (через PUT) ---
  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const post = posts.find((p) => p.id === id);
      if (!post) throw new Error("Пост не знайдено");

      // 🔧 ASP.NET очікує повний об’єкт для PUT
      const updatedPost = {
        ...post,
        status: newStatus,
      };

      const res = await fetch(`${API_URL}/blog_posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response:", text);
        throw new Error("Не вдалося змінити статус");
      }

      // 🔁 Оновлюємо список локально
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err: any) {
      alert(err.message || "Помилка при зміні статусу");
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6"> <BackButton />
        <h1 className="text-2xl font-bold">Блог — Адмін панель</h1>
        <button
          onClick={() => navigate("/admin/blog/new")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Новий пост
        </button>
      </div>

      {posts.length === 0 ? (
        <p>Немає постів</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2 text-left">Заголовок</th>
              <th className="border p-2 text-left">Категорія</th>
              <th className="border p-2 text-left">Статус</th>
              <th className="border p-2 text-left">Дата</th>
              <th className="border p-2">Дії</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="border p-2 text-center">{post.id}</td>
                <td className="border p-2">{post.title}</td>
                <td className="border p-2">{post.category || "-"}</td>
                <td
                  className={`border p-2 text-center ${
                    post.status === "published"
                      ? "text-green-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  <button
                    onClick={() => toggleStatus(post.id, post.status)}
                    className={`px-3 py-1 rounded text-white ${
                      post.status === "published"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {post.status === "published"
                      ? "Опубліковано"
                      : "Чернетка"}
                  </button>
                </td>
                <td className="border p-2 text-center">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("uk-UA")
                    : "-"}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => navigate(`/admin/blog/${post.id}`)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    ✏️ Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    🗑️ Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
