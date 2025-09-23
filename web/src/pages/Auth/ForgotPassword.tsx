import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function Forgot() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Відновлення паролю</h1>
      <form>
        <input type="email" placeholder="Введіть ваш Email" /><br />
        <button type="submit">Надіслати</button>
      </form>
      <BackHomeButton />
      <BackButton />
    </div>
  );
}

export default Forgot;
