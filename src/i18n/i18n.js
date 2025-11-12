import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uzTranslation from "./locales/uz.json"
import enTranslation from "./locales/en.json"

const savedLanguage = localStorage.getItem("language") || "uz"

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uzTranslation },
    en: { translation: enTranslation },
  },
  lng: savedLanguage,
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
})

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng)
})

export default i18n
