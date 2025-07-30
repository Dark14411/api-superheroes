"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Share2, 
  Camera, 
  Trophy, 
  Star, 
  Calendar,
  History,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  TrendingUp,
  Users,
  Heart,
  MessageCircle
} from "lucide-react"
import { useSocial } from "@/hooks/use-social"
import { useTranslations } from "@/hooks/use-translations"

export default function Social() {
  const [activeTab, setActiveTab] = useState("share")
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareContent, setShareContent] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  
  const { 
    shareHistory, 
    isSharing, 
    socialPlatforms,
    shareAchievement,
    shareMilestone,
    shareEvent,
    captureAndShare,
    generateShareImage,
    getShareStats,
    clearShareHistory
  } = useSocial()
  
  const { t } = useTranslations()
  const shareStats = getShareStats()

  const handleShare = async (type: string, data: any) => {
    let result
    switch (type) {
      case 'achievement':
        result = await shareAchievement(data)
        break
      case 'milestone':
        result = await shareMilestone(data)
        break
      case 'event':
        result = await shareEvent(data)
        break
      case 'screenshot':
        result = await captureAndShare()
        break
    }

    if (result && result.content) {
      setShareContent(result.content)
      setShowShareModal(true)
    }
  }

  const handlePlatformShare = async (platformId: string) => {
    if (!shareContent) return

    const platform = socialPlatforms.find(p => p.id === platformId)
    if (platform) {
      // Aquí se implementaría la lógica de compartir específica
      console.log(`Compartiendo en ${platform.name}`)
      setShowShareModal(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error al copiar:', error)
    }
  }

  const downloadImage = async () => {
    if (!shareContent) return

    try {
      const imageData = await generateShareImage(shareContent)
      if (imageData) {
        const link = document.createElement('a')
        link.href = imageData
        link.download = `mipou-${shareContent.type}-${Date.now()}.png`
        link.click()
      }
    } catch (error) {
      console.error('Error al descargar imagen:', error)
    }
  }

  const ShareModal = () => (
    <AnimatePresence>
      {showShareModal && shareContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compartir</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">{shareContent.title}</h4>
              <p className="text-sm text-gray-600">{shareContent.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlatformShare(platform.id)}
                  disabled={isSharing}
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  style={{ borderColor: platform.color }}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-xs">{platform.name}</span>
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`${shareContent.title}\n\n${shareContent.description}\n\n${typeof window !== 'undefined' ? window.location.href : ''}`)}
                className="flex-1"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadImage}
                className="flex-1"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const ShareableItem = ({ type, data, icon, title, description }: any) => (
    <Card className="p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => handleShare(type, data)}
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
      </div>
    </Card>
  )

  const ShareHistoryItem = ({ content }: { content: any }) => (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl">
            {content.type === 'achievement' && '🏆'}
            {content.type === 'milestone' && '⭐'}
            {content.type === 'event' && '🎉'}
            {content.type === 'screenshot' && '📸'}
          </div>
          <div>
            <h4 className="font-medium text-sm">{content.title}</h4>
            <p className="text-xs text-gray-600">
              {new Date(content.timestamp).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {content.type}
        </Badge>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📱 Integración Social
        </h1>
        <p className="text-gray-600">
          Comparte tus logros y experiencias con amigos
        </p>
      </div>

      {/* Estadísticas de compartir */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{shareStats.totalShares}</div>
          <div className="text-sm text-gray-600">Total Compartido</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{shareStats.sharesByType.achievement || 0}</div>
          <div className="text-sm text-gray-600">Logros</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{shareStats.sharesByType.screenshot || 0}</div>
          <div className="text-sm text-gray-600">Capturas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{socialPlatforms.length}</div>
          <div className="text-sm text-gray-600">Plataformas</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="share">Compartir</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
        </TabsList>

        <TabsContent value="share" className="space-y-4">
          <h3 className="text-lg font-semibold">Compartir Contenido</h3>
          
          <div className="space-y-4">
            <ShareableItem
              type="achievement"
              data={{
                name: "Primer Logro",
                description: "¡He desbloqueado mi primer logro en Mi Pou Virtual!"
              }}
              icon="🏆"
              title="Compartir Logro"
              description="Comparte tus logros desbloqueados"
            />

            <ShareableItem
              type="milestone"
              data={{
                title: "Nivel 10",
                description: "¡He alcanzado el nivel 10 con mi Pou!"
              }}
              icon="⭐"
              title="Compartir Hito"
              description="Comparte tus hitos importantes"
            />

            <ShareableItem
              type="event"
              data={{
                name: "Halloween Spooky",
                description: "¡Participando en el evento de Halloween!"
              }}
              icon="🎉"
              title="Compartir Evento"
              description="Comparte tu participación en eventos"
            />

            <ShareableItem
              type="screenshot"
              data={{}}
              icon="📸"
              title="Capturar y Compartir"
              description="Toma una captura de tu Pou y compártela"
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Historial de Compartir</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearShareHistory}
            >
              Limpiar
            </Button>
          </div>
          
          {shareHistory.length > 0 ? (
            <div className="space-y-3">
              {shareHistory.map((content) => (
                <ShareHistoryItem key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay contenido compartido
              </h3>
              <p className="text-gray-500">
                Comparte algo para verlo aquí
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <h3 className="text-lg font-semibold">Plataformas Disponibles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => (
              <Card key={platform.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: platform.color + '20' }}
                    >
                      {platform.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{platform.name}</h4>
                      <p className="text-sm text-gray-600">
                        {platform.enabled ? 'Disponible' : 'No disponible'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={platform.enabled ? "default" : "secondary"}>
                    {platform.enabled ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-semibold text-blue-800">Web Share API</h4>
                <p className="text-sm text-blue-600">
                  Usa la función nativa de compartir de tu dispositivo
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de compartir */}
      <ShareModal />
    </div>
  )
} 