import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mascota from './models/mascotaSchema.js';

// Cargar variables de entorno
dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mascotas_fantasticas';
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

const verificarMascotas = async () => {
    try {
        console.log('🔍 Verificando mascotas en la base de datos...\n');
        
        // Obtener todas las mascotas
        const mascotas = await Mascota.find({}).limit(10);
        
        console.log(`📊 Total de mascotas encontradas: ${mascotas.length}`);
        console.log('\n🐾 Primeras 10 mascotas:');
        
        mascotas.forEach((mascota, index) => {
            console.log(`${index + 1}. ID: ${mascota._id}`);
            console.log(`   Nombre: ${mascota.nombre}`);
            console.log(`   Tipo: ${mascota.tipo}`);
            console.log(`   Adoptada: ${mascota.adoptada}`);
            console.log(`   Propietario: ${mascota.propietarioId}`);
            console.log('   ---');
        });
        
        // Verificar mascotas disponibles
        const disponibles = await Mascota.find({ adoptada: false });
        console.log(`\n🆓 Mascotas disponibles: ${disponibles.length}`);
        
        if (disponibles.length > 0) {
            console.log('📋 IDs de mascotas disponibles:');
            disponibles.slice(0, 5).forEach((mascota, index) => {
                console.log(`  ${index + 1}. ${mascota._id} - ${mascota.nombre}`);
            });
        }
        
        // Verificar mascotas adoptadas
        const adoptadas = await Mascota.find({ adoptada: true });
        console.log(`\n🏠 Mascotas adoptadas: ${adoptadas.length}`);
        
        if (adoptadas.length > 0) {
            console.log('📋 IDs de mascotas adoptadas (primeras 5):');
            adoptadas.slice(0, 5).forEach((mascota, index) => {
                console.log(`  ${index + 1}. ${mascota._id} - ${mascota.nombre}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error verificando mascotas:', error.message);
    }
};

const main = async () => {
    await connectDB();
    await verificarMascotas();
    
    console.log('\n💡 Para usar los endpoints de adopción:');
    console.log('   Usa los IDs completos de MongoDB (ej: 687ac8f4cc0d0c53b9343995)');
    console.log('   NO uses números simples como "4" o "5"');
    
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
};

main().catch(console.error); 