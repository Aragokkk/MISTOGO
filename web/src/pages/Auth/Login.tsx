import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import { authService, LoginData } from '../../services/authService';
import './Login.css';

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData & { rememberMe?: boolean }>({ 
    email: '', 
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!formData.email || !formData.password) {
      setError(t('login.fill_all_fields'));
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      if (response.success && response.user) {
        navigate('/');
      } else {
        setError(t('login.invalid_server_response'));
      }
    } catch (err: any) {
      setError(err.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        {/* Header з кнопкою назад і заголовком */}
        <div className="login-header">
          <BackButton />
          <h1 className="login-title">{t('login.title')}</h1>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder={t('login.email')}
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />

          <input
            type="password"
            name="password"
            placeholder={t('login.password')}
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />

          {/* Чекбокс "Запам'ятати мене" */}
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe || false}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">
              Запам'ятати мене
            </label>
          </div>

          {/* Кнопка "Увійти" з іконкою */}
          <button type="submit" disabled={loading} className="login-button">
            {loading ? t('login.loading') : t('login.submit')}
            <svg 
              width="18" 
              height="17" 
              viewBox="0 0 18 17" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M1 15.0987L7.45833 8.43208L1 1.76541M10.0417 15.0987L16.5 8.43208L10.0417 1.76541" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </button>
        </form>

        {/* Footer з посиланнями */}
        <div className="login-footer">
          <button 
            type="button" 
            className="forgot-password"
            onClick={() => navigate('/auth/forgot')}
          >
            {t('login.forgot_password')}
          </button>
          
          <p className="register-link">
            {t('login.no_account')} <Link to="/auth/register">{t('login.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;