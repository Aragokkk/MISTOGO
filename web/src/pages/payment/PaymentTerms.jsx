import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated, getPendingVehicleId, debugAuthState } from "../../utils/auth.utils";
import "./payment-styles.css";

export default function PaymentTerms() {
  const navigate = useNavigate();
  // У .jsx НЕ можна писати useState<number | null> — це спричинить ReferenceError: number is not defined
  const [vehicleId, setVehicleId] = useState(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    console.log("🔍 PaymentTerms: Початок перевірки...");

    // Виводимо повний стан для дебагу
    debugAuthState();

    // Перевірка авторизації
    if (!isAuthenticated()) {
      console.log("❌ Користувач не авторизований - редірект на login");
      alert("Спочатку увійдіть в систему");
      navigate("/auth/login");
      return;
    }

    console.log("✅ Користувач авторизований");

    // Перевірка чи є відкладений транспорт
    const pendingVehicleId = getPendingVehicleId();
    if (pendingVehicleId) {
      console.log("🚗 Знайдено відкладений транспорт:", pendingVehicleId);
      setVehicleId(pendingVehicleId);
    } else {
      console.log("ℹ️ Немає відкладеного транспорту");
    }
  }, [navigate]);

  const handleContinue = () => {
    if (!accepted) return;
    console.log("➡️ Продовжуємо до форми оплати");
    navigate("/payment/form");
  };

  const handleBack = () => {
    console.log("⬅️ Повернення назад");
    navigate(-1);
  };

  return (
    <div className="payment-container gradient-background">
      <div className="payment-card">
        <button onClick={handleBack} className="back-button" aria-label="Повернутися назад">
          <svg className="back-icon" width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
            <path d="M39.5832 25H10.4165" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24.9998 39.5832L10.4165 24.9998L24.9998 10.4165" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h1 className="payment-title">Умови оплати</h1>

        {vehicleId && (
          <div
            style={{
              padding: "12px",
              margin: "10px 0",
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#1976d2",
            }}
          >
            ℹ️ Ви бронюєте транспорт #{vehicleId}
          </div>
        )}

        <div className="terms-content">
          <div className="terms-section">
            <h2 className="terms-heading">💳 Прив'язка банківської картки</h2>
            <p className="terms-text">
              Для використання сервісу MistoGO необхідно прив'язати банківську картку. Це потрібно для автоматичної
              оплати оренди транспорту.
            </p>
          </div>

          <div className="terms-section">
            <h2 className="terms-heading">🔒 Безпека платежів</h2>
            <ul className="terms-list">
              <li>Всі платежі обробляються через захищену платіжну систему WayForPay</li>
              <li>Дані вашої картки зберігаються відповідно до стандарту PCI DSS</li>
              <li>Ми не маємо доступу до повних даних вашої картки</li>
              <li>Всі транзакції захищені 3D Secure протоколом</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2 className="terms-heading">💰 Умови оплати</h2>
            <ul className="terms-list">
              <li>Оплата списується автоматично після завершення поїздки</li>
              <li>Тариф залежить від типу транспорту та тривалості оренди</li>
              <li>Ви можете переглянути історію платежів у особистому кабінеті</li>
              <li>У разі проблем з оплатою ви отримаєте повідомлення</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2 className="terms-heading">📝 Тестовий режим</h2>
            <p className="terms-text">
              Зараз система працює в тестовому режимі. Для підтвердження картки буде списано <strong>1 грн</strong>, яка
              автоматично повернеться.
            </p>
            <div className="test-card-info">
              <p>
                <strong>Тестові дані картки:</strong>
              </p>
              <p>Номер: 4111 1111 1111 1111</p>
              <p>CVV: 123</p>
              <p>Термін дії: 12/25</p>
            </div>
          </div>

          <div className="terms-agreement">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Я приймаю правила та умови оплати і обробку персональних даних</span>
            </label>
          </div>
        </div>

        <button onClick={handleContinue} disabled={!accepted} className={`continue-button ${!accepted ? "disabled" : ""}`}>
          Продовжити
          <svg className="arrow-icon" width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
            <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
