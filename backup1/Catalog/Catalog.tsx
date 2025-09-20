// Catalog.tsx
import { Link } from "react-router-dom";

const cars = [
  { id: 1, name: "Tesla" },
  { id: 2, name: "Самокат" },
  { id: 3, name: "Велосипед" },
];

function Catalog() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Каталог </h1>
      <ul>
        {cars.map(car => (
          <li key={car.id} style={{ marginBottom: "0.5rem" }}>
            {car.name} - <Link to={`/car/${car.id}`}>Деталі</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Catalog;
