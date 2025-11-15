import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface TableViewProps {
  tableName?: string;
}

export default function TableView({ tableName: propTableName }: TableViewProps) {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фільтри
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const navigate = useNavigate();
  const params = useParams();
  
  const tableName = propTableName || params.tableName || 'vehicles';
  
  useEffect(() => {
    fetchData();
  }, [tableName]);

  useEffect(() => {
    filterData();
  }, [data, searchQuery, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const BASE_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const cleanBaseUrl = BASE_URL.replace(/\/+$/, '');
      const fullUrl = `${cleanBaseUrl}/${tableName}`;
      
      console.log('🔄 TableView - Fetching table:', tableName);
      console.log('🌐 Full URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('✅ Data received:', result);
      
      if (!Array.isArray(result)) {
        console.error('❌ Result is not an array:', result);
        throw new Error('Відповідь від сервера не є масивом');
      }
      
      setData(result);
      
      if (result.length > 0) {
        const filteredColumns = Object.keys(result[0]).filter(key => 
          !['type', 'photos', 'descriptionDynamics', 'descriptionEngine', 'descriptionTransmission', 'passwordHash'].includes(key)
        );
        setColumns(filteredColumns.slice(0, 8));
        console.log('✅ Columns set:', filteredColumns);
      } else {
        console.log('⚠️ No data in result, table is empty');
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('❌ API Error:', err);
      setError(`Помилка завантаження: ${err.message}`);
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...data];

    if (searchQuery) {
      filtered = filtered.filter(row => {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    if (statusFilter !== 'all' && filtered.length > 0 && 'status' in filtered[0]) {
      filtered = filtered.filter(row => row.status === statusFilter);
    }

    setFilteredData(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити запис?')) return;
    
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const cleanBaseUrl = BASE_URL.replace(/\/+$/, '');
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${cleanBaseUrl}/${tableName}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (response.ok || response.status === 204) {
        alert('Видалено успішно!');
        fetchData();
      } else {
        const errorText = await response.text();
        alert(`Помилка видалення: ${errorText}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Помилка: ' + error);
    }
  };

  // ⭐ НОВА ФУНКЦІЯ: Рендер кнопок дій
  const renderActionButtons = (row: any) => {
    // Спеціальна логіка для support_tickets - тільки "Перегляд"
    if (tableName === 'support_tickets') {
      return (
        <button 
          onClick={() => navigate(`/admin/tables/support_tickets/view/${row.id}`)}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          title="Переглянути деталі тікета"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 3.75C5.83333 3.75 2.275 6.34167 1 10C2.275 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.725 13.6583 19 10C17.725 6.34167 14.1667 3.75 10 3.75Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Перегляд
        </button>
      );
    }

    // Спеціальна логіка для trips - тільки "Перегляд"
    if (tableName === 'trips') {
      return (
        <button 
          onClick={() => navigate(`/admin/trips/view/${row.id}`)}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
          title="Переглянути деталі поїздки"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 3.75C5.83333 3.75 2.275 6.34167 1 10C2.275 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.725 13.6583 19 10C17.725 6.34167 14.1667 3.75 10 3.75Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Перегляд
        </button>
      );
    }

    // Стандартні кнопки Edit + Delete для інших таблиць
    return (
      <div className="flex items-center gap-2 justify-end">
        <button 
          onClick={() => navigate(`/admin/${tableName}/edit/${row.id}`)}
          className="text-blue-600 hover:text-blue-900 text-xl"
          title="Редагувати"
        >
          ✏️
        </button>
        <button 
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-900 text-xl"
          title="Видалити"
        >
          🗑️
        </button>
      </div>
    );
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'string' && value.length > 50) return value.substring(0, 50) + '...';
    return String(value);
  };

  const getTableTitle = (): string => {
    const titles: Record<string, string> = {
      vehicles: "Транспорт",
      users: "Користувачі",
      zones: "Зони",
      posts: "Блог",
      trips: "Поїздки",
      payments: "Платежі",
      support_tickets: "Тікети підтримки",
      faq_items: "FAQ",
      vehicle_types: "Типи транспорту"
    };
    return titles[tableName] || tableName;
  };

  const getStatusBadgeClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      available: "bg-green-100 text-green-800",
      in_use: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      reserved: "bg-purple-100 text-purple-800",
      // Support tickets статуси
      open: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-purple-100 text-purple-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  // ⭐ НОВА ФУНКЦІЯ: Визначення чи показувати кнопку "Додати"
  const shouldShowAddButton = (): boolean => {
    // Не показуємо кнопку "Додати" для trips та support_tickets
    return !['trips', 'support_tickets'].includes(tableName);
  };

  // ⭐ НОВА ФУНКЦІЯ: Отримати URL для створення нового запису
  const getNewRecordUrl = (): string => {
    const customUrls: Record<string, string> = {
      faq_items: '/admin/tables/faq_items/new',
      vehicle_types: '/admin/tables/vehicle_types/new',
      support_tickets: '/admin/tables/support_tickets/new'
    };
    
    return customUrls[tableName] || `/admin/${tableName}/new`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">⏳ Завантаження {tableName}...</div>
      </div>
    );
  }

  const displayData = filteredData.length > 0 ? filteredData : data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate("/admin")}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              ← Назад до панелі
            </button>
            <h1 className="text-3xl font-bold">{getTableTitle()}</h1>
            <p className="text-gray-600 mt-1">
              Показано {displayData.length} з {data.length} записів
            </p>
          </div>
          
          {/* ⭐ ОНОВЛЕНО: Кнопка "Додати" показується не для всіх таблиць */}
          {shouldShowAddButton() && (
            <button 
              onClick={() => navigate(getNewRecordUrl())}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Додати
            </button>
          )}
        </div>

        {/* Фільтри */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Пошук */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Пошук
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введіть для пошуку..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Фільтр по статусу */}
            {(tableName === 'vehicles' || tableName === 'support_tickets') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Статус
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Всі</option>
                  {tableName === 'vehicles' && (
                    <>
                      <option value="available">Доступні</option>
                      <option value="in_use">В оренді</option>
                      <option value="maintenance">Обслуговування</option>
                    </>
                  )}
                  {tableName === 'support_tickets' && (
                    <>
                      <option value="open">Відкрито</option>
                      <option value="pending">Очікує</option>
                      <option value="in_progress">В роботі</option>
                      <option value="resolved">Вирішено</option>
                      <option value="closed">Закрито</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Блок для відображення помилок */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Помилка завантаження даних
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchData}
                    className="bg-red-100 px-4 py-2 rounded text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    🔄 Спробувати ще раз
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!error && displayData.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th 
                        key={column} 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td 
                          key={column} 
                          className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                        >
                          {column === 'status' ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(row[column])}`}>
                              {formatValue(row[column])}
                            </span>
                          ) : (
                            formatValue(row[column])
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        {/* ⭐ ВИКОРИСТОВУЄМО НОВУ ФУНКЦІЮ */}
                        {renderActionButtons(row)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : !error ? (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? '🔍 Нічого не знайдено за вашими фільтрами'
              : '📭 Немає даних для відображення'
            }
          </div>
        ) : null}
      </div>
    </div>
  );
}