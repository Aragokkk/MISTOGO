import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackHomeButton from '../../components/BackHomeButton';
import BackButton from '../../components/BackButton';
import { authService, RegisterData } from '../../services/authService';

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
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{t('register.title')}</h1>

      {error && (
        <div style={{ padding: '0.5rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            name="fullName"
            placeholder={t('register.full_name_optional')}
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            name="email"
            placeholder={t('register.email_required')}
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="tel"
            name="phone"
            placeholder={t('register.phone_optional')}
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            name="password"
            placeholder={t('register.password_required')}
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            name="confirmPassword"
            placeholder={t('register.confirm_password')}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? t('register.loading') : t('register.submit')}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>{t('register.already_have_account')} <Link to="/auth/login">{t('register.login')}</Link></p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default Register;
