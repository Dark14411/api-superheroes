# 🛍️ Tienda de Pou - Superhéroes Interactivos

## Descripción

Esta es una interfaz de tienda inspirada en el juego Pou, integrada con el sistema de superhéroes existente. La interfaz combina la estética amigable de Pou con funcionalidades de tienda completas.

## 🎯 Características Principales

### 🏪 Tienda de Pou
- **Interfaz inspirada en Pou**: Diseño colorido y amigable con el personaje Pou animado
- **Sistema de monedas**: Monedas virtuales para comprar items
- **Carrito de compras**: Agregar, remover y gestionar items
- **Búsqueda y filtros**: Encontrar items por categoría o nombre
- **Detalles de items**: Ver estadísticas y efectos de cada item

### 🦸 Integración con Superhéroes
- **Dashboard de héroes**: Gestionar superhéroes existentes
- **Juego de superhéroes**: Sistema de juego integrado
- **Juego de Pou**: Versión moderna del juego de mascotas
- **Navegación por pestañas**: Cambiar fácilmente entre diferentes secciones

## 🎮 Funcionalidades de la Tienda

### Items Disponibles
- **Armas**: Espadas, arcos, varitas mágicas
- **Armaduras**: Protección y defensa
- **Accesorios**: Coronas, capas, collares
- **Mascotas**: Dragones, unicornios, mascotas especiales
- **Comida**: Alimentos mágicos y potenciadores
- **Pociones**: Curación y efectos especiales
- **Cosméticos**: Personalización visual

### Sistema de Rareza
- **Común** (Gris): Items básicos
- **Raro** (Azul): Items mejorados
- **Épico** (Púrpura): Items poderosos
- **Legendario** (Dorado): Items únicos

### Características del Personaje Pou
- **Animaciones**: Expresiones y movimientos realistas
- **Estados de ánimo**: Feliz, triste, emocionado, dormido
- **Interactividad**: Responde a las acciones del usuario
- **Personalización**: Cambio de colores y accesorios

## 🚀 Cómo Usar

### 1. Iniciar la Aplicación
```bash
cd api-superheroes/superheroe-interfaz
npm run dev
```

### 2. Navegar por las Pestañas
- **🏪 Tienda de Pou**: Comprar items y gestionar inventario
- **🦸 Dashboard de Héroes**: Ver y gestionar superhéroes
- **🎮 Juego de Pou**: Jugar con la mascota virtual
- **⚔️ Juego de Superhéroes**: Sistema de juego principal

### 3. Usar la Tienda
1. **Buscar Items**: Usar la barra de búsqueda
2. **Filtrar por Categoría**: Seleccionar tipo de item
3. **Ver Detalles**: Hacer clic en "Ver" para más información
4. **Agregar al Carrito**: Hacer clic en "Comprar"
5. **Finalizar Compra**: Ir al carrito y confirmar

### 4. Gestionar el Carrito
- **Agregar Items**: Hacer clic en "Comprar"
- **Cambiar Cantidad**: Usar botones + y -
- **Remover Items**: Hacer clic en X
- **Ver Total**: Monedas necesarias para la compra

## 🎨 Diseño y Estética

### Colores Principales
- **Amarillo**: Color principal de Pou
- **Naranja**: Acentos y gradientes
- **Verde**: Botones de acción positiva
- **Azul**: Información y efectos
- **Púrpura**: Items épicos

### Animaciones
- **Framer Motion**: Transiciones suaves
- **Hover Effects**: Interactividad visual
- **Loading States**: Indicadores de carga
- **Success Animations**: Confirmación de acciones

## 🔧 Tecnologías Utilizadas

- **Next.js 15**: Framework de React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos y diseño
- **Framer Motion**: Animaciones
- **Lucide React**: Iconos
- **Radix UI**: Componentes accesibles

## 📁 Estructura de Archivos

```
superheroe-interfaz/
├── app/
│   ├── page.tsx              # Página principal con navegación
│   └── layout.tsx            # Layout de la aplicación
├── components/
│   ├── ui/                   # Componentes de UI
│   └── realistic-pet.tsx     # Componente de mascota
├── lib/
│   ├── api.ts               # API para superhéroes y mascotas
│   └── game-engine.ts       # Motor del juego
├── pou-store-interface.tsx  # Interfaz principal de la tienda
├── superhero-dashboard.tsx  # Dashboard de superhéroes
├── modern-pou-game.tsx      # Juego de Pou
└── superhero-game.tsx       # Juego de superhéroes
```

## 🎯 Próximas Mejoras

- [ ] **Sistema de Logros**: Desbloquear logros por compras
- [ ] **Eventos Especiales**: Ofertas y descuentos temporales
- [ ] **Inventario Personal**: Gestionar items comprados
- [ ] **Sistema de Niveles**: Progresión del personaje Pou
- [ ] **Multiplayer**: Comprar con amigos
- [ ] **Notificaciones**: Alertas de ofertas y eventos

## 🐛 Solución de Problemas

### Error de Importación
Si hay errores de importación, verificar que todos los archivos estén en las rutas correctas.

### Problemas de Estilos
Asegurarse de que Tailwind CSS esté configurado correctamente.

### Errores de API
Verificar que el servidor backend esté ejecutándose.

## 📞 Soporte

Para problemas o preguntas sobre la interfaz de tienda de Pou, revisar:
1. Los logs de la consola del navegador
2. Los logs del servidor de desarrollo
3. La documentación de las dependencias utilizadas

---

**¡Disfruta explorando la Tienda de Pou! 🛍️✨** 