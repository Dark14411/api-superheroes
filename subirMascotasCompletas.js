import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar dotenv
dotenv.config();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar el modelo de mascota
import Mascota from './models/mascotaSchema.js';

// Conectar a MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Función para limpiar la base de datos
const limpiarBaseDeDatos = async () => {
    try {
        await Mascota.deleteMany({});
        console.log('🗑️ Base de datos limpiada');
    } catch (error) {
        console.error('❌ Error limpiando base de datos:', error);
    }
};

// Función para subir mascotas
const subirMascotas = async () => {
    try {
        // Leer el archivo JSON
        const mascotasPath = path.join(__dirname, 'data', 'mascotas.json');
        const mascotasData = JSON.parse(fs.readFileSync(mascotasPath, 'utf8'));
        
        console.log(`📖 Leyendo ${mascotasData.length} mascotas del archivo JSON...`);
        
        // Preparar las mascotas para la base de datos
        const mascotasParaSubir = mascotasData.map((mascota, index) => {
            // Generar nombre si no existe
            const nombre = mascota.nombre || `${mascota.tipo}${index + 1}`;
            
            // Generar poder si no existe
            const poder = mascota.poder || `Poder de ${mascota.tipo}`;
            
            // Normalizar valores
            const energia = Math.max(0, Math.min(100, mascota.energia || 100));
            const felicidad = Math.max(0, Math.min(100, mascota.felicidad || 100));
            const hambre = Math.max(0, Math.min(100, mascota.hambre || 0));
            const sed = Math.max(0, Math.min(100, mascota.sed || 0));
            const cansancio = Math.max(0, Math.min(100, mascota.cansancio || 0));
            const estres = Math.max(0, Math.min(100, mascota.estres || 0));
            
            // Calcular estados
            const tieneHambre = hambre > 50;
            const tieneSed = sed > 50;
            const estaCansado = cansancio > 50;
            const estaEstresado = estres > 50;
            
            // Estados descriptivos
            const estadoHambre = hambre <= 20 ? "Saciado" : hambre <= 50 ? "Normal" : "Hambriento";
            const estadoSed = sed <= 20 ? "Hidratado" : sed <= 50 ? "Normal" : "Sediento";
            const estadoCansancio = cansancio <= 20 ? "Descansado" : cansancio <= 50 ? "Normal" : "Cansado";
            const estadoEstres = estres <= 20 ? "Tranquilo" : estres <= 50 ? "Normal" : "Estresado";
            const estadoEnergia = energia >= 80 ? "Lleno de energía" : energia >= 50 ? "Normal" : "Bajo de energía";
            const estadoFelicidad = felicidad >= 80 ? "Muy feliz" : felicidad >= 50 ? "Contento" : "Triste";
            
            // Calcular salud general
            const saludGeneral = Math.round((energia + felicidad + (100 - hambre) + (100 - sed) + (100 - cansancio) + (100 - estres)) / 6);
            
            return {
                id: mascota.id,
                nombre: nombre,
                tipo: mascota.tipo.toLowerCase(),
                elemento: mascota.elemento.toLowerCase(),
                poder: poder,
                energia: energia,
                felicidad: felicidad,
                hambre: hambre,
                sed: sed,
                cansancio: cansancio,
                estres: estres,
                tieneHambre: tieneHambre,
                tieneSed: tieneSed,
                estaCansado: estaCansado,
                estaEstresado: estaEstresado,
                estadoHambre: estadoHambre,
                estadoSed: estadoSed,
                estadoCansancio: estadoCansancio,
                estadoEstres: estadoEstres,
                estadoEnergia: estadoEnergia,
                estadoFelicidad: estadoFelicidad,
                muerto: mascota.muerto || false,
                fechaMuerte: mascota.fechaMuerte || null,
                causaMuerte: mascota.causaMuerte || null,
                vulnerabilidades: mascota.vulnerabilidades || [],
                fortalezas: mascota.fortalezas || [],
                ultimaComida: mascota.ultimaComida || null,
                ultimaBebida: mascota.ultimaBebida || null,
                ultimoDescanso: mascota.ultimoDescanso || null,
                ultimoEjercicio: mascota.ultimoEjercicio || null,
                enfermedades: mascota.enfermedades || [],
                fechaCreacion: mascota.fechaCreacion || new Date(),
                fechaUltimaActualizacion: mascota.fechaUltimaActualizacion || new Date(),
                adoptada: false, // Todas las mascotas empiezan como disponibles
                propietarioId: null, // Sin propietario inicialmente
                fechaAdopcion: null
            };
        });
        
        console.log(`🔄 Preparando ${mascotasParaSubir.length} mascotas para subir...`);
        
        // Subir mascotas a la base de datos
        const resultado = await Mascota.insertMany(mascotasParaSubir);
        
        console.log(`✅ ${resultado.length} mascotas subidas exitosamente a la base de datos`);
        
        // Mostrar estadísticas
        const totalMascotas = await Mascota.countDocuments();
        const mascotasDisponibles = await Mascota.countDocuments({ adoptada: false });
        const mascotasAdoptadas = await Mascota.countDocuments({ adoptada: true });
        
        console.log('\n📊 Estadísticas de la base de datos:');
        console.log(`   Total mascotas: ${totalMascotas}`);
        console.log(`   Mascotas disponibles: ${mascotasDisponibles}`);
        console.log(`   Mascotas adoptadas: ${mascotasAdoptadas}`);
        
        // Mostrar algunos ejemplos
        console.log('\n🐉 Ejemplos de mascotas subidas:');
        const ejemplos = await Mascota.find().limit(5).select('id nombre tipo elemento poder energia felicidad');
        ejemplos.forEach(mascota => {
            console.log(`   ID ${mascota.id}: ${mascota.nombre} (${mascota.tipo} - ${mascota.elemento}) - Energía: ${mascota.energia}, Felicidad: ${mascota.felicidad}`);
        });
        
    } catch (error) {
        console.error('❌ Error subiendo mascotas:', error);
    }
};

// Función principal
const main = async () => {
    console.log('🚀 Iniciando subida de mascotas a la base de datos...\n');
    
    await connectDB();
    
    // Preguntar si limpiar la base de datos
    console.log('⚠️ ¿Deseas limpiar la base de datos antes de subir las mascotas? (s/n)');
    console.log('   Esto eliminará todas las mascotas existentes.');
    
    // Por ahora, asumimos que sí para evitar conflictos
    await limpiarBaseDeDatos();
    
    await subirMascotas();
    
    console.log('\n🎉 Proceso completado!');
    console.log('🌐 Puedes probar los endpoints:');
    console.log('   - GET /api/adopcion/disponibles');
    console.log('   - GET /api/adopcion/mis-mascotas');
    console.log('   - POST /api/adopcion/adoptar/{id}');
    
    process.exit(0);
};

main().catch(console.error); 