import mongoose from 'mongoose';
import Mascota from './models/mascotaSchema.js';

// Configuración de conexión
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mascotas_fantasticas';

// Datos de ejemplo del sistema anterior (puedes modificar esto con tus datos reales)
const mascotasLegacy = [
    {
        id: 1,
        nombre: "Fuego",
        tipo: "dragon",
        elemento: "fuego",
        poder: "Lanzar llamas",
        energia: 100,
        felicidad: 90,
        hambre: 20,
        sed: 15,
        cansancio: 10,
        estres: 5,
        enfermedades: [],
        muerto: false
    },
    {
        id: 2,
        nombre: "Agua",
        tipo: "sirena",
        elemento: "agua",
        poder: "Controlar olas",
        energia: 85,
        felicidad: 95,
        hambre: 30,
        sed: 5,
        cansancio: 15,
        estres: 10,
        enfermedades: ["gripe"],
        muerto: false
    },
    {
        id: 3,
        nombre: "Tierra",
        tipo: "minotauro",
        elemento: "tierra",
        poder: "Fuerza bruta",
        energia: 95,
        felicidad: 80,
        hambre: 40,
        sed: 25,
        cansancio: 20,
        estres: 15,
        enfermedades: [],
        muerto: false
    }
];

async function migrarDatos() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Conectado a MongoDB exitosamente');

        // Limpiar base de datos
        console.log('🧹 Limpiando base de datos...');
        await Mascota.deleteMany({});
        console.log('✅ Base de datos limpiada');

        // Migrar cada mascota
        console.log('🔄 Iniciando migración de datos...');
        const mascotasMigradas = [];

        for (const mascotaLegacy of mascotasLegacy) {
            console.log(`📝 Migrando mascota: ${mascotaLegacy.nombre}`);
            
            // Mapear datos del sistema anterior al nuevo esquema
            const mascotaNueva = new Mascota({
                nombre: mascotaLegacy.nombre,
                tipo: mascotaLegacy.tipo,
                elemento: mascotaLegacy.elemento,
                poder: mascotaLegacy.poder,
                energia: mascotaLegacy.energia,
                felicidad: mascotaLegacy.felicidad,
                hambre: mascotaLegacy.hambre,
                sed: mascotaLegacy.sed,
                cansancio: mascotaLegacy.cansancio,
                estres: mascotaLegacy.estres,
                muerto: mascotaLegacy.muerto,
                fechaCreacion: new Date(),
                fechaUltimaActualizacion: new Date()
            });

            // Migrar enfermedades si existen
            if (mascotaLegacy.enfermedades && mascotaLegacy.enfermedades.length > 0) {
                mascotaLegacy.enfermedades.forEach(tipoEnfermedad => {
                    mascotaNueva.enfermedades.push({
                        tipo: tipoEnfermedad,
                        fechaInicio: new Date(),
                        curada: false
                    });
                });
            }

            // Generar vulnerabilidades y fortalezas basadas en el elemento
            mascotaNueva.vulnerabilidades = generarVulnerabilidades(mascotaLegacy.elemento);
            mascotaNueva.fortalezas = generarFortalezas(mascotaLegacy.elemento);

            // Guardar la mascota
            await mascotaNueva.save();
            mascotasMigradas.push(mascotaNueva);
            
            console.log(`✅ Mascota migrada: ${mascotaNueva.nombre} (ID: ${mascotaNueva._id})`);
        }

        console.log(`🎉 Migración completada exitosamente!`);
        console.log(`📊 Total de mascotas migradas: ${mascotasMigradas.length}`);

        // Mostrar estadísticas
        const totalMascotas = await Mascota.countDocuments();
        const mascotasVivas = await Mascota.countDocuments({ muerto: false });
        const mascotasEnfermas = await Mascota.countDocuments({
            'enfermedades': { $elemMatch: { curada: false } }
        });

        console.log('\n📈 Estadísticas después de la migración:');
        console.log(`   Total de mascotas: ${totalMascotas}`);
        console.log(`   Mascotas vivas: ${mascotasVivas}`);
        console.log(`   Mascotas enfermas: ${mascotasEnfermas}`);

        // Mostrar mascotas migradas
        console.log('\n🐉 Mascotas migradas:');
        mascotasMigradas.forEach(mascota => {
            console.log(`   - ${mascota.nombre} (${mascota.tipo}) - ID: ${mascota._id}`);
        });

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    }
}

// Funciones auxiliares para generar vulnerabilidades y fortalezas
function generarVulnerabilidades(elemento) {
    const vulnerabilidades = {
        'fuego': ['agua'],
        'agua': ['electricidad'],
        'tierra': ['agua'],
        'aire': ['tierra'],
        'luz': ['oscuridad'],
        'oscuridad': ['luz'],
        'electricidad': ['tierra'],
        'hielo': ['fuego'],
        'veneno': ['luz'],
        'psiquico': ['oscuridad']
    };
    
    return vulnerabilidades[elemento] || [];
}

function generarFortalezas(elemento) {
    const fortalezas = {
        'fuego': ['hielo'],
        'agua': ['fuego'],
        'tierra': ['electricidad'],
        'aire': ['tierra'],
        'luz': ['oscuridad'],
        'oscuridad': ['luz'],
        'electricidad': ['agua'],
        'hielo': ['agua'],
        'veneno': ['psiquico'],
        'psiquico': ['veneno']
    };
    
    return fortalezas[elemento] || [];
}

// Ejecutar migración
console.log('🚀 Iniciando migración a Mongoose...');
migrarDatos(); 