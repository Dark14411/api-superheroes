# 🚀 Guía de Deploy - Frontend Next.js

## 📋 Opciones de Deploy

### 1️⃣ **Vercel (Recomendado)**
```bash
# 1. Ve a vercel.com y conecta tu GitHub
# 2. Importa el repositorio: Dark14411/api-superheroes
# 3. Configura el directorio: api-superheroes/superheroe-interfaz
# 4. Variables de entorno:
NEXT_PUBLIC_API_URL=https://api-superheroes-hkbl.onrender.com
```

### 2️⃣ **Render**
```bash
# 1. Ve a render.com y conecta tu GitHub
# 2. Crea un nuevo Web Service
# 3. Selecciona el repositorio: Dark14411/api-superheroes
# 4. Configuración:
Root Directory: api-superheroes/superheroe-interfaz
Build Command: npm install && npm run build
Start Command: npm start
```

### 3️⃣ **Netlify**
```bash
# 1. Ve a netlify.com y conecta tu GitHub
# 2. Importa el repositorio
# 3. Configuración:
Base directory: api-superheroes/superheroe-interfaz
Build command: npm run build
Publish directory: .next
```

## 🔧 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://api-superheroes-hkbl.onrender.com
NODE_ENV=production
```

## 📁 Estructura del Proyecto

```
api-superheroes/
├── superheroe-interfaz/     # ← Este es el frontend
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── next.config.mjs
└── ... (backend files)
```

## ⚠️ Solución de Problemas

### Error: "Cannot find module app.js"
- **Causa**: Render está buscando el archivo en la raíz
- **Solución**: Configura el directorio correcto: `api-superheroes/superheroe-interfaz`

### Error: "Build failed"
- **Causa**: Dependencias faltantes
- **Solución**: Verifica que `package.json` tenga todas las dependencias

### Error: "API not found"
- **Causa**: Variable de entorno incorrecta
- **Solución**: Configura `NEXT_PUBLIC_API_URL` correctamente

## 🎯 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 🌐 URLs Importantes

- **Backend API**: https://api-superheroes-hkbl.onrender.com
- **Frontend**: (Tu URL de deploy)
- **GitHub**: https://github.com/Dark14411/api-superheroes 