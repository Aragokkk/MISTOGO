import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { licenseService, LicenseStatusDto } from '../../services/licenseService';
import './Profile.css';

interface Trip {
  id: string;
  vehicleType: 'car' | 'bike' | 'scooter' | 'moped';
  vehicleName: string;
  date: string;
  price: number;
  status: string;
}

interface Notification {
  id: string;
  message: string;
  bonusPoints: number;
}

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Отримуємо користувача з authService
  const [user, setUser] = useState(() => {
    const savedUser = authService.getUser();
    const API_URL = 'http://93.127.121.78:5000';
    const photoUrl = savedUser?.profilePhotoUrl 
      ? (savedUser.profilePhotoUrl.startsWith('http') 
          ? savedUser.profilePhotoUrl 
          : `${API_URL}${savedUser.profilePhotoUrl}`)
      : null;
    
    return {
      id: savedUser?.id || 0,
      name: savedUser?.fullName || savedUser?.email || 'Користувач',
      email: savedUser?.email || '',
      photo: photoUrl,
      bonusPoints: savedUser?.balance || 0,
      phoneVerified: savedUser?.phoneVerified || false,
      licenseVerified: savedUser?.licenseVerified || false
    };
  });

  // Стан водійського посвідчення
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatusDto>({
    status: 'none'
  });
  const [isUploadingLicense, setIsUploadingLicense] = useState(false);
  const [licenseError, setLicenseError] = useState<string | null>(null);

  // Стан завантаження фото
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [trips] = useState<Trip[]>([
    {
      id: '1',
      vehicleType: 'bike',
      vehicleName: 'E-bike Trek Powerfly',
      date: '12.10.2025',
      price: 400,
      status: 'Активна'
    },
    {
      id: '2',
      vehicleType: 'car',
      vehicleName: 'Toyota Prius Hybrid',
      date: '03.10.2025',
      price: 560,
      status: 'Завершено'
    },
    {
      id: '3',
      vehicleType: 'scooter',
      vehicleName: 'Xiaomi Electric Pro',
      date: '25.09.2025',
      price: 450,
      status: 'Скасовано'
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Бонусів за рух: Керуйте розумно, долучіть до того ж рахунка. Використовуйте ці бали звітчайте провізникувати провідниковано.',
      bonusPoints: 10
    }
  ]);

  // Перевірка чи користувач залогінений
  useEffect(() => {
    const savedUser = authService.getUser();
    if (!savedUser) {
      navigate('/login');
    }
  }, [navigate]);

  // Завантажити статус водійського посвідчення при монтуванні
  useEffect(() => {
    loadLicenseStatus();
  }, []);

  // Завантажити фото профілю при монтуванні
  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser?.profilePhotoUrl) {
      const fullPhotoUrl = profileService.getPhotoUrl(savedUser.profilePhotoUrl);
      setUser(prev => ({ ...prev, photo: fullPhotoUrl }));
    }
  }, []);

  const loadLicenseStatus = async () => {
    try {
      const status = await licenseService.getStatus();
      setLicenseStatus(status);
      
      if (status.status === 'verified') {
        const savedUser = authService.getUser();
        if (savedUser) {
          savedUser.licenseVerified = true;
          authService.saveUser(savedUser);
          setUser(prev => ({ ...prev, licenseVerified: true }));
        }
      }
    } catch (error) {
      console.error('Помилка завантаження статусу:', error);
    }
  };

  // ======= ОБРОБНИК ЗАВАНТАЖЕННЯ ФОТО ПРОФІЛЮ =======
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Розмір файлу не повинен перевищувати 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Дозволені тільки файли JPG та PNG');
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoError(null);

    try {
      const response = await profileService.uploadPhoto(user.id, file);
      
      if (response.success && response.photoUrl) {
        const fullPhotoUrl = profileService.getPhotoUrl(response.photoUrl);
        setUser(prev => ({ ...prev, photo: fullPhotoUrl }));
        
        const savedUser = authService.getUser();
        if (savedUser) {
          savedUser.profilePhotoUrl = response.photoUrl;
          authService.saveUser(savedUser);
        }
        
        alert(response.message || 'Фото успішно завантажено!');
      }
    } catch (error: any) {
      setPhotoError(error.message || 'Помилка при завантаженні фото');
      alert(error.message || 'Помилка при завантаженні фото');
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleLicenseFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setLicenseError('Розмір файлу не повинен перевищувати 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setLicenseError('Дозволені тільки файли JPG, PNG та PDF');
      return;
    }

    setIsUploadingLicense(true);
    setLicenseError(null);

    try {
      const response = await licenseService.submit(file);
      if (response.success && response.data) {
        setLicenseStatus(response.data);
        alert(response.message || 'Документ успішно завантажено!');
      }
    } catch (error: any) {
      setLicenseError(error.message || 'Помилка при завантаженні документа');
    } finally {
      setIsUploadingLicense(false);
      event.target.value = '';
    }
  };

  const handleCancelLicense = async () => {
    if (!confirm('Ви впевнені, що хочете видалити документ?')) {
      return;
    }

    try {
      const response = await licenseService.cancel();
      if (response.success) {
        setLicenseStatus({ status: 'none' });
        alert('Документ успішно видалено');
      }
    } catch (error: any) {
      alert(error.message || 'Помилка при видаленні документа');
    }
  };

  const renderLicenseCard = () => {
    const { status, documentUrl, rejectReason } = licenseStatus;

    switch (status) {
      case 'none':
        return (
          <>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M59.9992 37.5H67.4992M59.9992 52.5H67.4992M23.1367 56.25C23.9097 54.0525 25.3458 52.1492 27.2468 50.8028C29.1477 49.4564 31.4198 48.7333 33.7492 48.7333C36.0787 48.7333 38.3507 49.4564 40.2516 50.8028C42.1526 52.1492 43.5887 54.0525 44.3617 56.25" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M33.75 48.75C37.8921 48.75 41.25 45.3921 41.25 41.25C41.25 37.1079 37.8921 33.75 33.75 33.75C29.6079 33.75 26.25 37.1079 26.25 41.25C26.25 45.3921 29.6079 48.75 33.75 48.75Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M75 18.75H15C10.8579 18.75 7.5 22.1079 7.5 26.25V63.75C7.5 67.8921 10.8579 71.25 15 71.25H75C79.1421 71.25 82.5 67.8921 82.5 63.75V26.25C82.5 22.1079 79.1421 18.75 75 18.75Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="card-text-content">
              <h3 className="card-main-title">Додайте водійське посвідчення</h3>
              <p className="card-subtitle">Дані захищено</p>
            </div>
            <label className="add-button" htmlFor="license-upload">
              {isUploadingLicense ? 'Завантаження...' : 'Додати'}
            </label>
            <input
              id="license-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleLicenseFileChange}
              style={{ display: 'none' }}
              disabled={isUploadingLicense}
            />
          </>
        );

      case 'pending':
        return (
          <>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="45" cy="45" r="35" stroke="#FFA500" strokeWidth="3"/>
              <path d="M45 25V45L60 55" stroke="#FFA500" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="card-text-content">
              <h3 className="card-main-title">Документ на перевірці</h3>
              <p className="card-subtitle">Очікуйте підтвердження</p>
              {documentUrl && (
                <a 
                  href={licenseService.getDocumentUrl(documentUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-document-link"
                >
                  Переглянути документ
                </a>
              )}
            </div>
            <button className="cancel-button" onClick={handleCancelLicense}>
              Скасувати
            </button>
          </>
        );

      case 'verified':
        return (
          <>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="45" cy="45" r="35" stroke="#4CAF50" strokeWidth="3"/>
              <path d="M30 45L40 55L60 35" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="card-text-content">
              <h3 className="card-main-title" style={{ color: '#4CAF50' }}>Посвідчення підтверджено</h3>
              <p className="card-subtitle">Ви можете орендувати транспорт</p>
              {documentUrl && (
                <a 
                  href={licenseService.getDocumentUrl(documentUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-document-link"
                >
                  Переглянути документ
                </a>
              )}
            </div>
          </>
        );

      case 'rejected':
        return (
          <>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="45" cy="45" r="35" stroke="#F44336" strokeWidth="3"/>
              <path d="M35 35L55 55M55 35L35 55" stroke="#F44336" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="card-text-content">
              <h3 className="card-main-title" style={{ color: '#F44336' }}>Документ відхилено</h3>
              <p className="card-subtitle" style={{ color: '#F44336' }}>
                {rejectReason || 'Документ не пройшов перевірку'}
              </p>
            </div>
            <label className="add-button" htmlFor="license-upload-retry">
              {isUploadingLicense ? 'Завантаження...' : 'Завантажити знову'}
            </label>
            <input
              id="license-upload-retry"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleLicenseFileChange}
              style={{ display: 'none' }}
              disabled={isUploadingLicense}
            />
          </>
        );

      default:
        return null;
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike':
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.75 11.25H21.75M21.75 11.25H22.5L28.5 22.5M21.75 11.25L24.75 6.75M24.75 6.75H21M24.75 6.75H27.75M7.5 28.5C9.0913 28.5 10.6174 27.8679 11.7426 26.7426C12.8679 25.6174 13.5 24.0913 13.5 22.5C13.5 20.9087 12.8679 19.3826 11.7426 18.2574C10.6174 17.1321 9.0913 16.5 7.5 16.5C5.9087 16.5 4.38258 17.1321 3.25736 18.2574C2.13214 19.3826 1.5 20.9087 1.5 22.5C1.5 24.0913 2.13214 25.6174 3.25736 26.7426C4.38258 27.8679 5.9087 28.5 7.5 28.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 22.5L12.75 11.25M12.75 11.25L18 21H22.5M12.75 11.25C12.2505 9.75 10.5 6.75 7.5 6.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28.5 28.5C30.0913 28.5 31.6174 27.8679 32.7426 26.7426C33.8679 25.6174 34.5 24.0913 34.5 22.5C34.5 20.9087 33.8679 19.3826 32.7426 18.2574C31.6174 17.1321 30.0913 16.5 28.5 16.5C26.9087 16.5 25.3826 17.1321 24.2574 18.2574C23.1321 19.3826 22.5 20.9087 22.5 22.5C22.5 24.0913 23.1321 25.6174 24.2574 26.7426C25.3826 27.8679 26.9087 28.5 28.5 28.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'car':
        return (
          <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.5 16H29.5C30.4 16 31 15.4 31 14.5V10C31 8.65 29.95 7.45 28.75 7.15C26.05 6.4 22 5.5 22 5.5C22 5.5 20.05 3.4 18.7 2.05C17.95 1.45 17.05 1 16 1H5.5C4.6 1 3.85 1.6 3.4 2.35L1.3 6.7C1.10137 7.27934 1 7.88756 1 8.5V14.5C1 15.4 1.6 16 2.5 16H5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 19C10.1569 19 11.5 17.6569 11.5 16C11.5 14.3431 10.1569 13 8.5 13C6.84315 13 5.5 14.3431 5.5 16C5.5 17.6569 6.84315 19 8.5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.5 16H20.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23.5 19C25.1569 19 26.5 17.6569 26.5 16C26.5 14.3431 25.1569 13 23.5 13C21.8431 13 20.5 14.3431 20.5 16C20.5 17.6569 21.8431 19 23.5 19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'moped':
        return (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 24C3 19.227 6.3585 16.5 10.5 16.5C14.6415 16.5 18 19.227 18 24H3Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M7.5 12H13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 24C15 24.5909 14.8836 25.1761 14.6575 25.7221C14.4313 26.268 14.0998 26.7641 13.682 27.182C13.2641 27.5998 12.768 27.9313 12.2221 28.1575C11.6761 28.3836 11.0909 28.5 10.5 28.5C9.90905 28.5 9.32389 28.3836 8.77792 28.1575C8.23196 27.9313 7.73588 27.5998 7.31802 27.182C6.90016 26.7641 6.56869 26.268 6.34254 25.7221C6.1164 25.1761 6 24.5909 6 24" stroke="white" strokeWidth="2"/>
            <path d="M30 28.5C31.6569 28.5 33 27.1569 33 25.5C33 23.8431 31.6569 22.5 30 22.5C28.3431 22.5 27 23.8431 27 25.5C27 27.1569 28.3431 28.5 30 28.5Z" stroke="white" strokeWidth="2"/>
            <path d="M24 12C25.9995 12.957 30 16.761 30 22.5M23.985 7.5H24.8055C26.2815 7.5 27.6375 8.37 28.3215 9.7545C28.794 10.7145 28.3215 12 26.9775 12H23.985M23.985 7.5V12M23.985 7.5H19.416M23.985 12C23.985 14.8695 23.667 24 18 24H26.499" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Активна':
        return 'status-active';
      case 'Завершено':
        return 'status-completed';
      case 'Скасовано':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="page-header-section">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.5834 25H10.4167" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M25.0001 39.5832L10.4167 24.9998L25.0001 10.4165" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="page-main-title">Особистий кабінет</h1>
      </div>

      <div className="profile-content">
        <div className="profile-left-column">
          <div className="user-info-card">
            <div className="user-photo-section">
              {user.photo ? (
                <img src={user.photo} alt={user.name} className="user-photo" />
              ) : (
                <div className="user-photo-placeholder">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="30" r="15" stroke="#4B4B4B" strokeWidth="3"/>
                    <path d="M15 65C15 53 25 45 40 45C55 45 65 53 65 65" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <label className="photo-upload-button" htmlFor="photo-upload">
                {isUploadingPhoto ? 'Завантаження...' : 'Додати фото'}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                disabled={isUploadingPhoto}
              />
              {photoError && (
                <p style={{ color: '#F44336', fontSize: '12px', marginTop: '5px' }}>
                  {photoError}
                </p>
              )}
            </div>
            <div className="user-info-section">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-subtitle">Новачок</p>
            </div>
            <div className="bonus-badge">
              <span className="bonus-points">{user.bonusPoints}</span>
              <span className="bonus-label">бонусів</span>
            </div>
          </div>

          <div className="rental-history-card">
            <h3 className="section-card-title">Історії оренди</h3>
            <div className="rental-list">
              {trips.map((trip) => (
                <div key={trip.id} className="rental-item">
                  <div className="rental-icon">
                    {getVehicleIcon(trip.vehicleType)}
                  </div>
                  <div className="rental-info">
                    <h4 className="rental-vehicle-name">{trip.vehicleName}</h4>
                    <div className="rental-details">
                      <span className="rental-date">{trip.date}</span>
                      <span className={`rental-status ${getStatusClass(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  <div className="rental-price-section">
                    <span className="rental-price">{trip.price} ₴</span>
                    <button className="rental-action-button">
                      Знайти транспорт
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="#1D3A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-middle-column">
          <div className="driver-license-card">
            {renderLicenseCard()}
            {licenseError && (
              <p className="error-message" style={{ color: '#F44336', marginTop: '10px', fontSize: '14px' }}>
                {licenseError}
              </p>
            )}
          </div>

          <div className="save-card-card">
            <svg width="78" height="56" viewBox="0 0 78 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M69 1.5H9C4.85786 1.5 1.5 4.85786 1.5 9V46.5C1.5 50.6421 4.85786 54 9 54H69C73.1421 54 76.5 50.6421 76.5 46.5V9C76.5 4.85786 73.1421 1.5 69 1.5Z" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.5 20.25H76.5" stroke="#4B4B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="card-text-content">
              <h3 className="card-main-title">Збережіть вашу картку</h3>
              <p className="card-description">Оплата за оренду проходить автоматично - швидко й безпечно, а ваші дані надійно захищені</p>
            </div>
            <button 
              className="add-button-text"
              onClick={() => navigate('/payment/terms')}
            >
              Додати
            </button>
          </div>
        </div>

        <div className="profile-right-column">
          <div className="edit-profile-card">
            <h3 className="card-main-title">Редагувати профіль</h3>
          </div>

          <div className="feedback-card">
            <h3 className="card-main-title">Залиште відгук</h3>
            <p className="card-subtitle-small">Та отримайте 15% знижки на оренду транспорту</p>
          </div>
        </div>

        <div className="notifications-card">
          <h3 className="card-title-large">Історія повідомлень</h3>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M34.5556 11.2231H3.44444C2.37056 11.2231 1.5 12.0937 1.5 13.1675V17.0563C1.5 18.1302 2.37056 19.0007 3.44444 19.0007H34.5556C35.6294 19.0007 36.5 18.1302 36.5 17.0563V13.1675C36.5 12.0937 35.6294 11.2231 34.5556 11.2231Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.0017 11.2228V36.5M19.0017 11.2228C18.2984 8.32452 17.0873 5.8467 15.5265 4.11249C13.9657 2.37828 12.1275 1.46817 10.2517 1.50085C8.96249 1.50085 7.72605 2.01299 6.81441 2.9246C5.90278 3.83622 5.39063 5.07263 5.39062 6.36184C5.39063 7.65106 5.90278 8.88747 6.81441 9.79908C7.72605 10.7107 8.96249 11.2228 10.2517 11.2228M19.0017 11.2228C19.7051 8.32452 20.9161 5.8467 22.477 4.11249C24.0378 2.37828 25.876 1.46817 27.7517 1.50085C29.041 1.50085 30.2774 2.01299 31.1891 2.9246C32.1007 3.83622 32.6128 5.07263 32.6128 6.36184C32.6128 7.65106 32.1007 8.88747 31.1891 9.79908C30.2774 10.7107 29.041 11.2228 27.7517 11.2228M32.6128 19.0004V32.6112C32.6128 33.6426 32.2031 34.6317 31.4738 35.361C30.7445 36.0903 29.7554 36.5 28.724 36.5H9.27951C8.24812 36.5 7.25896 36.0903 6.52965 35.361C5.80035 34.6317 5.39063 33.6426 5.39062 32.6112V19.0004" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="notification-content">
                  <span className="notification-bonus">+{notification.bonusPoints}</span>
                  <p className="notification-text">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="settings-button">
          Налаштування
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="#1D3A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Вийти
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 14.3333L7.45833 7.66667L1 1M10.0417 14.3333L16.5 7.66667L10.0417 1" stroke="#1D3A17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Profile;