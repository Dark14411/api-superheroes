import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const verifyRender = async () => {
    try {
        console.log('🔍 Verificación para Render:');
        console.log('   NODE_ENV:', process.env.NODE_ENV);
        console.log('   PORT:', process.env.PORT);
        console.log('   MONGODB_URI configurada:', process.env.MONGODB_URI ? '✅ Sí' : '❌ No');
        
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI no está configurada en Render');
            console.log('💡 Configura la variable MONGODB_URI en las variables de entorno de Render');
            process.exit(1);
        }
        
        // Verificar que la URI tenga el formato correcto
        if (!process.env.MONGODB_URI.includes('mongodb+srv://')) {
            console.error('❌ MONGODB_URI debe ser una URL de MongoDB Atlas');
            process.exit(1);
        }
        
        console.log('\n🔌 Probando conexión a MongoDB Atlas...');
        
        const options = {
            serverSelectionTimeoutMS: 15000, // 15 segundos para Render
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0,
        };
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        
        console.log('✅ Conexión exitosa a MongoDB Atlas!');
        console.log('   Host:', conn.connection.host);
        console.log('   Base de datos:', conn.connection.name);
        
        // Probar operaciones básicas
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('   Colecciones disponibles:', collections.length);
        
        // Probar una operación de escritura
        const testCollection = conn.connection.db.collection('render_test');
        await testCollection.insertOne({ 
            test: true, 
            timestamp: new Date(),
            environment: process.env.NODE_ENV 
        });
        console.log('✅ Operación de escritura exitosa');
        
        // Limpiar el documento de prueba
        await testCollection.deleteOne({ test: true });
        console.log('✅ Operación de eliminación exitosa');
        
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada correctamente');
        console.log('\n🎉 ¡Render está configurado correctamente!');
        
    } catch (error) {
        console.error('❌ Error en Render:');
        console.error('   Mensaje:', error.message);
        console.error('   Código:', error.code);
        
        if (error.message.includes('bad auth')) {
            console.log('\n🔧 Soluciones para Render:');
            console.log('   1. Verifica que MONGODB_URI esté configurada correctamente en Render');
            console.log('   2. Asegúrate de que el usuario tenga permisos en MongoDB Atlas');
            console.log('   3. Verifica que 0.0.0.0/0 esté en Network Access de MongoDB Atlas');
            console.log('   4. Revisa que no haya espacios extra en la variable de entorno');
        }
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
            console.log('\n🔧 Problemas de red en Render:');
            console.log('   1. Verifica que la URL del cluster sea correcta');
            console.log('   2. Asegúrate de que MongoDB Atlas esté disponible');
            console.log('   3. Verifica la configuración de red en MongoDB Atlas');
        }
        
        process.exit(1);
    }
};

verifyRender(); 