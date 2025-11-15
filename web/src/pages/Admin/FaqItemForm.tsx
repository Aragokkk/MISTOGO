import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface FaqItemFormData {
  question: string;
  answer: string;
  category: string;
  orderPosition: number;
  isActive: boolean;
}

export default function FaqItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FaqItemFormData>({
    question: "",
    answer: "",
    category: "general",
    orderPosition: 0,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      loadFaqItem();
    }
  }, [id]);

  const loadFaqItem = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const response = await fetch(`${API_URL}/faq_items/${id}`);
      
      if (!response.ok) {
        throw new Error('Помилка завантаження');
      }
      
      const data = await response.json();
      setFormData({
        question: data.question || "",
        answer: data.answer || "",
        category: data.category || "general",
        orderPosition: data.orderPosition || data.order_position || 0,
        isActive: data.isActive !== undefined ? data.isActive : data.is_active !== undefined ? data.is_active : true,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const url = id 
        ? `${API_URL}/faq_items/${id}` 
        : `${API_URL}/faq_items`;
      
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Помилка збереження');
      }

      alert('Збережено успішно!');
      navigate('/admin/tables/faq_items');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate("/admin/tables/faq_items")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Назад до списку
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">
            {id ? 'Редагувати питання' : 'Додати питання'}
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Питання *
              </label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
                placeholder="Як зареєструватися?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Відповідь *
              </label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Детальна відповідь на питання..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категорія
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">Загальні</option>
                  <option value="registration">Реєстрація</option>
                  <option value="payment">Оплата</option>
                  <option value="vehicles">Транспорт</option>
                  <option value="technical">Технічні</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Позиція
                </label>
                <input
                  type="number"
                  name="orderPosition"
                  value={formData.orderPosition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-md">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                ✓ Активне (відображається користувачам)
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Збереження...' : 'Зберегти'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/tables/faq_items')}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
