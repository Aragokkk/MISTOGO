import BackHomeButton from "../../components/BackHomeButton";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";

function Transport() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Транспорт</h1>
      <p>Оберіть категорію транспорту:</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link to="/transport/cars"><button>Електромобілі</button></Link>
        <Link to="/transport/mopeds"><button>Електромопеди</button></Link>
        <Link to="/transport/scooters"><button>Електросамокати</button></Link>
        <Link to="/transport/bikes"><button>Електровелосипеди</button></Link>
      </div>

      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Transport;
