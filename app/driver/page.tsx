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

  // Fetch all skips on load
  useEffect(() => {
    fetchSkips()
  }, [])

  const fetchSkips = async () => {
    const { data } = await supabase.from('skips').select('*').order('id')
    if (data) setSkips(data)
  }

  // The Magic Logic: Update status based on current state
  const cycleStatus = async (id: string, currentStatus: string) => {
    setLoading(true)
    let newStatus = ''
    
    // The Lifecycle: Grey -> Green -> Red -> Grey
    if (currentStatus === 'grey') newStatus = 'green'
    else if (currentStatus === 'green') newStatus = 'red'
    else if (currentStatus === 'red') newStatus = 'grey'

    // Update Supabase
    await supabase.from('skips').update({ status: newStatus }).eq('id', id)
    
    // Refresh the list locally to show change instantly
    fetchSkips()
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🚛 Driver Task List</h1>

      <div className="space-y-4">
        {skips.map((skip) => (
          <div key={skip.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
            
            {/* Header Info */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-bold text-lg">{skip.id}</h2>
                <p className="text-gray-500 text-sm">{skip.address}</p>
                <p className="text-gray-400 text-xs">{skip.client_name}</p>
              </div>
              
              {/* Status Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white
                ${skip.status === 'red' ? 'bg-red-500' : 
                  skip.status === 'green' ? 'bg-green-500' : 'bg-gray-500'}`}>
                {skip.status}
              </div>
            </div>

            {/* The Big Action Button */}
            <button 
              onClick={() => cycleStatus(skip.id, skip.status)}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white shadow-md transition-all active:scale-95
                ${skip.status === 'grey' ? 'bg-green-600 hover:bg-green-700' : 
                  skip.status === 'green' ? 'bg-red-600 hover:bg-red-700' : 
                  'bg-gray-600 hover:bg-gray-700'}`}
            >
              {loading ? 'Updating...' : 
               skip.status === 'grey' ? '🚀 MARK AS DROPPED' : 
               skip.status === 'green' ? '⚠️ REPORT FULL' : 
               '✅ MARK AS COLLECTED'}
            </button>

          </div>
        ))}
      </div>
    </main>
  )
}