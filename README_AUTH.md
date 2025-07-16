# 🔐 Sistema de Autenticación con API Keys

Este sistema implementa autenticación basada en API Keys únicas por usuario, eliminando la necesidad de tokens JWT.

## 🚀 Características

- ✅ **API Keys únicas por usuario**
- ✅ **Registro simplificado** (solo username y password)
- ✅ **Autenticación global** en todos los endpoints
- ✅ **Validaciones robustas**
- ✅ **Documentación Swagger completa**
- ✅ **Manejo de errores detallado**

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
    },
    "apiKey": "user_abc123def456_1705312800000",
    "note": "Usa tu API Key personal en el header x-api-key"
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
    "apiKey": "user_abc123def456_1705312800000",
    "note": "Usa tu API Key personal en el header x-api-key"
  }
}
```

### 👤 GET /api/auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
x-api-key: user_abc123def456_1705312800000
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "API Key válida",
  "data": {
    "authenticated": true,
    "apiKey": "user_abc123def456_1705312800000",
    "authType": "user",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "usuario123",
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "note": "Tu API Key es válida y tienes acceso a todos los endpoints"
  }
}
```

### 🚪 POST /api/auth/logout
Cierra la sesión del usuario.

**Headers:**
```
x-api-key: user_abc123def456_1705312800000
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

## 🛡️ Validaciones

### Registro
- **username**: 3-30 caracteres, solo letras, números y guiones bajos
- **password**: Mínimo 3 caracteres (cualquier tipo)

### Login
- **username**: No puede estar vacío
- **password**: No puede estar vacío

## 🔒 Seguridad

### Contraseñas
- Hasheadas con bcrypt (12 rondas de salt)
- Nunca se devuelven en las respuestas
- Validación mínima (3 caracteres)

### API Keys
- Únicas por usuario
- Generadas automáticamente al registrarse
- Formato: `user_<hash>_<timestamp>`
- Verificación automática en todas las rutas

### Validaciones
- Sanitización de datos de entrada
- Verificación de unicidad de username
- Verificación de API Key en cada request

## 🧪 Pruebas

### Ejecutar pruebas de autenticación
```bash
node testAuth.js
```

### Probar endpoints con curl

**Registro:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123"
  }'
```

**Obtener perfil (con API Key):**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "x-api-key: TU_API_KEY_AQUI"
```

**Acceder a endpoints protegidos:**
```bash
curl -X GET http://localhost:3001/api/heroes \
  -H "x-api-key: TU_API_KEY_AQUI"
```

## 📚 Documentación Swagger

La documentación completa está disponible en:
```
http://localhost:3001/api-docs
```

## 🔧 Configuración Avanzada

### Variables de entorno
```env
# Configuración de API Key
API_KEY_AUTH_ENABLED=true
API_KEY_HEADER_NAME=X-API-Key
API_KEY_QUERY_PARAM=apiKey
API_KEY_REQUIRED=true
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
  "message": "🔐 Acceso denegado - Se requiere API Key",
  "error": "API Key requerida",
  "solution": "Debes registrarte para obtener tu API Key personal",
  "example": {
    "header": "x-api-key: tu_api_key_personal",
    "curl": "curl -H \"x-api-key: tu_api_key_personal\" http://localhost:3001/api/heroes"
  }
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

1. **API Keys**: Se deben incluir en el header `x-api-key: <api_key>`
2. **Contraseñas**: Nunca se almacenan en texto plano
3. **Validaciones**: Se ejecutan antes de procesar la lógica de negocio
4. **Roles**: Por defecto todos los usuarios tienen rol "user"
5. **Autenticación**: Todos los endpoints requieren API Key excepto `/api/auth`

## 🔄 Flujo de Autenticación

1. **Registro** → Usuario se registra → Recibe API Key única
2. **Login** → Usuario inicia sesión → Recibe API Key
3. **Acceso** → Usuario incluye API Key en requests → Accede a rutas protegidas
4. **Logout** → Usuario cierra sesión → API Key sigue válida

¡El sistema de autenticación con API Keys está listo para usar! 🎉 