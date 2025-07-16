import mongoose from 'mongoose';
import Mascota from './models/mascotaSchema.js';

// Configuración de conexión
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://javerage:javerage123@cluster0.mongodb.net/mascotas_fantasticas?retryWrites=true&w=majority';

async function testMongoose() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB exitosamente');

        // Limpiar base de datos de pruebas
        await Mascota.deleteMany({});
        console.log('🧹 Base de datos limpiada');

        // Crear una mascota de prueba
        console.log('🐉 Creando mascota de prueba...');
        const nuevaMascota = new Mascota({
            nombre: 'Fuego',
            tipo: 'dragon',
            elemento: 'fuego',
            poder: 'Lanzar llamas',
            energia: 100,
            felicidad: 90,
            hambre: 20,
            sed: 15,
            cansancio: 10,
            estres: 5
        });

        await nuevaMascota.save();
        console.log('✅ Mascota creada:', nuevaMascota.nombre);

        // Buscar todas las mascotas
        console.log('🔍 Buscando todas las mascotas...');
        const todasLasMascotas = await Mascota.find();
        console.log('📊 Total de mascotas:', todasLasMascotas.length);

        // Buscar mascota por ID
        console.log('🔍 Buscando mascota por ID...');
        const mascotaEncontrada = await Mascota.findById(nuevaMascota._id);
        console.log('✅ Mascota encontrada:', mascotaEncontrada.nombre);

        // Actualizar mascota
        console.log('✏️ Actualizando mascota...');
        mascotaEncontrada.felicidad = 95;
        await mascotaEncontrada.save();
        console.log('✅ Mascota actualizada');

        // Agregar enfermedad
        console.log('🏥 Agregando enfermedad...');
        mascotaEncontrada.enfermedades.push({
            tipo: 'gripe',
            fechaInicio: new Date(),
            curada: false
        });
        await mascotaEncontrada.save();
        console.log('✅ Enfermedad agregada');

        // Probar métodos de instancia
        console.log('⚡ Aplicando efectos de enfermedades...');
        mascotaEncontrada.aplicarEfectosEnfermedades();
        await mascotaEncontrada.save();
        console.log('✅ Efectos aplicados');

        // Probar búsquedas especializadas
        console.log('🔍 Buscando mascotas vivas...');
        const mascotasVivas = await Mascota.findVivas();
        console.log('✅ Mascotas vivas encontradas:', mascotasVivas.length);

        console.log('🔍 Buscando mascotas enfermas...');
        const mascotasEnfermas = await Mascota.findEnfermas();
        console.log('✅ Mascotas enfermas encontradas:', mascotasEnfermas.length);

        // Probar virtuals
        console.log('📊 Probando virtuals...');
        const mascotaConVirtuals = await Mascota.findById(nuevaMascota._id);
        console.log('🎂 Edad de la mascota:', mascotaConVirtuals.edad, 'días');
        console.log('❤️ Salud general:', mascotaConVirtuals.saludGeneral);
        console.log('🏥 Enfermedades activas:', mascotaConVirtuals.enfermedadesActivas.length);

        // Probar estadísticas
        console.log('📈 Probando estadísticas...');
        const estadisticas = await Mascota.aggregate([
            { $group: { _id: '$tipo', count: { $sum: 1 } } }
        ]);
        console.log('📊 Estadísticas por tipo:', estadisticas);

        console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    }
}

// Ejecutar pruebas
testMongoose(); 