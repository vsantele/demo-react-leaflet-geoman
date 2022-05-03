import { Map as LeafletMap } from "leaflet"
import { useEffect, useState } from "react"

import Map from "./components/Map"

function App() {
  const [map, setMap] = useState<LeafletMap | null>(null)

  const initMap = (inMap: LeafletMap) => {
    if (!map) {
      setMap(inMap)
    }
  }

  useEffect(() => {
    if (map) {
      map.pm.addControls({
        drawControls: true,
        rotateMode: true,
        dragMode: true,
        cutPolygon: false,
        editMode: true,
        removalMode: true,
      })
    }
  }, [map])

  return (
    <div style={{ height: "100vh" }}>
      <Map initMap={initMap} />
    </div>
  )
}

export default App
