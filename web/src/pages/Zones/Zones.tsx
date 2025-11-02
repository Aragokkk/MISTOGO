import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Zones.css';
import BackButton from '../../components/BackButton';

// Імпорт ваших PNG іконок
import CarIcon from '../../assets/image/Map/Car_small.png';
import CarIcon2 from '../../assets/image/Map/Car_small2.png';
import BikeIcon from '../../assets/image/Map/Bicycle_Small.png';
import ElectrobikeIcon from '../../assets/image/Map/Electrobike_small.png';
import ElectroscooterIcon from '../../assets/image/Map/Electrosamocat_small.png';
import ChargingStationIcon from '../../assets/image/Map/Frame.png';

// Типи даних
interface Vehicle {
  id: string;
  type: 'car' | 'car2' | 'scooter' | 'moped' | 'bike' | 'charging';
  position: [number, number];
  battery?: number;
  status: 'available' | 'busy';
}

// Карта іконок транспорту
const vehicleIconsMap: Record<string, string> = {
  car: CarIcon,
  car2: CarIcon2,
  bike: BikeIcon,
  moped: ElectrobikeIcon,
  scooter: ElectroscooterIcon,
  charging: ChargingStationIcon,
};

// Компонент кнопок фільтрів
const FilterButtons: React.FC<{
  activeFilters: Set<string>;
  onFilterToggle: (filter: string) => void;
  onSupportClick: () => void;
  onLocationClick: () => void;
}> = ({ activeFilters, onFilterToggle, onSupportClick, onLocationClick }) => {
  const { t } = useTranslation();
  
  return (
    <div className="filter-buttons">
      {/* 1. Навушники / Підтримка */}
      <button
        className={`filter-btn ${activeFilters.has('support') ? 'active' : ''}`}
        onClick={onSupportClick}
        title={t('Zones.buttons.support')}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3C7.03 3 3 7.03 3 12V16.5C3 17.88 4.12 19 5.5 19H6.5C6.78 19 7 18.78 7 18.5V12.5C7 12.22 6.78 12 6.5 12H5.03C5.52 8.17 8.47 5.22 12.3 4.73C16.5 4.2 20.2 7.36 20.8 11.5H19.5C19.22 11.5 19 11.72 19 12V18C19 18.28 19.22 18.5 19.5 18.5H20.5C21.88 18.5 23 17.38 23 16V12C23 7.03 18.97 3 14 3H12ZM5 14H6V17H5.5C5.23 17 5 16.77 5 16.5V14ZM19 13.5H20V16.5C20 16.77 19.77 17 19.5 17H19V13.5Z" fill="#1D3A17" stroke="#1D3A17" strokeWidth="0.5"/>
        </svg>
      </button>

      {/* 2. Електричка/Зарядка */}
      <button
        className={`filter-btn ${activeFilters.has('charging') ? 'active' : ''}`}
        onClick={() => onFilterToggle('charging')}
        title={t('Zones.buttons.charging')}
      >
        <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.49992 15.8333H18.9999V7.91667H9.49992V15.8333ZM6.33325 33.25V7.91667C6.33325 7.04583 6.64359 6.30061 7.26425 5.681C7.88492 5.06139 8.63014 4.75106 9.49992 4.75H18.9999C19.8708 4.75 20.6165 5.06033 21.2372 5.681C21.8578 6.30167 22.1676 7.04689 22.1666 7.91667V19H24.1458C24.911 19 25.5644 19.2708 26.1059 19.8122C26.6474 20.3537 26.9176 21.0066 26.9166 21.7708V29.0938C26.9166 29.5424 27.1013 29.9514 27.4708 30.3208C27.8402 30.6903 28.2492 30.875 28.6978 30.875C29.1728 30.875 29.5887 30.6903 29.9455 30.3208C30.3023 29.9514 30.4801 29.5424 30.4791 29.0938V14.25H30.0833C29.6346 14.25 29.2589 14.098 28.9559 13.794C28.653 13.49 28.501 13.1142 28.4999 12.6667V9.5H29.2916V7.125H30.8749V9.5H32.4583V7.125H34.0416V9.5H34.8333V12.6667C34.8333 13.1153 34.6813 13.4916 34.3773 13.7956C34.0733 14.0996 33.6975 14.2511 33.2499 14.25H32.8541V29.0938C32.8541 30.2021 32.4514 31.1721 31.646 32.0039C30.8406 32.8357 29.8584 33.2511 28.6994 33.25C27.5647 33.25 26.5883 32.8341 25.7703 32.0023C24.9522 31.1706 24.5432 30.201 24.5432 29.0938V21.7708C24.5432 21.6389 24.5104 21.5402 24.445 21.4748C24.3796 21.4093 24.2803 21.3761 24.1473 21.375H22.1666V33.25H6.33325ZM13.4583 30.0833L17.4166 23.75H15.0416V19L11.0833 25.3333H13.4583V30.0833Z" fill="#1D3A17" stroke="#1D3A17" strokeWidth="0.5"/>
        </svg>
      </button>

      {/* 3. Геолокація */}
      <button
        className={`filter-btn ${activeFilters.has('location') ? 'active' : ''}`}
        onClick={onLocationClick}
        title={t('Zones.buttons.location')}
      >
        <svg width="36" height="36" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_location)">
            <path d="M29.75 14.166C29.75 24.0827 17 32.5827 17 32.5827C17 32.5827 4.25 24.0827 4.25 14.166C4.25 10.7845 5.5933 7.54149 7.98439 5.1504C10.3755 2.75932 13.6185 1.41602 17 1.41602C20.3815 1.41602 23.6245 2.75932 26.0156 5.1504C28.4067 7.54149 29.75 10.7845 29.75 14.166Z" stroke="#1D3A17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 18.416C19.3472 18.416 21.25 16.5132 21.25 14.166C21.25 11.8188 19.3472 9.91602 17 9.91602C14.6528 9.91602 12.75 11.8188 12.75 14.166C12.75 16.5132 14.6528 18.416 17 18.416Z" fill="#1D3A17" stroke="#1D3A17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_location">
              <rect width="34" height="34" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </button>

      {/* 5. Транспорт */}
      <button
        className={`filter-btn ${activeFilters.has('bike') ? 'active' : ''}`}
        onClick={() => onFilterToggle('bike')}
        title={t('Zones.buttons.transport')}
      >
        <svg width="38" height="36" viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30.4792 24.5864C28.5792 24.5864 26.9628 23.9795 25.6302 22.7659C24.2976 21.5523 23.4466 19.9909 23.0771 18.0818H16.3479L14.9625 15.6273H23.0771C23.1563 14.8909 23.3542 14.1613 23.6708 13.4386C23.9875 12.7159 24.3966 12.0682 24.8979 11.4955H12.5479L11.1229 9.04091H26.2833L24.1063 2.45455H17.4167V0H24.1063C24.6364 0 25.1055 0.156821 25.5134 0.470455C25.9211 0.784088 26.2042 1.18636 26.3625 1.67727L28.7771 9.04091H30.0833C32.3792 9.04091 34.2726 9.75003 35.7635 11.1682C37.2545 12.5863 38 14.4682 38 16.8136C38 18.9409 37.2611 20.7682 35.7833 22.2955C34.3055 23.8228 32.5375 24.5864 30.4792 24.5864ZM30.4792 22.1318C31.8514 22.1318 33.0521 21.6 34.0812 20.5364C35.1104 19.4727 35.625 18.2318 35.625 16.8136C35.625 15.2863 35.1368 14.0182 34.1604 13.0091C33.1841 12 31.9586 11.4955 30.4839 11.4955C30.4544 11.4955 30.3274 11.5022 30.1031 11.5159C29.8788 11.5296 29.7534 11.5364 29.7271 11.5364L31.3104 16.0364L29.0938 16.8545L27.4708 12.3136C26.7583 12.9409 26.224 13.6159 25.8677 14.3386C25.5115 15.0613 25.3333 15.8864 25.3333 16.8136C25.3333 18.291 25.8337 19.5466 26.8343 20.5805C27.8348 21.6147 29.0497 22.1318 30.4792 22.1318ZM11.0833 36C9.88475 36 8.86603 35.5665 8.0271 34.6995C7.1882 33.8325 6.76875 32.7796 6.76875 31.5409V31.0909H0V28.6364H7.79792C8.14095 28.2273 8.58958 27.8659 9.14375 27.5523C9.69792 27.2387 10.3445 27.0818 11.0833 27.0818C11.743 27.0818 12.3434 27.2182 12.8844 27.4909C13.4253 27.7636 13.9201 28.1455 14.3687 28.6364H19.3958V23.7273H0V21.2727H3.5625V16.3636H0V13.9091H11.1625L15.4375 21.2727H19.3958C20.049 21.2727 20.6081 21.513 21.0734 21.9935C21.5383 22.4744 21.7708 23.0523 21.7708 23.7273V28.6364C21.7708 29.3114 21.5383 29.8892 21.0734 30.3697C20.6081 30.8505 20.049 31.0909 19.3958 31.0909H15.3979V31.5409C15.3979 32.7796 14.9785 33.8325 14.1396 34.6995C13.3006 35.5665 12.2819 36 11.0833 36ZM5.9375 21.2727H12.6667L9.81667 16.3636H5.9375V21.2727ZM11.0833 33.5455C11.6111 33.5455 12.0663 33.3477 12.449 32.9523C12.8316 32.5568 13.0229 32.0864 13.0229 31.5409C13.0229 30.9954 12.8316 30.525 12.449 30.1295C12.0663 29.7341 11.6111 29.5364 11.0833 29.5364C10.5555 29.5364 10.1003 29.7341 9.71771 30.1295C9.3351 30.525 9.14375 30.9954 9.14375 31.5409C9.14375 32.0864 9.3351 32.5568 9.71771 32.9523C10.1003 33.3477 10.5555 33.5455 11.0833 33.5455Z" fill="#1D3A17"/>
        </svg>
      </button>
    </div>
  );
};

// Головний компонент
const Zones: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Circle | null>(null);
  const navigate = useNavigate();
  const center: [number, number] = [50.450, 30.520];

  const vehicles: Vehicle[] = [
    // Автомобілі Car_small.png
    { id: 'car1', type: 'car', position: [50.465, 30.485], battery: 85, status: 'available' },
    { id: 'car2', type: 'car', position: [50.435, 30.495], battery: 90, status: 'available' },
    { id: 'car3', type: 'car', position: [50.450, 30.455], battery: 75, status: 'busy' },
    { id: 'car4', type: 'car', position: [50.448, 30.525], battery: 80, status: 'available' },
    
    // Автомобілі Car_small2.png
    { id: 'car5', type: 'car2', position: [50.468, 30.515], battery: 70, status: 'available' },
    { id: 'car6', type: 'car2', position: [50.438, 30.515], battery: 95, status: 'available' },
    
    // Мотоцикл
    { id: 'moped1', type: 'moped', position: [50.472, 30.515], battery: 85, status: 'available' },
    
    // Велосипеди
    { id: 'bike1', type: 'bike', position: [50.462, 30.515], battery: 90, status: 'available' },
    { id: 'bike2', type: 'bike', position: [50.462, 30.545], battery: 90, status: 'available' },
    
    // Самокати
    { id: 'scooter1', type: 'scooter', position: [50.432, 30.555], battery: 78, status: 'available' },
    { id: 'scooter2', type: 'scooter', position: [50.455, 30.495], battery: 82, status: 'available' },
    { id: 'scooter3', type: 'scooter', position: [50.435, 30.465], battery: 82, status: 'available' },
    
    // Зарядні станції
    { id: 'charging1', type: 'charging', position: [50.470, 30.490], battery: 100, status: 'available' },
    { id: 'charging2', type: 'charging', position: [50.458, 30.515], battery: 100, status: 'available' },
    { id: 'charging3', type: 'charging', position: [50.440, 30.515], battery: 100, status: 'available' },
    { id: 'charging4', type: 'charging', position: [50.428, 30.485], battery: 100, status: 'available' },
  ];

  // Ініціалізація карти
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map-container').setView(center, 14);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Додаємо зони паркування
      L.polygon([
        [50.455, 30.510],
        [50.458, 30.520],
        [50.452, 30.525],
        [50.449, 30.515]
      ], {
        color: '#AFD06E',
        fillColor: '#AFD06E',
        fillOpacity: 0.3,
        weight: 2
      }).addTo(map).bindPopup(t('Zones.parkingZones.khreshchatyk'));

      L.polygon([
        [50.448, 30.540],
        [50.452, 30.550],
        [50.446, 30.555],
        [50.442, 30.545]
      ], {
        color: '#AFD06E',
        fillColor: '#AFD06E',
        fillOpacity: 0.3,
        weight: 2
      }).addTo(map).bindPopup(t('Zones.parkingZones.maidan'));

      L.polygon([
        [50.440, 30.490],
        [50.444, 30.500],
        [50.438, 30.505],
        [50.434, 30.495]
      ], {
        color: '#AFD06E',
        fillColor: '#AFD06E',
        fillOpacity: 0.3,
        weight: 2
      }).addTo(map).bindPopup(t('Zones.parkingZones.besarabka'));

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [t]);

  // Оновлення маркерів транспорту
  useEffect(() => {
    if (!mapRef.current) return;

    // Видаляємо старі маркери
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Фільтруємо транспорт
    const filteredVehicles = vehicles.filter((vehicle) => {
      if (activeFilters.size === 0) return true;
      
      if (activeFilters.has('bike') && vehicle.type !== 'charging') {
        return false;
      }
      
      if (activeFilters.has('charging') && vehicle.type === 'charging') {
        return false;
      }
      
      return true;
    });

    // Додаємо нові маркери
    filteredVehicles.forEach((vehicle) => {
      const icon = L.icon({
        iconUrl: vehicleIconsMap[vehicle.type],
        iconSize: [90, 90],
        iconAnchor: [45, 45],
        popupAnchor: [0, -45],
        className: `vehicle-icon vehicle-${vehicle.id}`,
      });

      const marker = L.marker(vehicle.position, { icon }).addTo(mapRef.current!);

      let popupContent = '';
      if (vehicle.type === 'charging') {
        popupContent = `
          <div class="vehicle-popup">
            <h4>${t('Zones.chargingStation.title')}</h4>
            <div class="charging-info">
              <p>${t('Zones.chargingStation.fastCharging')}</p>
              <p>${t('Zones.chargingStation.available', { available: 2, total: 4 })}</p>
            </div>
          </div>
        `;
      } else {
        const vehicleName = 
          vehicle.type === 'car' || vehicle.type === 'car2' ? t('Zones.vehicles.car') :
          vehicle.type === 'moped' ? t('Zones.vehicles.motorcycle') :
          vehicle.type === 'scooter' ? t('Zones.vehicles.scooter') : t('Zones.vehicles.bike');

        const statusText = vehicle.status === 'available' 
          ? t('Zones.vehicleInfo.statusAvailable') 
          : t('Zones.vehicleInfo.statusBusy');

        popupContent = `
          <div class="vehicle-popup">
            <h4>${vehicleName}</h4>
            <div class="vehicle-popup-info">
              ${vehicle.battery ? `<span>${t('Zones.vehicleInfo.battery', { percent: vehicle.battery })}</span>` : ''}
            </div>
            <div class="vehicle-popup-status">
              ${t('Zones.vehicleInfo.status')} <span class="${vehicle.status === 'available' ? 'status-available' : 'status-busy'}">
                ${statusText}
              </span>
            </div>
           ${vehicle.status === 'available' ? `<button class="popup-book-button" data-type="${vehicle.type}">${t('Zones.vehicleInfo.bookButton')}</button>` : ''}

          </div>
        `;
      }

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);

      // Обработчик кнопки "Book"
marker.on('popupopen', () => {
  const popupEl = document.querySelector('.leaflet-popup-content');
  if (popupEl) {
    const bookBtn = popupEl.querySelector('.popup-book-button');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        const type = (bookBtn as HTMLButtonElement).getAttribute('data-type');
        if (type === 'car' || type === 'car2') {
          navigate('/transport/cars');
        } else if (type === 'bike') {
          navigate('/transport/bikes');
        } else if (type === 'scooter') {
          navigate('/transport/scooters');
        } else if (type === 'moped') {
          navigate('/transport/mopeds');
        }
      });
    }
  }
});

    });
  }, [activeFilters, t]);

  // Оновлення позиції користувача
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const circle = L.circle(userLocation, {
        color: '#007bff',
        fillColor: '#007bff',
        fillOpacity: 0.3,
        radius: 50,
        weight: 2
      }).addTo(mapRef.current);

      circle.bindPopup(`
        <div class="vehicle-popup">
          <h4>${t('Zones.userLocation.title')}</h4>
          <p>${t('Zones.userLocation.description')}</p>
        </div>
      `);

      userMarkerRef.current = circle;
    }
  }, [userLocation, t]);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) => {
      const updated = new Set(prev);
      updated.has(filter) ? updated.delete(filter) : updated.add(filter);
      return updated;
    });
  };

  const handleSupportClick = () => {
    navigate('/support');
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setActiveFilters((prev) => {
            const updated = new Set(prev);
            updated.add('location');
            return updated;
          });
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error('Помилка отримання геолокації:', error);
          alert(t('Zones.errors.geolocationFailed'));
        }
      );
    } else {
      alert(t('Zones.errors.geolocationNotSupported'));
    }
  };

  return (
    <div className="zones-page">
      <div className="zones-header">
        <BackButton />
        <h1 className="zones-title">{t('Zones.title')}</h1>
        <div className="zones-description">
          {t('Zones.description')}
        </div>
      </div>

      <div className="zones-map-wrapper">
        <div className="zones-map-container">
          <div id="map-container" style={{ height: '100%', width: '100%', borderRadius: '30px' }}></div>
          <FilterButtons
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            onSupportClick={handleSupportClick}
            onLocationClick={handleLocationClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Zones;