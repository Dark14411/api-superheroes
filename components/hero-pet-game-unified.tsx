"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Zap,
  Smile,
  Dumbbell,
  Star,
  Crown,
  Coins,
  Gem,
  Plus,
  Settings,
  Apple,
  Gamepad2,
  Sparkles,
  User,
  Swords,
  BookOpen,
  Shield,
  PawPrint,
  Target,
  Trophy,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Hero {
  id: number
  name: string
  class: string
  level: number
  experience: number
  health: number
  energy: number
  happiness: number
  strength: number
  magic: number
  agility: number
  appearance: any
}

interface Pet {
  id: number
  name: string
  species_name: string
  species_type: string
  species_rarity: string
  level: number
  health: number
  energy: number
  happiness: number
  hunger: number
  bond_level: number
}

interface PetSpecies {
  id: number
  name: string
  type: string
  rarity: string
  base_stats: Record<string, any>
  appearance: Record<string, any>
  abilities: string[]
}

// Mock data for demonstration
const mockHeroes: Hero[] = [
  {
    id: 1,
    name: "Thunder Strike",
    class: "warrior",
    level: 5,
    experience: 1250,
    health: 85,
    energy: 70,
    happiness: 90,
    strength: 75,
    magic: 30,
    agility: 60,
    appearance: {}
  },
  {
    id: 2,
    name: "Shadow Mage",
    class: "mage",
    level: 4,
    experience: 980,
    health: 60,
    energy: 85,
    happiness: 80,
    strength: 40,
    magic: 90,
    agility: 50,
    appearance: {}
  }
]

const mockPets: Pet[] = [
  {
    id: 1,
    name: "Flame",
    species_name: "Dragon",
    species_type: "fire",
    species_rarity: "legendary",
    level: 3,
    health: 90,
    energy: 80,
    happiness: 95,
    hunger: 20,
    bond_level: 75
  },
  {
    id: 2,
    name: "Aqua",
    species_name: "Phoenix",
    species_type: "water",
    species_rarity: "epic",
    level: 2,
    health: 75,
    energy: 85,
    happiness: 80,
    hunger: 40,
    bond_level: 60
  }
]

export function HeroPetGameUnified() {
  const [heroes, setHeroes] = useState<Hero[]>(mockHeroes)
  const [selectedHero, setSelectedHero] = useState<Hero | null>(mockHeroes[0])
  const [pets, setPets] = useState<Pet[]>(mockPets)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(mockPets[0])
  const [gameMode, setGameMode] = useState<"heroes" | "pets" | "create-hero" | "adopt-pet">("heroes")
  const [loading, setLoading] = useState(false)
  const [defaultUser, setDefaultUser] = useState({
    username: "Jugador1",
    level: 1,
    coins: 100,
    gems: 10,
  })

  // Form states for creating hero
  const [newHeroName, setNewHeroName] = useState("")
  const [newHeroClass, setNewHeroClass] = useState("warrior")
  const [createHeroError, setCreateHeroError] = useState("")
  const [creatingHero, setCreatingHero] = useState(false)

  // Form states for adopting pet
  const [newPetName, setNewPetName] = useState("")
  const [newPetSpecies, setNewPetSpecies] = useState("dragon")
  const [adoptPetError, setAdoptPetError] = useState("")
  const [adoptingPet, setAdoptingPet] = useState(false)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500"
      case "rare": return "bg-blue-500"
      case "epic": return "bg-purple-500"
      case "legendary": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getClassIcon = (heroClass: string) => {
    switch (heroClass) {
      case "warrior": return <Swords className="w-4 h-4" />
      case "mage": return <BookOpen className="w-4 h-4" />
      case "archer": return <Target className="w-4 h-4" />
      case "tank": return <Shield className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getPetTypeIcon = (type: string) => {
    switch (type) {
      case "fire": return "🔥"
      case "water": return "💧"
      case "earth": return "🌍"
      case "air": return "💨"
      case "light": return "✨"
      case "dark": return "🌑"
      default: return "🐾"
    }
  }

  const handleCreateHero = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHeroName.trim()) {
      setCreateHeroError("El nombre del héroe es requerido")
      return
    }

    setCreatingHero(true)
    setCreateHeroError("")

    // Simulate API call
    setTimeout(() => {
      const newHero: Hero = {
        id: heroes.length + 1,
        name: newHeroName,
        class: newHeroClass,
        level: 1,
        experience: 0,
        health: 100,
        energy: 100,
        happiness: 100,
        strength: newHeroClass === "warrior" ? 80 : 50,
        magic: newHeroClass === "mage" ? 80 : 30,
        agility: newHeroClass === "archer" ? 80 : 50,
        appearance: {}
      }

      setHeroes(prev => [...prev, newHero])
      setSelectedHero(newHero)
      setNewHeroName("")
      setNewHeroClass("warrior")
      setCreatingHero(false)
      setGameMode("heroes")
    }, 1000)
  }

  const handleAdoptPet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetName.trim()) {
      setAdoptPetError("El nombre de la mascota es requerido")
      return
    }

    setAdoptingPet(true)
    setAdoptPetError("")

    // Simulate API call
    setTimeout(() => {
      const newPet: Pet = {
        id: pets.length + 1,
        name: newPetName,
        species_name: newPetSpecies === "dragon" ? "Dragon" : "Phoenix",
        species_type: newPetSpecies === "dragon" ? "fire" : "water",
        species_rarity: newPetSpecies === "dragon" ? "legendary" : "epic",
        level: 1,
        health: 100,
        energy: 100,
        happiness: 100,
        hunger: 0,
        bond_level: 0
      }

      setPets(prev => [...prev, newPet])
      setSelectedPet(newPet)
      setNewPetName("")
      setNewPetSpecies("dragon")
      setAdoptingPet(false)
      setGameMode("pets")
    }, 1000)
  }

  const feedPet = (petId: number) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { ...pet, hunger: Math.min(100, pet.hunger + 30), happiness: Math.min(100, pet.happiness + 10) }
        : pet
    ))
  }

  const playWithPet = (petId: number) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { ...pet, happiness: Math.min(100, pet.happiness + 20), energy: Math.max(0, pet.energy - 10) }
        : pet
    ))
  }

  const trainHero = (heroId: number, stat: "strength" | "magic" | "agility") => {
    setHeroes(prev => prev.map(hero => 
      hero.id === heroId 
        ? { 
            ...hero, 
            [stat]: Math.min(100, hero[stat] + 5),
            experience: hero.experience + 50,
            energy: Math.max(0, hero.energy - 15)
          }
        : hero
    ))
  }

  if (gameMode === "create-hero") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Crear Nuevo Héroe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateHero} className="space-y-4">
              <div>
                <Label htmlFor="heroName">Nombre del Héroe</Label>
                <Input
                  id="heroName"
                  value={newHeroName}
                  onChange={(e) => setNewHeroName(e.target.value)}
                  placeholder="Ingresa el nombre de tu héroe"
                />
              </div>
              
              <div>
                <Label htmlFor="heroClass">Clase del Héroe</Label>
                <Select value={newHeroClass} onValueChange={setNewHeroClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warrior">Guerrero</SelectItem>
                    <SelectItem value="mage">Mago</SelectItem>
                    <SelectItem value="archer">Arquero</SelectItem>
                    <SelectItem value="tank">Tanque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {createHeroError && (
                <div className="text-red-500 text-sm">{createHeroError}</div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={creatingHero}
                  className="flex-1"
                >
                  {creatingHero ? "Creando..." : "Crear Héroe"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGameMode("heroes")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameMode === "adopt-pet") {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="w-5 h-5" />
              Adoptar Nueva Mascota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdoptPet} className="space-y-4">
              <div>
                <Label htmlFor="petName">Nombre de la Mascota</Label>
                <Input
                  id="petName"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="Ingresa el nombre de tu mascota"
                />
              </div>
              
              <div>
                <Label htmlFor="petSpecies">Especie</Label>
                <Select value={newPetSpecies} onValueChange={setNewPetSpecies}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dragon">Dragón</SelectItem>
                    <SelectItem value="phoenix">Fénix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {adoptPetError && (
                <div className="text-red-500 text-sm">{adoptPetError}</div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={adoptingPet}
                  className="flex-1"
                >
                  {adoptingPet ? "Adoptando..." : "Adoptar Mascota"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGameMode("pets")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Heroes & Pets Game</h1>
        <p className="text-gray-600 mb-4">Gestiona tus héroes y mascotas</p>
        
        {/* User Stats */}
        <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-bold">{defaultUser.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="font-bold">{defaultUser.coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-purple-600" />
            <span className="font-bold">{defaultUser.gems}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          variant={gameMode === "heroes" ? "default" : "outline"}
          onClick={() => setGameMode("heroes")}
          className="flex items-center gap-2"
        >
          <Swords className="w-4 h-4" />
          Héroes
        </Button>
        <Button
          variant={gameMode === "pets" ? "default" : "outline"}
          onClick={() => setGameMode("pets")}
          className="flex items-center gap-2"
        >
          <PawPrint className="w-4 h-4" />
          Mascotas
        </Button>
      </div>

      {/* Heroes Mode */}
      {gameMode === "heroes" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mis Héroes</h2>
            <Button
              onClick={() => setGameMode("create-hero")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear Héroe
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroes.map((hero) => (
              <Card key={hero.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{hero.name}</CardTitle>
                    <Badge variant="outline">
                      Nivel {hero.level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {getClassIcon(hero.class)}
                    <span className="capitalize">{hero.class}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <Progress value={hero.health} className="flex-1" />
                      <span className="text-sm text-gray-600">{hero.health}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <Progress value={hero.energy} className="flex-1" />
                      <span className="text-sm text-gray-600">{hero.energy}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-green-500" />
                      <Progress value={hero.happiness} className="flex-1" />
                      <span className="text-sm text-gray-600">{hero.happiness}%</span>
                    </div>
                  </div>

                  {/* Training Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => trainHero(hero.id, "strength")}
                      disabled={hero.energy < 15}
                      className="flex flex-col gap-1"
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span className="text-xs">Fuerza</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => trainHero(hero.id, "magic")}
                      disabled={hero.energy < 15}
                      className="flex flex-col gap-1"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs">Magia</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => trainHero(hero.id, "agility")}
                      disabled={hero.energy < 15}
                      className="flex flex-col gap-1"
                    >
                      <Target className="w-4 h-4" />
                      <span className="text-xs">Agilidad</span>
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Exp: {hero.experience}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pets Mode */}
      {gameMode === "pets" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mis Mascotas</h2>
            <Button
              onClick={() => setGameMode("adopt-pet")}
              className="flex items-center gap-2"
            >
              <PawPrint className="w-4 h-4" />
              Adoptar Mascota
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <Badge 
                      className={getRarityColor(pet.species_rarity)}
                      variant="secondary"
                    >
                      {pet.species_rarity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-lg">{getPetTypeIcon(pet.species_type)}</span>
                    <span>{pet.species_name}</span>
                    <span>• Nivel {pet.level}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <Progress value={pet.health} className="flex-1" />
                      <span className="text-sm text-gray-600">{pet.health}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <Progress value={pet.energy} className="flex-1" />
                      <span className="text-sm text-gray-600">{pet.energy}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-green-500" />
                      <Progress value={pet.happiness} className="flex-1" />
                      <span className="text-sm text-gray-600">{pet.happiness}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Apple className="w-4 h-4 text-orange-500" />
                      <Progress value={pet.hunger} className="flex-1" />
                      <span className="text-sm text-gray-600">{pet.hunger}%</span>
                    </div>
                  </div>

                  {/* Pet Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => feedPet(pet.id)}
                      className="flex items-center gap-2"
                    >
                      <Apple className="w-4 h-4" />
                      Alimentar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => playWithPet(pet.id)}
                      disabled={pet.energy < 10}
                      className="flex items-center gap-2"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      Jugar
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Vínculo: {pet.bond_level}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 