import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mascota from './models/mascotaSchema.js';

// Cargar variables de entorno
dotenv.config();

// ID del usuario (extraído del token JWT)
const USER_ID = '687a828146b28b4a2b7231f6';

// Datos de mascotas de prueba
const mascotasPrueba = [
    {
        propietarioId: USER_ID,
        nombre: "Fuego",
        tipo: "dragon",
        elemento: "fuego",
        poder: "Lanzar bolas de fuego devastadoras",
        energia: 100,
        felicidad: 95,
        hambre: 10,
        sed: 15,
        cansancio: 5,
        estres: 8
    },
    {
        propietarioId: USER_ID,
        nombre: "Aurora",
        tipo: "fenix",
        elemento: "fuego",
        poder: "Renacimiento eterno y curación",
        energia: 100,
        felicidad: 100,
        hambre: 5,
        sed: 8,
        cansancio: 2,
        estres: 3
    },
    {
        propietarioId: USER_ID,
        nombre: "Estrella",
        tipo: "unicornio",
        elemento: "luz",
        poder: "Cuerno mágico curativo y purificador",
        energia: 95,
        felicidad: 98,
        hambre: 12,
        sed: 10,
        cansancio: 8,
        estres: 5
    },
    {
        propietarioId: USER_ID,
        nombre: "Tormenta",
        tipo: "grifo",
        elemento: "aire",
        poder: "Control del viento y vuelo supersónico",
        energia: 90,
        felicidad: 92,
        hambre: 18,
        sed: 20,
        cansancio: 12,
        estres: 7
    },
    {
        propietarioId: USER_ID,
        nombre: "Veneno",
        tipo: "basilisco",
        elemento: "veneno",
        poder: "Mirada petrificante y veneno mortal",
        energia: 85,
        felicidad: 88,
        hambre: 25,
        sed: 22,
        cansancio: 15,
        estres: 10
    },
    {
        propietarioId: USER_ID,
        nombre: "Oceana",
        tipo: "sirena",
        elemento: "agua",
        poder: "Control de los mares y canto hipnótico",
        energia: 100,
        felicidad: 96,
        hambre: 8,
        sed: 5,
        cansancio: 6,
        estres: 4
    },
    {
        propietarioId: USER_ID,
        nombre: "Valiente",
        tipo: "centauro",
        elemento: "tierra",
        poder: "Fuerza sobrehumana y arco mágico",
        energia: 95,
        felicidad: 94,
        hambre: 15,
        sed: 18,
        cansancio: 10,
        estres: 6
    },
    {
        propietarioId: USER_ID,
        nombre: "Furia",
        tipo: "minotauro",
        elemento: "tierra",
        poder: "Fuerza bruta y resistencia extrema",
        energia: 100,
        felicidad: 90,
        hambre: 30,
        sed: 25,
        cansancio: 20,
        estres: 12
    },
    {
        propietarioId: USER_ID,
        nombre: "Caos",
        tipo: "quimera",
        elemento: "oscuridad",
        poder: "Múltiples cabezas con diferentes poderes",
        energia: 88,
        felicidad: 85,
        hambre: 22,
        sed: 28,
        cansancio: 18,
        estres: 15
    },
    {
        propietarioId: USER_ID,
        nombre: "Hydra",
        tipo: "hidra",
        elemento: "agua",
        poder: "Regeneración de cabezas y respiración acuática",
        energia: 92,
        felicidad: 87,
        hambre: 20,
        sed: 12,
        cansancio: 14,
        estres: 9
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

async function crearMascotas() {
    try {
        console.log('🐉 Iniciando creación de mascotas...');
        
        // Limpiar mascotas existentes del usuario
        await Mascota.deleteMany({ propietarioId: USER_ID });
        console.log('🧹 Mascotas existentes eliminadas');
        
        // Crear nuevas mascotas
        const mascotasCreadas = await Mascota.insertMany(mascotasPrueba);
        
        console.log(`✅ ${mascotasCreadas.length} mascotas creadas exitosamente:`);
        
        mascotasCreadas.forEach((mascota, index) => {
            console.log(`   ${index + 1}. ${mascota.nombre} (${mascota.tipo}) - ${mascota.elemento}`);
        });
        
        console.log('\n🎉 ¡Todas las mascotas han sido creadas!');
        console.log('🔗 Ahora puedes verlas en: http://localhost:3001/api/mascotas');
        console.log('📚 Documentación: http://localhost:3001/api-docs');
        
    } catch (error) {
        console.error('❌ Error creando mascotas:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
    }
}

// Ejecutar el script
conectarDB().then(crearMascotas); 