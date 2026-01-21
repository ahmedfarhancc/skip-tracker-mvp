'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Map() {
  const [skips, setSkips] = useState<any[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchSkips = async () => {
      // Fetch data
      const { data, error } = await supabase.from('skips').select('*')
      
      if (error) {
        console.error('Supabase Error:', error)
        setError(error.message)
      } else {
        setSkips(data || [])
      }
    }
    fetchSkips()
  }, [])

  // If we have an error, show it on screen so we know
  if (error) return <div className="p-10 text-red-600 font-bold">Error: {error}</div>

  return (
    <MapContainer 
      center={[56.15, 10.20]} 
      zoom={12} 
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Loop through data and draw Circle Dots instead of Image Pins */}
      {skips.map((skip) => (
        <CircleMarker 
          key={skip.id} 
          center={[skip.lat, skip.lng]} 
          radius={12} // Size of the dot
          pathOptions={{ 
            color: 'white', // Border color
            weight: 2,
            fillColor: skip.status === 'red' ? '#DC2626' : skip.status === 'green' ? '#16A34A' : '#6B7280', // Red/Green/Grey
            fillOpacity: 1
          }}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg">{skip.id}</h3>
              <p className="text-sm">{skip.client_name}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}