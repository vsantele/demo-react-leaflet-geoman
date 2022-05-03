import { LeafletMouseEvent } from "leaflet"
import { useMapEvents } from "react-leaflet"

interface HandleMapEventsProps {
  onMapClick?: (e: LeafletMouseEvent) => void
  onMouseMove?: (e: LeafletMouseEvent) => void
}
export default function HandleMapEvents(props: HandleMapEventsProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      props.onMapClick?.(e)
    },
    mousemove(e: LeafletMouseEvent) {
      props.onMouseMove?.(e)
    },
  })
  return null
}
