import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import BackHomeButton from '../../components/BackHomeButton';
import BackButton from '../../components/BackButton';
import { authService } from '../../services/authService';
import { useTranslation } from 'react-i18next'; // <-- додали i18n

function ForgotPassword() {
  const { t } = useTranslation(); // <-- хук для перекладів
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
      setError(t('forgotPassword.errors.emptyEmail'));
      return;
    }
    if (!email.includes('@')) {
      setError(t('forgotPassword.errors.invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || t('forgotPassword.checkEmail'));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || t('forgotPassword.errors.forgotFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{t('forgotPassword.title')}</h1>

      {error && <div style={{ padding: '0.5rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}
      {message && <div style={{ padding: '0.5rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>
              {t('forgotPassword.instruction')}
            </p>
            <input
              type="email"
              placeholder={t('forgotPassword.emailPlaceholder')}
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
            {loading ? t('forgotPassword.loading') : t('forgotPassword.submit')}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>{t('forgotPassword.checkEmail')}</p>
          <Link to="/auth/login" style={{ color: '#2196F3' }}>
            {t('forgotPassword.backToLogin')}
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
