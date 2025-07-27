# 🎮 **MI POU UNIFICADO** 

> **Un juego de mascota virtual inspirado en Pou con integración de superhéroes**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 **DESCRIPCIÓN**

**Mi Pou Unificado** es una aplicación web moderna que combina la experiencia de cuidado de mascotas virtuales (estilo Pou) con un sistema de superhéroes y tienda virtual. Desarrollada con Next.js 15, React 19 y TypeScript.

### **🌟 Características Principales:**

- 🐾 **Sistema de Mascotas Virtuales** - Cuida a tu Pou con alimentación, juego y cuidado
- 🦸‍♂️ **Gestión de Superhéroes** - Crea y personaliza héroes con poderes únicos
- 🛒 **Tienda Virtual** - Compra items, comida y juguetes con monedas virtuales
- 🏠 **Sistema de Adopción** - Adopta mascotas fantásticas para tus héroes
- 🎨 **Interfaz Moderna** - Diseño AAA con animaciones fluidas y UX intuitiva
- 🔐 **Autenticación Completa** - Sistema de login/register con JWT
- 📱 **Responsive Design** - Funciona perfectamente en móvil y desktop

---

## 🚀 **INSTALACIÓN Y USO**

### **📋 Prerrequisitos:**
- Node.js 18+ 
- npm o yarn
- Git

### **🔧 Instalación:**

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mi-pou-unificado.git
cd mi-pou-unificado

# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev
```

### **🌐 Acceso:**
- **Desarrollo:** http://localhost:3000
- **Producción:** [URL de tu deploy]

---

## 🎮 **CÓMO JUGAR**

### **1. 🏠 Pantalla de Bienvenida**
- Animación de introducción con tu Pou
- Opciones de login, registro o "Usuario Demo"

### **2. 🐾 Cuidado de Pou**
- **Alimentar** - Mantén a tu Pou bien nutrido
- **Jugar** - Aumenta su felicidad y energía
- **Curar** - Restaura su salud cuando esté enfermo
- **Limpiar** - Mantén a tu Pou aseado
- **Dormir** - Recupera energía durante el descanso

### **3. 🦸‍♂️ Gestión de Héroes**
- **Crear Héroe** - Diseña tu superhéroe personalizado
- **Atributos** - Salud, energía, fuerza, velocidad, felicidad
- **Poderes** - Asigna habilidades especiales
- **Nivel** - Sube de nivel ganando experiencia

### **4. 🛒 Tienda Virtual**
- **Comida** - Alimentos para tu Pou y héroes
- **Juguetes** - Items para aumentar felicidad
- **Equipamiento** - Mejoras para héroes
- **Monedas** - Sistema de economía virtual

### **5. 🏠 Adopción de Mascotas**
- **Especies Fantásticas** - Dragones, unicornios, fénix
- **Cuidado Especializado** - Cada mascota tiene necesidades únicas
- **Compañerismo** - Las mascotas mejoran las stats de los héroes

---

## 🏗️ **ARQUITECTURA TÉCNICA**

### **📁 Estructura del Proyecto:**
```
mi-pou-unificado/
├── 📂 app/                    # Next.js App Router
│   ├── page.tsx              # Página principal
│   └── layout.tsx            # Layout global
├── 📂 components/            # Componentes React
│   ├── 📂 ui/               # Componentes de UI (shadcn)
│   ├── 📂 auth/             # Autenticación
│   ├── enhanced-pou-game.tsx # Juego principal de Pou
│   └── welcome-screen.tsx   # Pantalla de bienvenida
├── 📂 lib/                   # Librerías y utilidades
│   ├── unified-api-client.ts # API unificada
│   ├── game-engine.ts       # Motor del juego
│   └── utils.ts             # Utilidades
├── 📂 scripts/              # Scripts de base de datos
│   └── database-schema.sql  # Esquema completo
└── package.json             # Dependencias
```

### **🔧 Tecnologías Utilizadas:**
- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Animaciones:** Framer Motion
- **Estado:** React Hooks, Context API
- **API:** REST API con JWT Authentication
- **Base de Datos:** MongoDB (backend separado)

---

## 📡 **INTEGRACIÓN API**

### **🔗 Backend URL:**
```
https://api-superheroes-hkbl.onrender.com/api
```

### **📋 Endpoints Principales:**
- `POST /auth/login` - Autenticación de usuarios
- `POST /auth/register` - Registro de usuarios
- `GET /heroes` - Lista de superhéroes
- `GET /mascotas` - Lista de mascotas
- `GET /items` - Items de la tienda
- `POST /adopcion` - Sistema de adopción

---

## 🎨 **CARACTERÍSTICAS VISUALES**

### **🎯 Diseño AAA:**
- **Interfaz Moderna** - Diseño limpio y profesional
- **Animaciones Fluidas** - Transiciones suaves con Framer Motion
- **Responsive** - Adaptable a todos los dispositivos
- **Tema Oscuro/Claro** - Soporte para preferencias de usuario
- **Iconografía Clara** - Iconos intuitivos y reconocibles

### **🎮 Experiencia de Usuario:**
- **Feedback Inmediato** - Respuestas instantáneas a acciones
- **Progresión Clara** - Sistema de niveles y recompensas
- **Navegación Intuitiva** - Menú lateral organizado por categorías
- **Estados Visuales** - Indicadores claros de salud, felicidad, etc.

---

## 🚀 **DEPLOY**

### **📦 Build de Producción:**
```bash
npm run build
npm start
```

### **☁️ Plataformas Soportadas:**
- **Vercel** - Deploy automático desde GitHub
- **Netlify** - Deploy con drag & drop
- **Railway** - Deploy con integración Git
- **Heroku** - Deploy tradicional

---

## 🤝 **CONTRIBUCIÓN**

### **📝 Cómo Contribuir:**
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **🐛 Reportar Bugs:**
- Usa el sistema de Issues de GitHub
- Incluye pasos para reproducir el problema
- Adjunta capturas de pantalla si es necesario

---

## 📄 **LICENCIA**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 **AUTOR**

**Desarrollado con ❤️ por [Tu Nombre]**

- **GitHub:** [@tu-usuario](https://github.com/tu-usuario)
- **LinkedIn:** [Tu LinkedIn](https://linkedin.com/in/tu-perfil)
- **Portfolio:** [Tu Portfolio](https://tu-portfolio.com)

---

## 🙏 **AGRADECIMIENTOS**

- **Next.js Team** - Por el increíble framework
- **Tailwind CSS** - Por el sistema de diseño
- **shadcn/ui** - Por los componentes hermosos
- **Framer Motion** - Por las animaciones fluidas
- **Comunidad Open Source** - Por toda la inspiración

---

## 📊 **ESTADÍSTICAS DEL PROYECTO**

![GitHub stars](https://img.shields.io/github/stars/tu-usuario/mi-pou-unificado?style=social)
![GitHub forks](https://img.shields.io/github/forks/tu-usuario/mi-pou-unificado?style=social)
![GitHub issues](https://img.shields.io/github/issues/tu-usuario/mi-pou-unificado)
![GitHub pull requests](https://img.shields.io/github/issues-pr/tu-usuario/mi-pou-unificado)
![GitHub license](https://img.shields.io/github/license/tu-usuario/mi-pou-unificado)

---

**⭐ ¡Dale una estrella si te gustó el proyecto! ⭐** 