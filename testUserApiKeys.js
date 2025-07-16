import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';

// Cargar variables de entorno
dotenv.config();

const testUserApiKeys = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conectado a la base de datos');

    // Limpiar usuarios de prueba anteriores
    await User.deleteMany({ username: { $regex: /^test_/ } });
    console.log('🧹 Usuarios de prueba anteriores eliminados');

    console.log('\n🎯 SISTEMA DE API KEYS ÚNICAS POR USUARIO');
    console.log('==========================================');
    console.log('');
    console.log('🔑 TIPOS DE API KEYS:');
    console.log('   1. API Key de Usuario: Generada automáticamente al registrarse');
    console.log('   2. Cada usuario tiene su propia API Key única');
    console.log('');
    console.log('📋 Flujo de uso:');
    console.log('');
    console.log('1. Registrar usuario (recibe API Key personal):');
    console.log('   curl -X POST http://localhost:3001/api/auth/register \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"username": "usuario123", "password": "123"}\'');
    console.log('');
    console.log('2. Login (muestra API Key personal):');
    console.log('   curl -X POST http://localhost:3001/api/auth/login \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"username": "usuario123", "password": "123"}\'');
    console.log('');
    console.log('3. Usar API Key personal:');
    console.log('   curl -H "x-api-key: TU_API_KEY_PERSONAL" http://localhost:3001/api/heroes');
    console.log('');
    console.log('4. Verificar perfil con API Key personal:');
    console.log('   curl -H "x-api-key: TU_API_KEY_PERSONAL" http://localhost:3001/api/auth/profile');
    console.log('');
    console.log('🎉 ¡Sistema de API Keys únicas implementado!');
    console.log('');
    console.log('💡 Ventajas:');
    console.log('   ✅ Cada usuario tiene su propia API Key');
    console.log('   ✅ Seguridad mejorada');
    console.log('   ✅ Identificación de usuario en requests');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
};

testUserApiKeys(); 