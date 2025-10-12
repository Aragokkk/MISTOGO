import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Footer.css";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
  };

  return (
    <footer className="footer-section">
      <div className="footer-top">
        <nav className="footer-nav">
          <a href="/transport" onClick={(e) => { e.preventDefault(); navigate('/transport'); }}>{t('transport')}</a>
          <a href="/zones" onClick={(e) => { e.preventDefault(); navigate('/zones'); }}>{t('zones.short_zone')}</a>
          <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>{t('blog')}</a>
          <a href="/support" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>{t('contacts')}</a>
        </nav>
        <div className="footer-center">
          <h2 className="footer-logo">MistoGo</h2>
          <p className="footer-tagline">
            {t('footer.tagline')}
          </p>
        </div>
        <div className="footer-right">
          <span className="footer-questions" onClick={() => navigate('/faq')} style={{cursor: 'pointer'}}>
            {t('faq.short')}
          </span>
          <button className="footer-language" onClick={toggleLanguage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
            {i18n.language === 'uk' ? 'UKR | ₴ UAH' : 'ENG | $ USD'}
          </button>
          <button className="footer-login" onClick={() => navigate('/auth/login')}>
            {t('login.title')}
          </button>
          <button
            className={`footer-theme-toggle ${isDarkMode ? 'dark' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <svg width="59" height="31" viewBox="0 0 59 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_footer)">
                <rect x="1.5" y="1.5" width="56" height="28" rx="14" stroke="white" strokeWidth="3" />
                <g style={{ transform: isDarkMode ? 'translateX(28px)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>
                  <circle cx="15.5" cy="15.5" r="11" stroke="white" strokeWidth="3" />
                  <circle cx="15.5" cy="15.5" r="3.5" fill="white" />
                  <ellipse cx="22.5" cy="15.6392" rx="1.5" ry="0.5" fill="white" />
                  <ellipse cx="8.5" cy="15.6392" rx="1.5" ry="0.5" transform="rotate(180 8.5 15.6392)" fill="white" />
                  <ellipse cx="15.5" cy="8.63916" rx="1.5" ry="0.5" transform="rotate(-90 15.5 8.63916)" fill="white" />
                  <ellipse cx="15.5" cy="22.6392" rx="1.5" ry="0.5" transform="rotate(90 15.5 22.6392)" fill="white" />
                  <ellipse cx="20.7354" cy="20.8928" rx="1.49622" ry="0.641236" transform="rotate(45 20.7354 20.8928)" fill="white" />
                  <ellipse cx="10.2646" cy="10.6634" rx="1.49622" ry="0.641236" transform="rotate(-135 10.2646 10.6634)" fill="white" />
                  <ellipse cx="20.7355" cy="10.4222" rx="1.47102" ry="0.630439" transform="rotate(-45 20.7355 10.4222)" fill="white" />
                  <ellipse cx="10.2645" cy="21.1339" rx="1.47102" ry="0.630439" transform="rotate(135 10.2645 21.1339)" fill="white" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_footer">
                  <rect width="59" height="31" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-legal">
          <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>{t('footer.terms')}</a>
          <a href="/confidentiality" onClick={(e) => { e.preventDefault(); navigate('/confidentiality'); }}>{t('footer.privacy')}</a>
        </div>
        <div className="footer-social">
          <a href="mailto:hello@mistogo.com" className="footer-email">
            hello@mistogo.com
          </a>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="white"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="white"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-credits">
          <span className="footer-cookies" style={{cursor: 'pointer'}}>{t('footer.cookies')}</span>
          <span className="footer-copyright">© 2025 MistoGo</span>
        </div>
      </div>
    </footer>
  );
}