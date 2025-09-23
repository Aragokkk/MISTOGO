import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#141414ff",
        border: "1px solid #0b0a0aff",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      ⬅ Назад
    </button>
  );
}

export default BackButton;
