import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import BackHomeButton from '../../components/BackHomeButton';
import BackButton from '../../components/BackButton';
import { authService } from '../../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setMessage('');

    if (!email) {
      setError('Введіть email адресу');
      return;
    }
    if (!email.includes('@')) {
      setError('Невірний формат email');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Помилка відновлення паролю');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Відновлення паролю</h1>

      {error && (
        <div style={{ padding: '0.5rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{ padding: '0.5rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '1rem' }}>
          {message}
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>
              Введіть email адресу, яку ви використовували при реєстрації
            </p>
            <input
              type="email"
              placeholder="Введіть ваш Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              background: loading ? '#ccc' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Надсилання...' : 'Надіслати інструкції'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>Перевірте вашу електронну пошту для отримання інструкцій.</p>
          <Link to="/auth/login" style={{ color: '#2196F3' }}>
            Повернутися до входу
          </Link>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default ForgotPassword;
