"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SkipForward, Volume2, VolumeX } from "lucide-react"
import { useCinematics } from "@/hooks/use-cinematics"
import { useAudio } from "@/hooks/use-audio"

interface CinematicsOverlayProps {
  onComplete?: () => void
}

export default function CinematicsOverlay({ onComplete }: CinematicsOverlayProps) {
  const { 
    isPlaying, 
    currentScene, 
    progress, 
    skipScene, 
    getCurrentScene, 
    getVisibleElements, 
    getElementOpacity 
  } = useCinematics()
  
  const { playGameMusic, playGameSounds } = useAudio()

  const scene = getCurrentScene()
  const visibleElements = getVisibleElements()

  // Reproducir audio de la escena
  useEffect(() => {
    if (isPlaying && scene?.audio) {
      // Aquí se podría reproducir música específica de la escena
      if (scene.audio === 'intro-music') {
        playGameMusic.background()
      } else if (scene.audio === 'achievement-epic') {
        playGameSounds.achievement()
      } else if (scene.audio === 'level-up') {
        playGameSounds.coin()
      } else if (scene.audio === 'event-start') {
        playGameSounds.notification()
      }
    }
  }, [isPlaying, scene?.audio, playGameMusic, playGameSounds])

  // Llamar onComplete cuando termine la escena
  useEffect(() => {
    if (!isPlaying && currentScene && onComplete) {
      onComplete()
    }
  }, [isPlaying, currentScene, onComplete])

  if (!isPlaying || !scene) return null

  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case 'fadeIn':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }
      case 'slideIn':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 }
        }
      case 'scaleIn':
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 }
        }
      case 'bounce':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 1, 
            scale: [0.8, 1.1, 1],
            transition: {
              duration: 0.6,
              ease: "easeOut"
            }
          },
          exit: { opacity: 0, scale: 0.8 }
        }
      case 'rotate':
        return {
          initial: { opacity: 0, rotate: -180 },
          animate: { opacity: 1, rotate: 0 },
          exit: { opacity: 0, rotate: 180 }
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }
    }
  }

  const renderElement = (element: any) => {
    const opacity = getElementOpacity(element)
    const variants = getAnimationVariants(element.animation)

    const elementStyle = {
      position: 'absolute' as const,
      left: `${element.position.x}%`,
      top: `${element.position.y}%`,
      transform: 'translate(-50%, -50%)',
      opacity,
      ...element.style
    }

    switch (element.type) {
      case 'text':
        return (
          <motion.div
            key={element.id}
            style={elementStyle}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center"
          >
            {element.content}
          </motion.div>
        )
      
      case 'animation':
        return (
          <motion.div
            key={element.id}
            style={elementStyle}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center"
          >
            {element.content}
          </motion.div>
        )
      
      case 'particle':
        return (
          <motion.div
            key={element.id}
            style={elementStyle}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 pointer-events-none"
          >
            {element.content.split('').map((char: string, index: number) => (
              <motion.span
                key={index}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: '2rem',
                  opacity: 0.7
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      >
        {/* Contenido de la escena */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Elementos de la escena */}
          {visibleElements.map(renderElement)}
          
          {/* Barra de progreso */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64">
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="text-center text-white text-sm">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Botón de saltar */}
          {scene.skipable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-4 right-4"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={skipScene}
                className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-30"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Saltar
              </Button>
            </motion.div>
          )}

          {/* Controles de audio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute top-4 left-4"
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-30"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Información de la escena */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="absolute top-16 left-4 text-white text-sm opacity-70"
          >
            <div>{scene.name}</div>
            <div className="text-xs">
              {Math.floor((progress / 100) * scene.duration / 1000)}s / {Math.floor(scene.duration / 1000)}s
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Componente para mostrar cinemáticas en el juego principal
export function CinematicsProvider({ children }: { children: React.ReactNode }) {
  const { isPlaying, playIntro } = useCinematics()

  useEffect(() => {
    // Reproducir intro automáticamente al cargar
    playIntro()
  }, [playIntro])

  return (
    <>
      {children}
      <CinematicsOverlay />
    </>
  )
} 