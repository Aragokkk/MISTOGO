import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const currentTheme =
      savedTheme || document.documentElement.getAttribute("data-theme") || "light";
    setIsDarkMode(currentTheme === "dark");
    document.documentElement.setAttribute("data-theme", currentTheme);

    const handleThemeChange = (e) => setIsDarkMode(e.detail === "dark");
    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new CustomEvent("themeChange", { detail: newTheme }));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "uk" ? "en" : "uk";
    i18n.changeLanguage(newLang);
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-fit">
          <div className="footer-wrapper">

            {/* Верхня частина футера */}
            <div className="footer-top">
              <nav className="footer-nav">
                <a 
                  onClick={() => navigate("/transport")}
                  className={location.pathname === "/transport" ? "footer-nav-link-active" : ""}
                >
                  {t("transport")}
                </a>
                <a 
                  onClick={() => navigate("/zones")}
                  className={location.pathname === "/zones" ? "footer-nav-link-active" : ""}
                >
                  {t("zones.short_zone")}
                </a>
                <a 
                  onClick={() => navigate("/blog")}
                  className={location.pathname === "/blog" ? "footer-nav-link-active" : ""}
                >
                  {t("blog")}
                </a>
                <a 
                  onClick={() => navigate("/support")}
                  className={location.pathname === "/support" ? "footer-nav-link-active" : ""}
                >
                  {t("contacts")}
                </a>
              </nav>

              <div className="footer-center">
                <h2 className="footer-logo">MistoGo</h2>
                <p className="footer-tagline">{t("footer.tagline")}</p>
              </div>

              <div className="footer-right">
                <span
                  className={`footer-questions ${location.pathname === "/faq" ? "footer-questions-active" : ""}`}
                  onClick={() => navigate("/faq")}
                >
                  {t("faq.title")}
                </span>

                <button className="footer-language" onClick={toggleLanguage}>
                  {i18n.language === "uk" ? "UKR" : "ENG"} |{" "}
                  {i18n.language === "uk" ? "₴ UAH" : "$ USD"}
                </button>

                <button
                  className={`footer-login ${location.pathname === "/auth/login" ? "footer-login-active" : ""}`}
                  onClick={() => navigate("/auth/login")}
                >
                  {t("login.title")}
                </button>

                <button
                  className={`footer-theme-toggle ${isDarkMode ? "dark" : ""}`}
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
                    <g clipPath="url(#clip0_footer_theme)">
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
                      <clipPath id="clip0_footer_theme">
                        <rect width="59" height="31" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>

            {/* Нижня частина футера */}
            <div className="footer-bottom">
              <div className="footer-legal">
                <a 
                  onClick={() => navigate("/privacy")}
                  className={location.pathname === "/privacy" ? "footer-legal-link-active" : ""}
                >
                  {t("footer.terms")}
                </a>
                <a 
                  onClick={() => navigate("/confidentiality")}
                  className={location.pathname === "/confidentiality" ? "footer-legal-link-active" : ""}
                >
                  {t("footer.privacy")}
                </a>
              </div>

              <div className="footer-social">
                <a href="mailto:hello@mistogo.com" className="footer-email">
                  hello@mistogo.com
                </a>

                <div className="social-icons">
                  <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="footer-credits">
                <span className="footer-cookies">{t("footer.cookies")}</span>
                <span className="footer-copyright">© 2025 MistoGo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;