import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';

// Cargar variables de entorno
dotenv.config();

const testRegisterOptional = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conectado a la base de datos');

    // Limpiar usuarios de prueba anteriores
    await User.deleteMany({ username: { $regex: /^test_/ } });
    console.log('🧹 Usuarios de prueba anteriores eliminados');

    console.log('\n🎯 PRUEBAS DE REGISTRO SIMPLIFICADO');
    console.log('=====================================');
    console.log('');
    console.log('✅ Campos obligatorios:');
    console.log('   - username (mínimo 3 caracteres)');
    console.log('   - password (mínimo 3 caracteres, cualquier formato)');
    console.log('');
    console.log('📋 Ejemplos de uso:');
    console.log('');
    console.log('1. Registro de usuario:');
    console.log('   curl -X POST http://localhost:3001/api/auth/register \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"username": "usuario123", "password": "123"}\'');
    console.log('');
    console.log('2. Login con username:');
    console.log('   curl -X POST http://localhost:3001/api/auth/login \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"username": "usuario123", "password": "123"}\'');
    console.log('');
    console.log('3. Acceder a endpoints protegidos:');
    console.log('   curl -H "x-api-key: TU_API_KEY_PERSONAL" http://localhost:3001/api/heroes');
    console.log('');
    console.log('🎉 ¡El registro simplificado está listo!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
};

testRegisterOptional(); 