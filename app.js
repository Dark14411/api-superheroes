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

// Cargar variables de entorno desde múltiples ubicaciones
dotenv.config({ path: './.env' })
dotenv.config({ path: '../.env' })
dotenv.config({ path: '../../.env' })

// Verificar que las variables se cargaron
console.log('🔧 Variables de entorno cargadas:')
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurada' : '❌ No encontrada')
console.log('   PORT:', process.env.PORT || '3001 (por defecto)')
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development (por defecto)')

const app = express()

// Configuración de CORS - Permitir solicitudes desde cualquier origen
app.use(cors({
  origin: true, // Permitir todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}))

// Manejar preflight OPTIONS requests
app.options('*', cors())

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
      },
      {
        url: 'https://api-superheroes-ftut.onrender.com',
        description: 'Servidor de producción (Render)'
      }
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Bearer (apitoken) - JWT token obtenido al iniciar sesión'
        }
      }
    }
  },
  apis: ['./controllers/*.js', './routes/*.js'] // Path to the API docs
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Endpoint para obtener swagger.json
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Superhéroes - Documentación'
}))

// Ruta raíz - Redirigir a Swagger
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Ruta de información de la API (sin autenticación)
app.get('/api/info', (req, res) => {
    res.json({
        message: 'API de Superhéroes y Mascotas funcionando correctamente!',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            heroes: '/api/heroes',
            mascotas: '/api/mascotas',
            items: '/api/items',
            docs: '/api-docs'
        },
        note: 'Todos los endpoints requieren JWT Bearer Token excepto /api/auth',
        authentication: 'Registra un usuario y obtén un token JWT para acceder a los endpoints'
    })
})

// Rutas de autenticación (sin protección)
app.use('/api/auth', authRoutes)

// Middleware de autenticación global para todas las demás rutas
app.use('/api', globalAuth)

// Rutas de la API (protegidas)
app.use('/api', heroController)
app.use('/api', mascotaController)
app.use('/api', itemController)

const PORT = process.env.PORT || 3001

const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
            console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`)
            console.log(`🌐 Página principal: http://localhost:${PORT} (redirige a Swagger)`)
            console.log(`🔐 Endpoint Auth: http://localhost:${PORT}/api/auth`)
            console.log(`🦸‍♂️ Endpoint Héroes: http://localhost:${PORT}/api/heroes`)
            console.log(`🐉 Endpoint Mascotas: http://localhost:${PORT}/api/mascotas`)
            console.log(`🎁 Endpoint Items: http://localhost:${PORT}/api/items`)
            console.log(`ℹ️ Info API: http://localhost:${PORT}/api/info`)
        })
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error)
        process.exit(1)
    }
}

startServer()
