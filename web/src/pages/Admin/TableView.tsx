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
      
      // ✅ ВИПРАВЛЕНО: Чітке формування URL
      const BASE_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      
      // Прибираємо зайві слеші
      const cleanBaseUrl = BASE_URL.replace(/\/+$/, '');
      const fullUrl = `${cleanBaseUrl}/${tableName}`;
      
      console.log('🔄 TableView - Fetching table:', tableName);
      console.log('🔗 BASE_URL:', BASE_URL);
      console.log('🌐 Full URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      // ✅ ВИПРАВЛЕНО: Детальна обробка помилок
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('✅ Data received:', result);
      console.log('✅ Data length:', Array.isArray(result) ? result.length : 'Not an array');
      
      // ✅ ВИПРАВЛЕНО: Перевірка чи це масив
      if (!Array.isArray(result)) {
        console.error('❌ Result is not an array:', result);
        throw new Error('Відповідь від сервера не є масивом');
      }
      
      setData(result);
      
      // ✅ Налаштовуємо колонки
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
      console.error('❌ Error stack:', err.stack);
      setError(`Помилка завантаження: ${err.message}`);
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...data];

    // Пошук
    if (searchQuery) {
      filtered = filtered.filter(row => {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Фільтр по статусу
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
      payments: "Платежі"
    };
    return titles[tableName] || tableName;
  };

  const getStatusBadgeClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      available: "bg-green-100 text-green-800",
      in_use: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      reserved: "bg-purple-100 text-purple-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
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
          <button 
            onClick={() => navigate(`/admin/${tableName}/new`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Додати
          </button>
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
            {tableName === 'vehicles' && (
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
                  <option value="available">Доступні</option>
                  <option value="in_use">В оренді</option>
                  <option value="maintenance">Обслуговування</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ✅ ДОДАНО: Блок для відображення помилок */}
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
                        <button 
                          onClick={() => navigate(`/admin/${tableName}/edit/${row.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Редагувати"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Видалити"
                        >
                          🗑️
                        </button>
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