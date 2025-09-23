import { Link } from "react-router-dom";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Auth() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Авторизація</h1>
      <p>Виберіть дію:</p>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <Link to="/auth/login">🔑 Вхід</Link>
        <Link to="/auth/register">🆕 Реєстрація</Link>
        <Link to="/auth/forgot">❓ Забули пароль</Link>
      </nav>

      <div style={{ marginTop: "2rem" }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default Auth;
