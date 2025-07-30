"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Music2, 
  Music3, 
  Volume1,
  Settings,
  X
} from "lucide-react"
import { useAudio } from "@/hooks/use-audio"
import { useTranslations } from "@/hooks/use-translations"

export default function AudioControls() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings, playGameMusic, playGameSounds } = useAudio()
  const { t } = useTranslations()

  const handleVolumeChange = (type: 'music' | 'sound', value: number[]) => {
    updateSettings({ [`${type}Volume`]: value[0] })
  }

  const toggleMusic = () => {
    updateSettings({ musicEnabled: !settings.musicEnabled })
  }

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled })
  }

  const testMusic = () => {
    playGameMusic.background()
  }

  const testSound = () => {
    playGameSounds.click()
  }

  return (
    <>
      {/* Botón flotante */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white touch-manipulation"
      >
        {settings.musicEnabled ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      {/* Panel de control */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl z-50 p-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  {t('settings.audio')}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Controles de música */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Music2 className="w-4 h-4" />
                      {t('settings.music')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMusic}
                      className={`h-8 px-3 ${settings.musicEnabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {settings.musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Slider
                      value={[settings.musicVolume]}
                      onValueChange={(value) => handleVolumeChange('music', value)}
                      max={1}
                      step={0.1}
                      disabled={!settings.musicEnabled}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>{Math.round(settings.musicVolume * 100)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Controles de efectos de sonido */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Volume1 className="w-4 h-4" />
                      {t('settings.soundEffects')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSound}
                      className={`h-8 px-3 ${settings.soundEnabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Slider
                      value={[settings.soundVolume]}
                      onValueChange={(value) => handleVolumeChange('sound', value)}
                      max={1}
                      step={0.1}
                      disabled={!settings.soundEnabled}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>{Math.round(settings.soundVolume * 100)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Botones de prueba */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testMusic}
                    disabled={!settings.musicEnabled}
                    className="flex-1 text-xs"
                  >
                    {t('settings.testMusic')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testSound}
                    disabled={!settings.soundEnabled}
                    className="flex-1 text-xs"
                  >
                    {t('settings.testSound')}
                  </Button>
                </div>

                {/* Estado actual */}
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>{t('settings.musicStatus')}:</span>
                      <span className={settings.musicEnabled ? 'text-green-600' : 'text-red-600'}>
                        {settings.musicEnabled ? t('settings.enabled') : t('settings.disabled')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('settings.soundStatus')}:</span>
                      <span className={settings.soundEnabled ? 'text-green-600' : 'text-red-600'}>
                        {settings.soundEnabled ? t('settings.enabled') : t('settings.disabled')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 