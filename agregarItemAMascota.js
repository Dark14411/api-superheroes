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

// Importar modelos
import Mascota from './models/mascotaSchema.js';
import Item from './models/itemModel.js';

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

// Función para cargar items desde JSON
const cargarItems = async () => {
    try {
        const itemsPath = path.join(__dirname, 'data', 'items.json');
        const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
        
        console.log(`📦 Cargando ${itemsData.length} items desde JSON...`);
        
        // Limpiar items existentes
        await Item.deleteMany({});
        
        // Crear items en la base de datos
        const itemsCreados = await Item.insertMany(itemsData);
        
        console.log(`✅ ${itemsCreados.length} items cargados exitosamente`);
        return itemsCreados;
    } catch (error) {
        console.error('❌ Error cargando items:', error);
        return [];
    }
};

// Función para agregar item a mascota
const agregarItemAMascota = async (mascotaId, itemId, userId) => {
    try {
        // Buscar la mascota por ID numérico
        const mascota = await Mascota.findOne({ id: parseInt(mascotaId) });
        if (!mascota) {
            throw new Error(`Mascota con ID ${mascotaId} no encontrada`);
        }

        // Verificar que la mascota pertenece al usuario
        if (mascota.propietarioId !== userId) {
            throw new Error('No tienes permisos para modificar esta mascota');
        }

        // Buscar el item
        const item = await Item.findOne({ id: parseInt(itemId) });
        if (!item) {
            throw new Error(`Item con ID ${itemId} no encontrado`);
        }

        // Verificar si la mascota ya tiene items
        if (!mascota.items) {
            mascota.items = [];
        }

        // Agregar el item a la mascota
        mascota.items.push({
            itemId: item.id,
            nombre: item.nombre,
            tipo: item.tipo,
            efecto: item.efecto,
            valor: item.valor,
            descripcion: item.descripcion,
            fechaObtencion: new Date()
        });

        // Aplicar efectos del item según su tipo
        switch (item.tipo) {
            case 'comida':
                mascota.hambre = Math.max(0, mascota.hambre - item.valor);
                if (item.efecto === 'felicidad' || item.efecto === 'ambos') {
                    mascota.felicidad = Math.min(100, mascota.felicidad + item.valor);
                }
                break;
            case 'medicina':
            case 'cura':
                if (item.efecto === 'salud' || item.efecto === 'ambos') {
                    mascota.energia = Math.min(100, mascota.energia + item.valor);
                }
                if (item.efecto === 'felicidad' || item.efecto === 'ambos') {
                    mascota.felicidad = Math.min(100, mascota.felicidad + item.valor);
                }
                break;
            case 'juguete':
                mascota.felicidad = Math.min(100, mascota.felicidad + item.valor);
                mascota.estres = Math.max(0, mascota.estres - (item.valor / 2));
                break;
        }

        // Actualizar estados
        mascota.actualizarEstados();
        mascota.fechaUltimaActualizacion = new Date();

        await mascota.save();

        console.log(`🎁 Item "${item.nombre}" agregado exitosamente a ${mascota.nombre}`);
        console.log(`📊 Nuevos valores:`);
        console.log(`   Energía: ${mascota.energia}`);
        console.log(`   Felicidad: ${mascota.felicidad}`);
        console.log(`   Hambre: ${mascota.hambre}`);
        console.log(`   Estrés: ${mascota.estres}`);

        return mascota;
    } catch (error) {
        console.error('❌ Error agregando item:', error.message);
        throw error;
    }
};

// Función principal
const main = async () => {
    console.log('🎁 Iniciando proceso de agregar item a mascota...\n');
    
    await connectDB();
    
    // Cargar items si no existen
    const itemsExistentes = await Item.countDocuments();
    if (itemsExistentes === 0) {
        console.log('📦 Cargando items desde JSON...');
        await cargarItems();
    }
    
    // ID de tu mascota (Ignis2)
    const mascotaId = 31;
    const userId = "687a828146b28b4a2b7231f6"; // Tu user ID
    
    // Mostrar items disponibles
    console.log('\n📋 Items disponibles:');
    const items = await Item.find().limit(10);
    items.forEach(item => {
        console.log(`   ID ${item.id}: ${item.nombre} (${item.tipo}) - ${item.descripcion}`);
    });
    
    // Agregar un item especial a tu mascota
    const itemId = 11; // Comida de Dragón (perfecto para Ignis2 que es un dragón)
    
    console.log(`\n🎯 Agregando item ID ${itemId} a tu mascota ID ${mascotaId}...`);
    
    try {
        const mascotaActualizada = await agregarItemAMascota(mascotaId, itemId, userId);
        
        console.log('\n✅ Proceso completado exitosamente!');
        console.log(`🐉 Tu mascota ${mascotaActualizada.nombre} ahora tiene ${mascotaActualizada.items.length} items`);
        
        // Mostrar items de la mascota
        if (mascotaActualizada.items.length > 0) {
            console.log('\n🎁 Items de tu mascota:');
            mascotaActualizada.items.forEach(item => {
                console.log(`   • ${item.nombre} (${item.tipo}) - Obtenido: ${item.fechaObtencion.toLocaleDateString()}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error en el proceso:', error.message);
    }
    
    process.exit(0);
};

main().catch(console.error); 