"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  tooltip?: string
  glowOnHover?: boolean
}

export const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  tooltip,
  glowOnHover = true,
}: ActionButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  }

  const sizes = {
    sm: "h-12 px-4 text-sm",
    md: "h-16 px-6 text-base",
    lg: "h-20 px-8 text-lg",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const ButtonComponent = (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className="relative"
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          ${variants[variant]} ${sizes[size]}
          text-white border-0 rounded-2xl font-semibold
          disabled:opacity-50 disabled:cursor-not-allowed
          flex flex-col items-center gap-2 transition-all duration-200
          shadow-lg hover:shadow-xl relative overflow-hidden
        `}
      >
        {/* Glow effect */}
        {glowOnHover && !disabled && (
          <motion.div
            className="absolute inset-0 bg-white opacity-0 rounded-2xl"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Loading spinner or icon */}
        {loading ? <Loader2 className={`${iconSizes[size]} animate-spin`} /> : <Icon className={iconSizes[size]} />}

        {/* Label */}
        <span className="font-semibold">{label}</span>

        {/* Success ripple effect */}
        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 bg-white rounded-2xl opacity-0"
            animate={{ scale: [0, 2], opacity: [0.3, 0] }}
            transition={{ duration: 0.6 }}
            key={Math.random()} // Force re-render for animation
          />
        )}
      </Button>
    </motion.div>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{ButtonComponent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return ButtonComponent
}
