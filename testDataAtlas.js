import dotenv from 'dotenv'
import connectDB from './config/database.js'
import Hero from './models/heroModel.js'

// Cargar variables de entorno
dotenv.config()

const testDataAtlas = async () => {
    try {
        console.log('🔍 Conectando a MongoDB Atlas...')
        await connectDB()
        
        console.log('📝 Creando un héroe de prueba en MongoDB Atlas...')
        
        // Crear un héroe de prueba
        const testHero = new Hero({
            nombre: 'TestHero-Atlas',
            poder: 'Prueba de conexión',
            edad: 25,
            universo: 'Test',
            descripcion: 'Héroe creado para verificar conexión con MongoDB Atlas'
        })
        
        // Guardar en la base de datos
        const savedHero = await testHero.save()
        
        console.log('✅ Héroe guardado exitosamente en MongoDB Atlas:')
        console.log('   ID:', savedHero._id)
        console.log('   Nombre:', savedHero.nombre)
        console.log('   Fecha de creación:', savedHero.createdAt)
        
        // Verificar que se puede leer desde la base de datos
        console.log('\n🔍 Verificando que se puede leer desde MongoDB Atlas...')
        const foundHero = await Hero.findById(savedHero._id)
        
        if (foundHero) {
            console.log('✅ Héroe encontrado en MongoDB Atlas:')
            console.log('   Nombre:', foundHero.nombre)
            console.log('   Poder:', foundHero.poder)
        }
        
        // Limpiar - eliminar el héroe de prueba
        console.log('\n🧹 Limpiando datos de prueba...')
        await Hero.findByIdAndDelete(savedHero._id)
        console.log('✅ Héroe de prueba eliminado')
        
        console.log('\n🎉 ¡Verificación completa! Tu API está usando MongoDB Atlas correctamente.')
        console.log('📊 Puedes verificar en MongoDB Atlas Dashboard que los datos se guardaron temporalmente.')
        
        process.exit(0)
        
    } catch (error) {
        console.error('❌ Error durante la prueba:', error.message)
        process.exit(1)
    }
}

testDataAtlas() 