'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DriverPage() {
  const [skips, setSkips] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch data on load
  useEffect(() => {
    fetchSkips()
  }, [])

  const fetchSkips = async () => {
    const { data } = await supabase.from('skips').select('*').order('id')
    if (data) setSkips(data)
  }

  // Status Cycle: Grey -> Green -> Red -> Grey
  const cycleStatus = async (id: string, currentStatus: string) => {
    setLoading(true)
    let newStatus = ''
    
    if (currentStatus === 'grey') newStatus = 'green'
    else if (currentStatus === 'green') newStatus = 'red'
    else if (currentStatus === 'red') newStatus = 'grey'

    await supabase.from('skips').update({ status: newStatus }).eq('id', id)
    fetchSkips()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Danish Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🚛 Chauffør Liste</h1>
      
      <div className="flex flex-col gap-4">
        {skips.map((skip) => (
          <div key={skip.id} className="bg-white p-5 rounded-xl shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-bold text-lg">{skip.id}</h2>
                <p className="text-gray-500 text-sm">{skip.client_name}</p>
              </div>
              {/* Status Badge */}
              <div className={`px-2 py-1 rounded text-white text-xs font-bold uppercase
                ${skip.status === 'red' ? 'bg-red-500' : 
                  skip.status === 'green' ? 'bg-green-500' : 'bg-gray-500'}`}>
                {/* Translate Status Text on Badge */}
                {skip.status === 'red' ? 'FULD' : 
                 skip.status === 'green' ? 'UDE' : 'HJEMME'}
              </div>
            </div>

            {/* The Big Button (Danish) */}
            <button 
              onClick={() => cycleStatus(skip.id, skip.status)}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-sm
                ${skip.status === 'grey' ? 'bg-green-600 active:bg-green-800' : 
                  skip.status === 'green' ? 'bg-red-600 active:bg-red-800' : 
                  'bg-gray-600 active:bg-gray-800'}`}
            >
              {skip.status === 'grey' ? '🚚 LEVERET HOS KUNDE' : 
               skip.status === 'green' ? '⚠️ MELD FULD / KLAR' : 
               '✅ HENTET HJEM'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}