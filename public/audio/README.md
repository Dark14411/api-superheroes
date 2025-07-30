# 🎵 Archivos de Audio - Mi Pou Virtual

## 📁 **Estructura de Archivos**

Este directorio contiene todos los archivos de audio para el juego "Mi Pou Virtual".

### 🎼 **Música de Fondo**
- `background-music.mp3` - Música principal del juego (relajante y alegre)
- `happy-music.mp3` - Música cuando Pou está feliz
- `sleep-music.mp3` - Música para cuando Pou duerme

### 🔊 **Efectos de Sonido**
- `click.mp3` - Sonido de clic en botones
- `coin.mp3` - Sonido de monedas ganadas
- `feed.mp3` - Sonido de alimentar a Pou
- `play.mp3` - Sonido de jugar con Pou
- `clean.mp3` - Sonido de limpiar a Pou
- `achievement.mp3` - Sonido de logro desbloqueado
- `purchase.mp3` - Sonido de compra en la tienda
- `notification.mp3` - Sonido de notificación

## 🎯 **Especificaciones Técnicas**

### **Formato Recomendado:**
- **Formato:** MP3
- **Calidad:** 128-192 kbps
- **Frecuencia:** 44.1 kHz
- **Duración música:** 1-3 minutos (loop)
- **Duración efectos:** 0.5-2 segundos

### **Optimización:**
- Comprimir archivos para web
- Usar nombres descriptivos
- Mantener archivos pequeños (< 1MB cada uno)

## 📝 **Notas de Implementación**

Los archivos de audio se cargan automáticamente al iniciar el juego y se gestionan a través del hook `useAudio`.

### **Uso en el Código:**
```typescript
import { useAudio } from '@/hooks/use-audio'

const { playGameSounds, playGameMusic } = useAudio()

// Reproducir efectos
playGameSounds.click()
playGameSounds.coin()

// Reproducir música
playGameMusic.background()
playGameMusic.happy()
```

## 🚀 **Próximos Pasos**

1. Agregar archivos de audio reales
2. Implementar más variedad de música
3. Agregar efectos específicos para mini-juegos
4. Optimizar para diferentes dispositivos 