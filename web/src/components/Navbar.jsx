import { NavLink, Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState({ transport: false, user: false, admin: false, mobile: false });

  // TODO: підключи зі свого auth-стору:
  const isAuthenticated = false; // <- true після логіну
  const isAdmin = false;         // <- true для адмінів
  const userName = "Користувач"; // <- коротке ім'я для меню

  const baseLink =
    "px-3 py-2 rounded-md transition hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400";
  const activeLink = "text-yellow-300";
  const inactiveLink = "text-white/90";

  const Drop = ({ label, isOpen, onOpen, onClose, children }) => (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        className={`${baseLink} ${isOpen ? activeLink : inactiveLink}`}
        onClick={(e) => {
          e.preventDefault();
          isOpen ? onClose() : onOpen();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {label}
      </button>
      {isOpen && (
        <ul
          className="absolute left-0 top-full mt-2 min-w-48 rounded-md bg-gray-700 shadow-lg ring-1 ring-black/10 z-50"
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          role="menu"
        >
          {children}
        </ul>
      )}
    </div>
  );

  const DropItem = ({ to, children, exact = false }) => (
    <li role="none">
      <NavLink
        to={to}
        end={exact}
        className={({ isActive }) =>
          `block px-4 py-2 text-sm hover:bg-gray-600 ${isActive ? "bg-gray-600 text-yellow-300" : "text-white/90"}`
        }
        role="menuitem"
        onClick={() => setOpen((s) => ({ ...s, transport: false, user: false, admin: false, mobile: false }))}
      >
        {children}
      </NavLink>
    </li>
  );

  const TopLink = ({ to, label, exact = false }) => (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `${baseLink} ${isActive ? activeLink : inactiveLink}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <header className="bg-gray-800 text-white sticky top-0 z-40">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* ЛОГО */}
          <Link to="/" className="flex items-center gap-2">
            <span className="rounded-md bg-white/10 px-2 py-1 text-lg font-semibold tracking-wide">
              MistoGo
            </span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-1">
            {/* Транспорт */}
            <Drop
              label="Транспорт"
              isOpen={open.transport || location.pathname.startsWith("/transport")}
              onOpen={() => setOpen((s) => ({ ...s, transport: true }))}
              onClose={() => setOpen((s) => ({ ...s, transport: false }))}
            >
              <DropItem to="/transport/cars">Електромобілі</DropItem>
              <DropItem to="/transport/mopeds">Електромопеди</DropItem>
              <DropItem to="/transport/scooters">Електросамокати</DropItem>
              <DropItem to="/transport/bikes">Електровелосипеди</DropItem>
              <li className="border-t border-white/10" role="separator" />
              <DropItem to="/transport">Увесь транспорт</DropItem>
            </Drop>

            <TopLink to="/zones" label="Паркування" />
            <TopLink to="/blog" label="Блог" />
            <TopLink to="/faq" label="Часті питання" />
            <TopLink to="/support" label="Підтримка" />

            {/* Мова (плейсхолдер) */}
            <button className={`${baseLink} ${inactiveLink}`} title="Мова інтерфейсу">
              UA
            </button>
          </div>

          {/* Правий блок: Auth/User/Admin */}
          <div className="hidden md:flex items-center gap-2">
            {isAdmin && (
              <Drop
                label="Адмін-панель"
                isOpen={open.admin || location.pathname.startsWith("/admin")}
                onOpen={() => setOpen((s) => ({ ...s, admin: true }))}
                onClose={() => setOpen((s) => ({ ...s, admin: false }))}
              >
                <DropItem to="/admin/vehicles">Транспорт</DropItem>
                <DropItem to="/admin/users">Користувачі</DropItem>
                <DropItem to="/admin/tariffs">Тарифи</DropItem>
                <DropItem to="/admin/zones">Зони</DropItem>
                <DropItem to="/admin/posts">Публікації</DropItem>
              </Drop>
            )}

            {isAuthenticated ? (
              <Drop
                label={userName || "Кабінет"}
                isOpen={open.user || location.pathname.startsWith("/user")}
                onOpen={() => setOpen((s) => ({ ...s, user: true }))}
                onClose={() => setOpen((s) => ({ ...s, user: false }))}
              >
                <DropItem to="/user/profile">Профіль</DropItem>
                <DropItem to="/user/trips">Поїздки</DropItem>
                <DropItem to="/user/payments">Оплати</DropItem>
                <DropItem to="/user/settings">Налаштування</DropItem>
                <li className="border-t border-white/10" role="separator" />
                <DropItem to="/auth/logout">Вийти</DropItem>
              </Drop>
            ) : (
              <>
                <TopLink to="/auth" label="Авторизація" />
                <Link
                  to="/auth/login"
                  className="ml-1 rounded-full border border-white px-4 py-1.5 text-sm hover:bg-white/10"
                >
                  Вхід
                </Link>
              </>
            )}
          </div>

          {/* MOBILE toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10"
            onClick={() => setOpen((s) => ({ ...s, mobile: !s.mobile }))}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        {/* MOBILE panel */}
        {open.mobile && (
          <div className="md:hidden border-t border-white/10 py-2">
            <div className="flex flex-col gap-1">
              <details>
                <summary className={`${baseLink} ${inactiveLink} list-none cursor-pointer`}>Транспорт</summary>
                <div className="ml-2 mt-1 flex flex-col">
                  <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/transport/cars" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Електромобілі</Link>
                  <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/transport/mopeds" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Електромопеди</Link>
                  <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/transport/scooters" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Електросамокати</Link>
                  <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/transport/bikes" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Електровелосипеди</Link>
                </div>
              </details>

              <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/zones" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Паркування</Link>
              <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/blog" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Блог</Link>
              <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/faq" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Часті питання</Link>
              <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/support" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Підтримка</Link>

              {isAdmin && (
                <details>
                  <summary className={`${baseLink} ${inactiveLink} list-none cursor-pointer`}>Адмін-панель</summary>
                  <div className="ml-2 mt-1 flex flex-col">
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/admin/vehicles" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Транспорт</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/admin/users" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Користувачі</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/admin/tariffs" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Тарифи</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/admin/zones" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Зони</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/admin/posts" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Публікації</Link>
                  </div>
                </details>
              )}

              {!isAuthenticated ? (
                <>
                  <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/auth" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Авторизація</Link>
                  <Link className="mx-3 mt-1 inline-block rounded-full border border-white px-4 py-1.5 text-center" to="/auth/login" onClick={() => setOpen((s)=>({...s,mobile:false}))}>
                    Вхід
                  </Link>
                </>
              ) : (
                <details>
                  <summary className={`${baseLink} ${inactiveLink} list-none cursor-pointer`}>{userName || "Кабінет"}</summary>
                  <div className="ml-2 mt-1 flex flex-col">
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/user/profile" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Профіль</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/user/trips" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Поїздки</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/user/payments" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Оплати</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/user/settings" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Налаштування</Link>
                    <Link className="px-3 py-2 hover:bg-gray-700 rounded-md" to="/auth/logout" onClick={() => setOpen((s)=>({...s,mobile:false}))}>Вийти</Link>
                  </div>
                </details>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
