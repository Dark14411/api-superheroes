# 🦸‍♂️ API de Superhéroes y Mascotas

Una API REST completa para gestionar superhéroes y sus mascotas fantásticas, con sistema de autenticación por API Keys, adopción única y documentación Swagger.

## 🚀 Características

* **🔐 Sistema de Autenticación** con API Keys únicas por usuario
* **CRUD completo** para Héroes, Mascotas e Items
* **Sistema de adopción única** - Una mascota por héroe
* **30 mascotas fantásticas** predefinidas con sistema de cuidado realista
* **Documentación Swagger** interactiva con candados de seguridad
* **Validaciones completas** de datos
* **Búsqueda por ciudad** de héroes
* **Sistema de enfrentamientos** contra villanos
* **CORS configurado** para desarrollo frontend
* **Sistema de enfermedades** y curación de mascotas

## 🔐 Sistema de Autenticación

### Registro y Login
- **Registro**: Solo requiere `username` y `password` (mínimo 3 caracteres)
- **Login**: Devuelve API Key única para el usuario
- **API Key**: Formato `user_<hash>_<timestamp>`

### Endpoints de Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión y obtener API Key |
| GET | `/api/auth/profile` | Obtener perfil del usuario |
| POST | `/api/auth/logout` | Cerrar sesión |

## 📋 Endpoints Disponibles

### 🔐 Autenticación (4 endpoints)
| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| POST | `/api/auth/register` | ❌ | Registrar nuevo usuario |
| POST | `/api/auth/login` | ❌ | Iniciar sesión |
| GET | `/api/auth/profile` | ✅ | Obtener perfil |
| POST | `/api/auth/logout` | ✅ | Cerrar sesión |

### 🦸‍♂️ Héroes (9 endpoints)
| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| GET | `/api/heroes` | ✅ | Obtener todos los héroes |
| GET | `/api/heroes/{id}` | ✅ | Obtener héroe por ID |
| GET | `/api/heroes/city/{city}` | ✅ | Buscar héroes por ciudad |
| POST | `/api/heroes` | ✅ | Crear nuevo héroe |
| PUT | `/api/heroes/{id}` | ✅ | Actualizar héroe |
| DELETE | `/api/heroes/{id}` | ✅ | Eliminar héroe |
| POST | `/api/heroes/{id}/enfrentar` | ✅ | Enfrentar villano |
| POST | `/api/heroes/{id}/adoptar` | ✅ | Adoptar mascota |
| POST | `/api/heroes/{id}/abandonar` | ✅ | Abandonar mascota |

### 🐉 Mascotas (8 endpoints)
| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| GET | `/api/mascotas` | ✅ | Obtener todas las mascotas |
| GET | `/api/mascotas/{id}` | ✅ | Obtener mascota por ID |
| POST | `/api/mascotas` | ✅ | Crear nueva mascota |
| PUT | `/api/mascotas/{id}` | ✅ | Actualizar mascota |
| DELETE | `/api/mascotas/{id}` | ✅ | Eliminar mascota |
| POST | `/api/mascotas/{id}/pasear` | ✅ | Pasear mascota |
| POST | `/api/mascotas/{id}/alimentar` | ✅ | Alimentar mascota |
| POST | `/api/mascotas/{id}/enfermar` | ✅ | Enfermar mascota |
| POST | `/api/mascotas/{id}/curar` | ✅ | Curar enfermedad |

### 🎁 Items (8 endpoints)
| Método | Endpoint | Protegido | Descripción |
|--------|----------|-----------|-------------|
| GET | `/api/items` | ✅ | Obtener todos los items |
| GET | `/api/items/{id}` | ✅ | Obtener item por ID |
| POST | `/api/items` | ✅ | Crear nuevo item |
| PUT | `/api/items/{id}` | ✅ | Actualizar item |
| DELETE | `/api/items/{id}` | ✅ | Eliminar item |
| GET | `/api/items/estadisticas` | ✅ | Estadísticas de items |
| GET | `/api/items/gratuitos` | ✅ | Items gratuitos |
| GET | `/api/items/buscar` | ✅ | Buscar items por nombre |
| GET | `/api/items/tipo/{tipo}` | ✅ | Items por tipo |

## 🛠️ Instalación

### Prerrequisitos

* Node.js (versión 14 o superior)
* npm
* MongoDB (local o Atlas)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Dark14411/superheroes.git
cd superheroes
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env basado en env.example
cp env.example .env

# Editar .env con tus configuraciones
MONGODB_URI=tu_mongodb_connection_string
PORT=3001
NODE_ENV=development
```

4. **Ejecutar el servidor**
```bash
npm start
```

5. **Acceder a la API**
* API Base: http://localhost:3001
* Swagger UI: http://localhost:3001/api-docs

## 🔑 Uso de la API

### 1. Registrarse
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mi_usuario",
    "password": "123"
  }'
```

### 2. Iniciar sesión (obtener API Key)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mi_usuario",
    "password": "123"
  }'
```

### 3. Usar API Key en requests
```bash
curl -X GET http://localhost:3001/api/heroes \
  -H "x-api-key: tu_api_key_aqui"
```

### 4. En Swagger UI
1. Ir a http://localhost:3001/api-docs
2. Hacer clic en "Authorize" (🔒)
3. Pegar tu API Key en el campo "ApiKeyAuth"
4. Hacer clic en "Authorize" y "Close"
5. Probar cualquier endpoint protegido

## 📊 Estructura del Proyecto

```
api-superheroes/
├── controllers/          # Controladores de la API
│   ├── heroController.js
│   ├── mascotaController.js
│   ├── itemController.js
│   └── authController.js
├── models/              # Modelos de datos
│   ├── heroModel.js
│   ├── mascotaModel.js
│   ├── itemModel.js
│   └── User.js
├── middleware/          # Middlewares
│   ├── globalAuth.js
│   └── validations.js
├── routes/             # Rutas
│   └── auth.js
├── repositories/       # Capa de acceso a datos
│   ├── heroRepository.js
│   └── mascotaRepository.js
├── services/          # Lógica de negocio
│   ├── heroService.js
│   └── mascotaService.js
├── utils/             # Utilidades
│   └── apiKeyGenerator.js
├── data/             # Datos JSON
│   ├── superheroes.json
│   └── mascotas.json
├── app.js            # Archivo principal
├── package.json      # Dependencias
└── README.md         # Este archivo
```

## 🎯 Ejemplos de Uso

### Crear un nuevo héroe (con API Key)
```bash
curl -X POST http://localhost:3001/api/heroes \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_api_key_aqui" \
  -d '{
    "name": "Peter Parker",
    "alias": "Spider-Man",
    "city": "Nueva York",
    "team": "Los Vengadores"
  }'
```

### Adoptar una mascota
```bash
curl -X POST http://localhost:3001/api/heroes/1/adoptar \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_api_key_aqui" \
  -d '{
    "mascotaId": 1
  }'
```

### Alimentar una mascota
```bash
curl -X POST http://localhost:3001/api/mascotas/1/alimentar \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_api_key_aqui" \
  -d '{
    "cantidad": 30
  }'
```

## 🔒 Seguridad y Validaciones

### Sistema de Autenticación
* ✅ **API Keys únicas** por usuario
* ✅ **Sin API Key global** - Solo keys de usuario
* ✅ **Autenticación requerida** en todos los endpoints excepto auth
* ✅ **Contraseñas hasheadas** con bcrypt

### Validaciones del Sistema
* ✅ **Adopción única** - Una mascota por héroe
* ✅ **Validación de datos** con express-validator
* ✅ **Sanitización** de inputs
* ✅ **Manejo de errores** detallado

### CORS Configurado
* ✅ **Permite cualquier origen** - `Access-Control-Allow-Origin: *`
* ✅ **Headers de API Key** incluidos
* ✅ **Métodos HTTP completos** soportados

## 🐉 Sistema de Mascotas Avanzado

### Características de las Mascotas
* **30 mascotas fantásticas** predefinidas
* **Sistema de salud y felicidad** (0-100)
* **Estados emocionales** (Sunny, Happy, Sad, Sick, Dead)
* **Sistema de enfermedades** realista
* **Cuidado diario** requerido

### Enfermedades Disponibles
* **Sarna** - Reduce felicidad
* **Gripe** - Reduce salud
* **Pelos en estómago** - Requiere curación
* **Pata rota** - Inmoviliza temporalmente

### Acciones de Cuidado
* **Pasear** - Aumenta felicidad
* **Alimentar** - Sistema realista con riesgo de enfermedades
* **Curar** - Elimina enfermedades específicas

## 🛡️ Tecnologías Utilizadas

* **Node.js** - Runtime de JavaScript
* **Express.js** - Framework web
* **MongoDB** - Base de datos
* **Mongoose** - ODM para MongoDB
* **Swagger** - Documentación de API
* **express-validator** - Validación de datos
* **bcryptjs** - Hashing de contraseñas
* **cors** - Configuración CORS
* **dotenv** - Variables de entorno

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request.

## 📞 Contacto

* **GitHub**: [@Dark14411](https://github.com/Dark14411)
* **Repositorio**: https://github.com/Dark14411/superheroes

---

¡Disfruta gestionando tu universo de superhéroes y mascotas! 🦸‍♂️🐉 