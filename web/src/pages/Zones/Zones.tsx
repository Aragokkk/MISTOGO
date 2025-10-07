import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Zones.css";
import BackHomeButton from "../../components/BackHomeButton";
import BackButton from "../../components/BackButton";
import { useTranslation } from "react-i18next";

interface ParkingZone {
  id: number;
  nameKey: string; // ключ для перекладу
  color: string;
  type: "allowed" | "restricted" | "premium";
  coordinates: L.LatLngExpression[];
  center: L.LatLngExpression;
  priceModifier?: number;
  descKey: string; // ключ для опису
}

interface VehicleMarker {
  id: number;
  type: "car" | "scooter" | "moped" | "bike";
  brand: string;
  model: string;
  lat: number;
  lng: number;
  battery?: number;
  fuel?: number;
  price: number;
  available: boolean;
}

const icon = L.Icon.Default.prototype as any;
delete icon._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function Zones() {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleMarker | null>(
    null
  );

  const parkingZones: ParkingZone[] = [
    {
      id: 1,
      nameKey: "zones.city_center.name",
      descKey: "zones.city_center.desc",
      color: "#28a745",
      type: "allowed",
      coordinates: [
        [50.4501, 30.5134],
        [50.4501, 30.5434],
        [50.4351, 30.5434],
        [50.4351, 30.5134],
      ],
      center: [50.4426, 30.5284],
    },
    {
      id: 2,
      nameKey: "zones.pechersk.name",
      descKey: "zones.pechersk.desc",
      color: "#007bff",
      type: "premium",
      coordinates: [
        [50.4301, 30.5434],
        [50.4301, 30.5634],
        [50.4151, 30.5634],
        [50.4151, 30.5434],
      ],
      center: [50.4226, 30.5534],
      priceModifier: 2,
    },
    {
      id: 3,
      nameKey: "zones.gov.name",
      descKey: "zones.gov.desc",
      color: "#dc3545",
      type: "restricted",
      coordinates: [
        [50.4470, 30.5370],
        [50.4470, 30.5420],
        [50.4420, 30.5420],
        [50.4420, 30.5370],
      ],
      center: [50.4445, 30.5395],
    },
  ];

  const vehicles: VehicleMarker[] = [
    { id: 1, type: "car", brand: "Renault", model: "Megane", lat: 50.445, lng: 30.52, fuel: 75, price: 8, available: true },
    { id: 2, type: "scooter", brand: "Bolt", model: "4", lat: 50.442, lng: 30.528, battery: 90, price: 4, available: true },
    { id: 3, type: "bike", brand: "Next", model: "City", lat: 50.45, lng: 30.515, price: 2, available: true },
  ];

  const getVehicleIcon = (vehicle: VehicleMarker) => {
    const icons: Record<string, string> = {
      car: "🚗",
      scooter: "🛴",
      moped: "🛵",
      bike: "🚲",
    };
    const colors: Record<string, string> = {
      car: "#007bff",
      scooter: "#28a745",
      moped: "#ffc107",
      bike: "#17a2b8",
    };
    return L.divIcon({
      className: "vehicle-marker",
      html: `<div style="
        background: ${vehicle.available ? colors[vehicle.type] : "#6c757d"};
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
      iconAnchor: [18, 18],
    });
  };

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = L.map(mapContainer.current, { center: [50.4426, 30.5284], zoom: 13 });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map.current);

      parkingZones.forEach((zone) => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: zone.type === "restricted" ? 0.4 : 0.2,
          weight: 2,
          dashArray: zone.type === "restricted" ? "10,10" : undefined,
        }).addTo(map.current!);

        polygon.bindPopup(`
          <b>${t(zone.nameKey)}</b><br>
          ${t(zone.descKey)}
          ${zone.priceModifier ? `<br>${t("zones.price_modifier")}: +${zone.priceModifier}₴/хв` : ""}
        `);
      });

      vehicles.forEach((vehicle) => {
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon: getVehicleIcon(vehicle) }).addTo(map.current!);
        marker.bindPopup(`
          <b>${vehicle.brand} ${vehicle.model}</b><br>
          ${t("zones.vehicle.price")}: ${vehicle.price}₴/хв<br>
          ${vehicle.battery !== undefined ? `${t("zones.vehicle.battery")}: ${vehicle.battery}%` : ""}
          ${vehicle.fuel !== undefined ? `${t("zones.vehicle.fuel")}: ${vehicle.fuel}%` : ""}
          ${vehicle.available ? `<br><button onclick="alert('${t("zones.vehicle.book")}')">${t("zones.vehicle.book")}</button>` : ""}
        `);
      });
    }

    return () => { map.current?.remove(); map.current = null; };
  }, [t]);

  return (
    <div className="zones-container">
      <div className="zones-header">
        <h1>{t("zones.title")}</h1>
        <p>{t("zones.subtitle")}</p>
      </div>
      <div ref={mapContainer} className="zones-map-container" />
      <div className="zones-navigation-buttons">
        <BackHomeButton />
        <BackButton />
      </div>
    </div>
  );
}

export default Zones;
