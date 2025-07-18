# 🔐 Sistema de Autenticación con JWT Bearer Tokens

Este sistema implementa autenticación basada en JWT (JSON Web Tokens) con Bearer Token, proporcionando un sistema de autenticación seguro y estándar.

## 🚀 Características

- ✅ **JWT Bearer Tokens** - Autenticación estándar de la industria
- ✅ **Registro simplificado** (solo username y password)
- ✅ **Autenticación global** en todos los endpoints
- ✅ **Validaciones robustas**
- ✅ **Documentación Swagger completa**
- ✅ **Manejo de errores detallado**
- ✅ **Tokens con expiración** (24h por defecto)

## 📋 Endpoints de Autenticación

### 👤 POST /api/auth/register
Registra un nuevo usuario.

**Body:**
```json
{
  "username": "usuario123",
  "password": "miPassword123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "usuario123",
      "role": "user"
    }
  }
}
```

### 🔑 POST /api/auth/login
Inicia sesión con un usuario existente.

**Body:**
```json
{
  "username": "usuario123",
  "password": "miPassword123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "usuario123",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "note": "Usa este token en el header Authorization: Bearer <token>"
  }
}
```

### 👤 GET /api/auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "authenticated": true,
    "authType": "jwt",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "usuario123",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "note": "Tu token JWT es válido y tienes acceso a todos los endpoints"
  }
}
```

### 🚪 POST /api/auth/logout
Cierra la sesión del usuario (el cliente debe eliminar el token).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Logout exitoso",
  "note": "Elimina el token del lado del cliente"
}
```

## 🔐 Uso de Autenticación

### En Postman
1. **Registro/Login** → Obtienes un token JWT
2. **En otros endpoints** → Usa `Authorization: Bearer <token>`

### En cURL
**Registrar usuario:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "miPassword123"
  }'
```

**Iniciar sesión:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario123",
    "password": "miPassword123"
  }'
```

**Acceder a endpoints protegidos:**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

**Acceder a otros endpoints:**
```bash
curl -X GET http://localhost:3001/api/heroes \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## 📚 Documentación Swagger

La documentación completa está disponible en:
```
http://localhost:3001/api-docs
```

## 🔧 Configuración Avanzada

### Variables de entorno
```env
# Configuración JWT
JWT_SECRET=tu_jwt_secret_super_seguro_2024
JWT_EXPIRES_IN=24h
```

### Middleware de autenticación
```javascript
import { globalAuth } from './middleware/globalAuth.js';

// Aplicar autenticación global
app.use('/api', globalAuth);

// Ruta protegida
app.get('/api/heroes', (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});
```

## 🚨 Manejo de Errores

### Errores comunes

**400 - Datos inválidos:**
```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "username",
      "message": "El nombre de usuario debe tener entre 3 y 30 caracteres"
    }
  ]
}
```

**401 - No autorizado:**
```json
{
  "success": false,
  "message": "🔐 Acceso denegado - Se requiere token de autenticación",
  "error": "Token requerido",
  "solution": "Debes iniciar sesión para obtener un token JWT",
  "example": {
    "header": "Authorization: Bearer tu_token_jwt",
    "curl": "curl -H \"Authorization: Bearer tu_token_jwt\" http://localhost:3001/api/heroes"
  }
}
```

**401 - Token expirado:**
```json
{
  "success": false,
  "message": "🔐 Acceso denegado - Token expirado",
  "error": "Tu token ha expirado",
  "solution": "Inicia sesión nuevamente para obtener un nuevo token"
}
```

**409 - Usuario ya existe:**
```json
{
  "success": false,
  "message": "El usuario ya existe"
}
```

## 📝 Notas Importantes

1. **Tokens JWT**: Se deben incluir en el header `Authorization: Bearer <token>`
2. **Contraseñas**: Nunca se almacenan en texto plano
3. **Validaciones**: Se ejecutan antes de procesar la lógica de negocio
4. **Roles**: Por defecto todos los usuarios tienen rol "user"
5. **Expiración**: Los tokens expiran en 24 horas por defecto
6. **Seguridad**: Los tokens contienen información del usuario pero están firmados 