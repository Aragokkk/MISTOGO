import TableView from "./TableView";

export default function Vehicles() {
  return <TableView tableName="vehicles" />;
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VehicleForm.module.css";

interface Vehicle {
  id: number;
  code: string;
  displayName: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: string;
  batteryPct: number;
  unlockFee: number;
  perMinute: number;
  photoUrl?: string;
  typeName?: string;
  typeId?: number;
  isActive: boolean;
}

interface VehicleType {
  id: number;
  name: string;
  code: string;
}

export default function VehicleForm() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Фільтри
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchVehicles();
    fetchVehicleTypes();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  const fetchVehicleTypes = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const response = await fetch(`${API_URL}/vehicle_types`);
      if (response.ok) {
        const data = await response.json();
        setVehicleTypes(data);
      }
    } catch (err) {
      console.error('Помилка завантаження типів:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/vehicles`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) throw new Error('Помилка завантаження');
      
      const data = await response.json();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    if (searchQuery) {
      filtered = filtered.filter(vehicle =>
        vehicle.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.typeId === parseInt(typeFilter));
    }

    setFilteredVehicles(filtered);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити транспорт?')) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        alert('✅ Видалено успішно!');
        fetchVehicles();
      } else {
        alert('❌ Помилка видалення');
      }
    } catch (error) {
      alert('❌ Помилка: ' + error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      available: { text: 'Доступний', class: styles.statusAvailable },
      in_use: { text: 'В оренді', class: styles.statusInUse },
      maintenance: { text: 'Обслуговування', class: styles.statusMaintenance },
    };
    return badges[status as keyof typeof badges] || { text: status, class: '' };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Завантаження транспорту...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button 
            onClick={() => navigate("/admin")} 
            className={styles.backButton}
            style={{ 
              background: 'white', 
              color: '#000',
              border: '1px solid #ddd'
            }}
          >
            ← Назад до панелі
          </button>
          
          <div className={styles.titleSection}>
            <h1 className={styles.title}>🚗 Транспорт</h1>
            <p className={styles.subtitle}>
              Показано {filteredVehicles.length} з {vehicles.length} записів
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate("/admin/vehicles/new")} 
          className={styles.addButton}
          style={{
            background: '#8bc34a',
            color: 'white',
            fontSize: '16px',
            padding: '12px 24px'
          }}
        >
          + Додати транспорт
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Пошук"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            style={{ color: '#000' }}
          />
        </div>

        <div className={styles.filterBox}>
          <span className={styles.filterIcon}>📊</span>
          <span className={styles.filterLabel}>Тип</span>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
            style={{ color: '#000' }}
          >
            <option value="all" style={{ color: '#000' }}>Всі</option>
            {vehicleTypes.map(type => (
              <option key={type.id} value={type.id} style={{ color: '#000' }}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterBox}>
          <span className={styles.filterIcon}>📊</span>
          <span className={styles.filterLabel}>Статус</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
            style={{ color: '#000' }}
          >
            <option value="all" style={{ color: '#000' }}>Всі</option>
            <option value="available" style={{ color: '#000' }}>Доступний</option>
            <option value="in_use" style={{ color: '#000' }}>В оренді</option>
            <option value="maintenance" style={{ color: '#000' }}>Обслуговування</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className={styles.error}>
          <p>❌ {error}</p>
          <button onClick={fetchVehicles}>Спробувати ще раз</button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Розблокування</th>
                <th>За хвилину</th>
                <th>Код</th>
                <th>Назва</th>
                <th>Бренд</th>
                <th>Модель</th>
                <th>Рік</th>
                <th>Колір</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => {
                  const statusBadge = getStatusBadge(vehicle.status);
                  return (
                    <tr 
                      key={vehicle.id}
                      onClick={() => navigate(`/admin/vehicles/edit/${vehicle.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{vehicle.unlockFee?.toFixed(2) || '0.00'}</td>
                      <td>{vehicle.perMinute?.toFixed(2) || '0.00'}</td>
                      <td className={styles.code}>{vehicle.code}</td>
                      <td>{vehicle.displayName}</td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.color}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actions}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('🔍 Клік на редагування, ID:', vehicle.id);
                              console.log('🔍 Навігація до:', `/admin/vehicles/edit/${vehicle.id}`);
                              navigate(`/admin/vehicles/edit/${vehicle.id}`);
                            }}
                            className={styles.editButton}
                            title="Редагувати"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(vehicle.id);
                            }}
                            className={styles.deleteButton}
                            title="Видалити"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className={styles.noData}>
                    🔍 Транспорт не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}