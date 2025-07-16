import User from '../models/User.js';
import { isUserApiKey } from '../utils/apiKeyGenerator.js';

// Middleware de autenticación global con API Key (solo usuarios)
export const globalAuth = async (req, res, next) => {
  try {
    // Obtener API Key del header
    const apiKey = req.headers['x-api-key'] || req.headers['X-API-Key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: '🔐 Acceso denegado - Se requiere API Key',
        error: 'API Key requerida',
        solution: 'Debes registrarte para obtener tu API Key personal',
        example: {
          header: 'x-api-key: tu_api_key_personal',
          curl: 'curl -H "x-api-key: tu_api_key_personal" http://localhost:3001/api/heroes'
        }
      });
    }

    // Verificar si es API Key de usuario
    if (isUserApiKey(apiKey)) {
      const user = await User.findOne({ apiKey }).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '🔐 Acceso denegado - API Key de usuario inválida',
          error: 'La API Key de usuario no existe o ha expirado',
          solution: 'Registra un nuevo usuario para obtener una nueva API Key'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: '🔐 Acceso denegado - Cuenta deshabilitada',
          error: 'Tu cuenta ha sido deshabilitada',
          solution: 'Contacta al administrador para reactivar tu cuenta'
        });
      }

      req.isAuthenticated = true;
      req.apiKey = apiKey;
      req.authType = 'user';
      req.user = user;
      req.userId = user._id;
      return next();
    }

    // API Key inválida
    return res.status(401).json({
      success: false,
      message: '🔐 Acceso denegado - API Key inválida',
      error: 'La API Key proporcionada no es válida',
      solution: 'Registra un nuevo usuario para obtener una API Key válida'
    });

  } catch (error) {
    console.error('Error en autenticación global:', error);
    res.status(500).json({
      success: false,
      message: '🔐 Error interno de autenticación',
      error: 'Error interno del servidor',
      solution: 'Intenta nuevamente más tarde'
    });
  }
};

// Middleware para rutas públicas (sin autenticación)
export const publicRoute = (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
};

// Middleware para mostrar información de autenticación requerida
export const authRequired = (req, res, next) => {
  res.status(401).json({
    success: false,
    message: '🔐 Autenticación requerida',
    error: 'Este endpoint requiere que estés autenticado',
    solution: 'Debes registrarte o iniciar sesión primero',
    endpoints: {
      register: {
        url: 'POST /api/auth/register',
        description: 'Registrar un nuevo usuario'
      },
      login: {
        url: 'POST /api/auth/login', 
        description: 'Iniciar sesión con usuario existente'
      }
    },
    example: {
      register: {
        body: {
          username: 'tu_usuario',
          email: 'tu@email.com',
          password: 'TuContraseña123!'
        }
      },
      login: {
        body: {
          username: 'tu_usuario',
          password: 'TuContraseña123!'
        }
      }
    }
  });
}; 