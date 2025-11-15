import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SupportTicketView.module.css";

interface SupportTicket {
  id: number;
  userId: number | null;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SupportMessage {
  id: number;
  ticketId: number;
  userId: number | null;
  message: string;
  isAdmin: boolean;
  authorName: string;
  createdAt: string;
}

export default function SupportTicketView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  
  // ⭐ НОВІ СТАНИ для редагування
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [tempStatus, setTempStatus] = useState("");
  const [tempPriority, setTempPriority] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTicket();
    loadMessages();
  }, [id]);

  const loadTicket = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/support_tickets/${id}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Помилка завантаження тікета');
      }
      
      const data = await response.json();
      const ticketData = {
        id: data.id,
        userId: data.userId || data.user_id || null,
        email: data.email || "",
        subject: data.subject || "",
        message: data.message || "",
        category: data.category || "general",
        priority: data.priority || "normal",
        status: data.status || "open",
        createdAt: data.createdAt || data.created_at || "",
        updatedAt: data.updatedAt || data.updated_at || "",
      };
      
      setTicket(ticketData);
      setTempStatus(ticketData.status);
      setTempPriority(ticketData.priority);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/support_messages?ticket_id=${id}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Помилка завантаження повідомлень:', err);
    }
  };

  // ⭐ НОВА ФУНКЦІЯ: Оновлення статусу
  const handleUpdateStatus = async () => {
    if (!ticket || tempStatus === ticket.status) {
      setIsEditingStatus(false);
      return;
    }

    setSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/support_tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...ticket,
          status: tempStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Помилка оновлення статусу');
      }

      // Оновлюємо локальний стан
      setTicket({ ...ticket, status: tempStatus });
      setIsEditingStatus(false);
      
      // Показуємо повідомлення
      alert('✅ Статус успішно оновлено!');
    } catch (err: any) {
      alert(`❌ Помилка: ${err.message}`);
      setTempStatus(ticket.status); // Повертаємо старе значення
    } finally {
      setSaving(false);
    }
  };

  // ⭐ НОВА ФУНКЦІЯ: Оновлення пріоритету
  const handleUpdatePriority = async () => {
    if (!ticket || tempPriority === ticket.priority) {
      setIsEditingPriority(false);
      return;
    }

    setSaving(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mistogo.online/api';
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/support_tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...ticket,
          priority: tempPriority,
        }),
      });

      if (!response.ok) {
        throw new Error('Помилка оновлення пріоритету');
      }

      // Оновлюємо локальний стан
      setTicket({ ...ticket, priority: tempPriority });
      setIsEditingPriority(false);
      
      // Показуємо повідомлення
      alert('✅ Пріоритет успішно оновлено!');
    } catch (err: any) {
      alert(`❌ Помилка: ${err.message}`);
      setTempPriority(ticket.priority); // Повертаємо старе значення
    } finally {
      setSaving(false);
    }
  };

  // ⭐ НОВА ФУНКЦІЯ: Скасування редагування
  const handleCancelStatusEdit = () => {
    setTempStatus(ticket?.status || "");
    setIsEditingStatus(false);
  };

  const handleCancelPriorityEdit = () => {
    setTempPriority(ticket?.priority || "");
    setIsEditingPriority(false);
  };

  const getCategoryText = (category: string) => {
    const categories: { [key: string]: string } = {
      general: "Загальні",
      payment: "Оплата",
      technical: "Технічні",
      vehicle: "Транспорт",
      account: "Акаунт"
    };
    return categories[category] || category;
  };

  const getPriorityText = (priority: string) => {
    const priorities: { [key: string]: string } = {
      low: "Низький",
      normal: "Звичайний",
      high: "Високий",
      urgent: "Терміновий"
    };
    return priorities[priority] || priority;
  };

  const getStatusText = (status: string) => {
    const statuses: { [key: string]: string } = {
      open: "Відкрито",
      pending: "Очікує",
      in_progress: "В роботі",
      resolved: "Вирішено",
      closed: "Закрито"
    };
    return statuses[status] || status;
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "low":
        return styles.priorityLow;
      case "normal":
        return styles.priorityNormal;
      case "high":
        return styles.priorityHigh;
      case "urgent":
        return styles.priorityUrgent;
      default:
        return "";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return styles.statusOpen;
      case "pending":
        return styles.statusPending;
      case "in_progress":
        return styles.statusInProgress;
      case "resolved":
        return styles.statusResolved;
      case "closed":
        return styles.statusClosed;
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || "Тікет не знайдено"}</p>
          <button onClick={() => navigate("/admin/tables/support_tickets")}>
            Повернутись до списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => navigate("/admin/tables/support_tickets")}
          className={styles.backButton}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад до списку
        </button>
        <h1 className={styles.title}>Тікет #{ticket.id}</h1>
      </div>

      <div className={styles.content}>
        {/* Основна інформація */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Основна інформація</h2>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span className={styles.label}>ID:</span>
              <span className={styles.value}>{ticket.id}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>ID Користувача:</span>
              <span className={styles.value}>{ticket.userId || "-"}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>
                <a href={`mailto:${ticket.email}`}>{ticket.email}</a>
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Категорія:</span>
              <span className={styles.value}>{getCategoryText(ticket.category)}</span>
            </div>

            {/* ⭐ ОНОВЛЕНО: Пріоритет з можливістю редагування */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Пріоритет:</span>
              {isEditingPriority ? (
                <div className={styles.editContainer}>
                  <select 
                    value={tempPriority}
                    onChange={(e) => setTempPriority(e.target.value)}
                    className={styles.editSelect}
                    disabled={saving}
                  >
                    <option value="low">Низький</option>
                    <option value="normal">Звичайний</option>
                    <option value="high">Високий</option>
                    <option value="urgent">Терміновий</option>
                  </select>
                  <button 
                    onClick={handleUpdatePriority}
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? "⏳" : "✓"}
                  </button>
                  <button 
                    onClick={handleCancelPriorityEdit}
                    className={styles.cancelButton}
                    disabled={saving}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className={styles.editableValue}>
                  <span className={`${styles.badge} ${getPriorityClass(ticket.priority)}`}>
                    {getPriorityText(ticket.priority)}
                  </span>
                  <button 
                    onClick={() => setIsEditingPriority(true)}
                    className={styles.editIcon}
                    title="Редагувати пріоритет"
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>

            {/* ⭐ ОНОВЛЕНО: Статус з можливістю редагування */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Статус:</span>
              {isEditingStatus ? (
                <div className={styles.editContainer}>
                  <select 
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value)}
                    className={styles.editSelect}
                    disabled={saving}
                  >
                    <option value="open">Відкрито</option>
                    <option value="pending">Очікує</option>
                    <option value="in_progress">В роботі</option>
                    <option value="resolved">Вирішено</option>
                    <option value="closed">Закрито</option>
                  </select>
                  <button 
                    onClick={handleUpdateStatus}
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? "⏳" : "✓"}
                  </button>
                  <button 
                    onClick={handleCancelStatusEdit}
                    className={styles.cancelButton}
                    disabled={saving}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className={styles.editableValue}>
                  <span className={`${styles.badge} ${getStatusClass(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                  </span>
                  <button 
                    onClick={() => setIsEditingStatus(true)}
                    className={styles.editIcon}
                    title="Редагувати статус"
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Створено:</span>
              <span className={styles.value}>{formatDate(ticket.createdAt)}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Оновлено:</span>
              <span className={styles.value}>{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Тема та повідомлення */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Тема</h2>
          <p className={styles.subject}>{ticket.subject}</p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Повідомлення</h2>
          <div className={styles.messageBox}>
            <p>{ticket.message}</p>
          </div>
        </div>

        {/* Історія повідомлень */}
        {messages.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Історія повідомлень ({messages.length})</h2>
            <div className={styles.messagesHistory}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.historyMessage} ${
                    msg.isAdmin ? styles.adminMessage : styles.userMessage
                  }`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.author}>
                      {msg.isAdmin ? "👨‍💼 Адміністратор" : "👤 Користувач"}
                      {msg.authorName && ` (${msg.authorName})`}
                    </span>
                    <span className={styles.timestamp}>{formatDate(msg.createdAt)}</span>
                  </div>
                  <div className={styles.messageText}>{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}