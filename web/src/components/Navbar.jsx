import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const ddRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Синхронізація теми при завантаженні
  useEffect(() => {
    // Перевірити збережену тему - ЦЕ ВАЖЛИВО!
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || document.documentElement.getAttribute('data-theme') || 'light';
    
    setIsDarkMode(currentTheme === 'dark');
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Слухати зміни теми з інших компонентів
    const handleThemeChange = (e) => {
      setIsDarkMode(e.detail === 'dark');
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    isActive ? "navbar-link navbar-link-active" : "navbar-link";

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Зберегти в localStorage
    localStorage.setItem('theme', newTheme);
    
    // Відправити подію для синхронізації інших компонентів
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <div className="navbar-fit">
          <div className="navbar-inner">
            {/* Лого */}
            <Link to="/" className="navbar-logo">
              <span className="logo-text">MistoGo</span>
            </Link>

            {/* Меню навігації */}
            <div className="navbar-links">
              {/* Dropdown Транспорт */}
              <div
                ref={ddRef}
                className={`navbar-dropdown ${open ? "open" : ""}`}
              >
                <button
                  className="navbar-dropdown-btn"
                  onClick={() => setOpen((v) => !v)}
                >
                  {t("transport")}
                  <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
                </button>
                <ul className="navbar-dropdown-list">
                  <li>
                    <NavLink
                      to="/transport/cars"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      🚗 {t("cars")}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transport/mopeds"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      🛵 {t("mopeds")}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transport/scooters"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      🛴 {t("scooters")}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/transport/bikes"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      🚴 {t("bikes")}
                    </NavLink>
                  </li>
                </ul>
              </div>

              <NavLink to="/zones" className={linkClass}>
                {t("zones.short_zone")}
              </NavLink>
              <NavLink to="/blog" className={linkClass}>
                {t("blog")}
              </NavLink>
            </div>

            {/* Права секція */}
            <div className="navbar-right">
              <NavLink to="/support" className="navbar-link">
                {t("contacts")}
              </NavLink>
              <NavLink to="/faq" className="navbar-link">
                {t("faq.short")}
              </NavLink>

              {/* Перемикач теми */}
              <button
                className={`theme-toggle ${isDarkMode ? "dark" : ""}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <svg
                  width="59"
                  height="31"
                  viewBox="0 0 59 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_228_816)">
                    <rect
                      x="1.5"
                      y="1.5"
                      width="56"
                      height="28"
                      rx="14"
                      stroke="white"
                      strokeWidth="3"
                    />
                    <g
                      className="toggle-circle"
                      style={{
                        transform: isDarkMode
                          ? "translateX(28px)"
                          : "translateX(0)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {/* Світла тема - Сонце */}
                      {!isDarkMode && (
                        <>
                          <circle
                            cx="15.5"
                            cy="15.5"
                            r="12.5"
                            stroke="white"
                            strokeWidth="3"
                          />
                          <circle cx="15.5" cy="15.5" r="3.5" fill="white" />
                          <ellipse cx="22.5" cy="15.639" rx="1.5" ry="0.5" fill="white" />
                          <ellipse
                            cx="8.5"
                            cy="15.639"
                            rx="1.5"
                            ry="0.5"
                            transform="rotate(180 8.5 15.639)"
                            fill="white"
                          />
                          <ellipse
                            cx="15.5"
                            cy="8.63898"
                            rx="1.5"
                            ry="0.5"
                            transform="rotate(-90 15.5 8.63898)"
                            fill="white"
                          />
                          <ellipse
                            cx="15.5"
                            cy="22.639"
                            rx="1.5"
                            ry="0.5"
                            transform="rotate(90 15.5 22.639)"
                            fill="white"
                          />
                          <ellipse
                            cx="20.7354"
                            cy="20.8927"
                            rx="1.49622"
                            ry="0.641236"
                            transform="rotate(45 20.7354 20.8927)"
                            fill="white"
                          />
                          <ellipse
                            cx="10.2646"
                            cy="10.6632"
                            rx="1.49622"
                            ry="0.641236"
                            transform="rotate(-135 10.2646 10.6632)"
                            fill="white"
                          />
                          <ellipse
                            cx="20.7355"
                            cy="10.422"
                            rx="1.47102"
                            ry="0.630439"
                            transform="rotate(-45 20.7355 10.422)"
                            fill="white"
                          />
                          <ellipse
                            cx="10.2645"
                            cy="21.1339"
                            rx="1.47102"
                            ry="0.630439"
                            transform="rotate(135 10.2645 21.1339)"
                            fill="white"
                          />
                        </>
                      )}

                      {/* Темна тема - Місяць */}
                      {isDarkMode && (
                        <>
                          <circle cx="15.5" cy="15.5" r="12.5" stroke="white" strokeWidth="3" fill="none" />
                          <path 
                            d="M12.5557 8.60059C11.583 9.80276 11 11.3332 11 13C11 16.866 14.134 20 18 20C19.6668 20 21.1963 19.416 22.3984 18.4434C21.254 21.1221 18.5971 23 15.5 23C11.3579 23 8 19.6421 8 15.5C8 12.4031 9.87722 9.74509 12.5557 8.60059Z" 
                            fill="white"
                          />
                        </>
                      )}
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_228_816">
                      <rect width="59" height="31" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>

              {/* Мова та валюта */}
              <button className="lang-currency" onClick={toggleLanguage}>
                <span className="lang-text">
                  {i18n.language === "uk" ? "UKR" : "ENG"}
                </span>
                <span className="separator"></span>
                <span className="currency-text">
                  {i18n.language === "uk" ? "₴ UAH" : "$ USD"}
                </span>
              </button>

              {/* Кнопка входу */}
              <Link to="/auth/login" className="navbar-login">
                {t("login.title")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}