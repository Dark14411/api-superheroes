import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Mascota from './models/mascotaSchema.js';

// Cargar variables de entorno
dotenv.config();

const USER_ID = '687a828146b28b4a2b7231f6'; // Tu userId del token

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

const asignarMascotasAlUsuario = async () => {
    try {
        console.log('🔧 Asignando todas las mascotas al usuario:', USER_ID);
        
        // Actualizar todas las mascotas para que pertenezcan al usuario
        const resultado = await Mascota.updateMany(
            {}, // Actualizar todas las mascotas
            { 
                propietarioId: USER_ID,
                adoptada: true,
                fechaAdopcion: new Date()
            }
        );
        
        console.log(`✅ ${resultado.modifiedCount} mascotas asignadas al usuario`);
        
        // Verificar cuántas mascotas tiene ahora el usuario
        const mascotasDelUsuario = await Mascota.find({ propietarioId: USER_ID });
        console.log(`📊 El usuario ahora tiene ${mascotasDelUsuario.length} mascotas`);
        
        // Mostrar algunas mascotas como ejemplo
        console.log('\n🐾 Ejemplos de mascotas asignadas:');
        mascotasDelUsuario.slice(0, 5).forEach((mascota, index) => {
            console.log(`  ${index + 1}. ${mascota.nombre} - ${mascota.tipo} (${mascota.superpoder})`);
        });
        
        if (mascotasDelUsuario.length > 5) {
            console.log(`  ... y ${mascotasDelUsuario.length - 5} más`);
        }
        
    } catch (error) {
        console.error('❌ Error asignando mascotas:', error.message);
    }
};

const main = async () => {
    await connectDB();
    await asignarMascotasAlUsuario();
    
    console.log('\n🎉 Proceso completado!');
    console.log('💡 Ahora puedes probar el endpoint /api/mascotas con tu token');
    
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
};

main().catch(console.error); 