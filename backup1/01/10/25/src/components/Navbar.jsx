import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";





//Commit 13
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);
  
  

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
          {/* Лого */}
          <Link to="/" className="navbar-logo">MistoGo</Link>

          {/* Основний блок: меню + праві кнопки */}
          <div className="navbar-main">
            {/* Меню */}
           <div className="navbar-links">
             <div ref={ddRef} className={`navbar-dropdown ${open ? "open" : ""}`}>

                <button
                  className="navbar-dropdown-btn"
                  onClick={() => setOpen(v => !v)}
                >
                  ☰ Транспорт
                </button>
                <ul className="navbar-dropdown-list">
                  <li><NavLink to="/transport/cars" className={linkClass} onClick={() => setOpen(false)}>Автомобілі</NavLink></li>
                  <li><NavLink to="/transport/mopeds" className={linkClass} onClick={() => setOpen(false)}>Мопеди</NavLink></li>
                  <li><NavLink to="/transport/scooters" className={linkClass} onClick={() => setOpen(false)}>Самокати</NavLink></li>
                  <li><NavLink to="/transport/bikes" className={linkClass} onClick={() => setOpen(false)}>Велосипеди</NavLink></li>
                </ul>
              </div>

              <NavLink to="/zones" className={linkClass}>Паркування</NavLink>
              <NavLink to="/blog" className={linkClass}>Блог</NavLink>
              <NavLink to="/faq" className={linkClass}>Часті питання</NavLink>
              <NavLink to="/support" className={linkClass}>Підтримка</NavLink>
            </div>

            {/* Праворуч */}
            <div className="navbar-right">
              <button className="navbar-lang">UA/ENG</button>
              <Link to="/auth" className="navbar-login">Вхід</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
