import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Zones.css";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";

// Типи для TypeScript
interface ParkingZone {
  id: number;
  name: string;
  color: string;
  type: 'allowed' | 'restricted' | 'premium';
  description: string;
  coordinates: L.LatLngExpression[];
  center: L.LatLngExpression;
  priceModifier?: number; // Модифікатор ціни для преміум зон
}

interface VehicleMarker {
  id: number;
  type: 'car' | 'scooter' | 'moped' | 'bike';
  brand: string;
  model: string;
  lat: number;
  lng: number;
  battery?: number; // Для електротранспорту
  fuel?: number; // Для авто/мопедів
  price: number; // Ціна за хвилину
  available: boolean;
}

// Виправлення проблеми з іконками Leaflet
const icon = L.Icon.Default.prototype as any;
delete icon._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});

function Zones() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleMarker | null>(null);

  // Зони паркування MISTOGO в Києві
  const parkingZones: ParkingZone[] = [
    {
      id: 1,
      name: "Центр міста",
      color: "#28a745", // Зелений - основна зона
      type: 'allowed',
      coordinates: [
        [50.4501, 30.5134],
        [50.4501, 30.5434],
        [50.4351, 30.5434],
        [50.4351, 30.5134]
      ],
      center: [50.4426, 30.5284],
      description: "Стандартна зона завершення поїздки"
    },
    {
      id: 2,
      name: "Преміум зона - Печерськ",
      color: "#007bff", // Синій - преміум
      type: 'premium',
      coordinates: [
        [50.4301, 30.5434],
        [50.4301, 30.5634],
        [50.4151, 30.5634],
        [50.4151, 30.5434]
      ],
      center: [50.4226, 30.5534],
      description: "Преміум зона (+2₴/хв до тарифу)",
      priceModifier: 2
    },
    {
      id: 3,
      name: "Обмежена зона - Урядовий квартал",
      color: "#dc3545", // Червоний - заборонено
      type: 'restricted',
      coordinates: [
        [50.4470, 30.5370],
        [50.4470, 30.5420],
        [50.4420, 30.5420],
        [50.4420, 30.5370]
      ],
      center: [50.4445, 30.5395],
      description: "Заборонено завершувати поїздку"
    },
    {
      id: 4,
      name: "Поділ - Стандарт",
      color: "#28a745",
      type: 'allowed',
      coordinates: [
        [50.4601, 30.5134],
        [50.4601, 30.5334],
        [50.4501, 30.5334],
        [50.4501, 30.5134]
      ],
      center: [50.4551, 30.5234],
      description: "Стандартна зона завершення поїздки"
    },
    {
      id: 5,
      name: "Оболонь - Стандарт",
      color: "#28a745",
      type: 'allowed',
      coordinates: [
        [50.5001, 30.4934],
        [50.5001, 30.5134],
        [50.4901, 30.5134],
        [50.4901, 30.4934]
      ],
      center: [50.4951, 30.5034],
      description: "Стандартна зона завершення поїздки"
    }
  ];

  // Доступні транспортні засоби
  const vehicles: VehicleMarker[] = [
    // Автомобілі
    { id: 1, type: 'car', brand: 'Renault', model: 'Megane', lat: 50.4450, lng: 30.5200, fuel: 75, price: 8, available: true },
    { id: 2, type: 'car', brand: 'Toyota', model: 'Corolla', lat: 50.4480, lng: 30.5250, fuel: 60, price: 9, available: true },
    { id: 3, type: 'car', brand: 'Nissan', model: 'Leaf', lat: 50.4400, lng: 30.5350, battery: 85, price: 7, available: false },
    
    // Електросамокати
    { id: 4, type: 'scooter', brand: 'Bolt', model: '4', lat: 50.4420, lng: 30.5280, battery: 90, price: 4, available: true },
    { id: 5, type: 'scooter', brand: 'Xiaomi', model: 'Pro 2', lat: 50.4460, lng: 30.5320, battery: 70, price: 3.5, available: true },
    { id: 6, type: 'scooter', brand: 'Ninebot', model: 'Max', lat: 50.4380, lng: 30.5400, battery: 45, price: 4, available: true },
    
    // Мопеди
    { id: 7, type: 'moped', brand: 'Honda', model: 'Dio', lat: 50.4550, lng: 30.5180, fuel: 80, price: 6, available: true },
    { id: 8, type: 'moped', brand: 'Yamaha', model: 'Jog', lat: 50.4350, lng: 30.5450, fuel: 65, price: 6.5, available: true },
    
    // Велосипеди
    { id: 9, type: 'bike', brand: 'Next', model: 'City', lat: 50.4500, lng: 30.5150, price: 2, available: true },
    { id: 10, type: 'bike', brand: 'Trek', model: 'FX', lat: 50.4430, lng: 30.5380, price: 2.5, available: true },
  ];

  // Іконки для різних типів транспорту
  const getVehicleIcon = (vehicle: VehicleMarker) => {
    const icons = {
      car: '🚗',
      scooter: '🛴',
      moped: '🛵',
      bike: '🚲'
    };

    const colors = {
      car: '#007bff',
      scooter: '#28a745',
      moped: '#ffc107',
      bike: '#17a2b8'
    };

    return L.divIcon({
      className: 'vehicle-marker',
      html: `<div style="
        background: ${vehicle.available ? colors[vehicle.type] : '#6c757d'};
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: ${vehicle.available ? 1 : 0.6};
        cursor: pointer;
      ">${icons[vehicle.type]}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  useEffect(() => {
    // Ініціалізація карти
    if (!map.current && mapContainer.current) {
      map.current = L.map(mapContainer.current, {
        center: [50.4426, 30.5284], // Центр Києва
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Базовий шар карти
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map.current);

      // Додавання зон паркування з Geofencing
      parkingZones.forEach(zone => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: zone.type === 'restricted' ? 0.4 : 0.2,
          weight: 2,
          dashArray: zone.type === 'restricted' ? '10, 10' : undefined
        }).addTo(map.current!);

        // Попап для зони
        polygon.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: ${zone.color};">
              ${zone.name}
            </h3>
            <p style="margin: 5px 0;">
              <strong>Тип:</strong> ${
                zone.type === 'allowed' ? '✅ Дозволено паркування' :
                zone.type === 'premium' ? '⭐ Преміум зона' :
                '⛔ Заборонено паркування'
              }
            </p>
            <p style="margin: 5px 0;">${zone.description}</p>
            ${zone.priceModifier ? `<p style="margin: 5px 0; font-weight: bold;">
              Додаткова вартість: +${zone.priceModifier}₴/хв
            </p>` : ''}
          </div>
        `);

        polygon.on('click', () => {
          setSelectedZone(zone);
        });
      });

      // Додавання маркерів транспорту
      vehicles.forEach(vehicle => {
        const marker = L.marker([vehicle.lat, vehicle.lng], {
          icon: getVehicleIcon(vehicle)
        }).addTo(map.current!);

        marker.bindPopup(`
          <div style="min-width: 220px;">
            <h4 style="margin: 0 0 8px 0; color: #333;">
              ${vehicle.brand} ${vehicle.model}
            </h4>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Тариф:</strong> ${vehicle.price}₴/хв</span>
              ${vehicle.battery !== undefined ? 
                `<span>🔋 ${vehicle.battery}%</span>` : 
                vehicle.fuel !== undefined ? 
                `<span>⛽ ${vehicle.fuel}%</span>` : ''
              }
            </div>
            <div style="margin: 8px 0;">
              <strong>Статус:</strong> 
              <span style="color: ${vehicle.available ? '#28a745' : '#dc3545'};">
                ${vehicle.available ? 'Доступний' : 'Зайнятий'}
              </span>
            </div>
            ${vehicle.available ? `
              <button style="
                width: 100%;
                padding: 8px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 8px;
              " onclick="alert('Перехід до бронювання...')">
                Забронювати
              </button>
            ` : ''}
          </div>
        `);

        marker.on('click', () => {
          if (vehicle.available) {
            setSelectedVehicle(vehicle);
          }
        });
      });

      // Легенда
      const Legend = L.Control.extend({
        options: {
          position: 'bottomright' as L.ControlPosition
        },
        onAdd: function() {
          const div = L.DomUtil.create('div', 'info legend');
          
          div.innerHTML = `
            <h4>Зони MISTOGO</h4>
            <div style="margin: 5px 0;">
              <span style="display: inline-block; width: 20px; height: 10px; background: #28a745; margin-right: 5px;"></span>
              Стандартна зона
            </div>
            <div style="margin: 5px 0;">
              <span style="display: inline-block; width: 20px; height: 10px; background: #007bff; margin-right: 5px;"></span>
              Преміум зона (+₴)
            </div>
            <div style="margin: 5px 0;">
              <span style="display: inline-block; width: 20px; height: 10px; background: #dc3545; margin-right: 5px; border: 1px dashed #fff;"></span>
              Заборонена зона
            </div>
            <hr style="margin: 10px 0; border-color: #ddd;">
            <h4>Транспорт</h4>
            <div style="margin: 5px 0;">🚗 Автомобіль</div>
            <div style="margin: 5px 0;">🛴 Самокат</div>
            <div style="margin: 5px 0;">🛵 Мопед</div>
            <div style="margin: 5px 0;">🚲 Велосипед</div>
          `;
          
          return div;
        }
      });
      const legend = new Legend();
      legend.addTo(map.current!);

      // Контрол масштабу
      L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false
      }).addTo(map.current!);

      // Кнопка геолокації
      const LocationControl = L.Control.extend({
        options: {
          position: 'topright' as L.ControlPosition
        },
        onAdd: function(map: L.Map) {
          const button = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          button.innerHTML = `
            <a href="#" style="
              width: 34px;
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              font-size: 20px;
              text-decoration: none;
            " title="Моє місцезнаходження">📍</a>
          `;
          
          L.DomEvent.on(button, 'click', function(e) {
            L.DomEvent.preventDefault(e);
            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  map.setView([latitude, longitude], 16);
                  L.marker([latitude, longitude], {
                    icon: L.divIcon({
                      className: 'user-location',
                      html: '<div style="width: 12px; height: 12px; background: #007bff; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                      iconSize: [18, 18],
                      iconAnchor: [9, 9]
                    })
                  }).addTo(map).bindPopup('Ви тут');
                },
                (error) => {
                  alert('Не вдалося визначити місцезнаходження');
                }
              );
            }
          });
          
          return button;
        }
      });
      const locationControl = new LocationControl();
      locationControl.addTo(map.current!);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="zones-container">
      <div className="zones-header">
        <h1 className="zones-title">Карта зон паркування MISTOGO</h1>
        <p className="zones-subtitle">
          Geofencing зони для завершення оренди • Доступний транспорт поблизу
        </p>
      </div>

      {/* Інформаційна панель для зони */}
      {selectedZone && (
        <div 
          className="zones-info-panel"
          style={{ borderLeft: `4px solid ${selectedZone.color}` }}
        >
          <h3 
            className="zones-info-panel-title"
            style={{ color: selectedZone.color }}
          >
            {selectedZone.name}
          </h3>
          <p className="zones-info-panel-content">
            <strong>Статус:</strong> {
              selectedZone.type === 'allowed' ? '✅ Дозволена зона' :
              selectedZone.type === 'premium' ? '⭐ Преміум зона' :
              '⛔ Обмежена зона'
            }
            <br />
            {selectedZone.description}
            {selectedZone.priceModifier && (
              <>
                <br />
                <strong>Додаткова плата:</strong> +{selectedZone.priceModifier}₴/хв
              </>
            )}
          </p>
          <button 
            onClick={() => setSelectedZone(null)}
            className="zones-close-button"
          >
            Закрити
          </button>
        </div>
      )}

      {/* Інформаційна панель для транспорту */}
      {selectedVehicle && (
        <div 
          className="zones-info-panel vehicle-panel"
          style={{ borderLeft: '4px solid #28a745' }}
        >
          <h3 className="zones-info-panel-title" style={{ color: '#28a745' }}>
            {selectedVehicle.brand} {selectedVehicle.model}
          </h3>
          <p className="zones-info-panel-content">
            <strong>Тариф:</strong> {selectedVehicle.price}₴/хв + 20₴ розблокування
            <br />
            <strong>Мінімальний платіж:</strong> 99₴
            {selectedVehicle.battery !== undefined && (
              <>
                <br />
                <strong>Заряд:</strong> {selectedVehicle.battery}%
              </>
            )}
            {selectedVehicle.fuel !== undefined && (
              <>
                <br />
                <strong>Паливо:</strong> {selectedVehicle.fuel}%
              </>
            )}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="zones-action-button"
              style={{ background: '#28a745' }}
            >
              Забронювати
            </button>
            <button 
              onClick={() => setSelectedVehicle(null)}
              className="zones-close-button"
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {/* Контейнер карти */}
      <div 
        ref={mapContainer} 
        className="zones-map-container"
      />

      {/* Навігація */}
      <div className="zones-navigation-buttons">
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default Zones;