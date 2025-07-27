"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface EnhancedProgressProps {
  value: number
  className?: string
  indicatorClassName?: string
  showGlow?: boolean
  animated?: boolean
}

export const EnhancedProgress = ({
  value,
  className = "",
  indicatorClassName = "",
  showGlow = true,
  animated = true,
}: EnhancedProgressProps) => {
  const getColorByValue = (val: number) => {
    if (val >= 80) return "from-green-400 to-green-500"
    if (val >= 60) return "from-yellow-400 to-yellow-500"
    if (val >= 40) return "from-orange-400 to-orange-500"
    return "from-red-400 to-red-500"
  }

  return (
    <div className="relative">
      <Progress
        value={value}
        className={`h-3 ${className}`}
        indicatorClassName={`bg-gradient-to-r ${getColorByValue(value)} ${indicatorClassName}`}
      />

      {/* Glow effect */}
      {showGlow && value > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            background: `linear-gradient(to right, transparent 0%, ${
              value >= 80 ? "#10B981" : value >= 60 ? "#F59E0B" : value >= 40 ? "#F97316" : "#EF4444"
            } ${value}%, transparent ${value}%)`,
            filter: "blur(4px)",
          }}
          animate={
            animated
              ? {
                  opacity: [0.3, 0.7, 0.3],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Shine effect when full */}
      {value >= 100 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  )
}
