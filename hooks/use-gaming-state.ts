// 🎮 HOOK PARA ESTADO GLOBAL DEL GAMING HUB
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { apiService } from '@/lib/api-service'

// 🎯 TIPOS DE ESTADO
interface LoadingState {
  games: boolean
  pets: boolean
  heroes: boolean
  achievements: boolean
  marketplace: boolean
  multiplayer: boolean
  profile: boolean
}

interface ErrorState {
  games: string | null
  pets: string | null
  heroes: string | null
  achievements: string | null
  marketplace: string | null
  multiplayer: string | null
  profile: string | null
}

// 🎮 HOOK PRINCIPAL
export const useGamingState = () => {
  // 📊 ESTADOS PRINCIPALES
  const [playerProfile, setPlayerProfile] = useState<any>(null)
  const [games, setGames] = useState<any[]>([])
  const [pets, setPets] = useState<any[]>([])
  const [heroes, setHeroes] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [marketplace, setMarketplace] = useState<any[]>([])
  const [multiplayerRooms, setMultiplayerRooms] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)

  // 🔄 ESTADOS DE LOADING
  const [loading, setLoading] = useState<LoadingState>({
    games: false,
    pets: false,
    heroes: false,
    achievements: false,
    marketplace: false,
    multiplayer: false,
    profile: false
  })

  // ❌ ESTADOS DE ERROR
  const [errors, setErrors] = useState<ErrorState>({
    games: null,
    pets: null,
    heroes: null,
    achievements: null,
    marketplace: null,
    multiplayer: null,
    profile: null
  })

  // 🎯 FUNCIÓN PARA MANEJAR LOADING
  const setLoadingState = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }))
  }, [])

  // 🎯 FUNCIÓN PARA MANEJAR ERRORES
  const setErrorState = useCallback((key: keyof ErrorState, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }))
  }, [])

  // 🎯 FUNCIÓN PARA MANEJAR ÉXITO
  const handleSuccess = useCallback((message: string) => {
    toast.success(message)
  }, [])

  // 🎯 FUNCIÓN PARA MANEJAR ERROR
  const handleError = useCallback((error: string) => {
    toast.error(error)
  }, [])

  // 🎮 CARGAR PERFIL DEL JUGADOR
  const loadProfile = useCallback(async () => {
    setLoadingState('profile', true)
    setErrorState('profile', null)

    try {
      const response = await apiService.getProfile()
      if (response.success && response.data) {
        setPlayerProfile(response.data)
      } else {
        setErrorState('profile', response.error || 'Error al cargar perfil')
        handleError(response.error || 'Error al cargar perfil')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('profile', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('profile', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 🎮 CARGAR JUEGOS
  const loadGames = useCallback(async (params?: any) => {
    setLoadingState('games', true)
    setErrorState('games', null)

    try {
      const response = await apiService.getGames(params)
      if (response.success && response.data) {
        setGames(response.data)
      } else {
        setErrorState('games', response.error || 'Error al cargar juegos')
        handleError(response.error || 'Error al cargar juegos')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('games', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('games', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 🐾 CARGAR MASCOTAS
  const loadPets = useCallback(async () => {
    setLoadingState('pets', true)
    setErrorState('pets', null)

    try {
      const response = await apiService.getPets()
      if (response.success && response.data) {
        setPets(response.data)
      } else {
        setErrorState('pets', response.error || 'Error al cargar mascotas')
        handleError(response.error || 'Error al cargar mascotas')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('pets', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('pets', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 🦸 CARGAR HÉROES
  const loadHeroes = useCallback(async () => {
    setLoadingState('heroes', true)
    setErrorState('heroes', null)

    try {
      const response = await apiService.getHeroes()
      if (response.success && response.data) {
        setHeroes(response.data)
      } else {
        setErrorState('heroes', response.error || 'Error al cargar héroes')
        handleError(response.error || 'Error al cargar héroes')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('heroes', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('heroes', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 🏆 CARGAR LOGROS
  const loadAchievements = useCallback(async () => {
    setLoadingState('achievements', true)
    setErrorState('achievements', null)

    try {
      const response = await apiService.getAchievements()
      if (response.success && response.data) {
        setAchievements(response.data)
      } else {
        setErrorState('achievements', response.error || 'Error al cargar logros')
        handleError(response.error || 'Error al cargar logros')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('achievements', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('achievements', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 💰 CARGAR MERCADO
  const loadMarketplace = useCallback(async () => {
    setLoadingState('marketplace', true)
    setErrorState('marketplace', null)

    try {
      const response = await apiService.getMarketplace()
      if (response.success && response.data) {
        setMarketplace(response.data)
      } else {
        setErrorState('marketplace', response.error || 'Error al cargar mercado')
        handleError(response.error || 'Error al cargar mercado')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('marketplace', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('marketplace', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 👥 CARGAR SALAS MULTIJUGADOR
  const loadMultiplayerRooms = useCallback(async () => {
    setLoadingState('multiplayer', true)
    setErrorState('multiplayer', null)

    try {
      const response = await apiService.getMultiplayerRooms()
      if (response.success && response.data) {
        setMultiplayerRooms(response.data)
      } else {
        setErrorState('multiplayer', response.error || 'Error al cargar salas')
        handleError(response.error || 'Error al cargar salas')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('multiplayer', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('multiplayer', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 📊 CARGAR ESTADÍSTICAS
  const loadStatistics = useCallback(async () => {
    setLoadingState('profile', true)
    setErrorState('profile', null)

    try {
      const response = await apiService.getStatistics()
      if (response.success && response.data) {
        setStatistics(response.data)
      } else {
        setErrorState('profile', response.error || 'Error al cargar estadísticas')
        handleError(response.error || 'Error al cargar estadísticas')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setErrorState('profile', errorMessage)
      handleError(errorMessage)
    } finally {
      setLoadingState('profile', false)
    }
  }, [setLoadingState, setErrorState, handleError])

  // 🎮 FUNCIONES DE ACCIÓN
  const startGame = useCallback(async (gameId: string) => {
    try {
      const response = await apiService.startGame(gameId)
      if (response.success) {
        handleSuccess('¡Juego iniciado!')
        return response.data
      } else {
        handleError(response.error || 'Error al iniciar juego')
        return null
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      handleError(errorMessage)
      return null
    }
  }, [handleSuccess, handleError])

  const adoptPet = useCallback(async (petId: string) => {
    try {
      const response = await apiService.adoptPet(petId)
      if (response.success) {
        handleSuccess('¡Mascota adoptada!')
        await loadPets() // Recargar mascotas
        return true
      } else {
        handleError(response.error || 'Error al adoptar mascota')
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      handleError(errorMessage)
      return false
    }
  }, [handleSuccess, handleError, loadPets])

  const unlockHero = useCallback(async (heroId: string) => {
    try {
      const response = await apiService.unlockHero(heroId)
      if (response.success) {
        handleSuccess('¡Héroe desbloqueado!')
        await loadHeroes() // Recargar héroes
        return true
      } else {
        handleError(response.error || 'Error al desbloquear héroe')
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      handleError(errorMessage)
      return false
    }
  }, [handleSuccess, handleError, loadHeroes])

  const buyItem = useCallback(async (itemId: string) => {
    try {
      const response = await apiService.buyItem(itemId)
      if (response.success) {
        handleSuccess('¡Item comprado!')
        await loadMarketplace() // Recargar mercado
        await loadProfile() // Recargar perfil para actualizar monedas
        return true
      } else {
        handleError(response.error || 'Error al comprar item')
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      handleError(errorMessage)
      return false
    }
  }, [handleSuccess, handleError, loadMarketplace, loadProfile])

  // 🎯 CARGAR TODO AL INICIO
  useEffect(() => {
    loadProfile()
    loadGames()
    loadPets()
    loadHeroes()
    loadAchievements()
    loadMarketplace()
    loadMultiplayerRooms()
    loadStatistics()
  }, [loadProfile, loadGames, loadPets, loadHeroes, loadAchievements, loadMarketplace, loadMultiplayerRooms, loadStatistics])

  return {
    // 📊 DATOS
    playerProfile,
    games,
    pets,
    heroes,
    achievements,
    marketplace,
    multiplayerRooms,
    statistics,
    
    // 🔄 LOADING
    loading,
    
    // ❌ ERRORES
    errors,
    
    // 🎮 FUNCIONES DE CARGA
    loadProfile,
    loadGames,
    loadPets,
    loadHeroes,
    loadAchievements,
    loadMarketplace,
    loadMultiplayerRooms,
    loadStatistics,
    
    // 🎯 FUNCIONES DE ACCIÓN
    startGame,
    adoptPet,
    unlockHero,
    buyItem,
    
    // 🎯 FUNCIONES DE UTILIDAD
    handleSuccess,
    handleError
  }
} 