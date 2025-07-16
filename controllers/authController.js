import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateUserApiKey } from '../utils/apiKeyGenerator.js';

// Registrar nuevo usuario
export const register = async (req, res) => {
  try {
    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Crear nuevo usuario
    const newUser = new User({
      username,
      password
    });

    await newUser.save();

    // Generar API Key única para el usuario
    const userApiKey = generateUserApiKey(newUser._id, newUser.username);
    newUser.apiKey = userApiKey;
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Buscar usuario por username o email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta deshabilitada'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          lastLogin: user.lastLogin
        },
        apiKey: user.apiKey || generateUserApiKey(user._id, user.username),
        note: 'Usa tu API Key personal en el header x-api-key'
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener perfil del usuario actual
export const getProfile = async (req, res) => {
  try {
    const response = {
      success: true,
      message: 'API Key válida',
      data: { 
        authenticated: true,
        apiKey: req.apiKey,
        authType: req.authType,
        note: 'Tu API Key es válida y tienes acceso a todos los endpoints'
      }
    };

    // Si es autenticación de usuario, agregar información del usuario
    if (req.authType === 'user' && req.user) {
      response.data.user = {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role,
        lastLogin: req.user.lastLogin
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Logout (opcional - el cliente debe eliminar el token)
export const logout = async (req, res) => {
  try {
    // En una implementación más avanzada, podrías agregar el token a una blacklist
    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 