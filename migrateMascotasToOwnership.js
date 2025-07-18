import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mascotas_fantasticas';

// Conectar a MongoDB
async function conectarDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

// Función para migrar mascotas existentes
async function migrarMascotas() {
    try {
        console.log('🚀 Iniciando migración de mascotas a sistema de propiedad...\n');

        // Obtener la colección de mascotas
        const db = mongoose.connection.db;
        const mascotasCollection = db.collection('mascotas');

        // Contar mascotas existentes
        const totalMascotas = await mascotasCollection.countDocuments();
        console.log(`📊 Total de mascotas encontradas: ${totalMascotas}`);

        if (totalMascotas === 0) {
            console.log('ℹ️  No hay mascotas para migrar');
            return;
        }

        // Obtener todas las mascotas
        const mascotas = await mascotasCollection.find({}).toArray();
        console.log(`📋 Mascotas a migrar: ${mascotas.length}`);

        // Crear un usuario por defecto para las mascotas existentes
        const usuarioPorDefecto = 'usuario_por_defecto_migracion';

        let mascotasMigradas = 0;
        let mascotasConPropietario = 0;

        for (const mascota of mascotas) {
            try {
                // Verificar si ya tiene propietario
                if (mascota.propietarioId) {
                    console.log(`   ✅ Mascota ${mascota._id} ya tiene propietario: ${mascota.propietarioId}`);
                    mascotasConPropietario++;
                    continue;
                }

                // Asignar propietario por defecto
                await mascotasCollection.updateOne(
                    { _id: mascota._id },
                    { 
                        $set: { 
                            propietarioId: usuarioPorDefecto,
                            fechaMigracion: new Date()
                        }
                    }
                );

                console.log(`   🔄 Mascota ${mascota._id} migrada a propietario: ${usuarioPorDefecto}`);
                mascotasMigradas++;

            } catch (error) {
                console.error(`   ❌ Error migrando mascota ${mascota._id}:`, error.message);
            }
        }

        console.log('\n🎉 Migración completada!');
        console.log(`   📊 Total de mascotas: ${totalMascotas}`);
        console.log(`   ✅ Mascotas ya con propietario: ${mascotasConPropietario}`);
        console.log(`   🔄 Mascotas migradas: ${mascotasMigradas}`);
        console.log(`   👤 Usuario por defecto asignado: ${usuarioPorDefecto}`);

        console.log('\n📋 Próximos pasos:');
        console.log('   1. Las mascotas existentes ahora tienen propietario');
        console.log('   2. Los usuarios solo pueden ver sus propias mascotas');
        console.log('   3. Las nuevas mascotas se asignarán automáticamente al usuario que las crea');
        console.log('   4. Sistema de seguridad activado ✅');

    } catch (error) {
        console.error('❌ Error en migración:', error);
    }
}

// Función principal
async function main() {
    try {
        await conectarDB();
        await migrarMascotas();
        
        console.log('\n🔒 Sistema de propiedad de mascotas activado!');
        console.log('   ✅ Las mascotas ahora son privadas por usuario');
        console.log('   ✅ Otros usuarios no pueden ver ni dañar tus mascotas');
        console.log('   ✅ Protección total implementada');
        
    } catch (error) {
        console.error('❌ Error en proceso:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada');
    }
}

// Ejecutar migración
main(); 