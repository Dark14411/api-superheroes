import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Usar la URL de MongoDB Atlas o local
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mascotas_fantasticas';
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

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
        process.exit(1);
    }
};

export default connectDB; 