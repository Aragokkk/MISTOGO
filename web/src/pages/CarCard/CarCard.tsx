// CarCard.tsx
import { useParams, Link } from "react-router-dom";

function CarCard() {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Картка  {id}</h1>
      <p>Детальна інформація про вибрану машину.</p>
      <Link to="/catalog">
        <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Назад в каталог
        </button>
      </Link>
    </div>
  );
}

export default CarCard;
