'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Map() {
  const [skips, setSkips] = useState<any[]>([])

  const fetchSkips = async () => {
    const { data } = await supabase.from('skips').select('*')
    if (data) setSkips(data)
  }

  useEffect(() => {
    // 1. Load data immediately when page opens
    fetchSkips()

    // 2. Set up a timer to refresh every 5 seconds (5000 ms)
    const interval = setInterval(() => {
      console.log("Auto-refreshing map data...") // You can see this in Console
      fetchSkips()
    }, 5000)

    // 3. Clean up the timer when the user leaves the page
    return () => clearInterval(interval)
  }, [])

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
      
      {skips.map((skip) => (
        <CircleMarker 
          key={skip.id} 
          center={[skip.lat, skip.lng]} 
          radius={12} 
          pathOptions={{ 
            color: 'white', 
            weight: 2,
            fillColor: skip.status === 'red' ? '#DC2626' : skip.status === 'green' ? '#16A34A' : '#6B7280', 
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