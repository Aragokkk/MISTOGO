// Копіюємо весь код, додаючи inline styles до select'ів

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Users.module.css";

interface User {
  id: number;
  email: string;
  displayName: string;
  phone: string;
  role: string;
  balance: number;
  isActive: boolean;
  isBlocked: boolean;
  phoneVerified: boolean;
  licenseVerified: boolean;
  totalTrips: number;
  createdAt: string;
}

interface NewUserForm {
  email: string;
  displayName: string;
  phone: string;
  password: string;
  role: string;
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    email: '',
    displayName: '',
    phone: '',
    password: '',
    role: 'user',
  });
  const [addingUser, setAddingUser] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  const [sortBy, setSortBy] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, roleFilter, statusFilter, verifiedFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) throw new Error('Помилка завантаження');
      
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter === "active") {
      filtered = filtered.filter(user => user.isActive && !user.isBlocked);
    } else if (statusFilter === "blocked") {
      filtered = filtered.filter(user => user.isBlocked);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(user => !user.isActive);
    }

    if (verifiedFilter === "verified") {
      filtered = filtered.filter(user => user.phoneVerified && user.licenseVerified);
    } else if (verifiedFilter === "unverified") {
      filtered = filtered.filter(user => !user.phoneVerified || !user.licenseVerified);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (column: keyof User) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password) {
      alert('⚠️ Email та пароль обов\'язкові!');
      return;
    }

    if (newUser.password.length < 6) {
      alert('⚠️ Пароль повинен містити мінімум 6 символів!');
      return;
    }

    try {
      setAddingUser(true);
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          email: newUser.email,
          displayName: newUser.displayName || newUser.email.split('@')[0],
          phone: newUser.phone,
          password: newUser.password,
          role: newUser.role,
          isActive: true,
          isBlocked: false,
          phoneVerified: false,
          licenseVerified: false,
          balance: 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Помилка створення користувача');
      }

      alert('✅ Користувача успішно додано!');
      
      setNewUser({
        email: '',
        displayName: '',
        phone: '',
        password: '',
        role: 'user',
      });
      
      setShowAddModal(false);
      fetchUsers();
    } catch (error: any) {
      alert('❌ Помилка: ' + error.message);
    } finally {
      setAddingUser(false);
    }
  };

  const toggleStatus = async (userId: number, field: 'isActive' | 'isBlocked') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newValue = !user[field];
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...user,
          [field]: newValue,
        }),
      });

      if (!response.ok) throw new Error('Помилка оновлення');

      setUsers(users.map(u => 
        u.id === userId ? { ...u, [field]: newValue } : u
      ));
      
      const statusText = field === 'isActive' 
        ? (newValue ? 'активовано' : 'деактивовано')
        : (newValue ? 'заблоковано' : 'розблоковано');
      
      alert(`✅ Користувача ${statusText}!`);
    } catch (error) {
      alert('❌ Помилка оновлення статусу');
    }
  };

  const toggleVerification = async (userId: number, field: 'phoneVerified' | 'licenseVerified') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newValue = !user[field];
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...user,
          [field]: newValue,
        }),
      });

      if (!response.ok) throw new Error('Помилка оновлення');

      setUsers(users.map(u => 
        u.id === userId ? { ...u, [field]: newValue } : u
      ));
      
      const verifyText = field === 'phoneVerified' ? 'телефон' : 'права';
      const statusText = newValue ? 'верифіковано' : 'верифікацію скасовано';
      
      alert(`✅ ${verifyText} ${statusText}!`);
    } catch (error) {
      alert('❌ Помилка оновлення верифікації');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити користувача?')) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        alert('✅ Видалено успішно!');
        fetchUsers();
      } else {
        alert('❌ Помилка видалення');
      }
    } catch (error) {
      alert('❌ Помилка: ' + error);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setVerifiedFilter("all");
    setCurrentPage(1);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive && !u.isBlocked).length,
    blocked: users.filter(u => u.isBlocked).length,
    verified: users.filter(u => u.phoneVerified && u.licenseVerified).length,
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Завантаження користувачів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigate("/admin")} className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Назад до панелі
          </button>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>👥 Користувачі</h1>
            <p className={styles.subtitle}>Показано {filteredUsers.length} з {users.length} записів</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className={styles.addButton}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Додати користувача
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd' }}>
            <span style={{ color: '#1976d2' }}>👥</span>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Всього користувачів</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9' }}>
            <span style={{ color: '#2e7d32' }}>✓</span>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Активні</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee' }}>
            <span style={{ color: '#c62828' }}>⊘</span>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.blocked}</div>
            <div className={styles.statLabel}>Заблоковані</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e5f5' }}>
            <span style={{ color: '#7b1fa2' }}>🛡️</span>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stats.verified}</div>
            <div className={styles.statLabel}>Верифіковані</div>
          </div>
        </div>
      </div>

      <div className={styles.filtersCard}>
        <div className={styles.filtersHeader}>
          <h3>🔍 Фільтри</h3>
          <button onClick={resetFilters} className={styles.resetButton}>
            Скинути всі
          </button>
        </div>
        
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>Пошук</label>
            <div className={styles.searchInput}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                type="text"
                placeholder="Email, ім'я або телефон..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: '#000' }}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Роль</label>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ color: '#000' }}>
              <option value="all" style={{ color: '#000' }}>Всі ролі</option>
              <option value="user" style={{ color: '#000' }}>Користувач</option>
              <option value="admin" style={{ color: '#000' }}>Адміністратор</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Статус</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ color: '#000' }}>
              <option value="all" style={{ color: '#000' }}>Всі статуси</option>
              <option value="active" style={{ color: '#000' }}>Активні</option>
              <option value="blocked" style={{ color: '#000' }}>Заблоковані</option>
              <option value="inactive" style={{ color: '#000' }}>Неактивні</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Верифікація</label>
            <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} style={{ color: '#000' }}>
              <option value="all" style={{ color: '#000' }}>Всі</option>
              <option value="verified" style={{ color: '#000' }}>Верифіковані</option>
              <option value="unverified" style={{ color: '#000' }}>Неверифіковані</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className={styles.error}>
          <p>❌ {error}</p>
          <button onClick={fetchUsers}>Спробувати ще раз</button>
        </div>
      ) : currentUsers.length > 0 ? (
        <>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")} className={styles.sortable}>
                      ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => handleSort("email")} className={styles.sortable}>
                      Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>Ім'я</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                    <th onClick={() => handleSort("balance")} className={styles.sortable}>
                      Баланс {sortBy === "balance" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th>Верифікація</th>
                    <th>Статус</th>
                    <th className={styles.actionsColumn}>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td className={styles.idCell}>{user.id}</td>
                      <td className={styles.emailCell}>{user.email}</td>
                      <td>{user.displayName || "-"}</td>
                      <td>{user.phone || "-"}</td>
                      <td>
                        <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}`}>
                          {user.role === 'admin' ? '👨‍💼 Адмін' : '👤 Користувач'}
                        </span>
                      </td>
                      <td className={styles.balanceCell}>
                        ₴{user.balance?.toFixed(2) || '0.00'}
                      </td>
                      <td>
                        <div className={styles.verificationBadges}>
                          <button
                            className={`${styles.verifyBadge} ${user.phoneVerified ? styles.verified : styles.unverified}`}
                            onClick={() => toggleVerification(user.id, 'phoneVerified')}
                            title={user.phoneVerified ? "Скасувати верифікацію телефону" : "Верифікувати телефон"}
                          >
                            📱
                          </button>
                          <button
                            className={`${styles.verifyBadge} ${user.licenseVerified ? styles.verified : styles.unverified}`}
                            onClick={() => toggleVerification(user.id, 'licenseVerified')}
                            title={user.licenseVerified ? "Скасувати верифікацію прав" : "Верифікувати права"}
                          >
                            🪪
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className={styles.statusActions}>
                          {user.isBlocked ? (
                            <button
                              className={`${styles.statusBadge} ${styles.statusBlocked}`}
                              onClick={() => toggleStatus(user.id, 'isBlocked')}
                              title="Розблокувати"
                            >
                              ⊘ Заблоковано
                            </button>
                          ) : user.isActive ? (
                            <button
                              className={`${styles.statusBadge} ${styles.statusActive}`}
                              onClick={() => toggleStatus(user.id, 'isActive')}
                              title="Деактивувати"
                            >
                              ✓ Активний
                            </button>
                          ) : (
                            <button
                              className={`${styles.statusBadge} ${styles.statusInactive}`}
                              onClick={() => toggleStatus(user.id, 'isActive')}
                              title="Активувати"
                            >
                              ○ Неактивний
                            </button>
                          )}
                          {user.isBlocked && (
                            <button
                              className={styles.unblockButton}
                              onClick={() => toggleStatus(user.id, 'isBlocked')}
                              title="Розблокувати"
                            >
                              🔓
                            </button>
                          )}
                          {!user.isBlocked && (
                            <button
                              className={styles.blockButton}
                              onClick={() => toggleStatus(user.id, 'isBlocked')}
                              title="Заблокувати"
                            >
                              🔒
                            </button>
                          )}
                        </div>
                      </td>
                      <td className={styles.actionsCell}>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className={styles.deleteButton}
                          title="Видалити"
                        >
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M2.5 5H17.5M8 8V14M12 8V14M15 5V17C15 17.5 14.5 18 14 18H6C5.5 18 5 17.5 5 17V5" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                ← Попередня
              </button>
              
              <div className={styles.paginationInfo}>
                Сторінка {currentPage} з {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Наступна →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <p>🔍 Користувачів не знайдено</p>
          <button onClick={resetFilters}>Скинути фільтри</button>
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>➕ Додати нового користувача</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="user@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ім'я користувача</label>
                <input
                  type="text"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                  placeholder="Іван Іванов"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Телефон</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="+380501234567"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Пароль *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Мінімум 6 символів"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Роль</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  style={{ color: '#000' }}
                >
                  <option value="user" style={{ color: '#000' }}>👤 Користувач</option>
                  <option value="admin" style={{ color: '#000' }}>👨‍💼 Адміністратор</option>
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={styles.cancelButton}
                  disabled={addingUser}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={addingUser}
                >
                  {addingUser ? '⏳ Додавання...' : '✅ Додати користувача'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}