# 🐉 API de Mascotas Fantásticas con Mongoose

## 🚀 Migración a MongoDB/Mongoose

Este proyecto ha sido migrado completamente a **MongoDB** usando **Mongoose** como ODM (Object Document Mapper).

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio:**
```bash
git clone <tu-repositorio>
cd api-superheroes
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar .env con tu configuración
```

## ⚙️ Configuración de Base de Datos

### Opción 1: MongoDB Local
```env
MONGODB_URI=mongodb://localhost:27017/mascotas_fantasticas
```

### Opción 2: MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 🧪 Pruebas

### Probar la conexión a MongoDB
```bash
node testMongoose.js
```

### Probar endpoints específicos
```bash
node testEnfermedadesCompleto.js
node testPelosEstomago.js
node testEstadosMascota.js
```

## 📊 Nuevas Características con Mongoose

### 🏗️ Esquema Robusto
- **Validación automática** de datos
- **Tipos de datos** estrictos
- **Índices** para mejor rendimiento
- **Virtuals** para propiedades calculadas

### 🔍 Búsquedas Avanzadas
```javascript
// Buscar mascotas vivas
const vivas = await Mascota.findVivas();

// Buscar mascotas enfermas
const enfermas = await Mascota.findEnfermas();

// Buscar por tipo
const dragones = await Mascota.findByTipo('dragon');
```

### 📈 Estadísticas Automáticas
```javascript
// Obtener estadísticas generales
const stats = await mascotaRepository.obtenerEstadisticas();

// Obtener mascotas con variaciones
const conVariaciones = await mascotaRepository.obtenerMascotasConVariaciones();
```

### 🏥 Sistema de Enfermedades Mejorado
- **Historial completo** de enfermedades
- **Fechas de inicio y fin**
- **Tratamientos aplicados**
- **Síntomas registrados**

### 🐾 Estados Descriptivos
- **Estados booleanos**: `tieneHambre`, `tieneSed`, etc.
- **Estados descriptivos**: `estadoHambre`, `estadoSed`, etc.
- **Actualización automática** de estados

## 🛠️ Estructura del Proyecto

```
api-superheroes/
├── config/
│   └── database.js          # Configuración de MongoDB
├── models/
│   ├── mascotaSchema.js     # Esquema de Mongoose
│   └── mascotaModel.js      # Modelo anterior (legacy)
├── repositories/
│   └── mascotaRepository.js # Operaciones de base de datos
├── controllers/
│   └── mascotaController.js # Controladores actualizados
├── services/
│   └── mascotaService.js    # Servicios (legacy)
├── testMongoose.js          # Pruebas de Mongoose
└── app.js                   # Aplicación principal
```

## 🔄 Migración de Datos

Si tienes datos en el sistema anterior, puedes migrarlos:

```javascript
// Ejemplo de migración
const mascotaLegacy = {
    id: 1,
    nombre: "Fuego",
    tipo: "dragon",
    // ... otros campos
};

const mascotaMongoose = new Mascota({
    nombre: mascotaLegacy.nombre,
    tipo: mascotaLegacy.tipo,
    // ... mapear campos
});

await mascotaMongoose.save();
```

## 📚 Endpoints Disponibles

### Mascotas
- `GET /api/mascotas` - Obtener todas las mascotas
- `POST /api/mascotas` - Crear nueva mascota
- `GET /api/mascotas/:id` - Obtener mascota por ID
- `PUT /api/mascotas/:id` - Actualizar mascota
- `DELETE /api/mascotas/:id` - Eliminar mascota

### Cuidado de Mascotas
- `POST /api/mascotas/:id/alimentar` - Alimentar mascota
- `POST /api/mascotas/:id/agua` - Dar agua
- `POST /api/mascotas/:id/descansar` - Hacer descansar
- `POST /api/mascotas/:id/ejercitar` - Ejercitar

### Sistema de Enfermedades
- `POST /api/mascotas/:id/enfermar` - Agregar enfermedad
- `POST /api/mascotas/:id/curar` - Curar enfermedad
- `GET /api/mascotas/:id/enfermedades` - Ver enfermedades

### Problemas de Pelo
- `POST /api/mascotas/:id/cepillar` - Cepillar pelo
- `POST /api/mascotas/:id/tratamiento-pelo` - Aplicar tratamiento
- `GET /api/mascotas/:id/problemas-pelo` - Ver problemas de pelo

## 🔍 Ejemplos de Uso

### Crear una Mascota
```bash
curl -X POST http://localhost:3001/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Fuego",
    "tipo": "dragon",
    "elemento": "fuego",
    "poder": "Lanzar llamas"
  }'
```

### Alimentar una Mascota
```bash
curl -X POST http://localhost:3001/api/mascotas/[ID]/alimentar \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 30}'
```

### Agregar Enfermedad
```bash
curl -X POST http://localhost:3001/api/mascotas/[ID]/enfermar \
  -H "Content-Type: application/json" \
  -d '{"tipo": "gripe"}'
```

## 🚨 Solución de Problemas

### Error de Conexión
```bash
# Verificar que MongoDB esté corriendo
mongod --version

# Verificar la URL de conexión
echo $MONGODB_URI
```

### Error de Validación
```bash
# Verificar el esquema
node -e "console.log(require('./models/mascotaSchema.js'))"
```

### Error de Permisos (MongoDB Atlas)
- Verificar que la IP esté en la whitelist
- Verificar credenciales de usuario
- Verificar que el usuario tenga permisos de lectura/escritura

## 📈 Monitoreo

### Logs de Conexión
```javascript
mongoose.connection.on('connected', () => {
    console.log('✅ Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});
```

### Métricas de Rendimiento
```javascript
// Obtener estadísticas de la base de datos
const stats = await mongoose.connection.db.stats();
console.log('📊 Estadísticas de DB:', stats);
```

## 🔮 Próximas Mejoras

- [ ] **Índices compuestos** para búsquedas complejas
- [ ] **Agregaciones** para reportes avanzados
- [ ] **Transacciones** para operaciones complejas
- [ ] **Caché** con Redis
- [ ] **Backup automático** de datos
- [ ] **Migración de datos** automatizada

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs del servidor
2. Verifica la conexión a MongoDB
3. Ejecuta las pruebas: `node testMongoose.js`
4. Consulta la documentación de Mongoose
5. Abre un issue en el repositorio

---

**¡Disfruta cuidando de tus mascotas fantásticas con MongoDB! 🐉✨** 