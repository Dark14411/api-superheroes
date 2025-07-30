import { Suspense } from 'react'
import { Toaster } from 'sonner'
import StableGamingDashboard from '@/components/stable-gaming-dashboard'

// Componente de loading épico
function EpicLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Logo animado */}
        <div className="relative">
          <div className="text-8xl animate-bounce">🎮</div>
          <div className="absolute inset-0 text-8xl animate-pulse opacity-50">✨</div>
        </div>
        
        {/* Título principal */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Gaming Hub Ultimate
          </h1>
          <p className="text-xl text-white/80 animate-fade-in">
            🚀 Cargando tu universo gaming épico...
          </p>
        </div>
        
        {/* Barra de progreso animada */}
        <div className="w-96 h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Features destacados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center space-y-2 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="text-3xl">🧠</div>
            <div className="text-white/70 text-sm">Pou IA Avanzado</div>
          </div>
          <div className="text-center space-y-2 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <div className="text-3xl">🗺️</div>
            <div className="text-white/70 text-sm">Escenarios Épicos</div>
          </div>
          <div className="text-center space-y-2 animate-fade-in-up" style={{animationDelay: '1.5s'}}>
            <div className="text-3xl">🎯</div>
            <div className="text-white/70 text-sm">15+ Mini-Juegos</div>
          </div>
          <div className="text-center space-y-2 animate-fade-in-up" style={{animationDelay: '2s'}}>
            <div className="text-3xl">👥</div>
            <div className="text-white/70 text-sm">Multijugador Global</div>
          </div>
        </div>
        
        {/* Estadísticas épicas */}
        <div className="mt-8 text-white/60 text-sm space-y-1">
          <p>🏆 Sistema de logros dinámico</p>
          <p>💰 Economía avanzada con marketplace</p>
          <p>🐾 Colección de mascotas legendarias</p>
          <p>🎨 Motor de juegos basado en escenarios reales</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Sistema de notificaciones globales */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            padding: '16px'
          },
          duration: 4000
        }}
        richColors
      />
      
      {/* Dashboard principal con Suspense para carga optimizada */}
      <Suspense fallback={<EpicLoader />}>
        <main className="relative">
          {/* Efectos de fondo dinámicos */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Dashboard principal */}
          <div className="relative z-10">
            <StableGamingDashboard />
          </div>
          
          {/* Footer épico */}
          <footer className="relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-16">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🎮</div>
                    <h3 className="text-xl font-bold">Gaming Hub Ultimate</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    La plataforma gaming más avanzada con IA, escenarios reales y experiencias multijugador épicas.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">🎯 Características</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Pou con IA avanzada</li>
                    <li>• 15+ mini-juegos únicos</li>
                    <li>• Escenarios basados en imágenes reales</li>
                    <li>• Sistema multijugador global</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">💰 Economía</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Marketplace avanzado</li>
                    <li>• Sistema de inversiones</li>
                    <li>• NFTs y cripto-items</li>
                    <li>• Banco virtual integrado</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">🏆 Estadísticas</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-purple-900/50 p-3 rounded">
                      <div className="text-2xl font-bold">15+</div>
                      <div className="text-gray-400">Juegos</div>
                    </div>
                    <div className="bg-blue-900/50 p-3 rounded">
                      <div className="text-2xl font-bold">50+</div>
                      <div className="text-gray-400">Logros</div>
                    </div>
                    <div className="bg-green-900/50 p-3 rounded">
                      <div className="text-2xl font-bold">100+</div>
                      <div className="text-gray-400">Items</div>
                    </div>
                    <div className="bg-pink-900/50 p-3 rounded">
                      <div className="text-2xl font-bold">∞</div>
                      <div className="text-gray-400">Diversión</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p className="text-gray-400 text-sm">
                  © 2024 Gaming Hub Ultimate. Creado con ❤️ y mucha ☕ para la mejor experiencia gaming.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="text-2xl">🚀</div>
                  <div className="text-2xl">✨</div>
                  <div className="text-2xl">🎉</div>
                  <div className="text-2xl">🔥</div>
                  <div className="text-2xl">💎</div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </Suspense>
    </div>
  )
}
