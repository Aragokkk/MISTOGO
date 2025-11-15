import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

const API_URL = import.meta.env.VITE_API_URL || "https://mistogo.online/api";

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    category: "",
    tags: "",
    status: "draft",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  // загрузка поста при редактировании
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/blog_posts/${id}`);
        if (!res.ok) throw new Error("Не вдалося завантажити пост");
        const data = await res.json();

        setForm({
          title: data.title || "",
          excerpt: data.excerpt || "",
          body: data.body || "",
          category: data.category || "",
          tags: Array.isArray(data.tags)
            ? data.tags.join(", ")
            : typeof data.tags === "string"
            ? data.tags.replace(/[\[\]"]/g, "")
            : "",
          status: data.status || "draft",
          image: null,
        });

        if (data.imageUrl) setPreview(data.imageUrl);
      } catch (e) {
        console.error(e);
        alert("Помилка завантаження поста");
      }
    })();
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
    // превью blob:* может ругаться CSP, это только визуально — на загрузку не влияет
    if (file) setPreview(URL.createObjectURL(file));
  };

  // загрузка файла на /api/upload
  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      console.error("upload error", await res.text());
      return null;
    }

    const data = await res.json();
    return data.url || data.path || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // готовим теги
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // если есть новая картинка — заливаем
    let imageUrl = preview || null;
    if (form.image) {
      const uploaded = await uploadImage(form.image);
      if (!uploaded) {
        alert("Не вдалося завантажити зображення");
        return;
      }
      imageUrl = uploaded;
    }

    const basePost = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body.trim(),
      category: form.category.trim(),
      tags: JSON.stringify(tagsArray),
      status: form.status,
      imageUrl,
    };

    const url = `${API_URL}/blog_posts${isEdit ? `/${id}` : ""}`;
    const method = isEdit ? "PUT" : "POST";

    // 🔴 критично: при PUT отправляем id
    const payload = isEdit
      ? { ...basePost, id: Number(id) }
      : basePost;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("save error", await res.text());
      alert("Помилка збереження поста");
      return;
    }

    alert("✅ Пост збережено");
    navigate("/admin/blog");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4"><BackButton />
        {isEdit ? "Редагування поста" : "Новий пост"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Заголовок"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Категорія"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Короткий опис"
          className="w-full border p-2 rounded"
          rows={2}
        />

        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Текст статті"
          className="w-full border p-2 rounded"
          rows={6}
          required
        />

        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Теги (через кому)"
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="block font-semibold mb-1">
            Обкладинка (зображення)
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <img src={preview} alt="Прев’ю" className="mt-2 w-64 rounded border" />
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Статус</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="draft">Чернетка</option>
            <option value="published">Опубліковано</option>
          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            💾 Зберегти
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Скасувати
          </button>
        </div>
      </form>
    </div>
  );
}
