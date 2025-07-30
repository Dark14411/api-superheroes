"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Gamepad2, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus,
  Star,
  Trophy,
  Coins,
  Sparkles,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

import { gameAPI } from "@/lib/api"

interface GameAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GameAuthModal({ isOpen, onClose, onSuccess }: GameAuthModalProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Estados del formulario
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  })

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Limpiar formularios y errores
  const resetForms = () => {
    setLoginForm({ username: "", password: "" })
    setRegisterForm({ username: "", email: "", password: "", confirmPassword: "" })
    setError("")
    setShowPassword(false)
  }

  // Manejar cierre del modal
  const handleClose = () => {
    resetForms()
    onClose()
  }

  // Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await gameAPI.login(loginForm.username, loginForm.password)
      
      if (response.success) {
        toast.success("¡Bienvenido de vuelta!")
        onSuccess()
        handleClose()
      } else {
        setError(response.message || "Error al iniciar sesión")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Manejar registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (registerForm.username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres")
      return
    }

    if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    if (registerForm.password.length < 3) {
      setError("La contraseña debe tener al menos 3 caracteres")
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const response = await gameAPI.register(
        registerForm.username,
        registerForm.email,
        registerForm.password
      )
      
      if (response.success) {
        toast.success("¡Cuenta creada exitosamente! Ahora inicia sesión")
        setActiveTab("login")
        setLoginForm({
          username: registerForm.username,
          password: ""
        })
        setRegisterForm({ username: "", email: "", password: "", confirmPassword: "" })
      } else {
        setError(response.message || "Error al crear la cuenta")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  // Datos de demostración
  const gameFeatures = [
    {
      icon: Gamepad2,
      title: "20 Juegos Únicos",
      description: "Desde puzzles hasta juegos de velocidad"
    },
    {
      icon: Trophy,
      title: "Sistema de Logros",
      description: "Desbloquea logros y sube de nivel"
    },
    {
      icon: Star,
      title: "Clasificaciones",
      description: "Compite con otros jugadores"
    },
    {
      icon: Coins,
      title: "Recompensas",
      description: "Gana experiencia y monedas"
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Únete al Sistema de Juegos
            </span>
          </DialogTitle>
          <DialogDescription>
            Accede a 20 juegos profesionales con sistema de progresión y recompensas
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Panel izquierdo - Características */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-6 text-white">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">¡Descubre Tu Potencial Gaming!</h3>
                <p className="text-blue-100 mb-4">
                  Únete a miles de jugadores en la plataforma de juegos más completa
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">20+</div>
                    <div className="text-xs text-blue-200">Juegos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-xs text-blue-200">Logros</div>
                  </div>
                </div>
              </div>
              
              {/* Efectos de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12" />
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">¿Qué obtienes?</h4>
              {gameFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 rounded-lg bg-blue-100">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">{feature.title}</h5>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats de ejemplo */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Ejemplo de Progresión</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-yellow-700">1,250</div>
                    <div className="text-xs text-yellow-600">XP Ganada</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-700">8</div>
                    <div className="text-xs text-yellow-600">Nivel</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-700">475</div>
                    <div className="text-xs text-yellow-600">Monedas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho - Formularios */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
              </TabsList>

              {/* Formulario de Login */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Bienvenido de Vuelta
                    </CardTitle>
                    <CardDescription>
                      Ingresa tus credenciales para continuar jugando
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Nombre de Usuario</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="login-username"
                            type="text"
                            placeholder="Tu nombre de usuario"
                            value={loginForm.username}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Tu contraseña"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Iniciando sesión...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Iniciar Sesión
                          </div>
                        )}
                      </Button>
                    </form>

                    {/* Usuario de demostración */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-2">👤 Usuario de Prueba:</p>
                      <div className="text-xs text-blue-700 space-y-1">
                        <div>Usuario: <code className="bg-blue-100 px-1 rounded">admin</code></div>
                        <div>Contraseña: <code className="bg-blue-100 px-1 rounded">SuperAdmin2024!</code></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Formulario de Registro */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Crear Cuenta Nueva
                    </CardTitle>
                    <CardDescription>
                      Únete a la comunidad de jugadores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Nombre de Usuario</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="register-username"
                            type="text"
                            placeholder="Elige tu nombre de usuario"
                            value={registerForm.username}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                            className="pl-10"
                            minLength={3}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="tu@email.com"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 3 caracteres"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 pr-10"
                            minLength={3}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password">Confirmar Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="register-confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creando cuenta...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Crear Cuenta
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 