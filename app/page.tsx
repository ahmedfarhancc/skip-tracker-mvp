'use client'

import dynamic from 'next/dynamic'

// Keep the Map safe (Do not run on server)
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="p-10 text-xl font-bold text-gray-500">Loading Map...</div>
})

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      
      {/* --- THE DASHBOARD OVERLAY (Top Left Box) --- */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-5 rounded-xl shadow-2xl w-72 border border-gray-200">
        
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">SkipTracker</h1>
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Aarhus Operations</p>
        </div>
        
        {/* Legend (The Color Key) */}
        <div className="flex flex-col gap-2 mb-6 text-sm font-medium text-gray-700">
           <div className="flex items-center">
             <span className="w-3 h-3 bg-green-600 rounded-full mr-3 shadow-sm"></span> 
             Lejet (Genererer Indtægter)
           </div>
           <div className="flex items-center">
             <span className="w-3 h-3 bg-red-600 rounded-full mr-3 shadow-sm"></span> 
             Fuld (Skal Afhentes)
           </div>
           <div className="flex items-center">
             <span className="w-3 h-3 bg-gray-500 rounded-full mr-3 shadow-sm"></span> 
             I Gården (Tilgængelig)
           </div>
        </div>

        {/* Action Button */}
       <button 
  onClick={() => alert("🔐 DEMO MODE: Oprettelse af nye containere er låst i denne offentlige version.")}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
>
  + Ny Container
</button>
      </div>

      {/* --- THE MAP --- */}
      <div className="h-full w-full z-0">
        <Map />
      </div>
    </main>
  )
}