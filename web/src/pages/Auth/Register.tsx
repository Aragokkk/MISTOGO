import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackHomeButton from '../../components/BackHomeButton';
import BackButton from '../../components/BackButton';
import { authService, RegisterData } from '../../services/authService';
import "./Register.css";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: RegisterData) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('register.fill_required_fields'));
      return false;
    }
    if (!formData.email.includes('@')) {
      setError(t('register.invalid_email'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('register.password_length'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.password_mismatch'));
      return false;
    }
    if (formData.phone && !/^\+380\d{9}$/.test(formData.phone)) {
      setError(t('register.invalid_phone'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.success) {
        alert(response.message);
        navigate('/auth/login');
      }
    } catch (err: any) {
      setError(err.message || t('register.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="register-box">
        {/* Header з кнопкою назад і заголовком на одному рівні */}
        <div className="register-header">
          <BackButton />
          <h1 className="register-title">{t('register.title')}</h1>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="fullName"
            placeholder={t('register.full_name_optional')}
            value={formData.fullName}
            onChange={handleChange}
            className="register-input"
          />

          <input
            type="email"
            name="email"
            placeholder={t('register.email_required')}
            value={formData.email}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="tel"
            name="phone"
            placeholder={t('register.phone_optional')}
            value={formData.phone}
            onChange={handleChange}
            className="register-input"
          />

          <input
            type="password"
            name="password"
            placeholder={t('register.password_required')}
            value={formData.password}
            onChange={handleChange}
            required
            className="register-input"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder={t('register.confirm_password')}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="register-input"
          />

          <button type="submit" disabled={loading} className="register-button">
            {loading ? t('register.loading') : t('register.submit')}
          </button>
        </form>

        <div className="register-footer">
          <p>{t('register.already_have_account')} <Link to="/auth/login">{t('register.login')}</Link></p>
        </div>

        
      </div>
    </div>
  );
}

export default Register;