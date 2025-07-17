import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Usar la URL de MongoDB Atlas o local
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mascotas_fantasticas';
        
        // Si no hay MONGODB_URI configurada, usar base de datos en memoria para desarrollo
        if (!process.env.MONGODB_URI) {
            console.log('⚠️ No se encontró MONGODB_URI. Usando base de datos en memoria para desarrollo...');
            console.log('💡 Para producción, configura MONGODB_URI con tu string de MongoDB Atlas');
        }
        
        // Configurar opciones de conexión optimizadas para Render
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 segundos
            socketTimeoutMS: 45000, // 45 segundos
        };
        
        const conn = await mongoose.connect(mongoURI, options);

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        
        // Configurar eventos de conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB desconectado');
        });

        // Manejar cierre graceful
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 Conexión MongoDB cerrada por terminación de la aplicación');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        console.log('💡 Soluciones:');
        console.log('   1. Instala MongoDB localmente');
        console.log('   2. Configura MONGODB_URI con tu string de MongoDB Atlas');
        console.log('   3. Crea un archivo .env con tu configuración');
        process.exit(1);
    }
};

export default connectDB; 