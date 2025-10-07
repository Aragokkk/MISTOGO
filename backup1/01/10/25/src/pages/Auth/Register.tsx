import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackHomeButton from '../../components/BackHomeButton';
import BackButton from '../../components/BackButton';
import { authService, RegisterData } from '../../services/authService';

function Register() {
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
      setError('Заповніть всі обов\'язкові поля');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Невірний формат email');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Пароль повинен містити мінімум 8 символів');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return false;
    }
    if (formData.phone && !/^\+380\d{9}$/.test(formData.phone)) {
      setError('Невірний формат телефону. Використовуйте формат +380XXXXXXXXX');
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
      const { email, password, fullName, phone } = formData;
      const response = await authService.register({ email, password, confirmPassword: '', fullName, phone });
      authService.saveToken(response.token);
      authService.saveUser(response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Реєстрація</h1>

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
            placeholder="Повне ім'я (опціонально)"
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            name="email"
            placeholder="Email *"
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
            placeholder="Телефон +380XXXXXXXXX (опціонально)"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            name="password"
            placeholder="Пароль (мін. 8 символів) *"
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
            placeholder="Підтвердіть пароль *"
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
          {loading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>Вже маєте аккаунт? <Link to="/auth/login">Увійти</Link></p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default Register;
