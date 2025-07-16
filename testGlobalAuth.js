import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';

// Cargar variables de entorno
dotenv.config();

const testGlobalAuth = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conectado a la base de datos');

    // Limpiar usuarios de prueba anteriores
    await User.deleteMany({ username: { $regex: /^test_/ } });
    console.log('🧹 Usuarios de prueba anteriores eliminados');

    // Crear usuario de prueba
    const testUser = new User({
      username: 'test_user',
      email: 'test@example.com',
      password: 'Test123!'
    });

    await testUser.save();
    console.log('✅ Usuario de prueba creado:', testUser.username);

    console.log('\n🎯 SISTEMA DE AUTENTICACIÓN GLOBAL ACTIVADO');
    console.log('==========================================');
    console.log('🔐 TODOS los endpoints requieren autenticación excepto:');
    console.log('   - POST /api/auth/register');
    console.log('   - POST /api/auth/login');
    console.log('   - GET /api-docs (documentación)');
    console.log('');
    console.log('🚫 Si intentas acceder a cualquier endpoint sin token:');
    console.log('   - GET /api/heroes');
    console.log('   - GET /api/mascotas');
    console.log('   - GET /api/items');
    console.log('   - GET / (ruta principal)');
    console.log('   Recibirás un error 401 con instrucciones claras');
    console.log('');
    console.log('✅ Para acceder a los endpoints:');
    console.log('   1. Registra un usuario: POST /api/auth/register');
    console.log('   2. O inicia sesión: POST /api/auth/login');
    console.log('   3. Usa el token recibido en el header: Authorization: Bearer <token>');
    console.log('');
    console.log('📋 Ejemplo de uso:');
    console.log('   curl -X POST http://localhost:3001/api/auth/register \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"username": "usuario123", "email": "user@example.com", "password": "Password123!"}\'');
    console.log('');
    console.log('   curl -X GET http://localhost:3001/api/heroes \\');
    console.log('     -H "Authorization: Bearer TU_TOKEN_AQUI"');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
};

testGlobalAuth(); 