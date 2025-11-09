import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

interface Table {
  name: string;
  label: string;
  icon: string;
}

function Admin() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('tables');

  const tables: Table[] = [
    { name: 'users', label: 'користувачі', icon: '👥' },
    { name: 'password_resets', label: 'відновлення паролю', icon: '🔑' },
    { name: 'vehicle_types', label: 'типи транспорту', icon: '🚗' },
    { name: 'vehicles', label: 'транспорт', icon: '🛴' },
    { name: 'trips', label: 'поїздки', icon: '🗺️' },
    { name: 'payments', label: 'платежі', icon: '💳' },
    { name: 'zones', label: 'зони', icon: '📍' },
    { name: 'blog_posts', label: 'блог', icon: '📝' },
    { name: 'faq_items', label: 'FAQ', icon: '❓' },
    { name: 'support_tickets', label: 'підтримка', icon: '🎫' },
  ];

  const tabs = [
    { id: 'tables', label: 'Таблиці БД', icon: '🗄️' },
    { id: 'numeric', label: 'Числові типи', icon: '#' },
    { id: 'string', label: 'Рядкові типи', icon: 'T' },
    { id: 'datetime', label: 'Дата і час', icon: '📅' },
    { id: 'logical', label: 'Логічні типи', icon: '🔘' },
    { id: 'constraints', label: 'Обмеження', icon: '🔒' },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <div className={`admin-container ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="admin-header">
        <h1>Адміністрування БД MistoGO</h1>
        
       
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="admin-content">
        {activeTab === 'tables' && (
          <div className="tables-section">
            <div className="section-header">
              <h2>Таблиці бази даних MistoGo</h2>
              <p>Оберіть таблицю з меню вище для перегляду її структури</p>
            </div>

            <div className="tables-grid">
              {tables.map(table => (
                <button
                  key={table.name}
                  className="table-card"
                  onClick={() => navigate(`/admin/tables/${table.name}`)}
                >
                  <span className="table-icon">{table.icon}</span>
                  <div className="table-info">
                    <span className="table-name">{table.name}</span>
                    <span className="table-label">{table.label}</span>
                  </div>
                  <span className="arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'numeric' && (
          <div className="data-types-section">
            <h2>Числові типи даних</h2>
            <p>Типи даних для зберігання числових значень у БД MistoGO</p>
            
            <div className="types-table">
              <table>
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Діапазон</th>
                    <th>Використання</th>
                    <th>Чому саме так</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>TINYINT</code></td>
                    <td>-128...127 (SIGNED) або 0...255 (UNSIGNED)</td>
                    <td>battery_pct, min_age, priority</td>
                    <td>Коли потрібно дуже маленьке число (наприклад, відсотки, вік). Економить пам'ять.</td>
                  </tr>
                  <tr>
                    <td><code>SMALLINT</code></td>
                    <td>-32,768...32,767</td>
                    <td>year, max_speed_kmh</td>
                    <td>Для чисел, що трохи більші за TINYINT, але не дотягують до INT. Напр., рік, швидкість.</td>
                  </tr>
                  <tr>
                    <td><code>INT</code></td>
                    <td>~-2 млрд...2 млрд</td>
                    <td>id у зонах, FAQ</td>
                    <td>Найчастіше використовується як ідентифікатор для невеликих сутностей.</td>
                  </tr>
                  <tr>
                    <td><code>BIGINT</code></td>
                    <td>дуже велике число (≈ 9 квінтильйонів)</td>
                    <td>id у users, trips, vehicles, payments</td>
                    <td>Для великих систем, де користувачів і записів може бути дуже багато.</td>
                  </tr>
                  <tr>
                    <td><code>DECIMAL(10,2)</code></td>
                    <td>до 10 цифр, з них 2 після крапки</td>
                    <td>balance, amount, per_minute, cost_total</td>
                    <td>Для грошей і тарифів. Чому не FLOAT? Бо DECIMAL зберігає точне значення, а не наближене.</td>
                  </tr>
                  <tr>
                    <td><code>DECIMAL(9,6)</code></td>
                    <td>до 9 цифр, 6 після крапки</td>
                    <td>lat, lng</td>
                    <td>Для географічних координат. 6 знаків після крапки ⇒ точність до 10 см.</td>
                  </tr>
                  <tr>
                    <td><code>DECIMAL(8,2)</code></td>
                    <td>до 8 цифр, 2 після крапки</td>
                    <td>km_total</td>
                    <td>Для відстаней у км з точністю до 10 м.</td>
                  </tr>
                  <tr>
                    <td><code>INT DEFAULT 0</code></td>
                    <td>0...2 млрд</td>
                    <td>total_trips, minutes_total</td>
                    <td>Для підрахунків. Значення за замовчуванням 0, щоб уникнути NULL.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'string' && (
          <div className="data-types-section">
            <h2>Рядкові типи даних</h2>
            <p>Типи даних для зберігання текстової інформації у БД MistoGO</p>
            
            <div className="types-table">
              <table>
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Діапазон</th>
                    <th>Використання</th>
                    <th>Чому саме так</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>VARCHAR(20)</code></td>
                    <td>до 20 символів</td>
                    <td>status, role, code</td>
                    <td>Для коротких слів (статуси, коди).</td>
                  </tr>
                  <tr>
                    <td><code>VARCHAR(30)</code></td>
                    <td>до 30 символів</td>
                    <td>color, category</td>
                    <td>Для небагато довших текстів.</td>
                  </tr>
                  <tr>
                    <td><code>VARCHAR(50)</code></td>
                    <td>до 50 символів</td>
                    <td>driver_license, brand, model</td>
                    <td>Для документів та назв.</td>
                  </tr>
                  <tr>
                    <td><code>VARCHAR(80)</code></td>
                    <td>до 80 символів</td>
                    <td>display_name, icons name</td>
                    <td>Досить для назв.</td>
                  </tr>
                  <tr>
                    <td><code>VARCHAR(100)</code></td>
                    <td>до 100 символів</td>
                    <td>qr_code, token</td>
                    <td>Довгі унікальні коди.</td>
                  </tr>
                  <tr>
                    <td><code>VARCHAR(120)</code></td>
                    <td>до 120 символів</td>
                    <td>email, slug, support.email</td>
                    <td>Email і slug (якщо є багато букв то мерло було унікально.</td>
                  </tr>
                  <tr>
                    <td><code>VARCHAR(255)</code></td>
                    <td>до 255 символів</td>
                    <td>photo_url, icon_url, cover_image, error_message</td>
                    <td>URL і повідомлення.</td>
                  </tr>
                  <tr>
                    <td><code>TEXT</code></td>
                    <td>до 65,535 символів</td>
                    <td>message, body, comment, geojson</td>
                    <td>Довгі текст (пости, повідомлення, координати зони).</td>
                  </tr>
                  <tr>
                    <td><code>JSON</code></td>
                    <td>Зберігає від даних</td>
                    <td>tags, metadata</td>
                    <td>Коли потрібна глибока структура, напр. список тегів.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'datetime' && (
          <div className="data-types-section">
            <h2>Типи дати і часу</h2>
            <p>Типи даних для зберігання дати та часу у БД MistoGO</p>
            
            <div className="types-table">
              <table>
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Використання</th>
                    <th>Призначення</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>TINYINT</code></td>
                    <td>created_at, started_at, ended_at, published_at</td>
                    <td>Використовується для більшості дат у системі. Зручно зберігати повний timestamp.</td>
                  </tr>
                  <tr>
                    <td><code>DEFAULT CURRENT_TIMESTAMP</code></td>
                    <td>created_at</td>
                    <td>Автоматично ставить час створення.</td>
                  </tr>
                  <tr>
                    <td><code>ON UPDATE CURRENT_TIMESTAMP</code></td>
                    <td>updated_at</td>
                    <td>Автоматично оновлює поле при зміні запису.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logical' && (
          <div className="data-types-section">
            <h2>Логічні типи даних</h2>
            <p>Типи даних для зберігання булевих значень у БД MistoGO</p>
            
            <div className="types-table">
              <table>
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Використання</th>
                    <th>Призначення</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>BOOLEAN</code></td>
                    <td>is_active, is_blocked, phone_verified, license_verified</td>
                    <td>Для так/ні. У MySQL зберігається як TINYINT (0/1).</td>
                  </tr>
                  <tr>
                    <td><code>DEFAULT TRUE / FALSE</code></td>
                    <td>Автоматичне значення</td>
                    <td>Безпечніше ставити false (наприклад, телефон спочатку неперевірений).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="data-types-section">
            <h2>Логічні типи даних</h2>
            <p>Типи даних для зберігання булевих значень у БД MistoGO</p>
            
            <div className="types-table">
              <table>
                <thead>
                  <tr>
                    <th>Тип</th>
                    <th>Приклад</th>
                    <th>Призначення</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>PRIMARY KEY</code></td>
                    <td>id BIGINT PRIMARY KEY</td>
                    <td>Унікальний ідентифікатор рядка.</td>
                  </tr>
                  <tr>
                    <td><code>AUTO_INCREMENT</code></td>
                    <td>id BIGINT AUTO_INCREMENT</td>
                    <td>Автоматично збільшує id.</td>
                  </tr>
                  <tr>
                    <td><code>UNIQUE</code></td>
                    <td>email VARCHAR(120) UNIQUE</td>
                    <td>Заборонено дублікати.</td>
                  </tr>
                  <tr>
                    <td><code>NOT NULL</code></td>
                    <td>password_hash VARCHAR(255) NOT NULL</td>
                    <td>Поле обов'язкове для заповнення.</td>
                  </tr>
                  <tr>
                    <td><code>DEFAULT</code></td>
                    <td>status VARCHAR(20) DEFAULT 'available'</td>
                    <td>Значення за замовчуванням.</td>
                  </tr>
                  <tr>
                    <td><code>CHECK</code></td>
                    <td>battery_pct CHECK (battery_pct &gt;=0 AND battery_pct &lt;=100)</td>
                    <td>Обмеження на діапазон значень.</td>
                  </tr>
                  <tr>
                    <td><code>FOREIGN KEY (FK)</code></td>
                    <td>FOREIGN KEY (user_id) REFERENCES users(id)</td>
                    <td>Зв'язує таблиці між собою.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;