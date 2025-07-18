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

const crearMascotasDisponibles = async () => {
    try {
        console.log('🐾 Creando mascotas disponibles para adopción...\n');
        
        const mascotasDisponibles = [
            {
                nombre: "Luna",
                tipo: "fenix",
                elemento: "fuego",
                poder: "Renacimiento",
                adoptada: false,
                propietarioId: null,
                energia: 100,
                felicidad: 100,
                salud: 100,
                hambre: 0,
                sed: 0,
                cansancio: 0,
                estres: 0,
                ultimoCuidado: new Date()
            },
            {
                nombre: "Estrella",
                tipo: "unicornio",
                elemento: "luz",
                poder: "Sanación mágica",
                adoptada: false,
                propietarioId: null,
                energia: 100,
                felicidad: 100,
                salud: 100,
                hambre: 0,
                sed: 0,
                cansancio: 0,
                estres: 0,
                ultimoCuidado: new Date()
            },
            {
                nombre: "Tormenta",
                tipo: "grifo",
                elemento: "aire",
                poder: "Vuelo legendario",
                adoptada: false,
                propietarioId: null,
                energia: 100,
                felicidad: 100,
                salud: 100,
                hambre: 0,
                sed: 0,
                cansancio: 0,
                estres: 0,
                ultimoCuidado: new Date()
            },
            {
                nombre: "Sombra",
                tipo: "basilisco",
                elemento: "oscuridad",
                poder: "Mirada petrificante",
                adoptada: false,
                propietarioId: null,
                energia: 100,
                felicidad: 100,
                salud: 100,
                hambre: 0,
                sed: 0,
                cansancio: 0,
                estres: 0,
                ultimoCuidado: new Date()
            },
            {
                nombre: "Marina",
                tipo: "sirena",
                elemento: "agua",
                poder: "Control de mares",
                adoptada: false,
                propietarioId: null,
                energia: 100,
                felicidad: 100,
                salud: 100,
                hambre: 0,
                sed: 0,
                cansancio: 0,
                estres: 0,
                ultimoCuidado: new Date()
            }
        ];
        
        // Crear las mascotas disponibles
        const mascotasCreadas = await Mascota.insertMany(mascotasDisponibles);
        
        console.log(`✅ ${mascotasCreadas.length} mascotas disponibles creadas`);
        
        console.log('\n🐾 Mascotas disponibles creadas:');
        mascotasCreadas.forEach((mascota, index) => {
            console.log(`${index + 1}. ${mascota.nombre} - ${mascota.tipo} (${mascota.poder})`);
            console.log(`   ID: ${mascota._id}`);
            console.log('   ---');
        });
        
        // Verificar total de mascotas disponibles
        const totalDisponibles = await Mascota.countDocuments({ adoptada: false });
        console.log(`\n📊 Total de mascotas disponibles: ${totalDisponibles}`);
        
        // Verificar total de mascotas adoptadas
        const totalAdoptadas = await Mascota.countDocuments({ adoptada: true });
        console.log(`📊 Total de mascotas adoptadas: ${totalAdoptadas}`);
        
    } catch (error) {
        console.error('❌ Error creando mascotas disponibles:', error.message);
    }
};

const main = async () => {
    await connectDB();
    await crearMascotasDisponibles();
    
    console.log('\n🎉 Proceso completado!');
    console.log('💡 Ahora puedes probar los endpoints de adopción con los IDs mostrados arriba');
    
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
};

main().catch(console.error); 