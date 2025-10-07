import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackHomeButton from '../../components/BackHomeButton';
import BackButton from '../../components/BackButton';
import { authService, LoginData } from '../../services/authService';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: LoginData) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!formData.email || !formData.password) {
      setError('Заповніть всі поля');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      authService.saveToken(response.token);
      authService.saveUser(response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Вхід</h1>

      {error && (
        <div style={{ padding: '0.5rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
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
            background: loading ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Вхід...' : 'Увійти'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p><Link to="/auth/forgot">Забули пароль?</Link></p>
        <p>Немає аккаунту? <Link to="/auth/register">Зареєструватися</Link></p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default Login;
