import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function NotFound() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>404 – Сторінку не знайдено</h1>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default NotFound;
