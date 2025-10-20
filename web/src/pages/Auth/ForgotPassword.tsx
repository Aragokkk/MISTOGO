import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackButton from '../../components/BackButton';
import { authService } from '../../services/authService';
import './ForgotPassword.css';

function ForgotPassword() {
  const { t } = useTranslation();
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
    <div className="container">
      <div className="forgot-box">
        {/* Header з кнопкою назад і заголовком */}
        <div className="forgot-header">
          <BackButton />
          <h1 className="forgot-title">{t('forgotPassword.title')}</h1>
        </div>

        {!submitted ? (
          <>
            <p className="forgot-description">
              {t('forgotPassword.instruction')}
            </p>

            {error && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="forgot-form">
              <input
                type="email"
                name="email"
                placeholder={t('forgotPassword.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="forgot-input"
              />

              <button type="submit" disabled={loading} className="forgot-button">
                {loading ? t('forgotPassword.loading') : t('forgotPassword.submit')}
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 15.0987L7.45833 8.43208L1 1.76541M10.0417 15.0987L16.5 8.43208L10.0417 1.76541" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <>
            {message && (
              <div className="success-message">{message}</div>
            )}

            <div className="success-state">
              <p className="success-text">
                {t('forgotPassword.checkEmail')}
              </p>
              <Link to="/auth/login" className="back-to-login">
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;