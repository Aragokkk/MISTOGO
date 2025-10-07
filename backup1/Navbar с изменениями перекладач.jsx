import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);
  const { t } = useTranslation();

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

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <div className="navbar-row">
          <Link to="/" className="navbar-logo">MistoGo</Link>

          <div className="navbar-main">
            <div className="navbar-links">
              <div ref={ddRef} className={`navbar-dropdown ${open ? "open" : ""}`}>
                <button
                  className="navbar-dropdown-btn"
                  aria-expanded={open}
                  onClick={() => setOpen(v => !v)}
                >
                  ☰ {t("transport")}
                </button>
                <ul className="navbar-dropdown-list" role="menu">
                  <li><NavLink to="/transport/cars" className={linkClass} onClick={() => setOpen(false)}>{t("cars")}</NavLink></li>
                  <li><NavLink to="/transport/mopeds" className={linkClass} onClick={() => setOpen(false)}>{t("mopeds")}</NavLink></li>
                  <li><NavLink to="/transport/scooters" className={linkClass} onClick={() => setOpen(false)}>{t("scooters")}</NavLink></li>
                  <li><NavLink to="/transport/bikes" className={linkClass} onClick={() => setOpen(false)}>{t("bikes")}</NavLink></li>
                </ul>
              </div>

              <NavLink to="/zones" className={linkClass}>{t("parking")}</NavLink>
              <NavLink to="/blog" className={linkClass}>{t("blog")}</NavLink>
              <NavLink to="/faq" className={linkClass}>{t("faq")}</NavLink>
              <NavLink to="/support" className={linkClass}>{t("support")}</NavLink>
            </div>

            <div className="navbar-right">
              <LanguageSwitcher />
              <Link to="/auth" className="navbar-login">{t("login")}</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
