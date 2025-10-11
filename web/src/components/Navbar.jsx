import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const ddRef = useRef(null);
  const { t, i18n } = useTranslation();

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
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        {/* ОБОВʼЯЗКОВО: обгортка для масштабування */}
        <div className="navbar-fit">
          <div className="navbar-inner">
            {/* Ліва секція - Лого + Меню */}
            <div className="navbar-left">
              <Link to="/" className="navbar-logo">
                <span className="logo-text">MistoGo</span>
              </Link>

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
            </div>

            {/* Права секція */}
            <div className="navbar-right">
              <NavLink to="/support" className="navbar-link">
                {t("contacts")}
              </NavLink>
              <NavLink to="/faq" className="navbar-link">
                {t("faq.short")}
              </NavLink>

              {/* Мова та валюта */}
              <button className="lang-currency" onClick={toggleLanguage}>
                {i18n.language === "uk" ? "UKR | ₴ UAH" : "ENG | $ USD"}
              </button>

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
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_228_816">
                      <rect width="59" height="31" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
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
