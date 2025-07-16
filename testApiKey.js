import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const testApiKey = () => {
  console.log('🎯 SISTEMA DE AUTENTICACIÓN POR API KEY');
  console.log('=======================================');
  console.log('🔐 Configuración actual:');
  console.log(`   API Key: Generada automáticamente al registrarse`);
  console.log('');
  console.log('✅ Endpoints públicos (sin API Key):');
  console.log('   - POST /api/auth/register');
  console.log('   - POST /api/auth/login');
  console.log('   - GET /api-docs');
  console.log('');
  console.log('🔒 Endpoints protegidos (requieren API Key):');
  console.log('   - GET / (ruta principal)');
  console.log('   - GET /api/heroes');
  console.log('   - POST /api/heroes');
  console.log('   - GET /api/mascotas');
  console.log('   - POST /api/mascotas');
  console.log('   - GET /api/items');
  console.log('   - POST /api/items');
  console.log('   - GET /api/auth/profile');
  console.log('   - POST /api/auth/logout');
  console.log('');
  console.log('📋 Ejemplos de uso:');
  console.log('');
  console.log('1. Sin API Key (debería dar error 401):');
  console.log('   curl http://localhost:3001/api/heroes');
  console.log('');
  console.log('2. Con API Key (debería funcionar):');
  console.log('   curl -H "x-api-key: TU_API_KEY_PERSONAL" http://localhost:3001/api/heroes');
  console.log('');
  console.log('3. Registrar usuario:');
  console.log('   curl -X POST http://localhost:3001/api/auth/register \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"username": "usuario123", "email": "user@example.com", "password": "Password123!"}\'');
  console.log('');
  console.log('4. Verificar API Key:');
  console.log('   curl -H "x-api-key: TU_API_KEY_PERSONAL" http://localhost:3001/api/auth/profile');
  console.log('');
  console.log('🎉 ¡El sistema de API Key está listo!');
};

testApiKey(); 