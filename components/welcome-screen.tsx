"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Star, Gamepad2, ShoppingBag } from "lucide-react"

interface WelcomeScreenProps {
  onShowAuth: () => void
}

export default function WelcomeScreen({ onShowAuth }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-white/90 backdrop-blur-sm shadow-2xl">
        <div className="text-center">
          {/* Pou animado de bienvenida */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 rounded-full relative flex items-center justify-center shadow-2xl border-4 border-yellow-300 mx-auto">
              {/* Brillo */}
              <div className="absolute top-4 left-6 w-4 h-4 bg-yellow-200 rounded-full opacity-60" />
              
              {/* Ojos felices */}
              <div className="absolute top-8 flex gap-4">
                <motion.div
                  className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-2 h-2 bg-black rounded-full" />
                </motion.div>
                <motion.div
                  className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
                >
                  <div className="w-2 h-2 bg-black rounded-full" />
                </motion.div>
              </div>

              {/* Sonrisa */}
              <motion.div
                className="absolute bottom-8 w-8 h-4 border-b-4 border-pink-600 rounded-b-full"
                animate={{ scaleX: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />

              {/* Mejillas rosadas */}
              <motion.div
                className="absolute left-2 top-12 w-3 h-3 bg-pink-300 rounded-full opacity-60"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute right-2 top-12 w-3 h-3 bg-pink-300 rounded-full opacity-60"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              />

              {/* Partículas de felicidad */}
              <motion.div
                className="absolute -top-4 -right-4 text-yellow-400 text-2xl"
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [1, 0.5, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>

          {/* Título */}
          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            ¡Bienvenido a Mi Pou!
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Tu mascota virtual favorita ahora con superhéroes
          </motion.p>

          {/* Características */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Cuida</div>
              <div className="text-xs text-gray-600">a tu Pou</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Gamepad2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Juega</div>
              <div className="text-xs text-gray-600">y diviértete</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Compra</div>
              <div className="text-xs text-gray-600">items únicos</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Explora</div>
              <div className="text-xs text-gray-600">superhéroes</div>
            </div>
          </motion.div>

          {/* Botón de inicio */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Button
              onClick={onShowAuth}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform transition-all hover:scale-105"
            >
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                ¡Comenzar Aventura! 🚀
              </motion.span>
            </Button>
          </motion.div>

          {/* Texto adicional */}
          <motion.div
            className="mt-6 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <p>🎮 Alimenta • 🎪 Juega • 🛍️ Compra • 💖 Cuida • 🦸 Explora</p>
            <p className="mt-2">¡La experiencia Pou más completa con superhéroes!</p>
          </motion.div>
        </div>
      </Card>
    </div>
  )
} 