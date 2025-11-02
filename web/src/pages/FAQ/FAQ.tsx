import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // ✅ додано
import styles from "./FAQ.module.css";
import BackButton from "../../components/BackButton";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // ✅ готуємо навігацію
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = useMemo(
    () => [
      {
        question: t("faq_page.questions.q1.question"),
        answer: t("faq_page.questions.q1.answer"),
      },
      {
        question: t("faq_page.questions.q2.question"),
        answer: t("faq_page.questions.q2.answer"),
      },
      {
        question: t("faq_page.questions.q3.question"),
        answer: t("faq_page.questions.q3.answer"),
      },
      {
        question: t("faq_page.questions.q4.question"),
        answer: t("faq_page.questions.q4.answer"),
      },
      {
        question: t("faq_page.questions.q5.question"),
        answer: t("faq_page.questions.q5.answer"),
      },
      {
        question: t("faq_page.questions.q6.question"),
        answer: t("faq_page.questions.q6.answer"),
      },
      {
        question: t("faq_page.questions.q7.question"),
        answer: t("faq_page.questions.q7.answer"),
      },
      {
        question: t("faq_page.questions.q8.question"),
        answer: t("faq_page.questions.q8.answer"),
      },
      {
        question: t("faq_page.questions.q9.question"),
        answer: t("faq_page.questions.q9.answer"),
      },
      {
        question: t("faq_page.questions.q10.question"),
        answer: t("faq_page.questions.q10.answer"),
      },
    ],
    [t]
  );

  const toggleAccordion = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSupportClick = (): void => {
    // ✅ переходимо на сторінку підтримки
    navigate("/support"); // або /contacts, залежно від маршруту
  };

  return (
    <div className={styles.container}>
      <div className={styles.faqBox}>
        {/* Header */}
        <div className={styles.faqHeader}>
          <BackButton />
          <h1 className={styles.faqTitle}>{t("faq_page.title")}</h1>
        </div>

        {/* Контент */}
        <div className={styles.faqContent}>
          <div className={styles.accordionList}>
            {faqData.map((item: FAQItem, index: number) => (
              <div key={index} className={styles.accordionItem}>
                <button
                  className={`${styles.accordionButton} ${
                    openIndex === index ? styles.active : ""
                  }`}
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-content-${index}`}
                  type="button"
                >
                  <span className={styles.questionNumber}>{index + 1}.</span>
                  <span className={styles.questionText}>{item.question}</span>
                  <svg
                    className={`${styles.accordionIcon} ${
                      openIndex === index ? styles.rotated : ""
                    }`}
                    width="20"
                    height="12"
                    viewBox="0 0 20 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L10 10L19 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  id={`faq-content-${index}`}
                  className={`${styles.accordionContent} ${
                    openIndex === index ? styles.open : ""
                  }`}
                  role="region"
                  aria-labelledby={`faq-button-${index}`}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Нижній блок */}
          <div className={styles.supportSection}>
            <p className={styles.supportText}>
              {t("faq_page.support_question")}
            </p>
            <button
              className={styles.supportButton}
              onClick={handleSupportClick}
              aria-label={t("faq_page.support_button")}
              type="button"
            >
              {t("faq_page.support_button")}
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1"
                  stroke="#1D3A17"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
