import { useTranslation } from "react-i18next";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";
import type { FC } from "react";

const Support: FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{t("support.title")}</h1>
      <p>{t("support.text")}</p>
      
      <div style={{ marginTop: "2rem" }}>
        <h2>{t("support.support")}</h2>
      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
};

export default Support;