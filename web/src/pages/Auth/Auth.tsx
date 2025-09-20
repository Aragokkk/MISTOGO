import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth({ setIsLoggedIn }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // здесь можно добавить реальную авторизацию
    setIsLoggedIn(true);
    navigate("/"); // после входа переходим на главную
  };

  return (
    <div style={{ maxWidth: "300px", margin: "2rem auto" }}>
      <h1>Авторизація / Реєстрація</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%" }}>Увійти</button>
      </form>
    </div>
  );
}

export default Auth;
