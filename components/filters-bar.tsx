"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Swords, 
  BookOpen, 
  Shield, 
  Settings, 
  User,
  Zap,
  Heart,
  Smile,
  Dumbbell
} from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface FiltersBarProps {
  onFiltersChange: (filters: any) => void
  totalHeroes: number
  filteredCount: number
}

export function FiltersBar({ onFiltersChange, totalHeroes, filteredCount }: FiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    clase: "",
    elemento: "",
    nivelMin: "",
    nivelMax: "",
    ordenarPor: "nivel",
    orden: "desc"
  })

  const clases = [
    { value: "guerrero", label: "Guerrero", icon: <Swords className="w-4 h-4" /> },
    { value: "mago", label: "Mago", icon: <BookOpen className="w-4 h-4" /> },
    { value: "arquero", label: "Arquero", icon: <Shield className="w-4 h-4" /> },
    { value: "tecnólogo", label: "Tecnólogo", icon: <Settings className="w-4 h-4" /> },
    { value: "espía", label: "Espía", icon: <User className="w-4 h-4" /> }
  ]

  const elementos = [
    { value: "fuego", label: "Fuego", icon: "🔥" },
    { value: "agua", label: "Agua", icon: "💧" },
    { value: "tierra", label: "Tierra", icon: "🌍" },
    { value: "aire", label: "Aire", icon: "💨" },
    { value: "electricidad", label: "Electricidad", icon: "⚡" },
    { value: "hielo", label: "Hielo", icon: "❄️" },
    { value: "luz", label: "Luz", icon: "✨" },
    { value: "oscuridad", label: "Oscuridad", icon: "🌑" }
  ]

  const ordenarOpciones = [
    { value: "nivel", label: "Nivel" },
    { value: "nombre", label: "Nombre" },
    { value: "experiencia", label: "Experiencia" },
    { value: "salud", label: "Salud" },
    { value: "energia", label: "Energía" },
    { value: "felicidad", label: "Felicidad" },
    { value: "fuerza", label: "Fuerza" }
  ]

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      clase: "",
      elemento: "",
      nivelMin: "",
      nivelMax: "",
      ordenarPor: "nivel",
      orden: "desc"
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.clase || filters.elemento || filters.nivelMin || filters.nivelMax

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {filteredCount} de {totalHeroes} héroes
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="w-4 h-4 mr-1" />
            {isExpanded ? "Ocultar" : "Mostrar"}
          </Button>
        </div>
      </div>

      {/* Búsqueda básica siempre visible */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar héroes por nombre..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros expandidos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Clase */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Clase</label>
                <Select value={filters.clase} onValueChange={(value) => handleFilterChange("clase", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las clases" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las clases</SelectItem>
                    {clases.map((clase) => (
                      <SelectItem key={clase.value} value={clase.value}>
                        <div className="flex items-center gap-2">
                          {clase.icon}
                          {clase.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Elemento */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Elemento</label>
                <Select value={filters.elemento} onValueChange={(value) => handleFilterChange("elemento", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los elementos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los elementos</SelectItem>
                    {elementos.map((elemento) => (
                      <SelectItem key={elemento.value} value={elemento.value}>
                        <div className="flex items-center gap-2">
                          <span>{elemento.icon}</span>
                          {elemento.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nivel mínimo */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Nivel mínimo</label>
                <Input
                  type="number"
                  placeholder="1"
                  value={filters.nivelMin}
                  onChange={(e) => handleFilterChange("nivelMin", e.target.value)}
                  min="1"
                  max="100"
                />
              </div>

              {/* Nivel máximo */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Nivel máximo</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={filters.nivelMax}
                  onChange={(e) => handleFilterChange("nivelMax", e.target.value)}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ordenar por</label>
                <Select value={filters.ordenarPor} onValueChange={(value) => handleFilterChange("ordenarPor", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ordenarOpciones.map((opcion) => (
                      <SelectItem key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Orden</label>
                <Select value={filters.orden} onValueChange={(value) => handleFilterChange("orden", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descendente</SelectItem>
                    <SelectItem value="asc">Ascendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtros activos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {filters.clase && (
                  <Badge variant="outline" className="text-xs">
                    Clase: {clases.find(c => c.value === filters.clase)?.label}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange("clase", "")}
                    />
                  </Badge>
                )}
                {filters.elemento && (
                  <Badge variant="outline" className="text-xs">
                    Elemento: {elementos.find(e => e.value === filters.elemento)?.label}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange("elemento", "")}
                    />
                  </Badge>
                )}
                {filters.nivelMin && (
                  <Badge variant="outline" className="text-xs">
                    Nivel ≥ {filters.nivelMin}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange("nivelMin", "")}
                    />
                  </Badge>
                )}
                {filters.nivelMax && (
                  <Badge variant="outline" className="text-xs">
                    Nivel ≤ {filters.nivelMax}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange("nivelMax", "")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
} 