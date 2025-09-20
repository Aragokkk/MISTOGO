// Home.tsx
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Головна сторінка</h1>
      <p>Тут буде герой-блок, опис проєкту і кнопки переходу.</p>
      <Link to="/catalog">
        <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Перейти в каталог
        </button>
      </Link>
      
    </div>
  );
}

export default Home;
