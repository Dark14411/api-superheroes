# API Superheroes 🦸‍♂️

API REST para gestión de mascotas fantásticas y superheroes, construida con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación JWT**: Sistema de autenticación seguro
- **API Key Authentication**: Autenticación por API Key
- **MongoDB Atlas**: Base de datos en la nube
- **Mongoose ODM**: Modelado de datos robusto
- **Validación de datos**: Middleware de validación
- **CORS habilitado**: Acceso desde diferentes dominios

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- MongoDB Atlas (cuenta gratuita)
- npm o yarn

## 🛠️ Instalación

1. **Clona el repositorio:**
```bash
git clone <tu-repositorio-url>
cd api-superheroes
```

2. **Instala las dependencias:**
```bash
npm install
```

3. **Configura las variables de entorno:**
```bash
cp env.example .env
```

4. **Edita el archivo `.env` con tus credenciales:**
```env
MONGODB_URI=tu_string_de_conexion_mongodb_atlas
JWT_SECRET=tu_jwt_secret_super_seguro
API_KEY_AUTH_ENABLED=true
USECURS_API_KEY=tu_usecurs_api_key
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📚 Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Obtener perfil del usuario

### Mascotas Fantásticas
- `GET /mascotas` - Obtener todas las mascotas
- `POST /mascotas` - Crear nueva mascota
- `GET /mascotas/:id` - Obtener mascota por ID
- `PUT /mascotas/:id` - Actualizar mascota
- `DELETE /mascotas/:id` - Eliminar mascota

### Superheroes
- `GET /superheroes` - Obtener todos los superheroes
- `POST /superheroes` - Crear nuevo superheroe
- `GET /superheroes/:id` - Obtener superheroe por ID
- `PUT /superheroes/:id` - Actualizar superheroe
- `DELETE /superheroes/:id` - Eliminar superheroe

## 🔐 Autenticación

### JWT Token
Incluye el token en el header:
```
Authorization: Bearer <tu-jwt-token>
```

### API Key
Incluye la API key en el header o query parameter:
```
X-API-Key: <tu-api-key>
```
o
```
?apiKey=<tu-api-key>
```

## 🗄️ Base de Datos

El proyecto utiliza MongoDB Atlas con las siguientes colecciones:
- `users` - Usuarios del sistema
- `mascotas` - Mascotas fantásticas
- `superheroes` - Superheroes
- `enfermedades` - Enfermedades de mascotas
- `estados` - Estados de mascotas

## 🧪 Scripts de Utilidad

- `npm run seed` - Poblar la base de datos con datos de ejemplo
- `npm run migrate` - Migrar datos existentes
- `npm run fix-indexes` - Arreglar índices de la base de datos

## 🌐 Despliegue

### Render
1. Conecta tu repositorio de GitHub a Render
2. Configura las variables de entorno en Render
3. Deploy automático en cada push

### Variables de entorno para producción:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://carlitoseuan2002:Cooper2024@cluster0.mlzaawc.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tu_jwt_secret_super_seguro_2024_produccion
API_KEY_AUTH_ENABLED=true
API_KEY_HEADER_NAME=X-API-Key
API_KEY_QUERY_PARAM=apiKey
API_KEY_REQUIRED=true
JWT_EXPIRES_IN=24h
USECURS_ENABLED=true
USECURS_URL=https://api.usecurs.com
USECURS_API_KEY=tu_usecurs_api_key
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio. 