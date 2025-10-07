import { Link } from "react-router-dom";

function BackHomeButton() {
  return (
    <div style={{ marginTop: "1rem" }}>
      <Link to="/">
        <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
          ⬅ На головну
        </button>
      </Link>
    </div>
  );
}

export default BackHomeButton;
