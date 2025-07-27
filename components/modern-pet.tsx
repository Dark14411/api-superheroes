"use client"

import { motion } from "framer-motion"
import type { Pet } from "@/lib/api"

interface ModernPetProps {
  pet: Pet
  size?: "small" | "medium" | "large"
  isAnimating?: boolean
  onClick?: () => void
}

export const ModernPet = ({ pet, size = "medium", isAnimating = false, onClick }: ModernPetProps) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  }

  // Obtener expresión basada en el estado de ánimo
  const getEyeExpression = () => {
    switch (pet.mood) {
      case "ecstatic":
        return { scaleY: 1.4, sparkle: true, bounce: true }
      case "happy":
        return { scaleY: 1.2, sparkle: true, bounce: false }
      case "content":
        return { scaleY: 1, sparkle: false, bounce: false }
      case "neutral":
        return { scaleY: 0.9, sparkle: false, bounce: false }
      case "sad":
        return { scaleY: 0.6, sparkle: false, bounce: false }
      case "tired":
        return { scaleY: 0.3, sparkle: false, bounce: false }
      case "sick":
        return { scaleY: 0.4, sparkle: false, bounce: false }
      default:
        return { scaleY: 1, sparkle: false, bounce: false }
    }
  }

  const getTailAnimation = () => {
    switch (pet.mood) {
      case "ecstatic":
        return {
          rotate: [-20, 20, -20],
          transition: { duration: 0.15, repeat: Number.POSITIVE_INFINITY },
        }
      case "happy":
        return {
          rotate: [-15, 15, -15],
          transition: { duration: 0.4, repeat: Number.POSITIVE_INFINITY },
        }
      case "content":
        return {
          rotate: [-8, 8, -8],
          transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
        }
      default:
        return { rotate: 0 }
    }
  }

  const eyeExpression = getEyeExpression()
  const tailAnimation = getTailAnimation()

  // Renderizar perro moderno y adorable
  if (pet.type === "dog") {
    return (
      <motion.div
        className={`${sizeClasses[size]} relative cursor-pointer select-none`}
        animate={
          isAnimating
            ? {
                scale: [1, 1.15, 1],
                y: [0, -8, 0],
              }
            : eyeExpression.bounce
              ? {
                  y: [0, -4, 0],
                }
              : {}
        }
        transition={{
          duration: isAnimating ? 0.6 : 1.5,
          repeat: eyeExpression.bounce ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Sombra realista */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-3 bg-black/15 rounded-full blur-md" />

        {/* SVG del perro completo y profesional */}
        <div className="relative w-full h-full">
          <motion.svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            {/* Cuerpo principal */}
            <ellipse
              cx="50"
              cy="70"
              rx="25"
              ry="18"
              fill={pet.primaryColor}
              stroke="#fff"
              strokeWidth="1.5"
              className="drop-shadow-md"
            />

            {/* Pecho */}
            <ellipse cx="50" cy="70" rx="15" ry="12" fill={pet.secondaryColor || "#ffffff"} opacity="0.9" />

            {/* Cabeza */}
            <circle
              cx="50"
              cy="35"
              r="20"
              fill={pet.primaryColor}
              stroke="#fff"
              strokeWidth="1.5"
              className="drop-shadow-md"
            />

            {/* Orejas colgantes animadas */}
            <motion.ellipse
              cx="35"
              cy="25"
              rx="8"
              ry="15"
              fill={pet.primaryColor}
              transform="rotate(-30 35 25)"
              animate={{
                rotate: [-35, -25, -35],
                scaleY: [1, 1.1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.ellipse
              cx="65"
              cy="25"
              rx="8"
              ry="15"
              fill={pet.primaryColor}
              transform="rotate(30 65 25)"
              animate={{
                rotate: [35, 25, 35],
                scaleY: [1, 1.1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Interior de orejas */}
            <ellipse
              cx="35"
              cy="25"
              rx="4"
              ry="8"
              fill={pet.secondaryColor || "#ffb6c1"}
              transform="rotate(-30 35 25)"
              opacity="0.8"
            />
            <ellipse
              cx="65"
              cy="25"
              rx="4"
              ry="8"
              fill={pet.secondaryColor || "#ffb6c1"}
              transform="rotate(30 65 25)"
              opacity="0.8"
            />

            {/* Hocico prominente */}
            <ellipse
              cx="50"
              cy="45"
              rx="8"
              ry="6"
              fill={pet.secondaryColor || "#f5deb3"}
              stroke="#ddd"
              strokeWidth="0.5"
            />

            {/* Nariz húmeda */}
            <ellipse cx="50" cy="42" rx="3" ry="2" fill="#000" />
            <ellipse cx="51" cy="41.5" rx="1" ry="0.5" fill="#fff" opacity="0.6" />

            {/* Boca expresiva */}
            <path d="M 50 45 Q 45 48 40 46" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 50 45 Q 55 48 60 46" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Sonrisa cuando está feliz */}
            {(pet.mood === "happy" || pet.mood === "ecstatic") && (
              <path d="M 42 48 Q 50 52 58 48" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            )}

            {/* Lengua cuando está muy feliz */}
            {pet.mood === "ecstatic" && <ellipse cx="50" cy="50" rx="3" ry="2" fill="#ff69b4" opacity="0.8" />}

            {/* Ojos expresivos */}
            <motion.g animate={eyeExpression} transition={{ duration: 0.3 }}>
              <circle cx="42" cy="32" r="4" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
              <circle cx="42" cy="32" r="2.5" fill="#000" />
              <circle cx="43" cy="31" r="1" fill="#fff" opacity="0.8" />

              <circle cx="58" cy="32" r="4" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
              <circle cx="58" cy="32" r="2.5" fill="#000" />
              <circle cx="59" cy="31" r="1" fill="#fff" opacity="0.8" />
            </motion.g>

            {/* Cejas expresivas */}
            <path d="M 38 28 Q 42 26 46 28" stroke="#000" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M 54 28 Q 58 26 62 28" stroke="#000" strokeWidth="1" fill="none" opacity="0.6" />

            {/* Patas con detalles */}
            <ellipse cx="35" cy="85" rx="4" ry="8" fill={pet.primaryColor} />
            <ellipse cx="45" cy="85" rx="4" ry="8" fill={pet.primaryColor} />
            <ellipse cx="55" cy="85" rx="4" ry="8" fill={pet.primaryColor} />
            <ellipse cx="65" cy="85" rx="4" ry="8" fill={pet.primaryColor} />

            {/* Almohadillas detalladas */}
            <ellipse cx="35" cy="90" rx="3" ry="2" fill="#000" opacity="0.8" />
            <ellipse cx="45" cy="90" rx="3" ry="2" fill="#000" opacity="0.8" />
            <ellipse cx="55" cy="90" rx="3" ry="2" fill="#000" opacity="0.8" />
            <ellipse cx="65" cy="90" rx="3" ry="2" fill="#000" opacity="0.8" />

            {/* Deditos */}
            <circle cx="33" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="37" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="43" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="47" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="53" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="57" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="63" cy="88" r="1" fill="#000" opacity="0.6" />
            <circle cx="67" cy="88" r="1" fill="#000" opacity="0.6" />

            {/* Cola animada */}
            <motion.ellipse
              cx="75"
              cy="65"
              rx="3"
              ry="12"
              fill={pet.primaryColor}
              transform="rotate(45 75 65)"
              animate={tailAnimation}
              style={{ transformOrigin: "75px 75px" }}
            />

            {/* Manchas del patrón si las tiene */}
            {pet.pattern === "spotted" && (
              <>
                <circle cx="40" cy="30" r="3" fill={pet.secondaryColor} opacity="0.7" />
                <circle cx="60" cy="38" r="2.5" fill={pet.secondaryColor} opacity="0.7" />
                <circle cx="45" cy="65" r="4" fill={pet.secondaryColor} opacity="0.7" />
                <circle cx="60" cy="72" r="3.5" fill={pet.secondaryColor} opacity="0.7" />
              </>
            )}
          </motion.svg>

          {/* Collar personalizable */}
          {pet.accessories.collar && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-2 rounded-full border border-white shadow-md z-10"
              style={{
                backgroundColor:
                  pet.accessories.collar === "lightning-collar"
                    ? "#FBBF24"
                    : pet.accessories.collar === "basic-collar"
                      ? "#DC2626"
                      : "#4F46E5",
              }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-sm border border-yellow-600" />
              {pet.accessories.collar === "lightning-collar" && (
                <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 text-xs">⚡</div>
              )}
            </div>
          )}

          {/* Sombrero */}
          {pet.accessories.hat && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
              {pet.accessories.hat === "superhero-cap" && (
                <div className="relative">
                  <div className="w-8 h-5 bg-red-500 rounded-t-2xl border-2 border-red-600 shadow-sm" />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-red-400 rounded-full" />
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-white">🦸</div>
                </div>
              )}
            </div>
          )}

          {/* Gafas */}
          {pet.accessories.glasses && (
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-15">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-black rounded-full bg-gray-200 opacity-80" />
                <div className="w-1 h-0.5 bg-black" />
                <div className="w-3 h-3 border-2 border-black rounded-full bg-gray-200 opacity-80" />
              </div>
            </div>
          )}

          {/* Juguete */}
          {pet.accessories.toy && (
            <div className="absolute -bottom-2 -right-2 z-10">
              {pet.accessories.toy === "basic-ball" && (
                <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-red-600 shadow-md relative">
                  <div className="absolute top-1 left-1 w-2 h-2 border border-white rounded-full opacity-60" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Indicadores de estado */}
        <div className="absolute -top-2 -right-2 z-30">
          <motion.div
            className="w-6 h-6 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {pet.level}
          </motion.div>
        </div>

        {/* Partículas de felicidad */}
        {eyeExpression.sparkle && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [-15, -25],
                  x: [0, Math.random() * 20 - 10],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.4,
                }}
                style={{
                  left: `${30 + i * 15}%`,
                  top: "15%",
                }}
              />
            ))}
          </>
        )}

        {/* Animación de parpadeo */}
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-full h-2 bg-transparent"
          animate={{
            scaleY: [1, 0.1, 1],
          }}
          transition={{
            duration: 0.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 4,
          }}
        />

        {/* Nombre de la mascota */}
        {size === "large" && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-sm font-bold text-gray-800">{pet.name}</p>
            <p className="text-xs text-gray-600 capitalize">{pet.breed}</p>
          </div>
        )}
      </motion.div>
    )
  }

  // Renderizar otros tipos de mascotas con el mismo nivel de detalle...
  // (Gato, Conejo, Hámster, etc. - código similar pero adaptado)

  return null
}
