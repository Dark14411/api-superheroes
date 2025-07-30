"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  X, 
  Smartphone, 
  Wifi, 
  WifiOff,
  CheckCircle,
  Info
} from "lucide-react"
import { usePWA } from "@/hooks/use-pwa"
import { useTranslations } from "@/hooks/use-translations"

export default function PWAInstallBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const { canInstall, isInstalled, isOnline, addToHomeScreen } = usePWA()
  const { t } = useTranslations()

  // Mostrar banner después de un delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canInstall && !isInstalled && !hasShown) {
        setIsVisible(true)
      }
    }, 5000) // 5 segundos después de cargar

    return () => clearTimeout(timer)
  }, [canInstall, isInstalled, hasShown])

  const handleInstall = () => {
    addToHomeScreen()
    setIsVisible(false)
    setHasShown(true)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setHasShown(true)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  {t('pwa.installTitle')}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {t('pwa.new')}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">
                {t('pwa.installDescription')}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {isOnline ? (
                    <>
                      <Wifi className="w-3 h-3 text-green-500" />
                      <span>{t('pwa.online')}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-red-500" />
                      <span>{t('pwa.offline')}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{t('pwa.offlineSupport')}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('pwa.install')}
                </Button>
                
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              <span>{t('pwa.benefits')}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-blue-500" />
                <span>{t('pwa.appLike')}</span>
              </div>
              <div className="flex items-center gap-1">
                <WifiOff className="w-3 h-3 text-green-500" />
                <span>{t('pwa.offlinePlay')}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
} 