"use client"

import { motion } from "framer-motion"
import { Pet } from "@/lib/game-engine"

interface RealisticPetProps {
  pet: Pet
  isAnimating?: boolean
  size?: "small" | "medium" | "large"
  onClick?: () => void
}

export function RealisticPet({ pet, isAnimating = false, size = "medium", onClick }: RealisticPetProps) {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  }

  const getPetEmoji = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog": return "🐕"
      case "cat": return "🐱"
      case "bird": return "🐦"
      case "fish": return "🐠"
      case "rabbit": return "🐰"
      case "hamster": return "🐹"
      case "dragon": return "🐉"
      case "unicorn": return "🦄"
      default: return "🐾"
    }
  }

  const getHealthColor = (health: number, maxHealth: number) => {
    const percentage = (health / maxHealth) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    if (percentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} relative cursor-pointer`}
      animate={isAnimating ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 0.6 }}
      onClick={onClick}
    >
      {/* Mascota */}
      <div className={`${sizeClasses[size]} rounded-full relative flex items-center justify-center shadow-lg border-4 border-white bg-gradient-to-br from-blue-100 to-purple-100`}>
        {/* Emoji de la mascota */}
        <div className="text-2xl">{getPetEmoji(pet.type)}</div>
        
        {/* Indicador de salud */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
          <div className={`w-3 h-3 rounded-full ${getHealthColor(pet.health, pet.maxHealth)}`} />
        </div>
        
        {/* Nivel */}
        <div className="absolute -bottom-2 -left-2 bg-yellow-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {pet.level}
        </div>
      </div>

      {/* Nombre */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="bg-white px-2 py-1 rounded-lg shadow-md text-xs font-medium text-gray-700">
          {pet.name}
        </div>
      </div>
    </motion.div>
  )
}
