"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Check, ChevronDown } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, changeLanguage, getCurrentLanguage, getAvailableLanguages, currentLanguage } = useTranslations()

  const languages = getAvailableLanguages()
  const currentLang = languages.find(lang => lang.code === currentLanguage)

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 h-auto touch-manipulation"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.name || 'Español'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[200px]"
          >
            <Card className="p-2 shadow-lg border-2">
              <div className="space-y-1">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    variant="ghost"
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full justify-between px-3 py-2 h-auto text-sm touch-manipulation ${
                      currentLanguage === language.code 
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {language.code === 'es' ? '🇪🇸' : '🇺🇸'}
                      </span>
                      <span>{language.name}</span>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 