import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware de autenticación global con JWT apitoken
export const globalAuth = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // apitoken TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '🔐 Acceso denegado - Se requiere token de autenticación',
        error: 'Token requerido',
        solution: 'Debes iniciar sesión para obtener un token JWT',
        example: {
          header: 'Authorization: apitoken tu_token_jwt',
          curl: 'curl -H "Authorization: apitoken tu_token_jwt" http://localhost:3001/api/heroes'
        }
      });
    }

    // Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '🔐 Acceso denegado - Token inválido',
        error: 'El usuario asociado al token no existe',
        solution: 'Inicia sesión nuevamente para obtener un token válido'
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

    // Agregar información del usuario al request
    req.isAuthenticated = true;
    req.authType = 'jwt';
    req.user = user;
    req.userId = user._id;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '🔐 Acceso denegado - Token inválido',
        error: 'El token proporcionado no es válido',
        solution: 'Inicia sesión nuevamente para obtener un token válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '🔐 Acceso denegado - Token expirado',
        error: 'Tu token ha expirado',
        solution: 'Inicia sesión nuevamente para obtener un nuevo token'
      });
    }

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
          password: 'TuContraseña123!'
        }
      },
      login: {
        body: {
          username: 'tu_usuario',
          password: 'TuContraseña123!'
        }
      },
      auth_header: {
        Authorization: 'apitoken tu_token_jwt'
      }
    }
  });
}; 