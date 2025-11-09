import { useLocation, useNavigate } from "react-router-dom";
import "./payment-styles.css";

export default function Fail() {
  const { state } = useLocation() || {};
  const navigate = useNavigate();
  const order = state?.orderReference || "—";
  const amount = state?.amount || "—";
  const desc = state?.desc || "—";
  const resp = state?.resp;

  const reason = resp?.reason || resp?.reasonCode || resp?.message || "Платіж відхилено";

  const handleBack = () => {
    navigate("/payment/form");
  };

  const handleRetry = () => {
    navigate("/payment/form");
  };

  return (
    <div className="payment-container gradient-background">
      <div className="fail-card">
        {/* Кнопка повернення */}
        <button onClick={handleBack} className="back-button">
          <svg className="back-icon" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.5837 25H10.417" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25.0003 39.5832L10.417 24.9998L25.0003 10.4165" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Іконка помилки */}
        <div className="fail-icon">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="45" r="40" stroke="#F44336" strokeWidth="3"/>
            <path d="M30 30L60 60M60 30L30 60" stroke="#F44336" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="fail-title">Оплата не пройшла</h1>
        <p className="order-number">{order}</p>

        {/* Деталі помилки */}
        <div className="fail-details-box">
          <div className="detail-row">
            <span className="detail-label">Операція:</span>
            <span className="detail-value">{desc}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Сума:</span>
            <span className="detail-value">{amount} грн</span>
          </div>
          <div className="detail-row fail-reason-row">
            <span className="detail-label">Причина:</span>
            <span className="detail-value-error">{reason}</span>
          </div>
        </div>

        {/* Рекомендації */}
        <div className="recommendations-box">
          <h3 className="recommendations-title">Що робити далі?</h3>
          <ul className="recommendations-list">
            <li>Перевірте правильність введених даних картки</li>
            <li>Переконайтесь, що на картці достатньо коштів</li>
            <li>Зверніться до вашого банку для уточнення деталей</li>
          </ul>
        </div>

        {/* Кнопка спробувати ще раз */}
        <button onClick={handleRetry} className="retry-button">
          Спробувати ще раз
          <svg className="arrow-icon" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="#1D3A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {resp && (
          <details className="info-section">
            <summary>Технічні деталі</summary>
            <pre className="response-data">
              {JSON.stringify(resp, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}