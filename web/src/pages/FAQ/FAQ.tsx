import { useTranslation } from "react-i18next";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

function FAQ() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{t("faq.title")}</h1>
      <p>{t("faq.description")}</p>
      
      <div style={{ marginTop: "2rem" }}>
        {/* Тут можна додати список питань */}
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default FAQ;