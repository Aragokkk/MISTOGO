import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setPaymentCardFlag, clearPendingVehicle, getPendingVehicleId } from "../../utils/auth.utils";
import "./payment-styles.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderReference, amount, desc, resp, savedCard } = location.state || {};

  useEffect(() => {
    console.log("✅ PaymentSuccess: Платіж успішний");
    console.log("Order:", orderReference);
    console.log("Saved card:", savedCard);

    // Якщо картка була збережена - встановлюємо флаг
    if (savedCard) {
      setPaymentCardFlag(true);
      console.log("💳 Флаг hasPaymentCard встановлено");
    }
  }, [orderReference, savedCard]);

  const handleContinue = () => {
    // Перевіряємо чи є відкладений транспорт для бронювання
    const pendingVehicleId = getPendingVehicleId();
    
    if (pendingVehicleId) {
      console.log("🚗 Переходимо до бронювання транспорту:", pendingVehicleId);
      // Очищаємо pendingVehicleId
      clearPendingVehicle();
      // Перекидаємо на сторінку з транспортом
      navigate('/transport');
    } else {
      console.log("📱 Переходимо в профіль");
      navigate('/user/profile');
    }
  };

  const pendingVehicleId = getPendingVehicleId();

  return (
    <div className="payment-container gradient-background">
      <div className="payment-card success-card">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="#4CAF50" fillOpacity="0.1" stroke="#4CAF50" strokeWidth="4"/>
            <path d="M25 40L35 50L55 30" stroke="#4CAF50" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="payment-title success-title">Платіж успішний!</h1>
        
        {savedCard && (
          <p className="payment-subtitle">
            💳 Картка успішно прив'язана до вашого акаунту
          </p>
        )}

        <div className="payment-details-box success-details">
          {orderReference && (
            <div className="detail-row">
              <span className="detail-label">Номер операції:</span>
              <span className="detail-value">{orderReference}</span>
            </div>
          )}
          
          {amount && (
            <div className="detail-row">
              <span className="detail-label">Сума:</span>
              <span className="detail-value-amount">{amount} грн</span>
            </div>
          )}
          
          {desc && (
            <div className="detail-row">
              <span className="detail-label">Опис:</span>
              <span className="detail-value">{desc}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Статус:</span>
            <span className="detail-value" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              ✅ Затверджено
            </span>
          </div>
        </div>

        <div className="success-info-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4CAF50" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <h3 className="info-title" style={{ color: '#4CAF50' }}>Що далі?</h3>
            <p className="info-description">
              {pendingVehicleId 
                ? "Тепер ви можете забронювати обраний транспорт"
                : "Ви можете почати користуватись сервісом MistoGO"
              }
            </p>
          </div>
        </div>

        <button onClick={handleContinue} className="continue-button">
          {pendingVehicleId 
            ? "Почати рух" 
            : "Повернутись в профіль"
          }
          <svg className="arrow-icon" width="18" height="16" viewBox="0 0 18 16" fill="none">
            <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button 
          onClick={() => navigate('/user/profile')} 
          className="secondary-button"
          style={{ 
            marginTop: '10px', 
            background: 'transparent', 
            color: '#666',
            border: '1px solid #ddd'
          }}
        >
          Перейти в особистий кабінет
        </button>

        {resp && (
          <details style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
            <summary style={{ cursor: 'pointer' }}>Технічна інформація</summary>
            <pre style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#f5f5f5', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {JSON.stringify(resp, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}