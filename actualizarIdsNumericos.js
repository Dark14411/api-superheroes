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

const actualizarIdsNumericos = async () => {
    try {
        console.log('🔧 Actualizando IDs numéricos para todas las mascotas...\n');
        
        // Obtener todas las mascotas
        const mascotas = await Mascota.find({});
        console.log(`📊 Total de mascotas encontradas: ${mascotas.length}`);
        
        // Asignar IDs numéricos secuenciales
        for (let i = 0; i < mascotas.length; i++) {
            const mascota = mascotas[i];
            const idNumerico = i + 1; // IDs del 1 al N
            
            await Mascota.updateOne(
                { _id: mascota._id },
                { id: idNumerico }
            );
            
            console.log(`✅ ${mascota.nombre} - ID asignado: ${idNumerico}`);
        }
        
        // Verificar el resultado
        const mascotasActualizadas = await Mascota.find({}).sort({ id: 1 });
        
        console.log('\n📋 Mascotas con IDs numéricos:');
        mascotasActualizadas.forEach((mascota) => {
            console.log(`  ${mascota.id}. ${mascota.nombre} - ${mascota.tipo} (${mascota.adoptada ? 'Adoptada' : 'Disponible'})`);
        });
        
        // Mostrar mascotas disponibles
        const disponibles = await Mascota.find({ adoptada: false }).sort({ id: 1 });
        console.log(`\n🆓 Mascotas disponibles (${disponibles.length}):`);
        disponibles.forEach((mascota) => {
            console.log(`  ${mascota.id}. ${mascota.nombre} - ${mascota.tipo}`);
        });
        
        // Mostrar mascotas adoptadas
        const adoptadas = await Mascota.find({ adoptada: true }).sort({ id: 1 });
        console.log(`\n🏠 Mascotas adoptadas (${adoptadas.length}):`);
        adoptadas.slice(0, 10).forEach((mascota) => {
            console.log(`  ${mascota.id}. ${mascota.nombre} - ${mascota.tipo}`);
        });
        
        if (adoptadas.length > 10) {
            console.log(`  ... y ${adoptadas.length - 10} más`);
        }
        
    } catch (error) {
        console.error('❌ Error actualizando IDs:', error.message);
    }
};

const main = async () => {
    await connectDB();
    await actualizarIdsNumericos();
    
    console.log('\n🎉 Proceso completado!');
    console.log('💡 Ahora puedes usar números simples en los endpoints:');
    console.log('   POST /api/adopcion/adoptar/1');
    console.log('   POST /api/adopcion/abandonar/2');
    console.log('   etc...');
    
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
};

main().catch(console.error); 