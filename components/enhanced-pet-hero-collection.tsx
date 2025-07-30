'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import Image from 'next/image'
import { 
  Heart, 
  Star, 
  Zap, 
  Shield, 
  Sparkles, 
  Crown, 
  Sword, 
  Palette,
  ShoppingBag,
  Users,
  Trophy,
  Target,
  Flame,
  Snowflake,
  Leaf,
  Bot,
  Gamepad2
} from 'lucide-react'

// 🐾 INTERFACES ÉPICAS
interface PetStats {
  happiness: number
  health: number
  energy: number
  hunger: number
  cleanliness: number
  intelligence: number
  strength: number
  agility: number
}

interface HeroStats {
  power: number
  defense: number
  speed: number
  magic: number
  leadership: number
  experience: number
}

interface PetItem {
  id: string
  name: string
  type: 'accessory' | 'food' | 'toy' | 'decoration' | 'enhancement'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  effect: Record<string, number>
  icon: string
  price: number
  description: string
}

interface HeroItem {
  id: string
  name: string
  type: 'weapon' | 'armor' | 'accessory' | 'ability' | 'enhancement'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  effect: Record<string, number>
  icon: string
  price: number
  description: string
}

interface Pet {
  id: string
  name: string
  species: string
  image: string
  owned: boolean
  level: number
  experience: number
  stats: PetStats
  personality: string
  bonded_hero?: string
  equipped_items: string[]
  customization: {
    color_filter?: string
    accessories: string[]
    special_effects: string[]
  }
  unlockCondition?: string
  evolution_stage: number
  max_evolution: number
  abilities: string[]
}

interface Hero {
  id: string
  name: string
  title: string
  image: string
  owned: boolean
  level: number
  experience: number
  stats: HeroStats
  element: 'fire' | 'ice' | 'thunder' | 'nature' | 'cyber'
  bonded_pet?: string
  equipped_items: string[]
  customization: {
    color_scheme?: string
    armor_variant: string
    weapon_variant: string
    special_effects: string[]
  }
  unlockCondition?: string
  abilities: string[]
  legendary_moves: string[]
}

interface BondedPair {
  pet_id: string
  hero_id: string
  bond_level: number
  max_bond_level: number
  bond_benefits: Record<string, number>
  combo_attacks: string[]
  shared_items: string[]
}

export default function EnhancedPetHeroCollection({ 
  onActivityComplete, 
  playerCoins = 2500, 
  playerLevel = 8,
  playerGems = 150 
}: {
  onActivityComplete?: (rewards: any) => void
  playerCoins?: number
  playerLevel?: number
  playerGems?: number
}) {
  // 🎮 ESTADOS PRINCIPALES
  const [pets, setPets] = useState<Pet[]>([])
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [bondedPairs, setBondedPairs] = useState<BondedPair[]>([])
  const [petItems, setPetItems] = useState<PetItem[]>([])
  const [heroItems, setHeroItems] = useState<HeroItem[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [activeTab, setActiveTab] = useState('pets')
  const [showCustomization, setShowCustomization] = useState(false)
  const [showBonding, setShowBonding] = useState(false)

  // 🐾 DATOS DE MASCOTAS USANDO TUS ASSETS
  useEffect(() => {
    const initialPets: Pet[] = [
      {
        id: 'mascota_perro',
        name: 'Guardián Leal Rex',
        species: 'Perro Cósmico',
        image: '/pet/mascota_perro.png',
        owned: true,
        level: 5,
        experience: 120,
        stats: { happiness: 85, health: 90, energy: 70, hunger: 60, cleanliness: 80, intelligence: 75, strength: 85, agility: 70 },
        personality: 'Protector y valiente',
        bonded_hero: 'superheroe_fire_phoenix',
        equipped_items: ['collar_fuego', 'armadura_basica'],
        customization: {
          color_filter: 'saturate(1.2) hue-rotate(10deg)',
          accessories: ['collar_fuego', 'capa_heroica'],
          special_effects: ['aura_fire']
        },
        evolution_stage: 2,
        max_evolution: 5,
        abilities: ['Rugido Intimidante', 'Salto de Fuego', 'Protección Férrea']
      },
      {
        id: 'mascota_gato',
        name: 'Sombra Lunar Whiskers',
        species: 'Gato Místico',
        image: '/pet/mascota_gato.png',
        owned: true,
        level: 4,
        experience: 95,
        stats: { happiness: 75, health: 80, energy: 90, hunger: 50, cleanliness: 95, intelligence: 90, strength: 60, agility: 95 },
        personality: 'Astuto y misterioso',
        bonded_hero: 'superheroe_ice_guardian',
        equipped_items: ['gafas_vision', 'botas_sigilo'],
        customization: {
          color_filter: 'saturate(1.1) hue-rotate(-20deg)',
          accessories: ['gafas_vision', 'collar_lunar'],
          special_effects: ['aura_ice', 'sombras']
        },
        evolution_stage: 2,
        max_evolution: 5,
        abilities: ['Sigilo Perfecto', 'Zarpazo Helado', 'Teletransporte']
      },
      {
        id: 'mascota_conejo',
        name: 'Saltarín Cósmico Bunny',
        species: 'Conejo Espacial',
        image: '/pet/mascota_conejo.png',
        owned: true,
        level: 3,
        experience: 60,
        stats: { happiness: 90, health: 70, energy: 95, hunger: 70, cleanliness: 85, intelligence: 80, strength: 50, agility: 98 },
        personality: 'Energético y juguetón',
        equipped_items: ['zapatillas_salto'],
        customization: {
          color_filter: 'saturate(1.3) brightness(1.1)',
          accessories: ['zapatillas_salto', 'mochila_cohete'],
          special_effects: ['estelas_luz']
        },
        evolution_stage: 1,
        max_evolution: 5,
        abilities: ['Super Salto', 'Velocidad Luz', 'Esquiva Dimensional'],
        unlockCondition: 'Alcanza nivel 3',
        owned: playerLevel >= 3
      },
      {
        id: 'mascota_pajaro',
        name: 'Explorador Alado Phoenix',
        species: 'Pájaro Mensajero',
        image: '/pet/mascota_pajaro.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { happiness: 80, health: 60, energy: 85, hunger: 75, cleanliness: 90, intelligence: 95, strength: 55, agility: 90 },
        personality: 'Sabio y explorador',
        bonded_hero: 'superheroe_thunder_bolt',
        equipped_items: [],
        customization: {
          accessories: [],
          special_effects: []
        },
        evolution_stage: 1,
        max_evolution: 5,
        abilities: ['Vuelo Supersónico', 'Vista Águila', 'Mensaje Telepático'],
        unlockCondition: 'Completa 10 misiones'
      },
      {
        id: 'mascota_hamster',
        name: 'Ingeniero Nano Chip',
        species: 'Hamster Tecnológico',
        image: '/pet/mascota_hamster.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { happiness: 85, health: 65, energy: 80, hunger: 90, cleanliness: 70, intelligence: 98, strength: 40, agility: 75 },
        personality: 'Genio inventivo',
        bonded_hero: 'superheroe_cyber_knight',
        equipped_items: [],
        customization: {
          accessories: [],
          special_effects: []
        },
        evolution_stage: 1,
        max_evolution: 5,
        abilities: ['Construcción Rápida', 'Hackeo Neural', 'Mini Robots'],
        unlockCondition: 'Gasta 500 monedas en la tienda'
      },
      {
        id: 'mascota_pez',
        name: 'Sabio Acuático Neptune',
        species: 'Pez Ancestral',
        image: '/pet/mascota_pez.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { happiness: 75, health: 85, energy: 70, hunger: 60, cleanliness: 98, intelligence: 95, strength: 45, agility: 85 },
        personality: 'Sabio y tranquilo',
        bonded_hero: 'superheroe_nature_guardian',
        equipped_items: [],
        customization: {
          accessories: [],
          special_effects: []
        },
        evolution_stage: 1,
        max_evolution: 5,
        abilities: ['Curación Acuática', 'Telepatía', 'Control Mareas'],
        unlockCondition: 'Alcanza nivel 10 con otra mascota'
      },
      {
        id: 'mascota_chinchilla',
        name: 'Saltarina Esponjosa Cloud',
        species: 'Chinchilla Celestial',
        image: '/pet/mascota_chinchilla.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { happiness: 95, health: 75, energy: 88, hunger: 65, cleanliness: 98, intelligence: 80, strength: 50, agility: 92 },
        personality: 'Esponjosa y saltarina',
        equipped_items: [],
        customization: {
          accessories: [],
          special_effects: []
        },
        evolution_stage: 1,
        max_evolution: 5,
        abilities: ['Salto Nube', 'Pelaje Eléctrico', 'Rodada Súper'],
        unlockCondition: 'Desbloquea con 100 gemas'
      }
    ]

    setPets(initialPets)
  }, [playerLevel])

  // 🦸 DATOS DE HÉROES USANDO TUS ASSETS
  useEffect(() => {
    const initialHeroes: Hero[] = [
      {
        id: 'superheroe_fire_phoenix',
        name: 'Fénix de Fuego Eterno',
        title: 'Maestro de las Llamas',
        image: '/heroe/superheroe_fire_phoenix.png',
        owned: true,
        level: 6,
        experience: 180,
        stats: { power: 95, defense: 70, speed: 80, magic: 90, leadership: 85, experience: 180 },
        element: 'fire',
        bonded_pet: 'mascota_perro',
        equipped_items: ['espada_fuego', 'armadura_phoenix'],
        customization: {
          color_scheme: 'fire',
          armor_variant: 'phoenix_gold',
          weapon_variant: 'sword_flame',
          special_effects: ['aura_fire', 'wing_flames']
        },
        abilities: ['Tornado de Fuego', 'Renacimiento Phoenix', 'Lluvia Meteoros'],
        legendary_moves: ['Apocalipsis Ígneo', 'Forma Phoenix Suprema']
      },
      {
        id: 'superheroe_ice_guardian',
        name: 'Guardián del Hielo Eterno',
        title: 'Señor del Invierno',
        image: '/heroe/superheroe_ice_guardian.png',
        owned: true,
        level: 5,
        experience: 140,
        stats: { power: 85, defense: 95, speed: 60, magic: 88, leadership: 90, experience: 140 },
        element: 'ice',
        bonded_pet: 'mascota_gato',
        equipped_items: ['escudo_hielo', 'casco_guardian'],
        customization: {
          color_scheme: 'ice',
          armor_variant: 'crystal_blue',
          weapon_variant: 'staff_ice',
          special_effects: ['aura_ice', 'crystal_fragments']
        },
        abilities: ['Blizzard Devastador', 'Muralla de Hielo', 'Congelación Total'],
        legendary_moves: ['Era Glacial', 'Dragón de Hielo']
      },
      {
        id: 'superheroe_thunder_bolt',
        name: 'Rayo Divino Zeus',
        title: 'Emperador del Trueno',
        image: '/heroe/superheroe_thunder_bolt.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { power: 98, defense: 60, speed: 95, magic: 92, leadership: 88, experience: 0 },
        element: 'thunder',
        bonded_pet: 'mascota_pajaro',
        equipped_items: [],
        customization: {
          armor_variant: 'lightning',
          weapon_variant: 'hammer_thunder',
          special_effects: []
        },
        abilities: ['Rayo Devastador', 'Tormenta Eléctrica', 'Velocidad Luz'],
        legendary_moves: ['Juicio del Olimpo', 'Avatar del Trueno'],
        unlockCondition: 'Logro Mítico: Maestro de Todos los Elementos'
      },
      {
        id: 'superheroe_nature_guardian',
        name: 'Guardián de la Naturaleza',
        title: 'Protector del Bosque',
        image: '/heroe/superheroe_nature_guardian.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { power: 80, defense: 90, speed: 75, magic: 95, leadership: 92, experience: 0 },
        element: 'nature',
        bonded_pet: 'mascota_pez',
        equipped_items: [],
        customization: {
          armor_variant: 'forest',
          weapon_variant: 'staff_nature',
          special_effects: []
        },
        abilities: ['Crecimiento Salvaje', 'Curación Natural', 'Ejército Animal'],
        legendary_moves: ['Despertar del Bosque', 'Gaia Suprema'],
        unlockCondition: 'Salva 100 animales en misiones'
      },
      {
        id: 'superheroe_cyber_knight',
        name: 'Caballero Cibernético',
        title: 'Guerrero del Futuro',
        image: '/heroe/superheroe_cyber_knight.png',
        owned: false,
        level: 1,
        experience: 0,
        stats: { power: 88, defense: 85, speed: 92, magic: 70, leadership: 80, experience: 0 },
        element: 'cyber',
        bonded_pet: 'mascota_hamster',
        equipped_items: [],
        customization: {
          armor_variant: 'nano_tech',
          weapon_variant: 'plasma_sword',
          special_effects: []
        },
        abilities: ['Modo Overcharge', 'Hackeo Cuántico', 'Arsenal Digital'],
        legendary_moves: ['Singularidad Cyber', 'Matrix Override'],
        unlockCondition: 'Completa 50 misiones de tecnología'
      }
    ]

    setHeroes(initialHeroes)
  }, [])

  // 🎒 ITEMS DE PERSONALIZACIÓN
  useEffect(() => {
    const initialPetItems: PetItem[] = [
      { id: 'collar_fuego', name: 'Collar de Fuego', type: 'accessory', rarity: 'epic', effect: { strength: 15, happiness: 10 }, icon: '🔥', price: 200, description: 'Aumenta el poder de fuego' },
      { id: 'gafas_vision', name: 'Gafas de Visión', type: 'accessory', rarity: 'rare', effect: { intelligence: 12, agility: 8 }, icon: '👓', price: 150, description: 'Mejora la percepción' },
      { id: 'zapatillas_salto', name: 'Zapatillas de Super Salto', type: 'accessory', rarity: 'epic', effect: { agility: 20, energy: 15 }, icon: '👟', price: 250, description: 'Saltos épicos' },
      { id: 'armadura_basica', name: 'Armadura Básica', type: 'accessory', rarity: 'common', effect: { health: 10, defense: 8 }, icon: '🛡️', price: 100, description: 'Protección básica' },
      { id: 'capa_heroica', name: 'Capa Heroica', type: 'accessory', rarity: 'legendary', effect: { happiness: 25, leadership: 15 }, icon: '🦸', price: 500, description: 'Para verdaderos héroes' }
    ]

    const initialHeroItems: HeroItem[] = [
      { id: 'espada_fuego', name: 'Espada de Fuego Eterno', type: 'weapon', rarity: 'epic', effect: { power: 20, magic: 15 }, icon: '⚔️', price: 400, description: 'Forjada en lava volcánica' },
      { id: 'escudo_hielo', name: 'Escudo de Hielo Perpetuo', type: 'armor', rarity: 'epic', effect: { defense: 25, magic: 10 }, icon: '🛡️', price: 350, description: 'Nunca se derrite' },
      { id: 'armadura_phoenix', name: 'Armadura Phoenix', type: 'armor', rarity: 'legendary', effect: { power: 15, defense: 20, magic: 18 }, icon: '🔥', price: 800, description: 'Renace de las cenizas' },
      { id: 'casco_guardian', name: 'Casco del Guardián', type: 'armor', rarity: 'rare', effect: { defense: 15, leadership: 12 }, icon: '👑', price: 300, description: 'Sabiduría ancestral' }
    ]

    setPetItems(initialPetItems)
    setHeroItems(initialHeroItems)
  }, [])

  // 🔗 VÍNCULOS INICIALES
  useEffect(() => {
    const initialBonds: BondedPair[] = [
      {
        pet_id: 'mascota_perro',
        hero_id: 'superheroe_fire_phoenix',
        bond_level: 3,
        max_bond_level: 10,
        bond_benefits: { power: 25, happiness: 20, strength: 15 },
        combo_attacks: ['Rugido Ígneo', 'Meteoro Canino', 'Llama Protectora'],
        shared_items: ['collar_fuego', 'armadura_phoenix']
      },
      {
        pet_id: 'mascota_gato',
        hero_id: 'superheroe_ice_guardian',
        bond_level: 2,
        max_bond_level: 10,
        bond_benefits: { agility: 20, intelligence: 15, magic: 10 },
        combo_attacks: ['Zarpazo Helado', 'Tormenta Felina', 'Barrera Gélida'],
        shared_items: ['gafas_vision', 'escudo_hielo']
      }
    ]

    setBondedPairs(initialBonds)
  }, [])

  // 🎨 FUNCIONES DE PERSONALIZACIÓN
  const customizePet = (petId: string, customization: any) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { ...pet, customization: { ...pet.customization, ...customization } }
        : pet
    ))
    toast.success(`¡${pets.find(p => p.id === petId)?.name} personalizada!`)
  }

  const customizeHero = (heroId: string, customization: any) => {
    setHeroes(prev => prev.map(hero => 
      hero.id === heroId 
        ? { ...hero, customization: { ...hero.customization, ...customization } }
        : hero
    ))
    toast.success(`¡${heroes.find(h => h.id === heroId)?.name} personalizado!`)
  }

  const createBond = (petId: string, heroId: string) => {
    const existingBond = bondedPairs.find(bond => bond.pet_id === petId || bond.hero_id === heroId)
    if (existingBond) {
      toast.error('Esta mascota o héroe ya tiene un vínculo!')
      return
    }

    const newBond: BondedPair = {
      pet_id: petId,
      hero_id: heroId,
      bond_level: 1,
      max_bond_level: 10,
      bond_benefits: { power: 5, happiness: 5 },
      combo_attacks: ['Ataque Combinado'],
      shared_items: []
    }

    setBondedPairs(prev => [...prev, newBond])
    setPets(prev => prev.map(pet => pet.id === petId ? { ...pet, bonded_hero: heroId } : pet))
    setHeroes(prev => prev.map(hero => hero.id === heroId ? { ...hero, bonded_pet: petId } : hero))
    
    toast.success('¡Vínculo creado! La aventura épica comienza!')
  }

  const levelUpBond = (petId: string, heroId: string) => {
    setBondedPairs(prev => prev.map(bond => {
      if (bond.pet_id === petId && bond.hero_id === heroId && bond.bond_level < bond.max_bond_level) {
        const newLevel = bond.bond_level + 1
        const newBenefits = {
          power: bond.bond_benefits.power + 5,
          happiness: bond.bond_benefits.happiness + 5,
          strength: (bond.bond_benefits.strength || 0) + 3
        }
        
        toast.success(`¡Vínculo nivel ${newLevel}! Nuevos poderes desbloqueados!`)
        return { ...bond, bond_level: newLevel, bond_benefits: newBenefits }
      }
      return bond
    }))
  }

  // 🎯 RENDER DE MASCOTA CON PERSONALIZACIÓN
  const PetCard = ({ pet }: { pet: Pet }) => {
    const bond = bondedPairs.find(b => b.pet_id === pet.id)
    const bondedHero = heroes.find(h => h.id === pet.bonded_hero)

    return (
      <Card className="gaming-card group cursor-pointer">
        <CardContent className="p-6">
          <div className="relative">
            {/* Imagen de la mascota con efectos */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={pet.image}
                alt={pet.name}
                fill
                className="object-contain rounded-lg transition-all duration-300 group-hover:scale-110"
                style={{ 
                  filter: pet.customization.color_filter || 'none'
                }}
              />
              {pet.customization.special_effects.map((effect, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 rounded-lg ${
                    effect === 'aura_fire' ? 'animate-glow bg-red-500/20' :
                    effect === 'aura_ice' ? 'animate-pulse bg-blue-500/20' :
                    'animate-shimmer'
                  }`}
                />
              ))}
              {bond && (
                <Badge className="absolute -top-2 -right-2 bg-purple-600">
                  Nivel {bond.bond_level}
                </Badge>
              )}
            </div>

            {/* Info de la mascota */}
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.species}</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Nivel {pet.level}</span>
              </div>
              
              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span>{pet.stats.health}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>{pet.stats.energy}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>{pet.stats.happiness}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span>{pet.stats.strength}</span>
                </div>
              </div>

              {/* Héroe vinculado */}
              {bondedHero && (
                <div className="flex items-center justify-center gap-2 bg-purple-100 dark:bg-purple-900 p-2 rounded">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">{bondedHero.name}</span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedPet(pet)
                    setShowCustomization(true)
                  }}
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedPet(pet)
                    setShowBonding(true)
                  }}
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 🦸 RENDER DE HÉROE CON PERSONALIZACIÓN
  const HeroCard = ({ hero }: { hero: Hero }) => {
    const bond = bondedPairs.find(b => b.hero_id === hero.id)
    const bondedPet = pets.find(p => p.id === hero.bonded_pet)

    const elementIcon = {
      fire: <Flame className="w-4 h-4 text-red-500" />,
      ice: <Snowflake className="w-4 h-4 text-blue-500" />,
      thunder: <Zap className="w-4 h-4 text-yellow-500" />,
      nature: <Leaf className="w-4 h-4 text-green-500" />,
      cyber: <Bot className="w-4 h-4 text-purple-500" />
    }

    return (
      <Card className="gaming-card group cursor-pointer">
        <CardContent className="p-6">
          <div className="relative">
            {/* Imagen del héroe */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={hero.image}
                alt={hero.name}
                fill
                className="object-contain rounded-lg transition-all duration-300 group-hover:scale-110"
              />
              {hero.customization.special_effects.map((effect, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 rounded-lg ${
                    effect === 'aura_fire' ? 'animate-glow bg-red-500/20' :
                    effect === 'aura_ice' ? 'animate-pulse bg-blue-500/20' :
                    effect === 'wing_flames' ? 'animate-bounce-gentle bg-orange-500/20' :
                    'animate-shimmer'
                  }`}
                />
              ))}
              {bond && (
                <Badge className="absolute -top-2 -right-2 bg-gold-600">
                  Vínculo {bond.bond_level}
                </Badge>
              )}
            </div>

            {/* Info del héroe */}
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg">{hero.name}</h3>
              <p className="text-sm text-muted-foreground">{hero.title}</p>
              <div className="flex items-center justify-center gap-2">
                {elementIcon[hero.element]}
                <span className="text-sm">{hero.element.toUpperCase()}</span>
                <Crown className="w-4 h-4 text-yellow-500" />
                <span>Nivel {hero.level}</span>
              </div>
              
              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Sword className="w-3 h-3 text-red-500" />
                  <span>{hero.stats.power}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span>{hero.stats.defense}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span>{hero.stats.speed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>{hero.stats.magic}</span>
                </div>
              </div>

              {/* Mascota vinculada */}
              {bondedPet && (
                <div className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900 p-2 rounded">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">{bondedPet.name}</span>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedHero(hero)
                    setShowCustomization(true)
                  }}
                >
                  <Palette className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedHero(hero)
                    setShowBonding(true)
                  }}
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header épico */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🐾 Colección Épica Mascota-Héroe 🦸
          </h1>
          <p className="text-xl text-white/80">
            Crea vínculos legendarios y personaliza a tus compañeros
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="text-2xl">💰</span>
              <span className="font-bold">{playerCoins.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <span className="text-2xl">💎</span>
              <span className="font-bold">{playerGems}</span>
            </div>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Mascotas
            </TabsTrigger>
            <TabsTrigger value="heroes" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Héroes
            </TabsTrigger>
            <TabsTrigger value="bonds" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Vínculos
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Tienda
            </TabsTrigger>
          </TabsList>

          {/* Contenido de mascotas */}
          <TabsContent value="pets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </TabsContent>

          {/* Contenido de héroes */}
          <TabsContent value="heroes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {heroes.map(hero => (
                <HeroCard key={hero.id} hero={hero} />
              ))}
            </div>
          </TabsContent>

          {/* Contenido de vínculos */}
          <TabsContent value="bonds" className="space-y-6">
            <div className="grid gap-6">
              {bondedPairs.map(bond => {
                const pet = pets.find(p => p.id === bond.pet_id)
                const hero = heroes.find(h => h.id === bond.hero_id)
                
                return (
                  <Card key={`${bond.pet_id}-${bond.hero_id}`} className="glass-effect">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Image src={pet?.image || ''} alt={pet?.name || ''} width={40} height={40} className="rounded" />
                          <span>{pet?.name}</span>
                        </div>
                        <Users className="w-6 h-6 text-purple-500" />
                        <div className="flex items-center gap-2">
                          <Image src={hero?.image || ''} alt={hero?.name || ''} width={40} height={40} className="rounded" />
                          <span>{hero?.name}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span>Nivel de Vínculo</span>
                            <span>{bond.bond_level}/{bond.max_bond_level}</span>
                          </div>
                          <Progress value={(bond.bond_level / bond.max_bond_level) * 100} className="mb-2" />
                          <Button 
                            size="sm" 
                            onClick={() => levelUpBond(bond.pet_id, bond.hero_id)}
                            disabled={bond.bond_level >= bond.max_bond_level}
                          >
                            Fortalecer Vínculo
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Beneficios del Vínculo</h4>
                            <div className="space-y-1 text-sm">
                              {Object.entries(bond.bond_benefits).map(([stat, value]) => (
                                <div key={stat} className="flex justify-between">
                                  <span className="capitalize">{stat}:</span>
                                  <span className="text-green-400">+{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Ataques Combo</h4>
                            <div className="space-y-1 text-sm">
                              {bond.combo_attacks.map((attack, index) => (
                                <div key={index} className="text-orange-400">
                                  • {attack}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Contenido de tienda */}
          <TabsContent value="shop" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Items para mascotas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Items para Mascotas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {petItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <Badge variant={item.rarity === 'legendary' ? 'destructive' : 'secondary'}>
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.price} 💰</div>
                          <Button size="sm" disabled={playerCoins < item.price}>
                            Comprar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Items para héroes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Items para Héroes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {heroItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <Badge variant={item.rarity === 'legendary' ? 'destructive' : 'secondary'}>
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.price} 💰</div>
                          <Button size="sm" disabled={playerCoins < item.price}>
                            Comprar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 