import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import CarCard from "./pages/CarCard/CarCard";
import Auth from "./pages/Auth/Auth";
import About from "./pages/About/About";

function App() {
  return (
    <Router>
      {/* Меню навигации */}
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Головна</Link>
        <Link to="/catalog" style={{ marginRight: "1rem" }}>Каталог</Link>
        <Link to="/auth"> Авторизація </Link>
        <Link to="/about" style={{ marginRight: "1rem" }}> Про нас </Link>

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/car/:id" element={<CarCard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
