"use client";

import {GeoJSON, MapContainer, TileLayer, useMap} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import {useEffect} from "react";
import L from "leaflet";
import {useLocale} from "@/hooks/useLocale";

interface Props {
  geoJsonData: any
}

function FitBoundsToGeoJSON({ geoJsonData }: Props) {
  const map = useMap()

  useEffect(() => {
    const layer = L.geoJSON(geoJsonData)
    const bounds = layer.getBounds()

    if (bounds.isValid()) {
      map.fitBounds(bounds)
    }
  }, [geoJsonData, map])

  return null
}

export default function MapComponent({ geoJsonData }: Props) {
  const { translations } = useLocale()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {translations.dataset.map.title}
      </h2>
      <MapContainer center={[0, 0]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoJsonData} />
        <FitBoundsToGeoJSON geoJsonData={geoJsonData} />
      </MapContainer>
    </div>
  )
}