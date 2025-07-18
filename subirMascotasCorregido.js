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

// Función para mapear tipos de mascotas
const mapearTipo = (tipoOriginal) => {
    const mapeo = {
        'Dragón': 'dragon',
        'Fénix': 'fenix',
        'Unicornio': 'unicornio',
        'Grifo': 'grifo',
        'Basilisco': 'basilisco',
        'Sirena': 'sirena',
        'Centauro': 'centauro',
        'Minotauro': 'minotauro',
        'Quimera': 'quimera',
        'Hidra': 'hidra',
        'Pegaso': 'grifo', // Mapear Pegaso a Grifo
        'dragón': 'dragon'
    };
    return mapeo[tipoOriginal] || 'dragon';
};

// Función para mapear elementos
const mapearElemento = (elementoOriginal) => {
    const mapeo = {
        'Fuego': 'fuego',
        'Agua': 'agua',
        'Tierra': 'tierra',
        'Aire': 'aire',
        'Luz': 'luz',
        'Oscuridad': 'oscuridad',
        'Electricidad': 'electricidad',
        'Hielo': 'hielo',
        'Veneno': 'veneno',
        'Psíquico': 'psiquico'
    };
    return mapeo[elementoOriginal] || 'fuego';
};

// Función para mapear estados
const mapearEstadoHambre = (hambre) => {
    if (hambre <= 20) return 'Saciado';
    if (hambre <= 40) return 'Ligeramente hambriento';
    if (hambre <= 60) return 'Hambriento';
    if (hambre <= 80) return 'Muy hambriento';
    return 'Hambriento extremo';
};

const mapearEstadoSed = (sed) => {
    if (sed <= 20) return 'Hidratado';
    if (sed <= 40) return 'Ligeramente sediento';
    if (sed <= 60) return 'Sediento';
    if (sed <= 80) return 'Muy sediento';
    return 'Sediento extremo';
};

const mapearEstadoCansancio = (cansancio) => {
    if (cansancio <= 20) return 'Descansado';
    if (cansancio <= 40) return 'Ligeramente cansado';
    if (cansancio <= 60) return 'Cansado';
    if (cansancio <= 80) return 'Muy cansado';
    return 'Agotado';
};

const mapearEstadoEstres = (estres) => {
    if (estres <= 20) return 'Tranquilo';
    if (estres <= 40) return 'Ligeramente estresado';
    if (estres <= 60) return 'Estresado';
    if (estres <= 80) return 'Muy estresado';
    return 'Estresado extremo';
};

const mapearEstadoEnergia = (energia) => {
    if (energia >= 80) return 'Lleno de energía';
    if (energia >= 60) return 'Energético';
    if (energia >= 40) return 'Normal';
    if (energia >= 20) return 'Bajo de energía';
    return 'Sin energía';
};

const mapearEstadoFelicidad = (felicidad) => {
    if (felicidad >= 80) return 'Muy feliz';
    if (felicidad >= 60) return 'Contento';
    if (felicidad >= 40) return 'Normal';
    if (felicidad >= 20) return 'Triste';
    return 'Muy triste';
};

// Función para limpiar enfermedades
const limpiarEnfermedades = (enfermedades) => {
    if (!Array.isArray(enfermedades)) return [];
    
    // Filtrar enfermedades válidas según el esquema
    const enfermedadesValidas = [
        'sarna', 'gripe', 'pelos_estomago', 'bola_pelo_grave', 'obstruccion_pelo',
        'gastritis_pelo', 'sindrome_pelo', 'pata_rota', 'parasitos', 'alergia',
        'infeccion_oido', 'problemas_dentales', 'ansiedad', 'depresion', 'diabetes',
        'obesidad', 'artritis', 'cataratas', 'hipotiroidismo', 'hipertiroidismo',
        'insuficiencia_renal', 'enfermedad_cardiaca', 'cancer', 'epilepsia',
        'dermatitis', 'conjuntivitis', 'bronquitis', 'neumonia', 'pancreatitis',
        'hepatitis', 'colitis', 'cistitis', 'otitis_media', 'gingivitis'
    ];
    
    return enfermedades.filter(enfermedad => 
        enfermedadesValidas.includes(enfermedad.toLowerCase())
    );
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
            const nombre = mascota.nombre || `${mapearTipo(mascota.tipo)}${index + 1}`;
            
            // Generar poder si no existe
            const poder = mascota.poder || `Poder de ${mapearTipo(mascota.tipo)}`;
            
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
            
            // Mapear estados usando las funciones correctas
            const estadoHambre = mapearEstadoHambre(hambre);
            const estadoSed = mapearEstadoSed(sed);
            const estadoCansancio = mapearEstadoCansancio(cansancio);
            const estadoEstres = mapearEstadoEstres(estres);
            const estadoEnergia = mapearEstadoEnergia(energia);
            const estadoFelicidad = mapearEstadoFelicidad(felicidad);
            
            // Calcular salud general
            const saludGeneral = Math.round((energia + felicidad + (100 - hambre) + (100 - sed) + (100 - cansancio) + (100 - estres)) / 6);
            
            // Limpiar enfermedades
            const enfermedadesLimpias = limpiarEnfermedades(mascota.enfermedades);
            
            return {
                id: mascota.id,
                nombre: nombre,
                tipo: mapearTipo(mascota.tipo),
                elemento: mapearElemento(mascota.elemento),
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
                enfermedades: enfermedadesLimpias,
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
        if (error.errors) {
            console.log('\n🔍 Errores de validación:');
            Object.keys(error.errors).forEach(key => {
                console.log(`   ${key}: ${error.errors[key].message}`);
            });
        }
    }
};

// Función principal
const main = async () => {
    console.log('🚀 Iniciando subida de mascotas a la base de datos...\n');
    
    await connectDB();
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