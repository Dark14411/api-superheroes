import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const fixIndexes = async () => {
  try {
    console.log('🔧 Arreglando índices de la base de datos...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Obtener la colección de usuarios
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Listar todos los índices actuales
    console.log('📋 Índices actuales:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Eliminar el índice problemático de email si existe
    try {
      await usersCollection.dropIndex('email_1');
      console.log('✅ Índice email_1 eliminado');
    } catch (error) {
      console.log('ℹ️ Índice email_1 no existe o ya fue eliminado');
    }
    
    // Crear los índices correctos
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    console.log('✅ Índice username_1 creado');
    
    await usersCollection.createIndex({ apiKey: 1 }, { unique: true, sparse: true });
    console.log('✅ Índice apiKey_1 creado');
    
    // Listar índices finales
    console.log('📋 Índices finales:');
    const finalIndexes = await usersCollection.indexes();
    finalIndexes.forEach(index => {
      console.log(`   - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('🎉 Índices arreglados correctamente');
    
  } catch (error) {
    console.error('❌ Error al arreglar índices:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar el script
fixIndexes(); 