import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/database.js'
import heroController from './controllers/heroController.js'
import mascotaController from './controllers/mascotaController.js'
import itemController from './controllers/itemController.js'
import authRoutes from './routes/auth.js'
import { globalAuth } from './middleware/globalAuth.js'

// Cargar variables de entorno
dotenv.config()

const app = express()

// Configuración de CORS - Permitir solicitudes desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-API-Key'],
  credentials: false
}))

// Solo middlewares esenciales
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Superhéroes y Cuidado de Mascotas',
      version: '2.0.0',
      description: 'API completa para gestionar superhéroes, mascotas fantásticas con sistema de cuidado, salud, felicidad e items',
      contact: {
        name: 'API Support',
        email: 'support@superheroes.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'ApiKeyAuth (apiKey)'
        }
      }
    }
  },
  apis: ['./controllers/*.js', './routes/*.js'] // Path to the API docs
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rutas de autenticación (sin protección)
app.use('/api/auth', authRoutes)

// Middleware de autenticación global para todas las demás rutas
app.use('/api', globalAuth)

// Rutas de la API (protegidas)
app.use('/api', heroController)
app.use('/api', mascotaController)
app.use('/api', itemController)

// Ruta de prueba (protegida)
app.get('/', globalAuth, (req, res) => {
    res.json({
        message: 'API de Superhéroes y Mascotas funcionando correctamente!',
        version: '2.0.0',
        authenticated: req.isAuthenticated,
        endpoints: {
            auth: '/api/auth',
            heroes: '/api/heroes',
            mascotas: '/api/mascotas',
            items: '/api/items',
            docs: '/api-docs'
        },
        note: 'Todos los endpoints requieren API Key excepto /api/auth',
        apiKey: 'Registra un usuario para obtener tu API Key personal'
    })
})

const PORT = process.env.PORT || 3001

const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
            console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`)
            console.log(`🌐 API Base: http://localhost:${PORT}`)
            console.log(`🔐 Endpoint Auth: http://localhost:${PORT}/api/auth`)
            console.log(`🦸‍♂️ Endpoint Héroes: http://localhost:${PORT}/api/heroes`)
            console.log(`🐉 Endpoint Mascotas: http://localhost:${PORT}/api/mascotas`)
            console.log(`🎁 Endpoint Items: http://localhost:${PORT}/api/items`)
        })
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error)
        process.exit(1)
    }
}

startServer()
