import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Support.module.css";
import BackButton from "../../components/BackButton";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  phone: string;
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

const Support: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    name: "",
    email: "",
    message: "",
    consent: false,
  });

  // ⬇️ ДОБАВЛЕНО: стейт для баннера/отправки
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // ⬇️ ЗАМЕНА handleSubmit на асинхронный, но вся форма/JSX снизу — без удалений
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("⏳ Заявка відправляється...");

    try {
      const response = await fetch("https://api.mistogo.online/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          subject: `Запит від ${formData.name || "користувача"}`,
          message: `Телефон: ${formData.phone}\n\n${formData.message}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        setStatus("success");
        setStatusMessage("✅ Заявка успішно створена!");
        setFormData({
          phone: "",
          name: "",
          email: "",
          message: "",
          consent: false,
        });
      } else {
        throw new Error(data?.message || "Помилка при створенні тікету");
      }
    } catch (err) {
      console.error("Помилка форми:", err);
      setStatus("error");
      setStatusMessage("❌ Сталася помилка. Спробуйте ще раз.");
    }

    // Авто-скрытие баннера
    setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      consent: e.target.checked,
    }));
  };

  // ⬇️ Инлайн-стили баннера (чтобы не лезть в CSS-файл и ничего не ломать)
  const bannerStyle: React.CSSProperties = {
    position: "fixed",
    top: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    padding: "16px 24px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: 1.2,
    textAlign: "center",
    maxWidth: "90vw",
  };

  const bannerBg =
    status === "loading" ? "#e3a008" : status === "success" ? "#2ea44f" : "#dc2626";

  return (
    <div className={styles.container}>
   {status !== "idle" && (
  <div
     style={{
      position: "fixed",
      top: "32px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      padding: "22px 48px",
      borderRadius: "28px",
      background:
        status === "loading"
          ? "linear-gradient(135deg, #facc15, #fbbf24)"
          : status === "success"
          ? "linear-gradient(135deg, #0d4222, #13a15c)"
          : "linear-gradient(135deg, #991b1b, #dc2626)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "20px",
      letterSpacing: "0.3px",
      textShadow: "0 2px 6px rgba(0,0,0,0.3)",
      boxShadow:
        "0 12px 35px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.15)",
      textAlign: "center",
      opacity: 1,
      backdropFilter: "blur(6px)",
      border: "1px solid rgba(255,255,255,0.15)",
      animation: "fadeInBounce 0.7s ease-out",
      transition: "all 0.4s ease",
      minWidth: "280px",
    }}
  >
    {statusMessage}
  </div>
)}

  


      {/* Header з фоном, заголовком та кнопкою назад */}
      <div className={styles.header}>
        <div className={styles.backButtonWrapper}>
          <BackButton />
          <h1 className={styles.title}>{t('support_page.title')}</h1>
        </div>
      </div>

      {/* Контент */}
      <div className={styles.content}>
        <div className={styles.wrapper}>
          {/* Ліва колонка - Контакти */}
          <div className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>{t('support_page.contact_title')}</h2>
            <p className={styles.contactText}>
              {t('support_page.contact_description')}
            </p>

            {/* Соціальні мережі */}
            <div className={styles.socialLinks}>
              <a
                href="https://facebook.com/mistogo.life"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Facebook"
              >
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.75 4.75H35.625C32.4756 4.75 29.4551 6.00111 27.2281 8.22811C25.0011 10.4551 23.75 13.4756 23.75 16.625V23.75H16.625V33.25H23.75V52.25H33.25V33.25H40.375L42.75 23.75H33.25V16.625C33.25 15.9951 33.5002 15.391 33.9456 14.9456C34.391 14.5002 34.9951 14.25 35.625 14.25H42.75V4.75Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href="viber://chat?number=%2B380"
                className={styles.socialIcon}
                aria-label="Viber"
              >
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.5 47.5C33.5391 47.5 38.3718 45.4982 41.935 41.935C45.4982 38.3718 47.5 33.5391 47.5 28.5C47.5 23.4609 45.4982 18.6282 41.935 15.065C38.3718 11.5018 33.5391 9.5 28.5 9.5C23.4609 9.5 18.6282 11.5018 15.065 15.065C11.5018 18.6282 9.5 23.4609 9.5 28.5C9.5 33.5391 11.5018 38.3718 15.065 41.935C18.6282 45.4982 23.4609 47.5 28.5 47.5ZM28.5 52.25C15.3829 52.25 4.75 41.6171 4.75 28.5C4.75 15.3829 15.3829 4.75 28.5 4.75C41.6171 4.75 52.25 15.3829 52.25 28.5C52.25 41.6171 41.6171 52.25 28.5 52.25Z"
                    fill="currentColor"
                  />
                  <path
                    d="M37.1547 27.0845C37.1832 23.541 34.2596 20.292 30.6377 19.8431L30.4002 19.8075C30.2186 19.7716 30.0342 19.751 29.8492 19.7458C29.1058 19.7458 28.9087 20.2825 28.8564 20.6031C28.8268 20.7363 28.8241 20.874 28.8486 21.0082C28.8731 21.1424 28.9242 21.2704 28.9989 21.3845C29.2459 21.7289 29.6782 21.7883 30.0249 21.8405C30.1294 21.8532 30.2221 21.869 30.3028 21.888C33.5589 22.6361 34.6562 23.8165 35.1906 27.1486C35.2032 27.2325 35.2111 27.3291 35.2143 27.4384C35.2381 27.835 35.2879 28.6639 36.1524 28.6639C36.2237 28.6639 36.2997 28.6575 36.3804 28.6449C37.1856 28.519 37.1594 27.7614 37.1476 27.398C37.1427 27.3102 37.1427 27.2222 37.1476 27.1344L37.1523 27.0869L37.1547 27.0845Z"
                    fill="currentColor"
                  />
                  <path
                    d="M29.6399 18.5416C29.7349 18.5488 29.8299 18.5559 29.9035 18.5677C35.2473 19.418 37.7078 22.0305 38.3894 27.5928C38.3989 27.6893 38.4037 27.8002 38.4037 27.9253C38.4108 28.3599 38.425 29.2624 39.3655 29.2814H39.394C39.5232 29.2886 39.6524 29.2679 39.7729 29.2208C39.8933 29.1736 40.0023 29.1012 40.0923 29.0082C40.3844 28.6924 40.3654 28.2245 40.3488 27.8445C40.3424 27.7527 40.3401 27.668 40.3417 27.5904C40.4082 21.9022 35.6392 16.7437 30.1339 16.5537L30.0674 16.5561L30.0033 16.5609C29.9463 16.5609 29.8814 16.5577 29.8085 16.5514L29.5235 16.5371C28.6472 16.5371 28.4809 17.1784 28.4595 17.5631C28.412 18.449 29.2409 18.5131 29.6399 18.5416ZM38.1305 34.7795L37.7909 34.5064C37.2067 34.0219 36.5844 33.5754 35.9859 33.1431L35.6107 32.8724C34.8412 32.3166 34.15 32.0435 33.4969 32.0435C32.6182 32.0435 31.851 32.547 31.2169 33.5374C30.9398 33.9728 30.5931 34.1897 30.1767 34.1881C29.8849 34.1776 29.5988 34.1038 29.3383 33.972C26.8564 32.8083 25.0823 31.027 24.0682 28.6758C23.5789 27.5358 23.7357 26.7948 24.6002 26.1891C25.0894 25.8471 26.0014 25.2083 25.9373 23.9851C25.866 22.5957 22.8949 18.4157 21.6433 17.9407C21.1092 17.7401 20.5207 17.7384 19.9855 17.936C18.5487 18.4348 17.5155 19.3135 17.0002 20.4701C16.5014 21.5911 16.5252 22.9045 17.0667 24.2725C18.627 28.2293 20.8192 31.6778 23.5884 34.523C26.2959 37.3089 29.6257 39.5889 33.4827 41.3036C33.8294 41.458 34.1952 41.5411 34.4612 41.6029L34.6868 41.6599C34.7179 41.6678 34.7497 41.6726 34.7818 41.6741H34.8127C36.6272 41.6741 38.805 39.9641 39.4748 38.0119C40.0614 36.3019 38.9903 35.4588 38.1305 34.7819V34.7795ZM30.4427 23.0613C30.1339 23.0684 29.4855 23.085 29.2575 23.7642C29.153 24.0841 29.1657 24.3572 29.2955 24.5836C29.4879 24.9161 29.8584 25.0183 30.1933 25.0729C31.4093 25.2748 32.0363 25.9706 32.1598 27.2579C32.2192 27.8611 32.611 28.2791 33.1145 28.2791L33.2285 28.2744C33.8349 28.1968 34.1255 27.7416 34.1002 26.9087C34.1097 26.0395 33.6703 25.0563 32.9222 24.2725C32.1717 23.484 31.2668 23.0399 30.4427 23.0613Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="https://t.me/mistogo.life"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Telegram"
              >
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M39.0998 21.0093L36.511 37.5844C36.4754 37.8129 36.3835 38.029 36.2436 38.2132C36.1038 38.3974 35.9204 38.544 35.7099 38.6398C35.4994 38.7357 35.2684 38.7777 35.0376 38.7622C34.8069 38.7467 34.5836 38.6741 34.3878 38.551L25.719 33.1194C25.5389 33.0067 25.3868 32.8543 25.2744 32.6739C25.162 32.4935 25.0923 32.2899 25.0705 32.0785C25.0488 31.867 25.0756 31.6534 25.1488 31.4539C25.2221 31.2544 25.34 31.0743 25.4934 30.9273L32.6897 24.0303C32.7704 23.9543 32.6754 23.8284 32.5804 23.8854L22.1494 30.1269C21.5294 30.4997 20.7932 30.6292 20.0832 30.4903L16.3069 29.7611C14.9437 29.4975 14.756 27.626 16.0362 27.0964L36.2284 18.7483C36.5724 18.6051 36.9483 18.5563 37.3175 18.6069C37.6866 18.6575 38.0356 18.8056 38.3284 19.036C38.6212 19.2664 38.8472 19.5707 38.9833 19.9175C39.1193 20.2644 39.1603 20.6412 39.1022 21.0093"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.5 4.05174C14.9981 4.05174 4.05176 14.9981 4.05176 28.5C4.05176 42.0019 14.9981 52.9482 28.5 52.9482C42.0019 52.9482 52.9483 42.0019 52.9483 28.5C52.9483 14.9981 42.0019 4.05174 28.5 4.05174ZM8.24126 28.5C8.24126 25.8396 8.76527 23.2052 9.78336 20.7473C10.8015 18.2894 12.2937 16.0561 14.1749 14.1749C16.0561 12.2937 18.2894 10.8014 20.7473 9.78335C23.2052 8.76525 25.8396 8.24124 28.5 8.24124C31.1604 8.24124 33.7948 8.76525 36.2527 9.78335C38.7106 10.8014 40.9439 12.2937 42.8251 14.1749C44.7063 16.0561 46.1986 18.2894 47.2167 20.7473C48.2347 23.2052 48.7588 25.8396 48.7588 28.5C48.7588 33.8729 46.6244 39.0258 42.8251 42.8251C39.0259 46.6243 33.873 48.7587 28.5 48.7587C23.1271 48.7587 17.9742 46.6243 14.1749 42.8251C10.3757 39.0258 8.24126 33.8729 8.24126 28.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="https://instagram.com/mistogo.life"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Instagram"
              >
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.5 16.625C25.3506 16.625 22.3301 17.8761 20.1031 20.1031C17.8761 22.3301 16.625 25.3506 16.625 28.5C16.625 31.6494 17.8761 34.6699 20.1031 36.8969C22.3301 39.1239 25.3506 40.375 28.5 40.375C31.6494 40.375 34.6699 39.1239 36.8969 36.8969C39.1239 34.6699 40.375 31.6494 40.375 28.5C40.375 25.3506 39.1239 22.3301 36.8969 20.1031C34.6699 17.8761 31.6494 16.625 28.5 16.625ZM28.5 35.625C26.6101 35.625 24.7976 34.8743 23.4567 33.5333C22.1157 32.1924 21.365 30.3799 21.365 28.49C21.365 26.6001 22.1157 24.7876 23.4567 23.4467C24.7976 22.1057 26.6101 21.355 28.5 21.355C30.3899 21.355 32.2024 22.1057 33.5433 23.4467C34.8843 24.7876 35.635 26.6001 35.635 28.49C35.635 30.3799 34.8843 32.1924 33.5433 33.5333C32.2024 34.8743 30.3899 35.625 28.5 35.625Z"
                    fill="currentColor"
                  />
                  <path
                    d="M40.375 21.375C42.2915 21.375 43.8438 19.8227 43.8438 17.9062C43.8438 15.9898 42.2915 14.4375 40.375 14.4375C38.4585 14.4375 36.9062 15.9898 36.9062 17.9062C36.9062 19.8227 38.4585 21.375 40.375 21.375Z"
                    fill="currentColor"
                  />
                  <path
                    d="M45.6 4.75H11.4C7.74035 4.75 4.75 7.74035 4.75 11.4V45.6C4.75 49.2597 7.74035 52.25 11.4 52.25H45.6C49.2597 52.25 52.25 49.2597 52.25 45.6V11.4C52.25 7.74035 49.2597 4.75 45.6 4.75ZM47.5 45.6C47.5 46.8913 46.8913 47.5 45.6 47.5H11.4C10.1087 47.5 9.5 46.8913 9.5 45.6V11.4C9.5 10.1087 10.1087 9.5 11.4 9.5H45.6C46.8913 9.5 47.5 10.1087 47.5 11.4V45.6Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>

            {/* Адреси - Київ, Львів, Дніпро */}
            <div className={styles.addresses}>
              <div className={styles.addressItem}>
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.locationIcon}
                >
                  <path
                    d="M47.5 23.75C47.5 35.6084 34.3449 47.9584 29.9274 51.7726C29.5158 52.0821 29.0149 52.2494 28.5 52.2494C27.9851 52.2494 27.4842 52.0821 27.0726 51.7726C22.6551 47.9584 9.5 35.6084 9.5 23.75C9.5 18.7109 11.5018 13.8782 15.065 10.315C18.6282 6.75178 23.4609 4.75 28.5 4.75C33.5391 4.75 38.3718 6.75178 41.935 10.315C45.4982 13.8782 47.5 18.7109 47.5 23.75Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.375 23.75L26.125 28.5L35.625 19"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t('support_page.address_kyiv')}</span>
              </div>
              
              <div className={styles.addressItem}>
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.locationIcon}
                >
                  <path
                    d="M47.5 23.75C47.5 35.6084 34.3449 47.9584 29.9274 51.7726C29.5158 52.0821 29.0149 52.2494 28.5 52.2494C27.9851 52.2494 27.4842 52.0821 27.0726 51.7726C22.6551 47.9584 9.5 35.6084 9.5 23.75C9.5 18.7109 11.5018 13.8782 15.065 10.315C18.6282 6.75178 23.4609 4.75 28.5 4.75C33.5391 4.75 38.3718 6.75178 41.935 10.315C45.4982 13.8782 47.5 18.7109 47.5 23.75Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.375 23.75L26.125 28.5L35.625 19"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  </svg>
                  <span>{t('support_page.address_lviv')}</span>
                  </div>
              
              <div className={styles.addressItem}>
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.locationIcon}
                >
                  <path
                    d="M47.5 23.75C47.5 35.6084 34.3449 47.9584 29.9274 51.7726C29.5158 52.0821 29.0149 52.2494 28.5 52.2494C27.9851 52.2494 27.4842 52.0821 27.0726 51.7726C22.6551 47.9584 9.5 35.6084 9.5 23.75C9.5 18.7109 11.5018 13.8782 15.065 10.315C18.6282 6.75178 23.4609 4.75 28.5 4.75C33.5391 4.75 38.3718 6.75178 41.935 10.315C45.4982 13.8782 47.5 18.7109 47.5 23.75Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.375 23.75L26.125 28.5L35.625 19"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t('support_page.address_dnipro')}</span>
                </div>
            </div>
          </div>

          {/* Права колонка - Форма */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>{t('support_page.form_title')}</h2>
            <p className={styles.formText}>
              {t('support_page.form_description')}
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Ім'я */}
              <input
                type="text"
                name="name"
                placeholder={t('support_page.form_name')}
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />

              {/* Телефон */}
              <div className={styles.phoneGroup}>
                <select className={styles.phoneCode}>
                  <option value="+380">+380</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('support_page.form_phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.phoneInput}
                  required
                />
              </div>

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />

              {/* Питання */}
              <textarea
                name="message"
                placeholder={t('support_page.form_message')}
                value={formData.message}
                onChange={handleChange}
                className={styles.textarea}
                rows={5}
                required
              />

              {/* Checkbox згода */}
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleCheckboxChange}
                  className={styles.checkbox}
                  required
                />
                <span className={styles.checkboxCustom}>
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 7L6.5 12.5L17 2"
                      stroke="#1d3a17"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={styles.checkboxText}>
                 {t('support_page.form_consent')}
                </span>
              </label>

              {/* Кнопка */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Відправляється..." : t('support_page.form_submit')}
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginLeft: 8 }}
                >
                  <path
                    d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
