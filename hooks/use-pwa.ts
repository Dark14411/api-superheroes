import { useState, useEffect, useCallback } from 'react'

interface PWAState {
  isInstalled: boolean
  isOnline: boolean
  isStandalone: boolean
  canInstall: boolean
  deferredPrompt: any
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    canInstall: false,
    deferredPrompt: null
  })

  // Detectar si la app está instalada
  useEffect(() => {
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInstalled = window.navigator.standalone || isStandalone
      
      setPwaState(prev => ({
        ...prev,
        isInstalled,
        isStandalone
      }))
    }

    checkInstallation()
    window.addEventListener('appinstalled', checkInstallation)
    
    return () => {
      window.removeEventListener('appinstalled', checkInstallation)
    }
  }, [])

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Detectar si se puede instalar
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaState(prev => ({
        ...prev,
        canInstall: true,
        deferredPrompt: e
      }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Registrar Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration)
          
          // Verificar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Hay una nueva versión disponible
                  console.log('Nueva versión disponible')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Error al registrar Service Worker:', error)
        })
    }
  }, [])

  // Función para instalar la app
  const installApp = useCallback(async () => {
    if (pwaState.deferredPrompt) {
      pwaState.deferredPrompt.prompt()
      
      const { outcome } = await pwaState.deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la app')
        setPwaState(prev => ({
          ...prev,
          canInstall: false,
          deferredPrompt: null
        }))
      } else {
        console.log('Usuario rechazó instalar la app')
      }
    }
  }, [pwaState.deferredPrompt])

  // Función para actualizar la app
  const updateApp = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update()
      })
    }
  }, [])

  // Función para mostrar notificación
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      })
    }
  }, [])

  // Función para solicitar permisos de notificación
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }, [])

  // Función para sincronizar en segundo plano
  const syncInBackground = useCallback(() => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('background-sync')
      })
    }
  }, [])

  // Función para agregar a pantalla de inicio
  const addToHomeScreen = useCallback(() => {
    if (pwaState.canInstall) {
      installApp()
    } else {
      // Mostrar instrucciones manuales
      const instructions = `
        Para instalar Mi Pou Virtual:
        
        En Chrome/Edge:
        1. Toca el menú (⋮)
        2. Selecciona "Instalar aplicación"
        
        En Safari:
        1. Toca el botón compartir
        2. Selecciona "Agregar a pantalla de inicio"
        
        En Firefox:
        1. Toca el menú (☰)
        2. Selecciona "Instalar aplicación"
      `
      alert(instructions)
    }
  }, [pwaState.canInstall, installApp])

  return {
    ...pwaState,
    installApp,
    updateApp,
    showNotification,
    requestNotificationPermission,
    syncInBackground,
    addToHomeScreen
  }
} 