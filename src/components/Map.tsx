import "leaflet/dist/leaflet.css"
import "leaflet"
import {
  LatLngBoundsExpression,
  LatLngExpression,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet"
import { ReactNode } from "react"
import {
  LayersControl,
  MapContainer,
  ScaleControl,
  TileLayer,
} from "react-leaflet"
import HandleMapEvents from "./HandleMapEvents"

interface MapProps {
  center?: LatLngExpression
  zoom?: number
  bounds?: LatLngBoundsExpression
  onMapClick?: (e: LeafletMouseEvent) => void
  onMouseMove?: (e: LeafletMouseEvent) => void
  initMap?: (map: LeafletMap) => void
  children?: ReactNode | undefined
}

export default function Map({
  center = {
    lat: 50.4541,
    lng: 3.9519,
  },
  bounds,
  zoom = 15,
  onMapClick,
  onMouseMove,
  initMap,
  children,
}: MapProps) {
  const whenCreated = (map: LeafletMap | null) => {
    if (map) {
      initMap?.(map)
    }
  }

  return (
    <MapContainer
      center={center}
      bounds={bounds}
      zoom={zoom}
      maxZoom={25}
      scrollWheelZoom={true}
      ref={whenCreated}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
          <TileLayer
            zIndex={1}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={19}
            maxZoom={25}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="MapBox.Satellite">
          <TileLayer
            zIndex={1}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/${"mapbox/satellite-streets-v11"}/tiles/{z}/{x}/{y}?access_token=${
              process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
            }`}
            maxNativeZoom={21}
            maxZoom={25}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="MapBox.Outdoors">
          <TileLayer
            zIndex={1}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/${"mapbox/outdoors-v11"}/tiles/{z}/{x}/{y}?access_token=${
              process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
            }`}
            maxNativeZoom={21}
            maxZoom={25}
          />
        </LayersControl.BaseLayer>
        {children}
      </LayersControl>
      <HandleMapEvents onMapClick={onMapClick} onMouseMove={onMouseMove} />
      <ScaleControl />
    </MapContainer>
  )
}
