import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [transportOpen, setTransportOpen] = useState(false);

  const links = [
    {
      name: "Транспорт",
      path: "/transport",
      submenu: [
        { name: "Mopeds", path: "/transport/mopeds" },
        { name: "Scooters", path: "/transport/scooters" },
        { name: "Bikes", path: "/transport/bikes" },
      ],
    },
    { name: "Паркування", path: "/zones" },
    { name: "Блог", path: "/blog" },
    { name: "Авторизація", path: "/auth" },
  ];

  return (
    <nav className="bg-gray-800 p-4 relative">
      <ul className="flex space-x-6 text-white">
        {links.map((link) => (
          <li key={link.name} className="relative">
            {link.submenu ? (
              <>
                <button
                  onMouseEnter={() => setTransportOpen(true)}
                  onMouseLeave={() => setTransportOpen(false)}
                  className={`hover:text-yellow-400 ${
                    location.pathname.startsWith("/transport")
                      ? "text-yellow-400"
                      : ""
                  }`}
                >
                  {link.name}
                </button>

                {transportOpen && (
                  <ul
                    onMouseEnter={() => setTransportOpen(true)}
                    onMouseLeave={() => setTransportOpen(false)}
                    className="absolute top-full left-0 bg-gray-700 mt-1 rounded shadow-lg"
                  >
                    {link.submenu.map((sublink) => (
                      <li key={sublink.path}>
                        <Link
                          to={sublink.path}
                          className={`block px-4 py-2 hover:bg-gray-600 ${
                            location.pathname === sublink.path
                              ? "bg-gray-600 text-yellow-400"
                              : ""
                          }`}
                        >
                          {sublink.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                to={link.path}
                className={`hover:text-yellow-400 ${
                  location.pathname === link.path ? "text-yellow-400" : ""
                }`}
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
