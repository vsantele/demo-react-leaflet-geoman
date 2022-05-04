import { GeoJSON, Polygon as LeafletPolygon } from "leaflet"
import React, { useEffect, useRef } from "react"
import { Polygon as PolygonLayer } from "react-leaflet"
import { Letter } from "../letters"
import { Polygon } from "geojson"

interface LetterLayerProps {
  info: Letter
  onClick?: (id: string) => void
  onUpdate?: (id: string, newShape: Polygon) => void
  style?: any
}

const LetterLayer = ({
  info,
  onClick,
  onUpdate,
  style: customStyle = {},
}: LetterLayerProps) => {
  const polygonRef = useRef<LeafletPolygon | null>(null)

  useEffect(() => {
    const polygon = polygonRef.current
    let style = { color: "red" }

    if (customStyle) {
      style = { ...style, ...customStyle }
    }

    if (polygon) {
      polygon.setStyle(style)

      polygon.pm.setOptions({
        allowRemoval: false,
        allowEditing: true,
        draggable: true,
      })
      polygon.on("click", () => {
        onClick?.(info.id)
      })
      polygon.on("pm:update", ({ layer }) => {
        const shape = (layer as LeafletPolygon).toGeoJSON().geometry as Polygon
        onUpdate?.(info.id, shape)
      })
      return () => {
        polygon.off("pm:update")
      }
    }
  }, [polygonRef, info, onClick, onUpdate, customStyle])

  return (
    <PolygonLayer
      ref={polygonRef}
      positions={GeoJSON.coordsToLatLngs(info.shape.coordinates, 1)}
    />
  )
}

export default React.memo(LetterLayer)
