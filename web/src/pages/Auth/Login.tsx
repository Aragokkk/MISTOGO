import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Login() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Вхід</h1>
      <form>
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Пароль" /><br />
        <button type="submit">Увійти</button>
      </form>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Login;
