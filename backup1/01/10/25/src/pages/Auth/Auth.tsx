// web/src/pages/Auth/Auth.tsx
import { useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

export default function Auth() {
  const location = useLocation();

  // Динамічний заголовок вкладки залежно від підроуту
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let title = 'Авторизація — MistoGO';
    if (path.includes('/auth/register')) title = 'Реєстрація — MistoGO';
    else if (path.includes('/auth/login')) title = 'Вхід — MistoGO';
    else if (path.includes('/auth/forgot')) title = 'Відновлення паролю — MistoGO';
    document.title = title;
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        background: '#f7f7f8'
      }}
    >
      {/* Верхня панель (опціонально) */}
      <header
        style={{
          background: '#111827',
          color: '#fff',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>MistoGO</div>

        <nav style={{ display: 'flex', gap: '1rem' }}>
          <NavLink
            to="/auth/login"
            style={({ isActive }) => ({
              color: isActive ? '#60a5fa' : '#e5e7eb',
              textDecoration: 'none'
            })}
          >
            Вхід
          </NavLink>
          <NavLink
            to="/auth/register"
            style={({ isActive }) => ({
              color: isActive ? '#34d399' : '#e5e7eb',
              textDecoration: 'none'
            })}
          >
            Реєстрація
          </NavLink>
          <NavLink
            to="/auth/forgot"
            style={({ isActive }) => ({
              color: isActive ? '#fbbf24' : '#e5e7eb',
              textDecoration: 'none'
            })}
          >
            Забули пароль?
          </NavLink>
        </nav>
      </header>

      {/* Контент сторінок auth */}
      <main
        style={{
          display: 'grid',
          placeItems: 'center',
          padding: '2rem'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            padding: '1.5rem'
          }}
        >
          {/* Тут рендеряться Register/Login/Forgot */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
