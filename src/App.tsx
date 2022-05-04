import { Map as LeafletMap, Polyline as LeafletPolyline } from "leaflet"
import { useEffect, useState } from "react"
import { Polygon } from "geojson"
import Map from "./components/Map"
import LetterLayer from "./components/LetterLayer"
import lettersData, { Letter } from "./letters"

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

function App() {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [letters, setLetters] = useState<Letter[]>(lettersData)

  const initMap = (inMap: LeafletMap) => {
    if (!map) {
      setMap(inMap)
    }
  }

  const handleLetterUpdate = (id: string, newShape: Polygon) => {
    console.log("Update letter", id)
    const newLetters = letters.map((letter) => {
      if (letter.id === id) {
        return { ...letter, shape: newShape }
      }
      return letter
    })
    setLetters(newLetters)
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

      // disable snappable
      // map.pm.setGlobalOptions({
      //   ...map.pm.getGlobalOptions(),
      //   snappable: false,
      // })

      map.on("pm:drawstart", ({ shape, workingLayer }) => {
        console.log("drawstart", shape)
        workingLayer.on("pm:vertexadded", ({ workingLayer, latlng }) => {
          const workingShape = workingLayer as LeafletPolyline
          workingShape.setStyle({ color: randomColor() })
          console.log("Add Vertex: ", latlng)
        })
      })

      map.on("pm:drawend", () => {
        console.log("drawend")
      })

      map.on("pm:create", ({ shape, layer }) => {
        if (shape === "Line") {
          const line = layer as LeafletPolyline
          console.dir(JSON.stringify(line.toGeoJSON()))
        }
        layer.on("pm:update", () => {
          console.log("update")
        })
        layer.on("pm:remove", () => {
          console.log("remove")
        })
        layer.on("pm:dragend", () => {
          console.log("dragend")
        })
      })

      return () => {
        map.off("pm:drawstart")
        map.off("pm:drawend")
        map.off("pm:create")
      }
    }
  }, [map])

  return (
    <div style={{ height: "100vh" }}>
      <Map initMap={initMap}>
        <>
          {letters.map((letter) => (
            <LetterLayer
              key={letter.id}
              info={letter}
              onUpdate={handleLetterUpdate}
            />
          ))}
        </>
      </Map>
    </div>
  )
}

export default App
