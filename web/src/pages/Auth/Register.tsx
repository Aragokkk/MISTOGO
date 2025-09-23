import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Register() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Реєстрація</h1>
      <form>
        <input type="text" placeholder="Ім'я" /><br />
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Пароль" /><br />
        <button type="submit">Зареєструватися</button>
      </form>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Register;
