import { body } from 'express-validator';

// Validaciones para registro
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('password')
    .isLength({ min: 3 })
    .withMessage('La contraseña debe tener al menos 3 caracteres')
];

// Validaciones para login
export const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario o email es requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// Validaciones para cambio de contraseña
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  
  body('newPassword')
    .isLength({ min: 3 })
    .withMessage('La nueva contraseña debe tener al menos 3 caracteres')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('La nueva contraseña no puede ser igual a la actual');
      }
      return true;
    })
];

// Validaciones para actualizar perfil
export const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Por favor ingresa un email válido')
    .normalizeEmail()
]; 