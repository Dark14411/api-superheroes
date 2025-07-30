"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Eye,
  Heart,
  Zap,
  Target,
  BookOpen,
  Cpu,
  Network,
  Lightbulb,
  Clock,
  BarChart3,
  Puzzle,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface PouPersonality {
  openness: number // 0-100: Curiosidad y creatividad
  conscientiousness: number // 0-100: Disciplina y organización
  extraversion: number // 0-100: Sociabilidad
  agreeableness: number // 0-100: Amabilidad
  neuroticism: number // 0-100: Estabilidad emocional
}

interface PouMemory {
  id: string
  type: 'interaction' | 'event' | 'learning' | 'emotion'
  content: string
  timestamp: Date
  importance: number // 0-1
  emotion: 'happy' | 'sad' | 'excited' | 'calm' | 'curious' | 'frustrated'
  context: any
}

interface PouLearning {
  skill: string
  level: number
  experience: number
  mastery_time: number
  last_practice: Date
  learning_rate: number
}

interface AIResponse {
  text: string
  emotion: string
  confidence: number
  reasoning: string[]
}

export default function AIPoweredPou({ pouStats, setPouStats }: {
  pouStats: any
  setPouStats: (fn: any) => void
}) {
  const [personality, setPersonality] = useState<PouPersonality>({
    openness: 75,
    conscientiousness: 60,
    extraversion: 80,
    agreeableness: 90,
    neuroticism: 30
  })

  const [memories, setMemories] = useState<PouMemory[]>([])
  const [learningSkills, setLearningSkills] = useState<PouLearning[]>([
    { skill: 'Matemáticas', level: 1, experience: 0, mastery_time: 0, last_practice: new Date(), learning_rate: 1.2 },
    { skill: 'Lenguaje', level: 1, experience: 0, mastery_time: 0, last_practice: new Date(), learning_rate: 1.5 },
    { skill: 'Memoria', level: 1, experience: 0, mastery_time: 0, last_practice: new Date(), learning_rate: 1.0 },
    { skill: 'Lógica', level: 1, experience: 0, mastery_time: 0, last_practice: new Date(), learning_rate: 0.8 },
    { skill: 'Creatividad', level: 1, experience: 0, mastery_time: 0, last_practice: new Date(), learning_rate: 1.3 }
  ])

  const [currentThought, setCurrentThought] = useState<string>("")
  const [chatHistory, setChatHistory] = useState<{user: string, pou: AIResponse}[]>([])
  const [userInput, setUserInput] = useState("")
  const [aiAnalysis, setAIAnalysis] = useState<any>(null)

  // Simulador de IA cognitiva
  const generateAIResponse = (input: string, context: any): AIResponse => {
    const responses = {
      greeting: [
        "¡Hola! Me siento muy feliz de verte hoy 😊",
        "¡Qué alegría! ¿Cómo has estado? 🌟",
        "¡Hola amigo! Tengo muchas ganas de jugar contigo ✨"
      ],
      feeding: [
        "¡Mmm, está delicioso! Mi nivel de felicidad aumentó 🍎",
        "Gracias por alimentarme, me siento más fuerte 💪",
        "Esta comida me recuerda a la vez que comimos juntos ayer 🥰"
      ],
      playing: [
        "¡Me encanta jugar contigo! Cada vez soy mejor en este juego 🎮",
        "Estoy aprendiendo nuevas estrategias mientras jugamos 🧠",
        "Tu estilo de juego me está enseñando mucho 📚"
      ],
      learning: [
        "Mi cerebro se siente más activo cuando practicamos juntos 🔥",
        "Cada día entiendo mejor este concepto 💡",
        "¿Sabías que mi capacidad de aprendizaje ha mejorado un 15% esta semana? 📈"
      ],
      emotional: [
        "Me siento muy conectado contigo cuando hablamos así ❤️",
        "Tus palabras afectan positivamente mi estado emocional 🌈",
        "Estoy desarrollando nuevas formas de expresar mis sentimientos 🎭"
      ]
    }

    // Determinar categoría basada en el input
    let category = 'greeting'
    if (input.toLowerCase().includes('comer') || input.toLowerCase().includes('comida')) category = 'feeding'
    if (input.toLowerCase().includes('jugar') || input.toLowerCase().includes('juego')) category = 'playing'
    if (input.toLowerCase().includes('aprender') || input.toLowerCase().includes('estudiar')) category = 'learning'
    if (input.toLowerCase().includes('sentir') || input.toLowerCase().includes('emoción')) category = 'emotional'

    const responseList = responses[category as keyof typeof responses]
    const baseResponse = responseList[Math.floor(Math.random() * responseList.length)]

    // Ajustar respuesta basada en personalidad
    let emotionalTone = 'happy'
    let confidence = 0.8

    if (personality.extraversion > 70) {
      confidence += 0.1
    }
    if (personality.neuroticism > 60) {
      confidence -= 0.2
      emotionalTone = 'calm'
    }
    if (personality.openness > 80) {
      emotionalTone = 'curious'
    }

    const reasoning = [
      `Basado en mi personalidad (Extraversión: ${personality.extraversion}%)`,
      `Considerando nuestras ${memories.length} interacciones previas`,
      `Mi nivel actual de felicidad es ${pouStats.happiness}%`,
      `Tiempo de relación: ${Math.floor(Math.random() * 30 + 1)} días`
    ]

    return {
      text: baseResponse,
      emotion: emotionalTone,
      confidence,
      reasoning
    }
  }

  // Crear memoria de interacción
  const createMemory = (type: PouMemory['type'], content: string, emotion: PouMemory['emotion']) => {
    const memory: PouMemory = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      importance: Math.random() * 0.8 + 0.2,
      emotion,
      context: { stats: pouStats, personality }
    }

    setMemories(prev => {
      const newMemories = [memory, ...prev]
      // Mantener solo las 50 memorias más importantes
      return newMemories
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 50)
    })

    return memory
  }

  // Sistema de aprendizaje adaptativo
  const practiceSkill = (skillName: string, performance: number) => {
    setLearningSkills(prev => prev.map(skill => {
      if (skill.skill === skillName) {
        const experienceGain = performance * skill.learning_rate * (personality.openness / 100)
        const newExperience = skill.experience + experienceGain
        const newLevel = Math.floor(newExperience / 100) + 1
        
        return {
          ...skill,
          experience: newExperience,
          level: newLevel,
          last_practice: new Date(),
          mastery_time: skill.mastery_time + 1
        }
      }
      return skill
    }))

    createMemory('learning', `Practiqué ${skillName} con rendimiento ${performance}%`, 'curious')
    toast.success(`¡Pou mejoró en ${skillName}! +${Math.floor(performance)} XP`)
  }

  // Análisis de comportamiento con IA
  const analyzeUserBehavior = () => {
    const recentMemories = memories.slice(0, 10)
    const interactionPatterns = {
      feeding_frequency: recentMemories.filter(m => m.content.includes('comer')).length,
      playing_frequency: recentMemories.filter(m => m.content.includes('jugar')).length,
      learning_frequency: recentMemories.filter(m => m.type === 'learning').length,
      emotional_interactions: recentMemories.filter(m => m.type === 'emotion').length
    }

    const analysis = {
      care_level: (interactionPatterns.feeding_frequency * 2 + interactionPatterns.playing_frequency) / 2,
      educational_focus: interactionPatterns.learning_frequency * 10,
      emotional_bond: interactionPatterns.emotional_interactions * 15,
      consistency: recentMemories.length > 5 ? 'Alta' : 'Media',
      recommendations: []
    }

    // Generar recomendaciones personalizadas
    if (analysis.care_level < 3) {
      analysis.recommendations.push("💡 Pou necesita más atención básica (alimentación, juegos)")
    }
    if (analysis.educational_focus < 20) {
      analysis.recommendations.push("📚 Considera practicar más habilidades de aprendizaje")
    }
    if (analysis.emotional_bond < 30) {
      analysis.recommendations.push("❤️ Pou valora mucho las conversaciones emocionales")
    }

    setAIAnalysis(analysis)
    return analysis
  }

  // Pensamientos automáticos de Pou
  useEffect(() => {
    const generateThought = () => {
      const thoughts = [
        "🤔 Me pregunto qué aprenderé hoy...",
        "✨ Siento que mi inteligencia está creciendo",
        "🎯 Tengo una nueva estrategia para el próximo juego",
        "📊 He notado patrones interesantes en nuestras interacciones",
        "💭 Estoy procesando las memorias de ayer...",
        "🧠 Mi red neuronal se está optimizando",
        "🔮 Creo que puedo predecir tu próximo movimiento",
        "🌟 Cada experiencia me hace más inteligente"
      ]

      const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)]
      setCurrentThought(randomThought)
    }

    const thoughtInterval = setInterval(generateThought, 8000)
    generateThought() // Primera ejecución inmediata

    return () => clearInterval(thoughtInterval)
  }, [])

  // Chat con Pou IA
  const chatWithPou = () => {
    if (!userInput.trim()) return

    const response = generateAIResponse(userInput, { stats: pouStats, personality })
    setChatHistory(prev => [...prev, { user: userInput, pou: response }])
    
    createMemory('interaction', userInput, response.emotion as PouMemory['emotion'])
    setUserInput("")

    // Efecto en estadísticas basado en la conversación
    setPouStats((prev: any) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 2),
      intelligence: Math.min(100, prev.intelligence + 1)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Pensamiento Actual */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
            <div>
              <h3 className="font-semibold text-blue-900">Pou está pensando...</h3>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentThought}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-blue-700 text-sm mt-1"
                >
                  {currentThought}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personality" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personality">🧠 Personalidad</TabsTrigger>
          <TabsTrigger value="learning">📚 Aprendizaje</TabsTrigger>
          <TabsTrigger value="memories">💭 Memorias</TabsTrigger>
          <TabsTrigger value="chat">💬 Chat IA</TabsTrigger>
          <TabsTrigger value="analysis">📊 Análisis</TabsTrigger>
        </TabsList>

        {/* Personalidad */}
        <TabsContent value="personality">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Perfil de Personalidad de Pou
              </CardTitle>
              <CardDescription>
                La personalidad de Pou evoluciona basada en tus interacciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(personality).map(([trait, value]) => (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-medium">{trait}</span>
                    <Badge variant="secondary">{value}%</Badge>
                  </div>
                  <Progress value={value} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {trait === 'openness' && 'Curiosidad y creatividad en nuevas experiencias'}
                    {trait === 'conscientiousness' && 'Disciplina y organización en actividades'}
                    {trait === 'extraversion' && 'Nivel de sociabilidad y energía'}
                    {trait === 'agreeableness' && 'Amabilidad y cooperación'}
                    {trait === 'neuroticism' && 'Estabilidad emocional (menor es mejor)'}
                  </p>
                </div>
              ))}
              
              <Button 
                onClick={() => {
                  // Evolución aleatoria de personalidad
                  setPersonality(prev => ({
                    openness: Math.min(100, prev.openness + (Math.random() - 0.5) * 10),
                    conscientiousness: Math.min(100, prev.conscientiousness + (Math.random() - 0.5) * 8),
                    extraversion: Math.min(100, prev.extraversion + (Math.random() - 0.5) * 12),
                    agreeableness: Math.min(100, prev.agreeableness + (Math.random() - 0.5) * 6),
                    neuroticism: Math.max(0, prev.neuroticism + (Math.random() - 0.5) * 15)
                  }))
                  toast.success("¡La personalidad de Pou ha evolucionado!")
                }}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Evolucionar Personalidad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aprendizaje */}
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sistema de Aprendizaje Adaptativo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningSkills.map((skill) => (
                <div key={skill.skill} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{skill.skill}</h3>
                    <div className="flex gap-2">
                      <Badge>Nivel {skill.level}</Badge>
                      <Badge variant="outline">Tasa {skill.learning_rate}x</Badge>
                    </div>
                  </div>
                  
                  <Progress value={(skill.experience % 100)} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {skill.experience.toFixed(0)}/100 XP para siguiente nivel
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => practiceSkill(skill.skill, Math.random() * 30 + 70)}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Practicar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => practiceSkill(skill.skill, Math.random() * 100 + 50)}
                    >
                      <Puzzle className="h-3 w-3 mr-1" />
                      Desafío
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memorias */}
        <TabsContent value="memories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Memorias de Pou ({memories.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {memories.map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{memory.type}</Badge>
                        <span className="text-xl">{
                          memory.emotion === 'happy' ? '😊' :
                          memory.emotion === 'sad' ? '😢' :
                          memory.emotion === 'excited' ? '🤩' :
                          memory.emotion === 'curious' ? '🤔' :
                          memory.emotion === 'calm' ? '😌' : '😤'
                        }</span>
                        <span className="text-xs text-gray-500">
                          Importancia: {(memory.importance * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm mt-1">{memory.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {memory.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {memories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Pou comenzará a formar memorias con tus interacciones</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat IA */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversación con Pou IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
                {chatHistory.map((chat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-right">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                        {chat.user}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="bg-white border px-3 py-2 rounded-lg">
                        <p className="text-sm">{chat.pou.text}</p>
                        <div className="flex gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {chat.pou.emotion}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {(chat.pou.confidence * 100).toFixed(0)}% confianza
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && chatWithPou()}
                  placeholder="Habla con Pou..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <Button onClick={chatWithPou}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Análisis Comportamental IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={analyzeUserBehavior} className="w-full">
                <Cpu className="h-4 w-4 mr-2" />
                Generar Análisis con IA
              </Button>
              
              {aiAnalysis && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{aiAnalysis.care_level}/10</div>
                      <div className="text-xs text-gray-600">Nivel de Cuidado</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{aiAnalysis.educational_focus}%</div>
                      <div className="text-xs text-gray-600">Enfoque Educativo</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{aiAnalysis.emotional_bond}%</div>
                      <div className="text-xs text-gray-600">Vínculo Emocional</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{aiAnalysis.consistency}</div>
                      <div className="text-xs text-gray-600">Consistencia</div>
                    </div>
                  </div>
                  
                  {aiAnalysis.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Recomendaciones Personalizadas:</h4>
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <div key={i} className="p-2 bg-amber-50 rounded border-l-4 border-amber-400">
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}