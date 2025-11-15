import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PaymentData {
  id: number;
  userId: number;
  tripId: number | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

export default function PaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  useEffect(() => {
    if (id) {
      loadPayment();
    }
  }, [id]);

  const loadPayment = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const response = await fetch(`${API_URL}/payments/${id}`);
      
      if (!response.ok) {
        throw new Error('Помилка завантаження');
      }
      
      const data = await response.json();
      setPayment(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Очікує",
      completed: "Завершено",
      failed: "Помилка",
      refunded: "Повернено",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">⏳ Завантаження...</div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => navigate("/admin/tables/payments")}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Назад до списку
          </button>
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error || 'Платіж не знайдено'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate("/admin/tables/payments")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Назад до списку
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Деталі платежу #{payment.id}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {getStatusText(payment.status)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID Користувача
                </label>
                <p className="text-lg font-semibold">{payment.userId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID Поїздки
                </label>
                <p className="text-lg font-semibold">{payment.tripId || '-'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Сума
              </label>
              <p className="text-3xl font-bold text-green-600">
                {payment.amount.toFixed(2)} {payment.currency}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Створено
                </label>
                <p className="text-lg">
                  {new Date(payment.createdAt).toLocaleString('uk-UA')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Оброблено
                </label>
                <p className="text-lg">
                  {payment.processedAt 
                    ? new Date(payment.processedAt).toLocaleString('uk-UA')
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              💡 <strong>Примітка:</strong> Платежі можна тільки переглядати. 
              Для зміни статусу або повернення коштів використовуйте платіжну систему.
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={() => navigate('/admin/tables/payments')}
              className="flex-1 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Закрити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
