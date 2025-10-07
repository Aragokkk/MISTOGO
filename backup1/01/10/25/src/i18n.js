import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ukTranslation from "./locales/uk.json";
import enTranslation from "./locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: ukTranslation },
      en: { translation: enTranslation }
    },
    lng: "uk",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
