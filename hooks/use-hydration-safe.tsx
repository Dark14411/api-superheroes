'use client'

import { useState, useEffect, ReactNode } from 'react'

/**
 * Hook para detectar hidratación del lado del cliente
 * Evita errores de hidratación en Next.js 15
 */
export function useHydrationSafe(): boolean {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook para manejo seguro de localStorage con hidratación
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const isHydrated = useHydrationSafe()
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return

    try {
      const item = localStorage.getItem(key)
      if (item && item !== 'undefined') {
        const parsed = JSON.parse(item)
        if (parsed !== null && parsed !== undefined) {
          setStoredValue(parsed)
        }
      }
    } catch (error) {
      console.warn(`localStorage read error for key "${key}":`, error)
    }
  }, [isHydrated, key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = typeof value === 'function' ? (value as (val: T) => T)(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined' && isHydrated) {
        if (valueToStore === null || valueToStore === undefined || valueToStore === '') {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      }
    } catch (error) {
      console.warn(`localStorage write error for key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Componente para renderizado condicional post-hidratación
 */
interface HydrationGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationGuard({ children, fallback = null }: HydrationGuardProps) {
  const isHydrated = useHydrationSafe()
  
  if (!isHydrated) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Hook simple para verificar si estamos en el cliente
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
} 