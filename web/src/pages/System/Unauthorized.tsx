import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Unauthorized() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>401/403 – Доступ заборонено</h1>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Unauthorized;
