import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mascota from './models/mascotaSchema.js';

// Cargar variables de entorno
dotenv.config();

// Datos de mascotas disponibles para adopción
const mascotasDisponibles = [
    {
        nombre: "Relámpago",
        tipo: "dragon",
        elemento: "electricidad",
        poder: "Control de tormentas eléctricas",
        energia: 100,
        felicidad: 85,
        hambre: 20,
        sed: 25,
        cansancio: 15,
        estres: 10,
        adoptada: false
    },
    {
        nombre: "Cristal",
        tipo: "unicornio",
        elemento: "hielo",
        poder: "Crear cristales mágicos y congelar",
        energia: 95,
        felicidad: 90,
        hambre: 15,
        sed: 18,
        cansancio: 8,
        estres: 5,
        adoptada: false
    },
    {
        nombre: "Sombra",
        tipo: "basilisco",
        elemento: "oscuridad",
        poder: "Control de sombras y invisibilidad",
        energia: 88,
        felicidad: 75,
        hambre: 30,
        sed: 28,
        cansancio: 20,
        estres: 15,
        adoptada: false
    },
    {
        nombre: "Coral",
        tipo: "sirena",
        elemento: "agua",
        poder: "Comunicación con criaturas marinas",
        energia: 100,
        felicidad: 95,
        hambre: 10,
        sed: 5,
        cansancio: 5,
        estres: 3,
        adoptada: false
    },
    {
        nombre: "Granito",
        tipo: "centauro",
        elemento: "tierra",
        poder: "Fuerza de montaña y resistencia",
        energia: 100,
        felicidad: 88,
        hambre: 25,
        sed: 30,
        cansancio: 12,
        estres: 8,
        adoptada: false
    },
    {
        nombre: "Volcán",
        tipo: "minotauro",
        elemento: "fuego",
        poder: "Fuerza volcánica y resistencia al fuego",
        energia: 100,
        felicidad: 82,
        hambre: 35,
        sed: 32,
        cansancio: 18,
        estres: 12,
        adoptada: false
    },
    {
        nombre: "Misterio",
        tipo: "quimera",
        elemento: "psiquico",
        poder: "Múltiples personalidades y poderes mentales",
        energia: 92,
        felicidad: 78,
        hambre: 28,
        sed: 35,
        cansancio: 22,
        estres: 18,
        adoptada: false
    },
    {
        nombre: "Torrente",
        tipo: "hidra",
        elemento: "agua",
        poder: "Control de corrientes y regeneración múltiple",
        energia: 95,
        felicidad: 80,
        hambre: 22,
        sed: 15,
        cansancio: 16,
        estres: 10,
        adoptada: false
    },
    {
        nombre: "Viento",
        tipo: "grifo",
        elemento: "aire",
        poder: "Vuelo supersónico y control del viento",
        energia: 98,
        felicidad: 92,
        hambre: 18,
        sed: 22,
        cansancio: 10,
        estres: 6,
        adoptada: false
    },
    {
        nombre: "Aurora",
        tipo: "fenix",
        elemento: "luz",
        poder: "Renacimiento eterno y curación con luz",
        energia: 100,
        felicidad: 98,
        hambre: 8,
        sed: 12,
        cansancio: 4,
        estres: 2,
        adoptada: false
    },
    {
        nombre: "Trueno",
        tipo: "dragon",
        elemento: "electricidad",
        poder: "Generar tormentas y rayos",
        energia: 96,
        felicidad: 87,
        hambre: 24,
        sed: 26,
        cansancio: 14,
        estres: 9,
        adoptada: false
    },
    {
        nombre: "Luna",
        tipo: "unicornio",
        elemento: "luz",
        poder: "Poderes lunares y curación nocturna",
        energia: 94,
        felicidad: 89,
        hambre: 16,
        sed: 19,
        cansancio: 9,
        estres: 6,
        adoptada: false
    },
    {
        nombre: "Némesis",
        tipo: "basilisco",
        elemento: "veneno",
        poder: "Veneno mortal y mirada petrificante",
        energia: 85,
        felicidad: 70,
        hambre: 32,
        sed: 30,
        cansancio: 25,
        estres: 20,
        adoptada: false
    },
    {
        nombre: "Marina",
        tipo: "sirena",
        elemento: "agua",
        poder: "Control de los océanos profundos",
        energia: 100,
        felicidad: 93,
        hambre: 12,
        sed: 8,
        cansancio: 6,
        estres: 4,
        adoptada: false
    },
    {
        nombre: "Roca",
        tipo: "centauro",
        elemento: "tierra",
        poder: "Fuerza de roca y resistencia extrema",
        energia: 100,
        felicidad: 85,
        hambre: 28,
        sed: 33,
        cansancio: 15,
        estres: 10,
        adoptada: false
    }
];

async function conectarDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

async function crearMascotasDisponibles() {
    try {
        console.log('🐉 Iniciando creación de mascotas disponibles para adopción...');
        
        // Crear nuevas mascotas disponibles
        const mascotasCreadas = await Mascota.insertMany(mascotasDisponibles);
        
        console.log(`✅ ${mascotasCreadas.length} mascotas disponibles creadas exitosamente:`);
        
        mascotasCreadas.forEach((mascota, index) => {
            console.log(`   ${index + 1}. ${mascota.nombre} (${mascota.tipo}) - ${mascota.elemento} - DISPONIBLE`);
        });
        
        console.log('\n🎉 ¡Todas las mascotas disponibles han sido creadas!');
        console.log('🔗 Puedes verlas en: http://localhost:3001/api/mascotas/disponibles');
        console.log('📚 Documentación: http://localhost:3001/api-docs');
        console.log('💡 Para adoptar una mascota, usa: POST /api/mascotas/{id}/adoptar');
        
    } catch (error) {
        console.error('❌ Error creando mascotas disponibles:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
}

// Ejecutar el script
conectarDB().then(crearMascotasDisponibles); 