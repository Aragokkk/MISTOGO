import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={() => changeLanguage("uk")}
        style={{
          padding: "4px 10px",
          background: i18n.language === "uk" ? "#3b82f6" : "#223046",
          color: i18n.language === "uk" ? "white" : "inherit",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        УК
      </button>
      <button
        onClick={() => changeLanguage("en")}
        style={{
          padding: "4px 10px",
          background: i18n.language === "en" ? "#3b82f6" : "#223046",
          color: i18n.language === "en" ? "white" : "inherit",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        EN
      </button>
    </div>
  );
}
