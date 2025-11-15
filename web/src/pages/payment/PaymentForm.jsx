// src/pages/payment/PaymentForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  isAuthenticated,
  getUserId,
  debugAuthState,
  setPaymentCardFlag,
} from "../../utils/auth.utils";
import "./payment-styles.css";

const RAW_BASE = import.meta.env.VITE_API_URL || "http://93.127.121.78:5000";
const API_BASE = RAW_BASE.replace(/\/+$/, "");

const PAYMENT_CREATE_URL = API_BASE.endsWith("/api")
  ? `${API_BASE}/Payment/create`
  : `${API_BASE}/api/Payment/create`;

async function loadWfpSdk() {
  if (typeof window !== "undefined" && typeof window.Wayforpay !== "undefined") {
    console.log("🧩 WFP SDK вже завантажений");
    return;
  }
  const tryLoad = (src) =>
    new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error(`Failed: ${src}`));
      document.head.appendChild(s);
    });

  try {
    await tryLoad("https://secure.wayforpay.com/server/pay-widget.js");
    console.log("✅ Завантажено pay-widget.js (server)");
  } catch (e1) {
    console.warn("⚠️ Не вдалося server/pay-widget.js:", e1?.message);
    await tryLoad("https://secure.wayforpay.com/client/js/widget.js");
    console.log("✅ Завантажено widget.js (client) як фолбек");
  }

  if (typeof window.Wayforpay === "undefined") {
    throw new Error("WayForPay SDK не завантажено (обидва шляхи).");
  }
}

const REQUIRED_FIELDS = [
  "merchantAccount",
  "merchantDomainName",
  "orderReference",
  "orderDate",
  "amount",
  "currency",
  "productName",
  "productCount",
  "productPrice",
  "merchantSignature",
];

function validateWfpPayload(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ok: false, reason: "Бекенд повернув не JSON-обʼєкт." };
  }
  const missing = REQUIRED_FIELDS.filter(
    (k) => data[k] === undefined || data[k] === null || data[k] === ""
  );
  if (missing.length) {
    return {
      ok: false,
      reason:
        "Віджет не відкрився: у відповіді бекенду відсутні поля → " +
        missing.join(", "),
    };
  }
  for (const arrKey of ["productName", "productCount", "productPrice"]) {
    if (!Array.isArray(data[arrKey]) || data[arrKey].length === 0) {
      return { ok: false, reason: `Поле ${arrKey} має бути непорожнім масивом.` };
    }
  }
  const len = data.productName.length;
  if (data.productCount.length !== len || data.productPrice.length !== len) {
    return {
      ok: false,
      reason:
        "Довжини масивів productName/productCount/productPrice повинні співпадати.",
    };
  }
  return { ok: true };
}

export default function PaymentForm() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1);
  const [desc] = useState("Card verification");
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const onErr = (e) => console.error("🛑 window.onerror:", e?.message || e);
    const onRej = (e) =>
      console.error("🛑 Unhandled promise rejection:", e?.reason || e);
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);

  useEffect(() => {
    console.log("🔍 PaymentForm init");
    console.log("🔗 RAW_BASE:", RAW_BASE);
    console.log("🔗 API_BASE:", API_BASE);
    console.log("🌐 PAYMENT_CREATE_URL:", PAYMENT_CREATE_URL);

    debugAuthState();

    if (!isAuthenticated()) {
      console.log("❌ Не авторизований → /auth/login");
      alert("Спочатку увійдіть в систему");
      navigate("/auth/login");
      return;
    }

    const currentUserId = getUserId();
    if (!currentUserId) {
      alert("Помилка авторизації. Увійдіть знову.");
      navigate("/auth/login");
      return;
    }

    console.log("✅ userId:", currentUserId);
    setUserId(currentUserId);
  }, [navigate]);

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Помилка: користувач не авторизований");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        userId,
        tripId: null,
        merchantDomainName: "mistogo.online",
        productName: desc,
        amount: Number(amount),
        currency: "UAH",
        saveCard,
        returnUrl: `${window.location.origin}/payment/success`,
      };
      console.log("📤 Request data:", requestData);

      const resp = await axios.post(PAYMENT_CREATE_URL, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = resp?.data;
      console.log("✅ Backend response (type):", typeof data);
      console.log("✅ Backend response (keys):", data && Object.keys(data));
      console.log("📊 FULL RESPONSE:", JSON.stringify(data, null, 2));
      console.log("🔐 merchantSignature:", data.merchantSignature);
      console.log("🔐 signature length:", data.merchantSignature?.length);
      console.log("🔐 requestType:", data.requestType);

      const v = validateWfpPayload(data);
      if (!v.ok) {
        throw new Error(
          v.reason +
            "\nПідказка: /api/Payment/create має ПОВЕРТАТИ інвойс з підписом."
        );
      }

      await loadWfpSdk();
      if (typeof window.Wayforpay === "undefined") {
        throw new Error("WayForPay SDK не ініціалізований після завантаження.");
      }

      // 🔧 НОРМАЛІЗАЦІЯ ТИПІВ ПЕРЕД ВИКЛИКОМ ВІДЖЕТА:
      // orderDate → Number, amount → Number, productCount → Number[], productPrice → Number[]
const launchData = {
  merchantAccount: data.merchantAccount,
  merchantDomainName: data.merchantDomainName,
  orderReference: data.orderReference,
  orderDate: Number(data.orderDate),
  amount: Number(data.amount),              // ← ЧИСЛО для віджета
  currency: data.currency,
  productName: data.productName,
  productCount: data.productCount.map(x => Number(x)),  // ← ЧИСЛА [1]
  productPrice: data.productPrice.map(x => Number(x)),  // ← ЧИСЛА [1.00]
  merchantSignature: data.merchantSignature,
  returnUrl: data.returnUrl,
  serviceUrl: data.serviceUrl,
  ...(data.requestType && { requestType: data.requestType }),
  language: data.language || "UA",
  clientFirstName: data.clientFirstName || "User",
  clientLastName: data.clientLastName || "MistoGO",
  clientPhone: data.clientPhone || "380630000000",
};

      console.log("🚀 Відкриваємо WayForPay run() з даними:", launchData);
      console.log("🔐 Final signature for WFP:", launchData.merchantSignature);
      console.log("🔥 launchData.productCount:", launchData.productCount, typeof launchData.productCount[0]);
console.log("🔥 launchData.productPrice:", launchData.productPrice, typeof launchData.productPrice[0]);
console.log("🔥 launchData.amount:", launchData.amount, typeof launchData.amount);

      const wfp = new window.Wayforpay();
      wfp.run(
        launchData,
        // success
        (resp) => {
          console.log("✅ Платіж/верифікація схвалена:", resp);
          if (saveCard) setPaymentCardFlag(true);
          navigate("/payment/success", {
            state: {
              orderReference: data.orderReference,
              amount,
              desc,
              resp,
              savedCard: saveCard,
            },
            replace: true,
          });
        },
        // fail
        (resp) => {
          console.log("❌ Відхилено:", resp);
          console.log("❌ Reason:", resp?.reason);
          navigate("/payment/fail", {
            state: { orderReference: data.orderReference, amount, desc, resp },
            replace: true,
          });
        },
        // pending
        (resp) => {
          console.log("⏳ В обробці:", resp);
          if (saveCard) setPaymentCardFlag(true);
          navigate("/payment/success", {
            state: {
              orderReference: data.orderReference,
              amount,
              desc,
              resp,
              savedCard: saveCard,
            },
            replace: true,
          });
        }
      );

      // Діагностика iframe
      setTimeout(() => {
        const iframes = Array.from(document.querySelectorAll("iframe")).map(
          (f) => ({
            src: f.getAttribute("src") || "",
            display: getComputedStyle(f).display,
            z: getComputedStyle(f).zIndex,
          })
        );
        console.log("🔎 Iframes now:", iframes);

        const wfpFrame = document.querySelector(
          'iframe[src*="secure.wayforpay.com"]'
        );
        if (!wfpFrame) {
          console.warn(
            "⚠️ WFP iframe не вставився. Ймовірно: невалідний payload/підпис."
          );
        } else {
          console.log("✅ WFP iframe присутній у DOM:", wfpFrame);
          const style = document.createElement("style");
          style.textContent = `
            iframe[src*="secure.wayforpay.com"] {
              position: fixed !important;
              inset: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              z-index: 2147483647 !important;
              display: block !important;
              opacity: 1 !important;
              visibility: visible !important;
            }
          `;
          document.head.appendChild(style);
        }
      }, 1200);
    } catch (err) {
      console.error("❌ Помилка платежу:", err);
      let msg = "Помилка створення платежу. ";
      if (err?.message) msg += err.message;

      if (err?.response) {
        console.error("Помилка сервера:", err.response.data);
        msg +=
          "\nДеталі сервера: " +
          (err.response.data?.error ||
            err.response.data?.message ||
            JSON.stringify(err.response.data));
      }
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="payment-container gradient-background">
      <div className="payment-card">
        <button onClick={handleBack} className="back-button" disabled={loading}>
          <svg className="back-icon" width="50" height="50" viewBox="0 0 50 50" fill="none">
            <path d="M39.5832 25H10.4165" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24.9998 39.5832L10.4165 24.9998L24.9998 10.4165" stroke="#4B4B4B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h1 className="payment-title">Додати картку</h1>
        <p className="payment-subtitle">
          Для підтвердження картки буде списано 1 грн (тестовий режим)
        </p>

        {error && (
          <div
            style={{
              padding: "12px",
              margin: "10px 0",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              color: "#c33",
              whiteSpace: "pre-line",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleInitiatePayment} className="payment-form">
          <div className="payment-info-box">
            <div className="info-row">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3 className="info-title">Безпечне з'єднання</h3>
                <p className="info-description">
                  Дані вашої картки захищені за стандартами PCI DSS
                </p>
              </div>
            </div>
          </div>

          <div className="payment-details-box">
            <div className="detail-row">
              <span className="detail-label">Операція:</span>
              <span className="detail-value">{desc}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Сума тесту:</span>
              <span className="detail-value-amount">{amount} грн</span>
            </div>
          </div>

          <div className="checkbox-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                Зберегти картку для майбутніх платежів
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="pay-button"
            disabled={loading || !userId}
          >
            {loading ? "Завантаження..." : "Підтвердити картку"}
            {!loading && (
              <svg className="arrow-icon" width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="additional-info">
            <p className="info-text-small">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#4B4B4B" strokeWidth="2" />
                <path d="M12 16V12M12 8H12.01" stroke="#4B4B4B" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Після натискання з'явиться віджет WayForPay для введення даних картки
            </p>
          </div>
        </form>

        <p className="test-mode-info" style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          ℹ️ Тестовий режим — реальні списання не відбуваються
        </p>
      </div>
    </div>
  );
}
