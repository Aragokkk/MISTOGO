import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Bikes() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Транспорт – Електровелосипеди</h1>
      <p>Тут буде список доступних електровелосипедів.</p>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Bikes;
