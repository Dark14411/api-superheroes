"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Palette, 
  Shirt, 
  Star, 
  Check,
  Crown,
  Sparkles,
  Paintbrush,
  Eye
} from "lucide-react"

// Tipos para personalización
interface PouCustomization {
  bodyColor: string
  eyeColor: string
  pattern: string
  background: string
  accessories: string[]
}

// Colores disponibles para el Pou
const bodyColors = [
  { id: 'yellow', name: 'Amarillo', color: 'from-yellow-400 to-orange-400', price: 0 },
  { id: 'blue', name: 'Azul', color: 'from-blue-400 to-cyan-400', price: 100 },
  { id: 'pink', name: 'Rosa', color: 'from-pink-400 to-rose-400', price: 100 },
  { id: 'green', name: 'Verde', color: 'from-green-400 to-emerald-400', price: 100 },
  { id: 'purple', name: 'Morado', color: 'from-purple-400 to-violet-400', price: 150 },
  { id: 'red', name: 'Rojo', color: 'from-red-400 to-pink-400', price: 150 },
  { id: 'orange', name: 'Naranja', color: 'from-orange-400 to-yellow-400', price: 100 },
  { id: 'rainbow', name: 'Arcoíris', color: 'from-red-400 via-yellow-400 to-blue-400', price: 300 }
]

// Colores de ojos
const eyeColors = [
  { id: 'black', name: 'Negro', color: 'bg-black', price: 0 },
  { id: 'brown', name: 'Marrón', color: 'bg-amber-800', price: 50 },
  { id: 'blue', name: 'Azul', color: 'bg-blue-500', price: 50 },
  { id: 'green', name: 'Verde', color: 'bg-green-500', price: 50 },
  { id: 'purple', name: 'Morado', color: 'bg-purple-500', price: 75 },
  { id: 'red', name: 'Rojo', color: 'bg-red-500', price: 75 },
  { id: 'rainbow', name: 'Arcoíris', color: 'bg-gradient-to-r from-red-500 to-blue-500', price: 150 }
]

// Patrones para el cuerpo
const patterns = [
  { id: 'none', name: 'Sin patrón', preview: '', price: 0 },
  { id: 'dots', name: 'Lunares', preview: '⚪', price: 80 },
  { id: 'stripes', name: 'Rayas', preview: '▬', price: 80 },
  { id: 'hearts', name: 'Corazones', preview: '💕', price: 120 },
  { id: 'stars', name: 'Estrellas', preview: '⭐', price: 120 },
  { id: 'flowers', name: 'Flores', preview: '🌸', price: 100 },
  { id: 'sparkles', name: 'Brillos', preview: '✨', price: 150 }
]

// Fondos disponibles
const backgrounds = [
  { id: 'default', name: 'Predeterminado', preview: '🌈', price: 0 },
  { id: 'forest', name: 'Bosque', preview: '🌲', price: 150 },
  { id: 'ocean', name: 'Océano', preview: '🌊', price: 150 },
  { id: 'space', name: 'Espacio', preview: '🌌', price: 200 },
  { id: 'candy', name: 'Dulces', preview: '🍭', price: 180 },
  { id: 'flowers', name: 'Jardín', preview: '🌻', price: 120 },
  { id: 'stars', name: 'Estrellas', preview: '⭐', price: 160 }
]

// Vista previa del Pou personalizado
const PouPreview = ({ 
  customization, 
  size = 'large' 
}: { 
  customization: PouCustomization
  size?: 'small' | 'large'
}) => {
  const sizeClass = size === 'large' ? 'w-32 h-32' : 'w-16 h-16'
  const bodyColor = bodyColors.find(c => c.id === customization.bodyColor)?.color || 'from-yellow-400 to-orange-400'
  const eyeColor = eyeColors.find(c => c.id === customization.eyeColor)?.color || 'bg-black'
  const pattern = patterns.find(p => p.id === customization.pattern)

  return (
    <div className={`relative ${sizeClass} mx-auto`}>
      {/* Cuerpo del Pou */}
      <div className={`${sizeClass} bg-gradient-to-br ${bodyColor} rounded-full relative flex items-center justify-center shadow-2xl border-4 border-yellow-300`}>
        {/* Brillo */}
        <div className="absolute top-4 left-6 w-4 h-4 bg-yellow-200 rounded-full opacity-60" />
        
        {/* Ojos */}
        <div className="absolute top-8 flex gap-4">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className={`w-2 h-2 ${eyeColor} rounded-full`} />
          </div>
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className={`w-2 h-2 ${eyeColor} rounded-full`} />
          </div>
        </div>

        {/* Boca */}
        <div className="absolute bottom-8 w-8 h-4 border-b-4 border-pink-600 rounded-b-full" />

        {/* Patrón */}
        {pattern && pattern.preview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="text-2xl">{pattern.preview}</div>
          </div>
        )}

        {/* Accesorios dinámicos */}
        {customization.accessories.map((accessoryId) => {
          switch (accessoryId) {
            case 'crown':
              return (
                <div key={accessoryId} className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl animate-pulse">
                  👑
                </div>
              )
            case 'sunglasses':
              return (
                <div key={accessoryId} className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xl">
                  🕶️
                </div>
              )
            case 'hat':
              return (
                <div key={accessoryId} className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xl">
                  🎩
                </div>
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}

// Componente de selección de color
const ColorSelector = ({ 
  title, 
  items, 
  selected, 
  onSelect, 
  coins, 
  ownedItems 
}: {
  title: string
  items: any[]
  selected: string
  onSelect: (id: string) => void
  coins: number
  ownedItems: string[]
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const isOwned = item.price === 0 || ownedItems.includes(item.id)
          const canAfford = coins >= item.price
          
          return (
            <motion.div
              key={item.id}
              className={`relative cursor-pointer ${
                selected === item.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => isOwned && onSelect(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`p-3 text-center ${!isOwned ? 'opacity-50' : ''}`}>
                {/* Vista previa del color/patrón */}
                {item.color && (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} mx-auto mb-2 border-2 border-gray-300`} />
                )}
                {item.preview && (
                  <div className="text-2xl mb-2">{item.preview}</div>
                )}
                
                <p className="text-sm font-medium">{item.name}</p>
                
                {item.price > 0 && (
                  <Badge variant={isOwned ? "secondary" : "outline"} className="text-xs mt-1">
                    {isOwned ? "Comprado" : `${item.price} 🪙`}
                  </Badge>
                )}
                
                {selected === item.id && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Componente principal de personalización
export default function Customization({ 
  coins, 
  onPurchase, 
  ownedItems,
  currentCustomization,
  onCustomizationChange
}: {
  coins: number
  onPurchase: (item: any) => void
  ownedItems: string[]
  currentCustomization: PouCustomization
  onCustomizationChange: (customization: PouCustomization) => void
}) {
  const [tempCustomization, setTempCustomization] = useState<PouCustomization>(currentCustomization)

  const handleColorChange = (type: keyof PouCustomization, value: string) => {
    const newCustomization = { ...tempCustomization, [type]: value }
    setTempCustomization(newCustomization)
  }

  const handleSave = () => {
    onCustomizationChange(tempCustomization)
  }

  const handleReset = () => {
    setTempCustomization(currentCustomization)
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">🎨 Personalizar Pou</h2>
        <p className="text-gray-600 mb-4 sm:mb-6 px-4">
          Personaliza la apariencia de tu mascota virtual
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-yellow-500 rounded-full px-3 sm:px-4 py-2 flex items-center gap-2">
            <span className="text-yellow-900 font-bold text-sm sm:text-base">💰 {coins}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vista previa */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4 text-center">Vista Previa</h3>
            <PouPreview customization={tempCustomization} />
            
            <div className="mt-6 space-y-2">
              <Button 
                onClick={handleSave}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                Resetear
              </Button>
            </div>
          </Card>
        </div>

        {/* Opciones de personalización */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Colores</span>
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Patrones</span>
              </TabsTrigger>
              <TabsTrigger value="eyes" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Ojos</span>
              </TabsTrigger>
              <TabsTrigger value="backgrounds" className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                <span className="hidden sm:inline">Fondos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors">
              <ColorSelector
                title="Color del Cuerpo"
                items={bodyColors}
                selected={tempCustomization.bodyColor}
                onSelect={(value) => handleColorChange('bodyColor', value)}
                coins={coins}
                ownedItems={ownedItems}
              />
            </TabsContent>

            <TabsContent value="eyes">
              <ColorSelector
                title="Color de Ojos"
                items={eyeColors}
                selected={tempCustomization.eyeColor}
                onSelect={(value) => handleColorChange('eyeColor', value)}
                coins={coins}
                ownedItems={ownedItems}
              />
            </TabsContent>

            <TabsContent value="patterns">
              <ColorSelector
                title="Patrones del Cuerpo"
                items={patterns}
                selected={tempCustomization.pattern}
                onSelect={(value) => handleColorChange('pattern', value)}
                coins={coins}
                ownedItems={ownedItems}
              />
            </TabsContent>

            <TabsContent value="backgrounds">
              <ColorSelector
                title="Fondos del Entorno"
                items={backgrounds}
                selected={tempCustomization.background}
                onSelect={(value) => handleColorChange('background', value)}
                coins={coins}
                ownedItems={ownedItems}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 