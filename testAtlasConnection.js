import dotenv from 'dotenv'
import connectDB from './config/database.js'

// Cargar variables de entorno
dotenv.config()

const testAtlasConnection = async () => {
    try {
        console.log('🔍 Probando conexión a MongoDB Atlas...')
        console.log('📡 URI de conexión:', process.env.MONGODB_URI ? 'Configurada' : 'No configurada')
        
        if (!process.env.MONGODB_URI) {
            console.error('❌ Error: MONGODB_URI no está configurada en el archivo .env')
            console.log('💡 Asegúrate de crear un archivo .env con tu string de conexión de MongoDB Atlas')
            process.exit(1)
        }

        // Intentar conectar
        await connectDB()
        
        console.log('✅ ¡Conexión exitosa a MongoDB Atlas!')
        console.log('🎉 Tu proyecto está correctamente vinculado con MongoDB Atlas')
        
        // Cerrar la conexión
        process.exit(0)
        
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB Atlas:', error.message)
        console.log('🔧 Verifica:')
        console.log('   1. Tu string de conexión en el archivo .env')
        console.log('   2. Tu usuario y contraseña de MongoDB Atlas')
        console.log('   3. Tu dirección IP está en la whitelist de MongoDB Atlas')
        process.exit(1)
    }
}

testAtlasConnection() 