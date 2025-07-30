"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Heart,
  Star,
  Sparkles,
  Trophy,
  Gift,
  Crown,
  Zap,
  Target,
  Shield,
  Flame,
  Snowflake,
  Leaf,
  Fish,
  Bird,
  Cat,
  Dog,
  Settings,
  Play,
  Camera,
  Share2,
  Award,
  Coins,
  Gem,
  Clock,
  TrendingUp,
  Eye,
  Smile,
  Battery,
  Apple,
  Gamepad2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface Pet {
  id: string
  name: string
  species: string
  image: string
  type: 'normal' | 'superhero' | 'magical' | 'legendary'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  stats: {
    happiness: number
    health: number
    energy: number
    hunger: number
    cleanliness: number
    intelligence: number
    strength: number
    agility: number
  }
  level: number
  experience: number
  skills: string[]
  personality: {
    playful: number
    loyal: number
    independent: number
    social: number
    curious: number
  }
  abilities: string[]
  evolutionStage: number
  maxEvolutionStage: number
  owned: boolean
  unlockCondition?: string
  backstory: string
  favoriteActivities: string[]
  habitat: string
}

interface PetActivity {
  id: string
  name: string
  description: string
  icon: any
  duration: number
  effects: {
    stat: keyof Pet['stats']
    change: number
  }[]
  cost: number
  unlockLevel: number
}

export default function EnhancedPetCollection({ 
  onActivityComplete,
  playerCoins = 1000,
  playerLevel = 5
}: {
  onActivityComplete?: (rewards: any) => void
  playerCoins?: number
  playerLevel?: number
}) {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 'mascota_perro',
      name: 'Guardián Leal',
      species: 'Perro',
      image: '/img/mascota_perro.png',
      type: 'normal',
      rarity: 'common',
      stats: {
        happiness: 85,
        health: 90,
        energy: 80,
        hunger: 60,
        cleanliness: 70,
        intelligence: 75,
        strength: 85,
        agility: 70
      },
      level: 5,
      experience: 250,
      skills: ['Guardián', 'Leal', 'Obediente'],
      personality: {
        playful: 80,
        loyal: 95,
        independent: 30,
        social: 90,
        curious: 70
      },
      abilities: ['Protección', 'Búsqueda', 'Compañía'],
      evolutionStage: 1,
      maxEvolutionStage: 3,
      owned: true,
      backstory: 'Un perro leal que ha sido tu compañero desde el principio. Su devoción es inquebrantable.',
      favoriteActivities: ['Jugar pelota', 'Pasear', 'Entrenar'],
      habitat: 'Casa'
    },
    {
      id: 'mascota_gato',
      name: 'Ninja Silencioso',
      species: 'Gato',
      image: '/img/mascota_gato.png',
      type: 'normal',
      rarity: 'rare',
      stats: {
        happiness: 70,
        health: 85,
        energy: 90,
        hunger: 50,
        cleanliness: 95,
        intelligence: 90,
        strength: 60,
        agility: 95
      },
      level: 3,
      experience: 150,
      skills: ['Sigilo', 'Agilidad', 'Independiente'],
      personality: {
        playful: 60,
        loyal: 70,
        independent: 95,
        social: 50,
        curious: 85
      },
      abilities: ['Sigilo', 'Salto Alto', 'Visión Nocturna'],
      evolutionStage: 1,
      maxEvolutionStage: 3,
      owned: true,
      backstory: 'Un gato misterioso con habilidades ninja. Aparece y desaparece cuando menos lo esperas.',
      favoriteActivities: ['Cazar', 'Dormir', 'Explorar'],
      habitat: 'Casa'
    },
    {
      id: 'mascota_conejo',
      name: 'Saltarín Veloz',
      species: 'Conejo',
      image: '/img/mascota_conejo.png',
      type: 'normal',
      rarity: 'common',
      stats: {
        happiness: 90,
        health: 75,
        energy: 95,
        hunger: 80,
        cleanliness: 80,
        intelligence: 70,
        strength: 50,
        agility: 100
      },
      level: 2,
      experience: 80,
      skills: ['Velocidad', 'Salto', 'Esquivar'],
      personality: {
        playful: 95,
        loyal: 60,
        independent: 40,
        social: 75,
        curious: 80
      },
      abilities: ['Salto Alto', 'Velocidad', 'Esquivar'],
      evolutionStage: 1,
      maxEvolutionStage: 2,
      owned: false,
      unlockCondition: 'Alcanza nivel 3',
      backstory: 'Un conejo súper enérgico que nunca se queda quieto. Su velocidad es legendaria.',
      favoriteActivities: ['Saltar', 'Correr', 'Comer zanahorias'],
      habitat: 'Jardín'
    },
    {
      id: 'mascota_pajaro',
      name: 'Mensajero Alado',
      species: 'Pájaro',
      image: '/img/mascota_pajaro.png',
      type: 'normal',
      rarity: 'rare',
      stats: {
        happiness: 80,
        health: 70,
        energy: 85,
        hunger: 70,
        cleanliness: 85,
        intelligence: 95,
        strength: 40,
        agility: 90
      },
      level: 4,
      experience: 200,
      skills: ['Vuelo', 'Navegación', 'Comunicación'],
      personality: {
        playful: 70,
        loyal: 80,
        independent: 85,
        social: 60,
        curious: 100
      },
      abilities: ['Vuelo', 'Mensajería', 'Exploración Aérea'],
      evolutionStage: 1,
      maxEvolutionStage: 3,
      owned: false,
      unlockCondition: 'Completa 10 misiones',
      backstory: 'Un pájaro inteligente que puede llevar mensajes a grandes distancias.',
      favoriteActivities: ['Volar', 'Cantar', 'Explorar'],
      habitat: 'Cielo'
    },
    {
      id: 'mascota_hamster',
      name: 'Ingeniero Pequeño',
      species: 'Hamster',
      image: '/img/mascota_hamster.png',
      type: 'normal',
      rarity: 'common',
      stats: {
        happiness: 85,
        health: 65,
        energy: 75,
        hunger: 90,
        cleanliness: 60,
        intelligence: 85,
        strength: 30,
        agility: 80
      },
      level: 1,
      experience: 20,
      skills: ['Ingeniería', 'Almacenar', 'Trabajador'],
      personality: {
        playful: 85,
        loyal: 65,
        independent: 70,
        social: 55,
        curious: 90
      },
      abilities: ['Construcción', 'Almacenamiento', 'Túneles'],
      evolutionStage: 1,
      maxEvolutionStage: 2,
      owned: false,
      unlockCondition: 'Gasta 500 monedas en la tienda',
      backstory: 'Un hamster genio que puede construir cualquier cosa con materiales simples.',
      favoriteActivities: ['Construir', 'Almacenar', 'Correr en rueda'],
      habitat: 'Laboratorio'
    },
    {
      id: 'mascota_pez',
      name: 'Sabio Acuático',
      species: 'Pez',
      image: '/img/mascota_pez.png',
      type: 'magical',
      rarity: 'epic',
      stats: {
        happiness: 75,
        health: 80,
        energy: 70,
        hunger: 60,
        cleanliness: 100,
        intelligence: 100,
        strength: 45,
        agility: 85
      },
      level: 6,
      experience: 300,
      skills: ['Sabiduría', 'Telepatía', 'Magia Acuática'],
      personality: {
        playful: 40,
        loyal: 85,
        independent: 90,
        social: 30,
        curious: 95
      },
      abilities: ['Telepatía', 'Sabiduría Ancestral', 'Magia Acuática'],
      evolutionStage: 2,
      maxEvolutionStage: 4,
      owned: false,
      unlockCondition: 'Alcanza nivel 10 con otra mascota',
      backstory: 'Un pez ancestral con conocimientos milenarios y poderes telepáticos.',
      favoriteActivities: ['Meditar', 'Compartir sabiduría', 'Nadar'],
      habitat: 'Acuario Místico'
    },
    // SUPERHÉROES MASCOTAS
    {
      id: 'superheroe_fire_phoenix',
      name: 'Fénix de Fuego',
      species: 'Fénix',
      image: '/img/superheroe_fire_phoenix.png',
      type: 'superhero',
      rarity: 'legendary',
      stats: {
        happiness: 95,
        health: 100,
        energy: 100,
        hunger: 40,
        cleanliness: 90,
        intelligence: 95,
        strength: 100,
        agility: 95
      },
      level: 10,
      experience: 500,
      skills: ['Fuego Sagrado', 'Renacimiento', 'Vuelo Cósmico'],
      personality: {
        playful: 70,
        loyal: 100,
        independent: 80,
        social: 60,
        curious: 85
      },
      abilities: ['Inmortalidad', 'Control de Fuego', 'Curación', 'Vuelo'],
      evolutionStage: 3,
      maxEvolutionStage: 5,
      owned: false,
      unlockCondition: 'Desbloquea completando el Torneo de Fuego',
      backstory: 'Una criatura legendaria nacida del fuego eterno. Su llama nunca se extingue.',
      favoriteActivities: ['Volar alto', 'Meditar en lava', 'Proteger aliados'],
      habitat: 'Volcán Sagrado'
    },
    {
      id: 'superheroe_ice_guardian',
      name: 'Guardián del Hielo',
      species: 'Dragón de Hielo',
      image: '/img/superheroe_ice_guardian.png',
      type: 'superhero',
      rarity: 'legendary',
      stats: {
        happiness: 80,
        health: 100,
        energy: 90,
        hunger: 30,
        cleanliness: 100,
        intelligence: 90,
        strength: 95,
        agility: 70
      },
      level: 12,
      experience: 600,
      skills: ['Hielo Eterno', 'Protección', 'Magia Glacial'],
      personality: {
        playful: 50,
        loyal: 100,
        independent: 70,
        social: 40,
        curious: 60
      },
      abilities: ['Control de Hielo', 'Escudo Glacial', 'Respiración Helada'],
      evolutionStage: 4,
      maxEvolutionStage: 5,
      owned: false,
      unlockCondition: 'Derrota al Jefe del Hielo Eterno',
      backstory: 'Guardián ancestral de las tierras heladas. Su poder puede congelar el tiempo.',
      favoriteActivities: ['Meditar en glaciares', 'Crear esculturas de hielo', 'Proteger'],
      habitat: 'Fortaleza de Hielo'
    },
    {
      id: 'superheroe_thunder_bolt',
      name: 'Rayo Divino',
      species: 'Espíritu del Trueno',
      image: '/img/superheroe_thunder_bolt.png',
      type: 'superhero',
      rarity: 'mythic',
      stats: {
        happiness: 100,
        health: 95,
        energy: 100,
        hunger: 20,
        cleanliness: 85,
        intelligence: 100,
        strength: 100,
        agility: 100
      },
      level: 15,
      experience: 750,
      skills: ['Rayos Divinos', 'Velocidad Luz', 'Control Eléctrico'],
      personality: {
        playful: 90,
        loyal: 95,
        independent: 60,
        social: 80,
        curious: 100
      },
      abilities: ['Rayos', 'Velocidad Sobrenatural', 'Teletransporte'],
      evolutionStage: 5,
      maxEvolutionStage: 5,
      owned: false,
      unlockCondition: 'Logro Mítico: Maestro de Todos los Elementos',
      backstory: 'La encarnación del poder del trueno. Solo los más dignos pueden ganarse su confianza.',
      favoriteActivities: ['Crear tormentas', 'Viajar a la velocidad de la luz', 'Entrenar'],
      habitat: 'Tormenta Eterna'
    },
    {
      id: 'superheroe_nature_guardian',
      name: 'Guardián de la Naturaleza',
      species: 'Espíritu del Bosque',
      image: '/img/superheroe_nature_guardian.png',
      type: 'superhero',
      rarity: 'legendary',
      stats: {
        happiness: 90,
        health: 100,
        energy: 85,
        hunger: 50,
        cleanliness: 95,
        intelligence: 95,
        strength: 80,
        agility: 85
      },
      level: 8,
      experience: 400,
      skills: ['Magia Natural', 'Comunicación Animal', 'Curación'],
      personality: {
        playful: 75,
        loyal: 90,
        independent: 85,
        social: 100,
        curious: 90
      },
      abilities: ['Control de Plantas', 'Curación Natural', 'Comunicación Animal'],
      evolutionStage: 2,
      maxEvolutionStage: 4,
      owned: false,
      unlockCondition: 'Salva 100 animales en misiones',
      backstory: 'Protector eterno de todos los seres vivos. Su corazón late con la naturaleza.',
      favoriteActivities: ['Plantar árboles', 'Curar animales', 'Meditar en bosques'],
      habitat: 'Bosque Encantado'
    },
    {
      id: 'superheroe_cyber_knight',
      name: 'Caballero Cibernético',
      species: 'Android Avanzado',
      image: '/img/superheroe_cyber_knight.png',
      type: 'superhero',
      rarity: 'epic',
      stats: {
        happiness: 70,
        health: 100,
        energy: 100,
        hunger: 10,
        cleanliness: 100,
        intelligence: 100,
        strength: 95,
        agility: 90
      },
      level: 7,
      experience: 350,
      skills: ['Tecnología Avanzada', 'Análisis', 'Combate Táctico'],
      personality: {
        playful: 40,
        loyal: 100,
        independent: 60,
        social: 50,
        curious: 100
      },
      abilities: ['Análisis Táctico', 'Armas Láser', 'Escudos de Energía'],
      evolutionStage: 2,
      maxEvolutionStage: 4,
      owned: false,
      unlockCondition: 'Completa 50 misiones de tecnología',
      backstory: 'Un guerrero del futuro con IA avanzada y corazón noble.',
      favoriteActivities: ['Analizar datos', 'Entrenar combate', 'Actualizar sistema'],
      habitat: 'Laboratorio Cibernético'
    }
  ])

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [activeTab, setActiveTab] = useState('collection')
  const [petActivities] = useState<PetActivity[]>([
    {
      id: 'feed',
      name: 'Alimentar',
      description: 'Dale comida deliciosa a tu mascota',
      icon: Apple,
      duration: 30,
      effects: [
        { stat: 'hunger', change: 40 },
        { stat: 'happiness', change: 15 }
      ],
      cost: 10,
      unlockLevel: 1
    },
    {
      id: 'play',
      name: 'Jugar',
      description: 'Diviértete con tu mascota',
      icon: Gamepad2,
      duration: 60,
      effects: [
        { stat: 'happiness', change: 30 },
        { stat: 'energy', change: -15 }
      ],
      cost: 5,
      unlockLevel: 1
    },
    {
      id: 'clean',
      name: 'Limpiar',
      description: 'Mantén a tu mascota limpia y saludable',
      icon: Sparkles,
      duration: 45,
      effects: [
        { stat: 'cleanliness', change: 35 },
        { stat: 'health', change: 10 }
      ],
      cost: 15,
      unlockLevel: 1
    },
    {
      id: 'train',
      name: 'Entrenar',
      description: 'Mejora las habilidades de combate',
      icon: Target,
      duration: 90,
      effects: [
        { stat: 'strength', change: 20 },
        { stat: 'agility', change: 15 },
        { stat: 'energy', change: -25 }
      ],
      cost: 25,
      unlockLevel: 3
    },
    {
      id: 'study',
      name: 'Estudiar',
      description: 'Aumenta la inteligencia de tu mascota',
      icon: Trophy,
      duration: 75,
      effects: [
        { stat: 'intelligence', change: 25 },
        { stat: 'energy', change: -20 }
      ],
      cost: 20,
      unlockLevel: 2
    },
    {
      id: 'rest',
      name: 'Descansar',
      description: 'Recupera energía y salud',
      icon: Heart,
      duration: 120,
      effects: [
        { stat: 'energy', change: 50 },
        { stat: 'health', change: 20 }
      ],
      cost: 0,
      unlockLevel: 1
    }
  ])

  // Simulación de degradación de stats con el tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setPets(prev => prev.map(pet => {
        if (!pet.owned) return pet
        
        return {
          ...pet,
          stats: {
            ...pet.stats,
            hunger: Math.max(0, pet.stats.hunger - 2),
            energy: Math.max(0, pet.stats.energy - 1),
            cleanliness: Math.max(0, pet.stats.cleanliness - 1),
            happiness: Math.max(0, pet.stats.happiness - (pet.stats.hunger < 20 ? 3 : 1))
          }
        }
      }))
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  // Realizar actividad con mascota
  const performActivity = async (pet: Pet, activity: PetActivity) => {
    if (playerCoins < activity.cost) {
      toast.error("No tienes suficientes monedas")
      return
    }

    if (pet.level < activity.unlockLevel) {
      toast.error(`Necesitas nivel ${activity.unlockLevel} para esta actividad`)
      return
    }

    // Simular duración de la actividad
    toast.info(`${activity.name} en progreso... (${activity.duration}s)`)
    
    setTimeout(() => {
      setPets(prev => prev.map(p => {
        if (p.id !== pet.id) return p
        
        const updatedStats = { ...p.stats }
        let experienceGained = 10

        activity.effects.forEach(effect => {
          const newValue = Math.max(0, Math.min(100, updatedStats[effect.stat] + effect.change))
          updatedStats[effect.stat] = newValue
          experienceGained += Math.abs(effect.change) * 2
        })

        const newExperience = p.experience + experienceGained
        const newLevel = Math.floor(newExperience / 100) + 1

        if (newLevel > p.level) {
          toast.success(`¡${p.name} subió al nivel ${newLevel}!`)
        }

        return {
          ...p,
          stats: updatedStats,
          experience: newExperience,
          level: newLevel
        }
      }))

      if (onActivityComplete) {
        onActivityComplete({
          coins: -activity.cost,
          experience: 10,
          activity: activity.name
        })
      }

      toast.success(`¡${activity.name} completado!`)
    }, activity.duration * 100) // Simulación acelerada
  }

  // Adoptar nueva mascota
  const adoptPet = (pet: Pet) => {
    if (pet.unlockCondition && playerLevel < 5) {
      toast.error(`Condición no cumplida: ${pet.unlockCondition}`)
      return
    }

    const cost = pet.rarity === 'mythic' ? 10000 :
                 pet.rarity === 'legendary' ? 5000 :
                 pet.rarity === 'epic' ? 2000 :
                 pet.rarity === 'rare' ? 1000 : 500

    if (playerCoins < cost) {
      toast.error(`Necesitas ${cost} monedas para adoptar esta mascota`)
      return
    }

    setPets(prev => prev.map(p => 
      p.id === pet.id ? { ...p, owned: true } : p
    ))

    if (onActivityComplete) {
      onActivityComplete({
        coins: -cost,
        newPet: pet.name
      })
    }

    toast.success(`¡Adoptaste a ${pet.name}!`)
  }

  // Evolucionar mascota
  const evolvePet = (pet: Pet) => {
    if (pet.evolutionStage >= pet.maxEvolutionStage) {
      toast.error("Esta mascota ya está completamente evolucionada")
      return
    }

    const evolutionCost = pet.evolutionStage * 1000
    if (playerCoins < evolutionCost) {
      toast.error(`Necesitas ${evolutionCost} monedas para evolucionar`)
      return
    }

    setPets(prev => prev.map(p => {
      if (p.id !== pet.id) return p
      
      return {
        ...p,
        evolutionStage: p.evolutionStage + 1,
        stats: {
          happiness: Math.min(100, p.stats.happiness + 10),
          health: Math.min(100, p.stats.health + 15),
          energy: Math.min(100, p.stats.energy + 10),
          hunger: p.stats.hunger,
          cleanliness: p.stats.cleanliness,
          intelligence: Math.min(100, p.stats.intelligence + 20),
          strength: Math.min(100, p.stats.strength + 15),
          agility: Math.min(100, p.stats.agility + 15)
        }
      }
    }))

    toast.success(`¡${pet.name} evolucionó!`)
  }

  const ownedPets = pets.filter(p => p.owned)
  const availablePets = pets.filter(p => !p.owned)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🐾 Colección de Mascotas Épicas</h1>
              <p className="opacity-90">Cuida, entrena y evoluciona a tus compañeros legendarios</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{ownedPets.length}</div>
              <div className="text-sm opacity-90">Mascotas Adoptadas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection">🏠 Mi Colección</TabsTrigger>
          <TabsTrigger value="available">🛒 Adoptar</TabsTrigger>
          <TabsTrigger value="care">💖 Cuidados</TabsTrigger>
          <TabsTrigger value="evolution">⭐ Evolución</TabsTrigger>
        </TabsList>

        {/* Mi Colección */}
        <TabsContent value="collection">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedPets.map((pet) => (
              <motion.div
                key={pet.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  pet.rarity === 'mythic' ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' :
                  pet.rarity === 'legendary' ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50' :
                  pet.type === 'superhero' ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50' :
                  ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <Image
                          src={pet.image}
                          alt={pet.name}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                        {pet.type === 'superhero' && (
                          <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{pet.name}</h3>
                          <Badge variant={
                            pet.rarity === 'mythic' ? 'destructive' :
                            pet.rarity === 'legendary' ? 'default' : 'secondary'
                          }>
                            {pet.rarity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{pet.species}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Lv. {pet.level}</Badge>
                          <Badge variant="outline">
                            Evo {pet.evolutionStage}/{pet.maxEvolutionStage}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Stats Mini Display */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <Progress value={pet.stats.happiness} className="h-1 flex-1" />
                        <span>{pet.stats.happiness}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-500" />
                        <Progress value={pet.stats.health} className="h-1 flex-1" />
                        <span>{pet.stats.health}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3 text-green-500" />
                        <Progress value={pet.stats.energy} className="h-1 flex-1" />
                        <span>{pet.stats.energy}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Apple className="h-3 w-3 text-orange-500" />
                        <Progress value={pet.stats.hunger} className="h-1 flex-1" />
                        <span>{pet.stats.hunger}%</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedPet(pet)}
                      className="w-full mt-3"
                      size="sm"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {ownedPets.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold mb-2">No tienes mascotas aún</h3>
                <p className="text-gray-600 mb-4">¡Ve a la sección de adopción para conseguir tu primera mascota!</p>
                <Button onClick={() => setActiveTab('available')}>
                  Adoptar Mascota
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Mascotas Disponibles */}
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePets.map((pet) => {
              const cost = pet.rarity === 'mythic' ? 10000 :
                          pet.rarity === 'legendary' ? 5000 :
                          pet.rarity === 'epic' ? 2000 :
                          pet.rarity === 'rare' ? 1000 : 500

              return (
                <motion.div
                  key={pet.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`transition-all duration-300 hover:shadow-lg ${
                    pet.rarity === 'mythic' ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' :
                    pet.rarity === 'legendary' ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50' :
                    pet.type === 'superhero' ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50' :
                    ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <Image
                            src={pet.image}
                            alt={pet.name}
                            width={80}
                            height={80}
                            className="rounded-lg"
                          />
                          {pet.type === 'superhero' && (
                            <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{pet.name}</h3>
                            <Badge variant={
                              pet.rarity === 'mythic' ? 'destructive' :
                              pet.rarity === 'legendary' ? 'default' : 'secondary'
                            }>
                              {pet.rarity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{pet.species}</p>
                          <p className="text-xs text-gray-500">{pet.backstory}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Costo de adopción:</span>
                          <span className="font-semibold">{cost.toLocaleString()} 🪙</span>
                        </div>
                        
                        {pet.unlockCondition && (
                          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                            🔒 {pet.unlockCondition}
                          </div>
                        )}

                        <div className="flex gap-1 flex-wrap">
                          {pet.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          onClick={() => adoptPet(pet)}
                          className="w-full"
                          size="sm"
                          disabled={playerCoins < cost || (pet.unlockCondition && playerLevel < 5)}
                        >
                          <Gift className="h-3 w-3 mr-1" />
                          Adoptar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Cuidados */}
        <TabsContent value="care">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividades de Cuidado</CardTitle>
                <CardDescription>
                  Selecciona una mascota y una actividad para cuidarla
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {petActivities.map((activity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="text-center">
                        <activity.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h4 className="font-semibold">{activity.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                        <div className="text-xs space-y-1">
                          <div>⏱️ {activity.duration}s</div>
                          <div>🪙 {activity.cost}</div>
                          <div>🔓 Nivel {activity.unlockLevel}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownedPets.map((pet) => (
                <Card key={pet.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold">{pet.name}</h4>
                        <p className="text-sm text-gray-600">Nivel {pet.level}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {petActivities.slice(0, 3).map((activity) => (
                        <Button
                          key={activity.id}
                          onClick={() => performActivity(pet, activity)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                          disabled={playerCoins < activity.cost || pet.level < activity.unlockLevel}
                        >
                          <activity.icon className="h-3 w-3 mr-1" />
                          {activity.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Evolución */}
        <TabsContent value="evolution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ownedPets.map((pet) => (
              <Card key={pet.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-gray-600">{pet.species}</p>
                      <Badge variant="outline">
                        Evolución {pet.evolutionStage}/{pet.maxEvolutionStage}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso de Evolución</span>
                        <span>{((pet.evolutionStage / pet.maxEvolutionStage) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(pet.evolutionStage / pet.maxEvolutionStage) * 100} />
                    </div>

                    {pet.evolutionStage < pet.maxEvolutionStage ? (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Próxima evolución:</strong>
                          <ul className="text-xs text-gray-600 mt-1">
                            <li>• +15 Salud</li>
                            <li>• +20 Inteligencia</li>
                            <li>• +15 Fuerza y Agilidad</li>
                            <li>• Nuevas habilidades</li>
                          </ul>
                        </div>
                        <Button
                          onClick={() => evolvePet(pet)}
                          className="w-full"
                          disabled={playerCoins < pet.evolutionStage * 1000}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Evolucionar ({(pet.evolutionStage * 1000).toLocaleString()} 🪙)
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                        <p className="font-semibold text-green-600">¡Completamente Evolucionado!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalles de Mascota */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Image
                    src={selectedPet.image}
                    alt={selectedPet.name}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  {selectedPet.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPet(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Estadísticas</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedPet.stats).map(([stat, value]) => (
                      <div key={stat} className="flex items-center gap-2">
                        <span className="text-sm capitalize w-20">{stat}:</span>
                        <Progress value={value} className="flex-1 h-2" />
                        <span className="text-sm w-10">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Personalidad</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedPet.personality).map(([trait, value]) => (
                      <div key={trait} className="flex items-center gap-2">
                        <span className="text-sm capitalize w-20">{trait}:</span>
                        <Progress value={value} className="flex-1 h-2" />
                        <span className="text-sm w-10">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Historia</h4>
                <p className="text-sm text-gray-600">{selectedPet.backstory}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Habilidades</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.skills.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Hábitat</h4>
                <p className="text-sm text-gray-600">{selectedPet.habitat}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Actividades Favoritas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.favoriteActivities.map((activity, i) => (
                    <Badge key={i} variant="secondary">{activity}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}