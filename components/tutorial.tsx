"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  HelpCircle, 
  Play, 
  SkipForward, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  BookOpen,
  Target,
  X,
  Lightbulb,
  GraduationCap,
  Trophy
} from "lucide-react"
import { useTutorial } from "@/hooks/use-tutorial"
import { useTranslations } from "@/hooks/use-translations"

export default function Tutorial() {
  const [activeTab, setActiveTab] = useState("available")
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false)
  
  const { 
    tutorials,
    activeTutorial,
    showTooltip,
    tooltipData,
    startTutorial,
    completeStep,
    skipTutorial,
    showTooltipFor,
    hideTooltip,
    nextStep,
    previousStep,
    isTutorialCompleted,
    resetTutorial,
    getTutorialProgress,
    getAvailableTutorials,
    getCompletedTutorials,
    hasActiveTutorial,
    getCurrentStep
  } = useTutorial()
  
  const { t } = useTranslations()

  const availableTutorials = getAvailableTutorials()
  const completedTutorials = getCompletedTutorials()
  const currentStep = getCurrentStep()

  // Mostrar overlay cuando hay un tutorial activo
  useEffect(() => {
    setShowTutorialOverlay(hasActiveTutorial())
  }, [hasActiveTutorial])

  const handleStartTutorial = (tutorialId: string) => {
    startTutorial(tutorialId)
  }

  const handleSkipTutorial = () => {
    if (activeTutorial) {
      skipTutorial(activeTutorial.id)
    }
  }

  const handleNextStep = () => {
    if (currentStep) {
      completeStep(activeTutorial!.id, currentStep.id)
      nextStep()
    }
  }

  const handlePreviousStep = () => {
    previousStep()
  }

  const TutorialCard = ({ tutorial }: { tutorial: any }) => (
    <Card className="p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {tutorial.id === 'welcome' && '👋'}
            {tutorial.id === 'store' && '🛒'}
            {tutorial.id === 'minigames' && '🎮'}
            {tutorial.id === 'customization' && '🎨'}
            {tutorial.id === 'achievements' && '🏆'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{tutorial.name}</h3>
            <p className="text-sm text-gray-600">{tutorial.description}</p>
          </div>
        </div>
        <Badge variant={tutorial.completed ? "default" : "outline"}>
          {tutorial.completed ? 'Completado' : 'Disponible'}
        </Badge>
      </div>

      {!tutorial.completed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progreso:</span>
            <span>{getTutorialProgress(tutorial.id)}%</span>
          </div>
          <Progress value={getTutorialProgress(tutorial.id)} className="h-2" />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleStartTutorial(tutorial.id)}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
            {tutorial.completed && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => resetTutorial(tutorial.id)}
              >
                Reiniciar
              </Button>
            )}
          </div>
        </div>
      )}

      {tutorial.completed && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Tutorial completado</span>
        </div>
      )}
    </Card>
  )

  const TutorialOverlay = () => (
    <AnimatePresence>
      {showTutorialOverlay && activeTutorial && currentStep && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          
          {/* Highlight del elemento objetivo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Aquí se posicionaría el highlight sobre el elemento objetivo */}
              <div className="w-64 h-32 border-2 border-blue-400 rounded-lg bg-blue-400 bg-opacity-20 animate-pulse" />
            </div>
          </div>

          {/* Tooltip del tutorial */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`absolute bg-white rounded-lg shadow-lg p-4 max-w-sm pointer-events-auto ${
              currentStep.position === 'top' ? 'bottom-full mb-4' :
              currentStep.position === 'bottom' ? 'top-full mt-4' :
              currentStep.position === 'left' ? 'right-full mr-4' :
              'left-full ml-4'
            }`}
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{currentStep.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkipTutorial}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{currentStep.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Paso {activeTutorial.currentStep + 1} de {activeTutorial.steps.length}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={activeTutorial.currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  onClick={handleNextStep}
                >
                  {activeTutorial.currentStep === activeTutorial.steps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completar
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Siguiente
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const TooltipOverlay = () => (
    <AnimatePresence>
      {showTooltip && tooltipData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-50 bg-white rounded-lg shadow-lg p-3 max-w-xs pointer-events-auto"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <h4 className="font-medium text-sm">{tooltipData.title}</h4>
          </div>
          <p className="text-xs text-gray-600">{tooltipData.description}</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={hideTooltip}
            className="mt-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📚 Tutorial Interactivo
        </h1>
        <p className="text-gray-600">
          Aprende a jugar con guías paso a paso
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{tutorials.length}</div>
          <div className="text-sm text-gray-600">Total Tutoriales</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedTutorials.length}</div>
          <div className="text-sm text-gray-600">Completados</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{availableTutorials.length}</div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round((completedTutorials.length / tutorials.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Progreso</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "available" ? "default" : "outline"}
          onClick={() => setActiveTab("available")}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Disponibles ({availableTutorials.length})
        </Button>
        <Button
          variant={activeTab === "completed" ? "default" : "outline"}
          onClick={() => setActiveTab("completed")}
          className="flex-1"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Completados ({completedTutorials.length})
        </Button>
      </div>

      {/* Contenido de los tabs */}
      {activeTab === "available" && (
        <div className="space-y-4">
          {availableTutorials.length > 0 ? (
            availableTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                ¡Todos los tutoriales completados!
              </h3>
              <p className="text-gray-500">
                Has completado todos los tutoriales disponibles
              </p>
            </Card>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedTutorials.length > 0 ? (
            completedTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay tutoriales completados
              </h3>
              <p className="text-gray-500">
                Completa algunos tutoriales para verlos aquí
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Consejos rápidos */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <div>
            <h4 className="font-semibold text-blue-800">Consejos Rápidos</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Haz clic en tu Pou para ganar monedas</li>
              <li>• Mantén las estadísticas de tu Pou altas</li>
              <li>• Juega mini-juegos para ganar monedas extra</li>
              <li>• Personaliza tu Pou con items de la tienda</li>
              <li>• Completa logros para obtener recompensas</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Overlays */}
      <TutorialOverlay />
      <TooltipOverlay />
    </div>
  )
} 