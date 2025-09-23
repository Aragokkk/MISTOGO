import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Cars() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Транспорт – Автомобілі</h1>
      <p>Тут буде список доступних авто.</p>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Cars;
